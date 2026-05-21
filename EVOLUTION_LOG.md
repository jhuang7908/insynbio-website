# AbEngineCore — Evolution Log

**Purpose:** Agent 可自由追加的学习日志。记录案例观察、参数建议和标准升级提案。  
**权限:** Agent 可 APPEND（追加），不可 DELETE/MODIFY 已有条目。  
**审批:** 所有标记为 `[PROPOSAL]` 的条目，需所有者审批后方可执行。

---

## 文件分类体系

| 分类 | 标记 | Agent 权限 | 示例 |
|------|------|-----------|------|
| 🔒 LOCKED | frozen | 只读，不可修改 | Standards, configs, governance |
| 📝 APPEND-ONLY | learnable | 可追加，不可改/删已有内容 | 本文件 (`EVOLUTION_LOG.md`) |
| ⚙️ TUNABLE | via-proposal | 可提案修改，需所有者批准后执行 | 工具阈值, 场景参数 |
| 🔧 PROJECT | free | 自由创建/修改 | `projects/`, `delivery_*/`, `output/` |

---

## 条目格式

每条记录使用以下格式：

```
### [TYPE] YYYY-MM-DD — 标题
- **来源案例:** 项目名 / 抗体名
- **观察:** 具体发现
- **建议:** 提议的修改（如有）
- **影响范围:** 哪些标准/配置会受影响
- **状态:** LOGGED / PROPOSED / APPROVED / REJECTED / EXECUTED
```

TYPE 可选值:
- `[OBSERVATION]` — 纯观察记录，不提议修改
- `[PROPOSAL]` — 建议修改标准/配置/阈值，需所有者审批
- `[APPROVED]` — 所有者已批准，待执行
- `[EXECUTED]` — 已执行并反映在标准中

---

## 进化记录

### [OBSERVATION] 2026-05-20 — Therasik 多租户邮件链路：sync handler ContextVar 丢失 + Private Email SMTP

- **来源案例:** `console.therasik.com` 注册 / 验证码 / 忘记密码 / 找回用户名 邮件错发为 InSynBio 品牌（`contact@insynbio.com`），且 Therasik 验证码在 Therasik DB 中存在但 `verify-email` 始终返回 `Invalid or expired`。
- **观察:**
  1. **租户绑定丢失**：`api/routers/auth.py` 的 `_tenant_scope` 仅作为 APIRouter 依赖项设置 `ContextVar`。FastAPI 把同步 handler 调度到线程池执行，依赖项里设置的 `ContextVar` 不会随线程切换传递；`register()` 因在函数体内再次调用 `_bind_tenant()` 而正确写入 `therasik_auth.db`，但 `verify_email` / `forgot_username` / `forgot_password` / `reset_password` / `me` / `gate_me` / `debit` / `ledger` 等同步 handler 未在函数体内绑定 → 实际查询了默认 `insynbio_auth.db`，导致验证码、找回用户名一律命中 InSynBio 账号（如同邮箱下的 `Jhuang78`）。
  2. **邮件品牌硬编码**：`auth_db.send_verification_email()` / `send_service_email()` 硬编码 `INSYNBIO_SMTP_*` 与 `contact@insynbio.com` 文案，没有按租户切换发件人 / 主题 / 正文。
  3. **Therasik Private Email 网络与认证**：Hetzner 节点出站到 `mail.privateemail.com:465` 超时；改用 587 + STARTTLS 可达；`535 authentication failed` 实际原因是 `/etc/abenginecore/env` 中 `THERASIK_SMTP_PASS` 留了占位文本（`YOUR_REAL_PASSWORD`），替换为 Namecheap Private Email 真实密码后登录成功。
  4. **运维侧次生事故**：手动跑 `uvicorn` 调试时未停 `abenginecore.service`，导致两个进程抢占 127.0.0.1:8000，systemd 进入 `address already in use` 重启循环，业务 `RESET_CODE[...]` 日志因此从未落到 `/tmp/uvicorn.log`，误判为应用 bug。
- **修复实施（已 push 至 commit `4d494f8`）:**
  - `api/routers/auth.py`：所有同步 handler 在访问 `auth_db` 前显式 `_bind_tenant(request)`；新增 `POST /api/auth/resend-verification`；`verify-email` 改用 `_user_lookup`（兼容用户名/邮箱）并规范化 6 位数字；`forgot-username`、`forgot-password` / `reset-password` 按租户输出品牌化主题与正文。
  - `api/auth_db.py`：新增 `_mail_profile()` / `get_mail_brand()`；Therasik 默认 `mail.privateemail.com:465`、发件人 `contact@therasik.com`、中英双语正文；InSynBio 保留原品牌；Therasik **不再回退** InSynBio SMTP，未配置时打印 `[AUTH][therasik] ... SMTP not configured; set THERASIK_SMTP_PASS ...`。
  - `api/static/therasik_login.html`：验证页显示账号（只读）、`sessionStorage` 缓存 pending 用户名、新增「重新发送验证码 / Resend Code」按钮。
  - `scripts/start_api_server.sh`：在 systemd 示例段补充 `THERASIK_SMTP_*` 与 `INSYNBIO_SMTP_*` 注释。
  - 服务器侧：`/etc/abenginecore/env`（0600）通过 `EnvironmentFile=` 注入；`THERASIK_SMTP_PORT=587`，密码使用 Namecheap Private Email 真实密码。
- **建议:**
  1. **跨同步 handler 的租户绑定写法应作为约定**：任何同步路由（不只是 auth），只要访问 `auth_db` 或其它租户感知模块，都必须在函数体首行 `_bind_tenant(request)`，仅靠 APIRouter 依赖项不可靠（FastAPI threadpool ContextVar 行为）。建议以注释/PR 检查的方式约束，避免未来回归。
  2. **`/api/health` 增加 `tenant_resolver_ok` / `therasik_smtp_configured` 自检字段**，便于一次性判定租户路由与 SMTP 是否健康；当前需要靠手动 `grep RESET_CODE[therasik]` 推断。
  3. **域名邮件认证**：建议给 `therasik.com` 加 SPF (`include:spf.privateemail.com`) / DKIM (Namecheap 控制台启用) / DMARC，避免 Gmail 投递率波动；本次首封 `contact@therasik.com` 邮件能直接到达收件箱已是良好基线，但缺 SPF/DKIM 长期存在被退/进垃圾箱风险。
  4. **运维规程**：明确「`systemctl stop abenginecore` → 手动 uvicorn → Ctrl+C → `systemctl start abenginecore`」次序，禁止 systemd 与手动实例并存；可在 `docs/operations/` 增加一段说明，避免 ghost 进程再发生。
- **影响范围:**
  - `api/routers/auth.py`、`api/auth_db.py`、`api/static/therasik_login.html`、`scripts/start_api_server.sh`（实现已上线 commit `4d494f8`）。
  - 运维侧 `/etc/abenginecore/env`、systemd `override.conf`（已添加 `EnvironmentFile=`）。
  - `docs/VHVL_WEB_CONSOLE_CONTRACT.md` 可能需追加「Therasik 多租户邮件 / Private Email」段落与第 5 节版本可见性中的租户标识；属 LOCKED 文件，待 Owner 批准后再更新。
- **状态:** LOGGED（实现已部署并经端到端验证：`contact@therasik.com` 双语验证码邮件到达 `mail.jing.huang@gmail.com`，用户名 `jhuang71` 匹配 Therasik 租户）。

---

### [EXECUTED] 2026-05-20 — 发布 `docs/operations/VHVL_WEB_CONSOLE_CONTRACT.md`（多租户契约 §7）

**Source:** Owner approval ("批准") following the 2026-05-20 OBSERVATION entry above.
**Status:** EXECUTED 2026-05-20 by Agent.

**Change:**
- 新增 `docs/operations/VHVL_WEB_CONSOLE_CONTRACT.md`（先前缺失；workspace rule `vhvl-web-console-contract.mdc` 早已引用该路径）。
- 文件以 §0–§10 章节正式记录 VH/VL Web Console 单一事实源（SSOT），其中 §7 系统化记录多租户架构（租户解析、`_bind_tenant` 必须性、SQLite 隔离、邮件品牌矩阵、Private Email 配置、SPF/DKIM/DMARC 建议），§8 写入运维纪律（禁止 ghost uvicorn、部署流程、Therasik 邮件冒烟测试）。
- 未触碰其它 LOCKED 文件；与已上线的 commit `4d494f8` 一一对应。

**Verification:**
- 文件路径与 `vhvl-web-console-contract.mdc` 中的引用一致。
- Markdown 解析无破坏性符号；与现有 `docs/CURSOR_REPORT_ENGINE_V4_1_SPEC.md` 引用方式一致。

---

### [EXECUTED] 2026-05-16 — VHH Humanization V5.0: Structure-Driven + DeepFR-CTX Fallback

**Source:** Owner strategic direction (2026-05-16 chat). Approved by Owner ("全部批准 V5.0 升级") immediately following the PROPOSAL entry below.
**Status:** EXECUTED 2026-05-16 by Agent.

**Five Mandatory Changes (all approved):**
1. **Template library: clinical-VHH only** — drop the 90 synthetic VH3-SAFE templates. Real clinical VHH (n=42, expansion welcome) is the sole authorized source.
2. **FR identity cutoff lowered 0.70 → 0.65** — aligned with conventional antibody humanization. Permissive 0.60 available via `ABENGINECORE_VHH_PERMISSIVE_CUTOFF=1` with audit log.
3. **Hallmark CDR3+SAP/pI decision tree** — FULL (CDR3≥17aa AND SAP>0.714) / PARTIAL (CDR3 12–17aa AND pI≤9.0) / MINIMAL (CDR3<12aa AND net_basic≤4). Replaces V4.0 static "always preserve 37/44/45/47".
4. **Non-Hallmark back-mutation: structure + DeepFR-CTX driven** — mandatory IgFold/ABodyBuilder2 structure prediction → SASA + CDR-distance → DeepFR-CTX 9-mer voting → dynamic Tier per template. Static Tier 1/2 lists become fallback when structure prediction unavailable.
5. **No-template fallback: DeepFR-CTX-VHH 9-aa context voting** — replaces V4.0 fixed-substitution surface reshaping table. G/P/C hard-protected. PTM motif veto. Charge-class flip veto. ΔSAP filter. Uses `config/clinical_842_9mer_db.json`.

**Files modified (LOCKED files, modified under approval):**
- `docs/VHH_HUMANIZATION_DESIGN_STANDARD.md` — version 1.0 → 5.0; added V5.0 section with Five Mandatory Changes + V5.0 Quality Gates; extended Version History table.
- `config/standards_ssot.json` — `vhh_humanization_path_a` V4.0 → V5.0; added `clinical_842_9mer_db.json` to config_files.
- `config/abenginecore_registry.json` — release_id V4.0 → V5.0; added `structure_prediction_required`, `structure_predictors`, `deepfr_ctx_integration` blocks; new `version_mapping.V5.0_VHH_Humanization`; V4.0 marked superseded_by V5.0.
- `config/tier_system_config.json` — version 1.0 → 5.0; added top-level `v5_runtime` block (fr_identity_cutoff, hallmark_decision_v5, dynamic_tier_formula, structure_prediction, deepfr_ctx_integration, no_template_fallback, template_library).
- `core/scaffolds.py` — `load_human_vhh_safe_templates()` returns `[]` by default in V5.0. Legacy override via env `ABENGINECORE_ALLOW_VH3_SAFE_LEGACY=1`.
- `core/vhh_humanization.py` — `select_human_templates()` FR cutoff 0.65; VH3-SAFE fallback path returns `([], {"v5_no_template_fallback_required": True})`; `surface_reshaping_trigger()` replaced V2.2 fixed-substitution table with V5.0 DeepFR-CTX-VHH 9-mer voting helpers (`_v5_load_9mer_db`, `_v5_vote_for_position`, `_v5_introduces_ptm_motif`, `_v5_charge_class`); G/P/C hard-protected; PTM motif veto; charge-class flip veto; ΔSAP filter.

**Verification:**
- All modified files pass syntactic validation (`ast.parse` for Python, `json.loads` for configs).
- Linter on `core/vhh_humanization.py`: clean.
- V4.0 prescreen gates retained (CDR3 hard ≥25aa, soft ≥20aa; SAP hard >0.771; pI hard >9.5).

**Backward compatibility:**
- Strategy names S1/S2/S3 retained (now dynamic-Tier ranges instead of static position lists).
- Static Tier 0/1/2/3 lists retained in `tier_system_config.json` as fallback when structure prediction is unavailable.
- Legacy VH3-SAFE library accessible via env var for archival reproducibility only.

**PROPOSAL Source (preserved for audit trail):**
The original PROPOSAL entry (with full rationale, risk/adversarial check, and owner action requested) was logged 2026-05-16. Owner replied "全部批准 V5.0 升级" — full approval of all five parts. The PROPOSAL and APPROVED states are folded into this EXECUTED entry for the on-disk EVOLUTION_LOG (since the working copy was reset to HEAD before re-applying, the intermediate states are documented in the chat transcript).

---

### [OBSERVATION] 2026-04-01 — PAG1 短肽场景 PRODIGY 无鉴别力
- **来源案例:** PAG1 Virtual Affinity Maturation (7m_humanPAG1)
- **观察:** PRODIGY 对 32 aa 短肽抗原 36 个突变的 ΔΔG 范围仅 0.78 kcal/mol，无法区分有益/有害突变。原因是界面接触数太少，ML 回归模型缺乏分辨率。
- **建议:** Scenario A (≤30 aa) 中标记 PRODIGY 为"跳过"
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §3.2
- **状态:** EXECUTED — 已写入 VAM V1.0

### [OBSERVATION] 2026-04-01 — ThermoMPNN 与 MM/GBSA 负相关
- **来源案例:** PAG1 36-mutation scan
- **观察:** ThermoMPNN ΔΔG 与 MM/GBSA ΔΔG Pearson r = −0.786。两者测量不同物理量（稳定性 vs 结合能），不应混用排名。
- **建议:** ThermoMPNN 仅作否决工具（ΔΔG > +0.5 排除），不参与亲和力排名
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §5.4
- **状态:** EXECUTED — 已写入 VAM V1.0

### [OBSERVATION] 2026-04-01 — AntiFold 与 ESM-IF1 高度冗余
- **来源案例:** PAG1 36-mutation scan
- **观察:** AntiFold vs ESM-IF1 Pearson r = +0.732。两者均为逆折叠序列适配模型，预测值高度相关。同时使用不增加信息量，反而可能导致伪共识。
- **建议:** 场景 B/C 选 AntiFold（抗体专用预训练），ESM-IF1 作为通用备选。不双重计票
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §5.5, §5.6
- **状态:** EXECUTED — 已写入 VAM V1.0

### [OBSERVATION] 2026-04-01 — EvoEF2 带电残基突变不可信
- **来源案例:** PAG1 K100R, K100E mutations
- **观察:** EvoEF2 对 K→R 和 K→E 预测的 ΔΔG 方向与 MM/GBSA 不一致。EvoEF2 的半经验势函数对长程静电和溶剂化处理不足。
- **建议:** 涉及 K/R/D/E/H 的突变必须用 MM/GBSA 验证，EvoEF2 结果仅作参考
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §5.1
- **状态:** EXECUTED — 已写入 VAM V1.0

### [OBSERVATION] 2026-04-01 — HADDOCK3 需要 3-molecule 输入处理 VH/VL 抗体
- **来源案例:** PAG1 HADDOCK3 pipeline
- **观察:** 将 VH+VL 合并为单一 PDB（`pdb_chain -A`）后，HADDOCK3 CNS `topoaa` 因残基编号冲突（VH 和 VL 都从 1 开始）导致 50% 拓扑生成失败。拆分为 3 个独立分子（VH=A, VL=B, Ag=C）可正常运行。
- **建议:** HADDOCK3 VH/VL 抗体配置模板使用 3-molecule 方案
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §5.7, `pag1_haddock3_pipeline.py`
- **状态:** EXECUTED — 已写入 pipeline 脚本

---

### [OBSERVATION] 2026-04-02 — Scenario C 实战：扫描范围应扩展至全界面（非仅 CDR3）
- **来源案例:** mumab4d5_VGRW_SR_R2 VHH–HER2 VAM（247 突变全界面扫描）
- **观察:** 当前标准 Scenario C 规定"CDR1/CDR2 仅扫描已知界面接触残基，不做全 19-aa 扫描"。实战中全界面穷举扫描（13 位点 × 19 AA = 247）发现：核心优化位点 G49（FR2/CDR2 边界，3 接触）和 E51（CDR2，4 接触）均在 CDR3 以外。仅扫描 CDR3 将完全遗漏这两个最终候选。F112（CDR3 前 2 位）也在标准未明确规定的扩展区域。
- **建议:** Scenario C 改为"对所有界面接触数 ≥ 3 的残基（含 CDR1/CDR2/FR2 边界）做 19-AA 穷举扫描"，取消"CDR3 only"的隐含限制。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §3.4 Scenario C 扫描规则
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.1 §3.4)

### [OBSERVATION] 2026-04-02 — HADDOCK3 VHH 对接采样量：Sampling=40 界面定义偏差
- **来源案例:** mumab4d5_VGRW_SR_R2 HADDOCK3 Sampling 40→100→200 比较
- **观察:** Sampling=40 运行结果中，关键位点 N62 被预测为高价值热点（N62S ΔΔG=−0.04），但在 Sampling=100 收敛模型中 N62S ΔΔG=+1.79（不利）。低采样导致界面姿态偏差产生假阳性候选。100→200 结构已高度收敛（同一姿态，79% 第一簇）。
- **建议:** Scenario C VHH 项目中，HADDOCK3 最低 Sampling ≥ 100；当前标准 Phase 0 质量门应加入"HADDOCK3 第一簇集中度 ≥ 60%"作为对接收敛性门控。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §5.7 HADDOCK3，§4 Phase 0 质量门
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.1 §5.7 + Phase 0)

### [OBSERVATION] 2026-04-02 — EvoEF2 对非接触位点（变构/FR 内部）完全无分辨力
- **来源案例:** mumab4d5_VGRW_SR_R2 Y67（1 接触）和 K70（0 接触）扫描
- **观察:** EvoEF2 对 K70 的 19 种替换输出完全相同数值（变构位点，无直接接触），对 Y67 也无鉴别力。但 MM/GBSA 显示 K70R ΔΔG=−14.68 kcal/mol（全批次最优），可能通过变构效应优化 CDR 取向。当前标准未说明如何处理非接触/变构位点。
- **建议:** 标准中补充"EvoEF2 盲区规则"：接触数 = 0 的残基，EvoEF2 结果无效；如需评估该类位点，应直接用 ESM-2 进化保守性扫描 + MM/GBSA，跳过 EvoEF2 L1 筛选。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §5.1 EvoEF2 已知限制
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.1 §5.1)

### [OBSERVATION] 2026-04-02 — ESM-2 全序列进化保守性扫描作为 Scenario C L2 补充工具
- **来源案例:** mumab4d5_VGRW_SR_R2 esm2_fullseq_scan.py（120 × 19 = 2280 评估）
- **观察:** 对 VHH 全序列（120 aa）进行 ESM-2 masked logP 扫描，可以：①评估 EvoEF2 无法覆盖的非接触位点（变构、Vernier、内部核心）；②提供进化压力下的"可容忍替换"信息；③与 ThermoMPNN 互补（ThermoMPNN 测稳定性，ESM-2 测进化天然性）。本项目中 K70（ESM min_ΔlogP=−2.73）和 Y67（min_ΔlogP=−2.95）在进化上均属可替换位点，支持将其列为候选。
- **建议:** Scenario C 标准中，将 ESM-2 全序列扫描列为可选 Phase 2.5 工具，用于补充评估接触数 < 3 的框架区/变构位点，条件为"接触数=0 但有历史进化信号"。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §3.4, §4 工作流补充
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.1 §4 Phase 2.5 + §5.8)

### [OBSERVATION] 2026-04-02 — CMC pI 门控系统性淘汰 R/K→非电荷替换，揭示电荷位点不可动
- **来源案例:** mumab4d5_VGRW_SR_R2 CMC gate：R50 系列 18/19 淘汰，R55/R66 大量淘汰
- **观察:** 对界面上集中了多个 R/K 残基的 VHH（本例 R50/R55/R66/K70 均在界面或近界面），EvoEF2 L1 和 ThermoMPNN L2 均支持其多种疏水/中性替换，但 CMC pI 门控强制淘汰所有去电荷替换（pI 偏移 0.6–1.8 单位超标）。最终 CMC 成为主要筛选力量，而非结合能计算。当前标准中 CMC 门控位于 Phase 3，发生在稳定性/序列筛选之后，但实际上 pI 约束是硬性可开发性约束，可以提前。
- **建议:** 对于界面含 ≥3 个 R/K 残基的项目，建议在 Phase 1 完成后即进行 CMC pI 预筛选（快速 pI 估算），提前过滤 pI 变化明显的候选，减少 ThermoMPNN/MM/GBSA 的无效计算量。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §4 Phase 3，新增"提前 pI 预筛"建议
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.1 §4 Phase 3 注记)

### [OBSERVATION] 2026-04-02 — 双点突变协同性（Epistasis）实测：单点筛选无法预测双点最优解
- **来源案例:** mumab4d5_VGRW_SR_R2 G49A+F112L 双点 MM/GBSA 验证
- **观察:** G49A 和 F112L 在各自单点批次 ΔΔG 均为轻微不利（+13.20 和 +7.48），但组合后 ΔΔG=−3.32（优于 WT），非加和协同项达 −24.0 kcal/mol。这是典型的正向上位性（Positive Epistasis）：两个单独有害或中性的突变组合后产生协同增益。当前标准完全没有双点验证协议，也未提及如何选择组合候选对。
- **建议:** 在 Phase 4 之后增加可选的"Phase 4.5 — 双点协同验证"：（1）从单点精算中选取空间上距离 ≤ 25 Å 的 top-N 对进行 MM/GBSA 双点计算；（2）计算非加和项 = 实测 ΔΔG(A+B) − [ΔΔG(A) + ΔΔG(B)]；（3）非加和项 < −5 kcal/mol 定义为强协同，优先推荐实验验证。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §4 增加 Phase 4.5
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.1 §4 Phase 4.5)

### [OBSERVATION] 2026-04-02 — AbLang 可替代 AntiFold 用于 Scenario C 序列自然性过滤
- **来源案例:** mumab4d5_VGRW_SR_R2 AntiFold 安装失败（Python 3.14 biotite 不兼容）
- **观察:** AntiFold 依赖 biotite，在 Python 3.14 环境中无法安装（C 扩展编译失败）。以 AbLang 替代，对 96 个候选进行 heavy chain 序列自然性评分，所有候选通过（Δ logP > −0.3），验证了 AbLang 可作为有效的备选过滤工具。AbLang 与 AntiFold 均基于大规模抗体序列训练，评估序列天然性的逻辑一致，但 AntiFold 基于结构逆折叠，信息更丰富。
- **建议:** 标准 §5.5 中补充"若 AntiFold 不可用（Python 版本兼容性问题），可用 AbLang（heavy/light chain 预训练模型）作为等效替代，ΔlogP < −0.3 为警告阈值（非硬淘汰）"。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §5.5 AntiFold 备选说明
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.1 §5.5)

### [OBSERVATION] 2026-04-02 — MM/GBSA 跨批次基线波动约 ±50 kcal/mol，批次内排序有效
- **来源案例:** mumab4d5_VGRW_SR_R2 单点批次（WT=−4119.94）vs 双点批次（WT=−4130.07）
- **观察:** 两次独立 MM/GBSA 运行（均使用相同 PDB、参数、500 步），WT 基线绝对值相差约 10 kcal/mol。F112L 在单点批次 ΔΔG=+22.38，在双点批次 ΔΔG=+7.48——方向一致但数值差异显著。这证实了 MM/GBSA 单次绝对值不可靠，而同批次内的 ΔΔG 相对排序有效的已知结论。
- **建议:** 标准 §5.3 补充"跨批次比较原则：MM/GBSA 每次独立运行需设置批次内 WT 对照，仅比较同批次 ΔΔG。若需跨批次，应至少重复 3 次取均值"。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §5.3 OpenMM MM/GBSA
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.1 §5.3)

---

### [PROPOSAL] 2026-04-02 — P1：§3.1 决策树扩展为二维（抗体/抗原类型 × 结构来源质量）
- **来源案例:** VGRW-SR-R2 实战总结 + 前瞻性 VH/VL 和 AF3 场景预判
- **观察:** 现有 §3.1 场景判定是单维（仅按 antigen_length 和 antibody_type 分类）。实际上"结构来源质量"是独立的第二维度，直接决定 Phase 0 路径和全链置信度：实验共晶 PDB（最可靠）→ AF2-Multimer 高置信（ipTM>0.75）→ AF2-Multimer 中置信（0.60–0.75）→ AF2-Multimer 低置信（<0.60）→ AF3（不同置信指标）。不同来源在同一场景类别下应走不同 Phase 0 分支，但现标准不区分，存在用低质量结构驱动整条设计链的风险。
- **建议:** §3.1 增加第二维参数 `structure_source_tier`（PDB_experimental / AF2_high / AF2_mid / AF2_low / AF3 / HADDOCK3_refined），与现有场景 A/B/C 组合成决策矩阵，分别规定 Phase 0 处理路径（direct / HADDOCK3_optional / HADDOCK3_recommended / HADDOCK3_mandatory / AF3_PAE_check）。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §3.1 场景判定逻辑，§4 Phase 0
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.2)

### [PROPOSAL] 2026-04-02 — P2：§3.1 新增 AlphaFold 结构分层规则（含 AF3 支持）
- **来源案例:** 前瞻性 AF2/AF3 数据来源预判
- **观察:** AF2-Multimer 和 AF3 是最常见的结构来源，但两者的置信指标不同（AF2 用 ipTM；AF3 用 PAE 矩阵均值 + pTM + ipTM，且 AF3 界面定义精度有差异）。现标准对 AF2 仅有"ipTM>0.7"的笼统要求，未分层；AF3 完全未覆盖。低 ipTM 的 AF2 结构进入 EvoEF2 扫描，界面残基列表可能错误，导致全链输出不可信。
- **建议:** §3 新增"结构来源分层表"：(1) PDB 实验结构 → 直接用，记录分辨率+R-factor；(2) AF2 ipTM>0.75 → 多模型取共识（≥3 模型），HADDOCK3 可选；(3) AF2 ipTM 0.60–0.75 → HADDOCK3 精修推荐，EvoEF2 结果需多结构交叉验证；(4) AF2 ipTM<0.60 → HADDOCK3 精修强制，标注置信度警告；(5) AF3 → 检查 PAE 界面均值 < 10 Å²，否则退回 HADDOCK3；(6) HADDOCK3 精修后 → 以 Cluster-1 集中度 ≥ 60% 作为质量门。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §3.1，§4 Phase 0 质量门
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.2)

### [PROPOSAL] 2026-04-02 — P3：§3.3 场景 B（VH/VL + 蛋白抗原）同步 V1.1 改进
- **来源案例:** VGRW-SR-R2 VHH 实战改进项的可迁移性分析
- **观察:** V1.1 写入 §3.4（场景 C）的所有改进在物理原理上同样适用于场景 B（VH/VL + 蛋白抗原）：(1) EvoEF2 扫描范围应由接触图谱决定，非 CDR 定义；(2) EvoEF2 接触数=0 盲区规则；(3) ESM-2 全序列保守性补充扫描；(4) Phase 4.5 双点协同验证；(5) MM/GBSA 批次内 WT 强制对照。但 §3.3 未更新，形成标准不一致，同一团队执行场景 B 和 C 时会采用不同规则。
- **建议:** §3.3 同步以下 V1.1 内容：扫描范围改为"全界面接触数 ≥ 3 的残基"（删除"全 CDR × 19 aa"），新增 EvoEF2 盲区排除规则，新增 ESM-2 补充扫描（推荐），MM/GBSA 行补充"每批必须含 WT 对照，批次间绝对值不可比较"，新增"双点验证"行。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §3.3 场景 B 工具表
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.2)

### [PROPOSAL] 2026-04-02 — P4：§3.2 场景 A 按抗体格式细分（短肽 + VH/VL 子场景）
- **来源案例:** 前瞻性 VH/VL 抗体设计场景预判
- **观察:** 现场景 A 只按抗原大小（≤30 aa）分类，但对同为短肽靶标的 VHH vs VH/VL 抗体没有区分。两者关键差异：(1) 扫描范围：VHH 只有 3 个 CDR 环（H1/H2/H3）；VH/VL 有 6 个 CDR 环（H1/H2/H3 + L1/L2/L3），需联合分析；(2) 序列评估工具：VHH 用 AntiFold VHH 预训练模型或 AbLang；VH/VL 应使用 AntiFold scFv 模型或 AbLang heavy+light 双链评分；(3) CMC 约束：VH/VL 轻链对 pI 影响不同于 VHH；(4) Hallmark 保护位点：VHH 有 Kabat 37/44/45/47 保护约束，VH/VL 无对应约束但有 Vernier 位点限制。
- **建议:** §3.2 拆分为 A-VHH 和 A-VH/VL 两个子场景表格，分别规定扫描环数、序列评估工具、CMC 要求和禁止突变位点。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §3.2 场景 A
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.2)

### [PROPOSAL] 2026-04-02 — P5：引入 BioChatter 作为 Phase -1 智能输入分类层
- **来源案例:** InSynBio/Therasik BioChatter 能力引入（前瞻性架构升级）
- **观察:** 当前 VAM 标准的场景分类完全依赖人工输入（antigen_length 和 antibody_type 由用户提供）。随着 BioChatter 的引入，可以用 LLM + 工具调用自动完成：(1) 从 UniProt/序列自动识别 antibody_type（VHH 标志：Hallmark 位点 Kabat 44/45 为 G/E；VH/VL 标志：Kabat 44 为 G，通常不含 37/47 疏水核心）；(2) 从 AF2 JSON 自动解析 ipTM / pLDDT_interface 并分层；(3) 从 PDB header 提取实验结构分辨率和 R-free；(4) 输出结构化的 `scenario_classification_report`，驱动后续 Phase 0 路径选择。
- **建议:** §4 Phase 0 前新增 Phase -1（BioChatter 智能输入分类），为 InSynBio/Therasik 产品线工作流规定可选自动化入口：工具链 = `sequence_parser → structure_quality_analyzer → scenario_classifier`，输出 `{scenario: A/B/C, structure_tier: PDB/AF2_high/.../AF3, antibody_format: VHH/VHL, recommended_phase0_path}`。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §4 工作流，新增 Phase -1 描述；相关 BioChatter 工具集成文档
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.2)

### [PROPOSAL] 2026-04-02 — P6：BioChatter 驱动 Phase 0 预查询（SKEMPI2/BindingDB 实验数据对照）
- **来源案例:** InSynBio/Therasik BioChatter 知识库查询能力（前瞻性）
- **观察:** 当前 VAM 流程全部依赖从头计算，未利用已有实验数据。对于常见靶标（HER2、EGFR、PD-L1、TNFα），SKEMPI2 数据库和 BindingDB 中存有大量突变-结合能实验数据。对于这些已有数据的位点/突变，可直接用实验值校准计算工具的可信度，甚至在数据充分时直接用实验数据替代计算预测。BioChatter 具备数据库查询和 RAG 检索能力，可在 Phase 0 自动执行此查询。
- **建议:** §4 Phase 0 新增"实验数据预查询"可选步骤：BioChatter 查询 SKEMPI2 API（或本地镜像），检索与当前抗原-抗体系统同源度 ≥ 70% 的已知突变数据；若查到 ≥ 5 条同系统实验数据，在 Phase 2 EvoEF2 结果旁附上实验基准值；若查到当前待扫描位点的直接实验数据，跳过该位点的 EvoEF2/MM/GBSA 计算，直接引用。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §4 Phase 0；BioChatter 工具集成 API 定义
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.2)

### [PROPOSAL] 2026-04-02 — P7：BioChatter RAG 支持跨系统阈值校准（动态置信度调整）
- **来源案例:** InSynBio/Therasik BioChatter RAG 能力（前瞻性）
- **观察:** 现 VAM 标准中所有工具阈值（EvoEF2 ΔΔG < −0.5 保留，ThermoMPNN > +0.5 排除，MM/GBSA < −1.0 高置信）均来自 PAG1 短肽和 VGRW-SR-R2 VHH 两个案例。对于新抗原系统（如 CD3ε、CTLA-4、IL-6R），工具在这些系统上的精度可能显著不同（EvoEF2 在不同蛋白家族 Pearson r 范围 0.30–0.70）。BioChatter 的 RAG 能力可在 Phase 0 自动检索该系统已发表的计算亲和力预测基准文献，动态调整各工具的置信阈值。
- **建议:** §4 Phase 0 新增"RAG 阈值校准"可选步骤（仅在 BioChatter 接入时启用）：BioChatter 以系统关键词（抗原名称 + 工具名称）检索 PubMed/bioRxiv，提取同类系统的工具精度报告，生成系统特异性阈值建议（如"EvoEF2 在 anti-HER2 VHH 系统 r≈0.45，建议提高 L1 保留阈值至 −0.8"），供执行者参考或自动应用。
- **影响范围:** `VIRTUAL_AFFINITY_MATURATION_STANDARD.md` §4 Phase 0，§5 各工具阈值说明；BioChatter RAG 配置文档
- **状态:** APPROVED → EXECUTED (2026-04-02，写入 VAM Standard V1.2)

---

### [OBSERVATION] 2026-04-02 — Evidence-Gating Layer integrated into three main CLIs
- **来源案例:** InSynBio BioChatter 整合计划（Plan Integration — Layer 1）
- **观察:** `core/resources/evidence_gate.py` 已创建，实现 `EvidenceGate` 和 `EvidenceContext`。可从 ADA 三层库（Tier1/2/3）本地查询，可选 PubMed/UniProt/PDB 网络富化。已接入三个主 CLI：`run_engineering_pipeline.py`（VH/VL 人源化入口）、`run_vhh_engineering.py`（VHH 四路径入口）、`affinity_energy_cli.py`（VAM 亲和力入口）。每次运行自动打印 Evidence Banner，将 ADA Tier 和证据链写入执行日志。
- **建议:** 后续项目中 CAR-T CLI (`core/car_design/`) 和其他新入口应同样接入 EvidenceGate。
- **影响范围:** `scripts/run_engineering_pipeline.py`、`scripts/run_vhh_engineering.py`、`scripts/affinity_energy_cli.py`
- **状态:** EXECUTED

### [OBSERVATION] 2026-04-02 — Report output layer upgraded with Tier labels and disclaimers
- **来源案例:** InSynBio BioChatter 整合计划（Plan Integration — Layer 2）
- **观察:** `core/evaluation/client_report.py` 的 `generate_client_report` 和 `write_client_report` 新增 `evidence_context` 参数。Section 4（免疫安全性）在有 EvidenceContext 时自动渲染 ADA Tier 标签、证据来源和分级警告。新增 Section 5（数据溯源与可信度），展示 Tier 等级说明和 PubMed 自动检索结果。Footer 在需要时自动附加数据可信度声明。`core/reporting/spec.py` 所有 8 个 ReportFamily 的 chapter skeleton 中均已注入 `evidence_traceability` 章节（位于 `methodology_reliability` 之前）。
- **建议:** 无。
- **影响范围:** `core/evaluation/client_report.py`、`core/reporting/spec.py`
- **状态:** EXECUTED

### [OBSERVATION] 2026-04-02 — Evidence-Gating Layer integrated into four CMC CLIs
- **来源案例:** InSynBio BioChatter 整合计划（补充 — CMC/可开发性入口）
- **观察:** `EvidenceGate` 已接入以下四个 CMC/可开发性 CLI 入口：
  1. `scripts/run_ab_evaluator.py`（IgG CMC 评估器，--project 触发 ADA Tier 查询）
  2. `scripts/run_vhh_cmc_eval.py`（VHH CMC 15指标+ADI 评估，--project 触发查询）
  3. `scripts/run_bispecific_vhh_cmc.py`（双特异 VHH CMC 评估，--name-a 触发查询）
  4. `scripts/cmc_optimize_pipeline.py`（CMC 优化管线，--antibody-id / --project 触发查询）
  所有入口在正式评估前自动打印 Evidence Banner 和 ADA Tier 信息。
- **建议:** 无。
- **影响范围:** `scripts/run_ab_evaluator.py`、`scripts/run_vhh_cmc_eval.py`、`scripts/run_bispecific_vhh_cmc.py`、`scripts/cmc_optimize_pipeline.py`
- **状态:** EXECUTED

### [OBSERVATION] 2026-04-02 — CARDesigner evidence_context bridge for report layer
- **来源案例:** InSynBio BioChatter 整合计划（补充 — CAR-T 设计引擎）
- **观察:** `core/car_design/car_designer.py` 的 `design()` 方法现在在有 Knowledge Enrichment 时自动生成 `evidence_context` 字典（EvidenceContext 兼容格式），包含 ADA Tier、证据来源、PubMed hits 等信息，写入结果 dict 的 `result["evidence_context"]` 字段。该字段可直接被 `client_report.py` 的 `generate_client_report(evidence_context=...)` 消费，实现 CAR-T 报告的自动 Tier 标注和免责声明。CAR-T 的 `KnowledgeEnricher` 已原生集成三层 ADA 数据库查询，无需重复接线。
- **建议:** 后续 CAR-T 报告生成器（尚未创建）应消费 `result["evidence_context"]` 字段。
- **影响范围:** `core/car_design/car_designer.py`
- **状态:** EXECUTED

### [PROPOSAL] 2026-04-02 — Phased hard integration into CMC, VAM, CAR-T, humanization core engines
- **来源案例:** InSynBio BioChatter 整合计划（Plan Integration — Layer 3）
- **观察:** 上层框架（证据门禁、报告输出、三层 ADA 数据库）已全部落地。以下核心引擎尚未原生硬接线，需要在后续项目推进中逐步整合：
  1. **CMC (`core/evaluation/evaluator.py`)**: `AbEvaluator` 可增加 `evidence_hooks` 参数，在评估时自动查询 ADA Tier 并写入 `EvaluationResult.results["evidence_context"]`。需走 Evolution Protocol（LOCKED 文件）。
  2. **VAM (`core/structure/affinity_energy_toolkit.py`)**: `AffinityEnergyToolkit` 可在 `run_all()` 前增加 Phase -1 知识过滤步骤。需走 Evolution Protocol（LOCKED 文件）。
  3. **CAR-T (`core/car_design/car_designer.py` + `decision_advisor.py`)**: `CARDesigner` 和 `DecisionAdvisor` 可消费统一 EvidenceContext 进行元件选择决策。无锁定限制，可直接修改。
  4. **Humanization routing**: `run_vhvl_v44_pipeline.py` 和 VHH 引擎可在路由层统一调用 EvidenceGate 并将结果传递至下游报告。无锁定限制。
- **建议:** 采用"项目驱动"策略：每次执行新项目时，优先在该项目涉及的模块中完成硬接线，逐步覆盖所有核心引擎。LOCKED 文件需所有者审批后执行。
- **影响范围:** `core/evaluation/evaluator.py`（LOCKED）、`core/structure/affinity_energy_toolkit.py`（LOCKED）、`core/car_design/car_designer.py`、`core/car_design/decision_advisor.py`
- **状态:** PROPOSED

---

### [OBSERVATION] 2026-04-02 — Self-Evolution V1 architecture fully implemented
- **来源案例:** InSynBio 自进化架构 V1 实施（self-evolution-v1 plan）
- **观察:** `core/evolution/` 模块已完整实现，包含 6 个组件：
  1. `run_event.py` — RunEvent schema + append-only JSONL RunEventStore
  2. `event_collector.py` — EventCollector 工厂，支持 from_evidence_gate / from_cmc_result / from_vam_result / from_car_result / from_report_output 五种采集模式
  3. `signal_analyzer.py` — 5 条规则型信号检测（TIER2/3 循环命中、缺 target、知识离线、报告缺 traceability、CMC FAIL 循环）
  4. `governance_policy.py` — 机器可读治理规则，与 `docs/ABENGINECORE_GOVERNANCE.md` 对齐
  5. `proposal_engine.py` — 将 Signal 转为受治理的 OBSERVATION / PROPOSAL 条目，双输出：EVOLUTION_LOG.md + `output/evolution/suggestions.json` + `summary.md`
  6. `__init__.py` — 公开 API
  非侵入式采集器已接入 7 个 CLI 入口（run_engineering_pipeline、run_vhh_engineering、run_ab_evaluator、run_vhh_cmc_eval、run_bispecific_vhh_cmc、cmc_optimize_pipeline、affinity_energy_cli）。独立 CLI `scripts/run_evolution_cycle.py` 支持 `--dry-run` 和 `--stats` 模式。端到端集成测试通过：8 事件 → 3 信号 → 2 OBSERVATION + 1 PROPOSAL。
- **影响范围:** `core/evolution/`（新建），7 个 scripts CLI（非侵入式 try/except 追加），`output/evolution/`（运行时产物）
- **状态:** LOGGED

---

### [OBSERVATION] 2026-04-02 — De Novo CDR Design draft 仍缺少可执行门控表与断点续算细则
- **来源案例:** De Novo CDR Design & Patent Escape Standard V3.0 架构讨论
- **观察:** 当前 de novo CDR 设计草案已具备完整科学流程，但在工程落地层面仍缺少两类关键执行信息：(1) Gate Thresholds 附录，如 AbLang/AbNatiV、CDR RMSD、global RMSD、SC、Epitope overlap、CMC 快筛等阈值及其适用条件；(2) Checkpoint / Resume 规范，如 `project_manifest.json`、append-only `.jsonl/.csv`、`done.flag`、任务唯一 ID 和休眠/唤醒后的恢复逻辑。若缺少这些细则，长流程在笔记本休眠后虽可重跑，但无法保证精确续算与一致路由。
- **建议:** 将该标准补充为“流程正文 + Appendix A（Gate Thresholds）+ Appendix B（Checkpoint & Resume Spec）”三段式结构。
- **影响范围:** `docs/DE_NOVO_CDR_DESIGN_STANDARD.md`
- **状态:** LOGGED

### [PROPOSAL] 2026-04-02 — 为 De Novo CDR Design Standard 增补 Appendix A/B
- **来源案例:** De Novo CDR Design & Patent Escape Standard V3.0 架构讨论
- **观察:** 用户的真实使用场景以笔记本合盖休眠为主，而非关机；因此断点续算不是“可选优化”，而是工作流可用性的硬需求。与此同时，若无统一门控表，不同 Agent 或不同项目会对 SC、Epitope overlap、RMSD、自然度和 CMC 快筛采用不一致的阈值，导致结果不可复现。
- **建议:** 对 `docs/DE_NOVO_CDR_DESIGN_STANDARD.md` 执行一次 patch 级升级，新增两个附录：  
  Appendix A — Gate Thresholds：给出 Phase 1–4 的默认阈值、推荐范围、失败回退逻辑、需 benchmark 校准项。  
  Appendix B — Checkpoint & Resume Spec：规定项目目录结构、`project_manifest.json` 字段、append-only 中间结果文件、完成标志文件、重启扫描顺序与跳过策略。
- **影响范围:** `docs/DE_NOVO_CDR_DESIGN_STANDARD.md`
- **状态:** APPROVED → EXECUTED (2026-04-02，V1.0 → V1.1，新增 Appendix A + B)

### [OBSERVATION] 2026-04-02 — Clinical ADA drivers shift in expanded dataset (n=131)
- **来源案例:** 380 Natural Atlas + 459 Engineered Atlas 临床 ADA 关联分析
- **观察:** 样本量从 70 扩大至 131 后，参数相关性发生显著漂移：
  1. **VH Identity** 的显著性增强 (rho=-0.187, p=0.032)，成为最稳健的单一预测指标。
  2. **理化参数 (CMC)** 如 Instability Index 和 Hydro Patch 的线性相关性大幅稀释，证明其对 ADA 的影响是非线性的（即：极差会导致风险，但优异不代表低风险）。
  3. **天然 vs 改造抗体** 表现出截然不同的驱动逻辑：天然抗体受 VL Identity 影响极大 (rho=-0.345, p=0.0099)，而改造抗体则无此显著相关性。
- **影响范围:** `core/evaluation/evaluator.py`, `docs/VH_VL_HUMANIZATION_STANDARD_V4.4.md`
- **状态:** LOGGED

### [PROPOSAL] 2026-04-02 — 优化免疫原性风险评估算法：从“线性加权”转向“分层门禁”
- **来源案例:** 380 Natural Atlas + 459 Engineered Atlas 临床 ADA 关联分析
- **建议:** 
  1. **算法逻辑重构**: 在 `evaluator.py` 中，将免疫风险评估从单一加权评分改为“Identity 门禁 + CMC 否决”逻辑。
  2. **亚组特异性权重**: 针对全人源/天然序列，提升 VL Identity 的权重；针对人源化/改造序列，维持 VH Identity 核心地位并引入更细致的表位设计审计。
  3. **非线性 CMC 否决**: 设定理化参数的“硬阈值”（如 Hydro Patch > 0.8），一旦触碰即触发 HIGH RISK 警告，而非参与线性评分计算。
- **影响范围:** `core/evaluation/evaluator.py` (LOCKED), `config/vh_vl_humanization_v44.json` (LOCKED)
- **状态:** PROPOSED → EXECUTED (2026-04-03, ADA Scorer V2 上线)
- **执行摘要:** `core/immunogenicity/ada_risk_scorer.py` 重写为 V2 六组分模型 (G=0.40 F=0.30 I=0.05 E=0.15 P=0.10 C=0.00)，亚组 VL 调节，CMC 否决门禁。Spearman 从 +0.048 提升至 +0.190**(p=0.035)。配置: `config/immunogenicity_risk_v2.json`。

---

### [OBSERVATION] 2026-04-02 — 多参数 ADA 预测建模：R²为负、特征集需扩展

- **来源案例:** 136-Panel ADA 预测建模（CLEAN-124，Tier A+B）
- **方法:** RandomForest / Ridge / GradientBoosting，12维特征（germline identity, CMC, MHC-II, SASA），10-fold CV
- **观察:**
  1. **所有模型 R² 为负**（RF raw=-0.287，log变换后=-0.052）：12维序列/结构特征不能单独预测临床 ADA 发生率。ADA 偏度极高（skew=3.23），跨3个数量级（0–95%）。
  2. **去除 Tier C 6个抗体显著改善**：RF R² 从 -0.705 → -0.299（ΔR²=+0.407）。Tier C 数据引入噪音，生产级建模应排除。
  3. **特征重要性一致性**（log-ADA，RF）：frac_exposed_vh(20%) > VH_identity(18%) > VL_identity(15%) > net_charge(10%) > pI(9%)。VH germline identity 不再是第一，被 SASA 暴露比率取代。
  4. **亚组信号差异显著**：全人源亚组中 VL_identity(rho=-0.297\*\*) 和 n_surf_patches(rho=+0.284\*\*) 有效；工程化亚组中 VL_identity(rho=+0.199\*) 符号相反，提示不同机制。
  5. **主要混杂因素未收录**：fc_isotype 解释5.7%，phase 解释5.4%，origin 仅2.5%。检测方法、给药途径、免疫抑制剂、试验时长等均不在当前特征集中，是 R² 偏低的根本原因。
- **建议:** 补入临床元数据字段（给药途径 SC/IV、是否合用免疫抑制剂、ADA 检测方法、试验持续时间），预期可将 RF R² 提升至正值区间（>0.2）。
- **影响范围:** `core/evaluation/evaluator.py` 免疫原性评估输出字段
- **状态:** LOGGED

---

### [OBSERVATION] 2026-04-02 — 亲水面 SASA 分析：frac_exposed_vh 是唯一显著 surface 预测因子

- **来源案例:** 136-Panel 全量 surface immunogenicity 批量计算
- **方法:** freesasa (Shrake-Rupley, r=1.4Å)，131 个抗体 PDB 结构，链 H/L
- **观察:**
  1. **全部 131 个抗体均分类为 HIGH surface risk**（水解斑块数 7–13，均值 9.7），说明当前阈值（≥3 patches = HIGH）对治疗性抗体群体不具鉴别力，需要重新校准。
  2. **frac_exposed_vh（VH 暴露残基比例）与 ADA 呈显著负相关**（rho=−0.202，p=0.021），方向与直觉相反：VH 暴露比越高 → ADA 越低。生物学解释：高暴露比通常与更接近人胚系的框架区有关（可溶性好、结构开放），而非免疫原性驱动。
  3. **n_patches 在全人源亚组具有正相关性**（rho=+0.286，p=0.036），在工程化抗体亚组中消失（rho=+0.042，ns）。亲水斑块数量是天然抗体 ADA 的次要正向信号，但在工程化抗体中被框架区人源化程度所掩盖。
  4. **最高斑块抗体（13 patches）= Tezepelumab**（ADA 4.9%），最高 ADA（90%）= Donanemab（12 patches）。提示斑块数与 ADA 无单调关系，高 ADA 由多因素共同驱动。
  5. VH 平均 SASA = 46.6 Å²/残基，VL = 45.4 Å²/残基；暴露比 VH > VL，符合 VH 框架区更多参与抗原接触的物理预期。
- **建议:** 现有 surface_risk 三级分类（HIGH/MEDIUM/LOW）阈值（≥3 patches）无法区分治疗性抗体，建议重新校准为 ≥12 patches = HIGH，8–11 = MEDIUM，≤7 = LOW。
- **影响范围:** `core/immunogenicity/surface_immuno.py` (surface_risk 阈值 MIN_PATCH_LEN 和风险分类逻辑)
- **状态:** LOGGED

---

### [OBSERVATION] 2026-04-03 — ADA 主表：极高值条目与 FDA 标签对账（≥30% 子集）

- **来源案例:** 用户质疑 ≥30% ADA 及 95% 等数值；对 DailyMed SPL / PI §12.6 核对
- **观察:**
  1. **Depemokimab 95%** — 错误：来自 PK 小节 **95% CI** 的误摘，非 ADA。EXDENSUR §12.6：**10%（66/691）**，其中 6%（4/66）中和抗体。
  2. **Donanemab 90%** — 与 KISUNLA §12.6 不一致；标签为 **87%**（691/792 与 176/202），ADA 阳性者中中和抗体比例标签写明 100%。
  3. **Atoltivimab 80%** — 错误：标签中 **80%** 为病毒抑制语境，非 ADA。INMAZEB：24 名健康受试者 **未检出** 抗体反应（至 168 天）。
- **建议:** 其余 ≥30% 多为联合治疗、试验定义或预先存在 ADA；侧栏保留证据链与 URL，避免跨试验简单比较单一百分数。
- **影响范围:** `data/immunogenicity_knowledge_base/master/ada_master_136_curated.csv`，`docs/ada_db_data.json`
- **状态:** EXECUTED（主表与 JSON 已更新）

---

### [APPROVED] 2026-04-03 — DE_NOVO_CDR_DESIGN_STANDARD V4.0 → V5.0 升级
- **来源案例:** denovo_HER2_VGRW_SR_R2 (CDR2-only) + 多CDR/CDR3设计讨论
- **观察:**
  1. V4.0 缺少 T1.5 结合界面物理门控（EvoEF2 BuildMutant + vdW clash check）
  2. V4.0 未明确多CDR/CDR3设计时 ImmuneBuilder、HADDOCK3 的分工规则
  3. 三个核心工具（ImmuneBuilder / EvoEF2 / HADDOCK3）各自回答不同的物理问题，需在标准中明确定义
  4. 需要将"智能路由"（Adaptive Pipeline）正式纳入标准
  5. 需要新增 `core/evaluation/fast_clash_check.py` 到工具清单
  6. 需要明确 `run_all_v2.py` 的断点续算（checkpoint/resume）规范
- **建议:** 升级至 V5.0，新增 §2b（三问题框架）、§4.45（T1.5 门控）、§6（多CDR/CDR3扩展管线）、§9（自动路由决策树完整规范）
- **影响范围:** `docs/DE_NOVO_CDR_DESIGN_STANDARD.md`, `docs/STANDARDS_INDEX.md`
- **状态:** EXECUTED — V5.0 已写入 `DE_NOVO_CDR_DESIGN_STANDARD.md` 和 `STANDARDS_INDEX.md`

---

<!-- APPEND NEW ENTRIES ABOVE THIS LINE -->
<!-- Agent: 在此行上方追加新条目。不得修改或删除上方任何已有条目。 -->
