# VH/VL 人源化 V4.4.1 标准流程更新总结

**生效日期**: 2026-03-27  
**标准版本**: V4.4.1 (owner-locked)  
**修改人**: InSynBio AbEngineCore  

---

## 核心更新：自适应救援策略

### ✅ 已完成的 5 层实现

#### 1. **核心引擎** (`core/humanization/rescue_engine.py`)
- ✓ `RescueConfig` 类：配置所有循环限制和金牌框架
- ✓ `RescueEngine` 类：管理 Round 2 + Option B 完整生命周期
- ✓ `RescueResult` 数据类：记录每次迭代的结果
- ✓ 提供方法：触发检查、迭代限制、失败判定、审计日志

#### 2. **标准流程文档** (`docs/VH_VL_RESCUE_STRATEGY_V4.4.1.md`)
- ✓ 详细说明流程图（初始 → Round 2 ≤3次 → Option B 1次 → FAIL）
- ✓ QA 阈值表（pI 5.5-8.5、RMSD < 1.5 Å、angle ≤ 3°）
- ✓ Round 2 执行逻辑和 Vernier 重选策略
- ✓ 金牌框架定义（VH: IGHV3-23*01 等；VL: IGKV1-39*01 等）
- ✓ 失败报告格式和建议方向

#### 3. **配置更新** (`config/vh_vl_humanization_v44.json`)
- ✓ Changelog 新增 entry 14（rescue engine 2026-03-27）
- ✓ `phase_5_after` 扩展：详细的 5.R2a/b/c、5.OB 和 5.EXHAUSTED 步骤
- ✓ `checklist_v4_4` 新增 item 5.9（Phase 5 gate 评估并触发 Round 2）
- ✓ `compliance_rules.must_do` 新增 5 条强制规则（Round 2 触发、执行、Option B 等）
- ✓ `compliance_rules.must_not_do` 新增 5 条禁止项（禁止跳过 Round 2、修改 CDR 等）

#### 4. **测试用例** (`tests/test_rescue_engine.py`)
- ✓ 6 个单元测试，验证配置、触发条件、迭代限制、审计日志、最终状态
- ✓ **所有测试通过** ✅

#### 5. **规则文档更新** (`.cursor/rules/abenginecore-ownership.mdc`)
- ✓ 新增 KABAT FR TRUNCATION BUG 说明（IMGT cutoff 问题已修复）
- ✓ 新增 5 条禁止项涉及 Round 2 + Option B（跳过、使用非金牌框架等）

#### 6. **快速参考** (`docs/VH_VL_RESCUE_QUICK_REF.py`)
- ✓ 配置验证脚本
- ✓ 快速查表：限制、金牌框架、必须/禁止规则

---

## 关键参数速记

### 🎯 循环限制

| 阶段 | 最多 | 超时 | 触发 |
|------|------|------|------|
| 初始 Phase 1-5 | 1 | ∞ | 无 |
| **Round 2** | **3** | 300s/次 | Phase 5 FAIL |
| **Option B** | **1** | 600s | Round 2 全失 |
| **总计** | **5** | N/A | hard limit |

### 🏅 金牌框架

**VH** (按优先级)
1. `IGHV3-23*01` ← **推荐首选** (Herceptin, Avastin)
2. `IGHV3-30*01`
3. `IGHV1-46*01`

**VL** (按优先级)
1. `IGKV1-39*01` ← **推荐首选** (配套 IGHV3-23)
2. `IGKV3-11*01`
3. `IGKV4-1*01`

### 📊 QA 门禁

| 指标 | 阈值 | 触发 Round 2 |
|------|------|------------|
| pI | 5.5-8.5 | 出界 |
| CDR RMSD | < 1.5 Å | ≥ 1.5 |
| VH/VL angle | ≤ 3° | > 3° |
| Vernier packing | P5-P95 | 出界 |
| 临床标志 | 无 | 任何 |

---

## 流程图

```
┌─ 初始 Phase 1-5
│  迭代 #1
└─ Phase 5 QA 评估
   │
   ├─ PASS ─→ [✅ 成功] 输出报告
   │
   └─ FAIL/WARN ─→ 触发 Round 2
      │
      ├─ Round 2 迭代 #2-4 (最多 3 次)
      │  ├─ 位置: 同框架，重新优化 Vernier BM
      │  ├─ 周期: Phase 3 (结构) → Phase 4 (重选 BM) → Phase 5 (QA)
      │  └─ 条件: 任意迭代 PASS → [✅ 成功] 输出报告
      │
      └─ 若 Round 2 全 3 次失败 → 触发 Option B
         │
         └─ Option B 迭代 #5 (1 次)
            ├─ 位置: 切到 IGHV3-23*01 + IGKV1-39*01
            ├─ 运行: 完整 Phase 2-5
            ├─ 结果 PASS → [✅ 成功] 输出报告 (带框架切换说明)
            └─ 结果 FAIL → [❌ EXHAUSTED] 输出失败报告
               ├─ 列出全 5 次迭代结果
               ├─ 诊断最终失败原因
               └─ 建议人工设计或 CDR 筛选

总计: 最多 5 次迭代 (initial + Round2×3 + OptionB×1)
```

---

## 必须做 (MUST-DO)

```python
✓ 若 Phase 5 检测到失败 → 自动触发 Round 2
✓ Round 2 循环最多 3 次，每次重选 Vernier BM
✓ 若 Round 2 全失 → 自动触发 Option B
✓ Option B 使用固定金牌框架对 (IGHV3-23*01 + IGKV1-39*01)
✓ 若 5 次迭代全失 → 强制 ABORT，输出 FAIL 报告
✓ 每个项目审计日志必须记录所有迭代（见 {id}_V44_Audit.md）
```

---

## 禁止做 (MUST-NOT-DO)

```python
✗ 跳过 Round 2，直接进入 Option B
✗ 在 Round 2 中修改 CDR（只允许调整 Vernier BM）
✗ 使用非金牌框架作为 Option B 备选
✗ 超过 5 次总迭代次数
✗ 沉默接受 EXHAUSTED 失败（必须输出审计报告）
✗ 使用非公开的临床框架（必须来自 842 clinical DB）
```

---

## 实现点（集成位置）

### 核心模块
```
core/humanization/rescue_engine.py
├── class RescueConfig           # 配置容器
├── class RescueEngine           # 救援编排器
├── class RescuePhase            # 枚举：ROUND2 / OPTION_B / EXHAUSTED
└── class RescueResult           # 单次迭代结果
```

### 集成脚本 (待编写)
```
scripts/run_vhvl_v44_pipeline.py
├── 初始运行 HumanizationEngine.run()
├── 创建 RescueEngine 实例
├── 若需要 Round 2：循环调用 rescue.record_round2_attempt()
├── 若需要 Option B：调用 rescue.record_option_b_attempt()
└── 最后：rescue.get_final_status() → 输出报告或 FAIL
```

### 报告输出
```
{id}_V44_Audit.md
└── 新增 "救援引擎执行日志 (Rescue Audit)" 部分
    ├── 是否触发救援？
    ├── Round 2 迭代表（3 行）
    ├── Option B 迭代（1 行）
    └── 最终状态 (PASS / EXHAUSTED)

{id}_Client_zh.md
└── 若使用 Round 2/Option B，在客户报告中声明：
    "该设计基于自适应人源化救援策略 (V4.4.1) 
     经过 X 轮结构优化和框架选择评估而得出"
```

---

## 验证清单

- [x] Round 2 引擎实现完成 (`rescue_engine.py`)
- [x] 标准流程文档完成 (`VH_VL_RESCUE_STRATEGY_V4.4.1.md`)
- [x] 配置更新完成 (`vh_vl_humanization_v44.json`)
- [x] 单元测试编写完成 (6 tests)
- [x] 单元测试通过 ✅
- [x] 规则文档更新完成 (`.cursor/rules/abenginecore-ownership.mdc`)
- [x] 快速参考生成完成 (`VH_VL_RESCUE_QUICK_REF.py`)
- [ ] 集成到 `run_vhvl_v44_pipeline.py` (下一步)
- [ ] muMAb4D5 实际运行验证 (下一步)

---

## 下一步

### 立即可做
1. **执行 muMAb4D5 VH/VL 人源化** 使用 V4.4.1 标准  
   - 观察是否触发 Round 2 或 Option B
   - 验证审计日志正确性
   - 测试失败报告格式

2. **集成 RescueEngine 到脚本**  
   - 编辑 `scripts/run_vhvl_v44_pipeline.py` main 函数
   - 加入 Round 2 循环和 Option B 调用

### 中期
- 收集实际运行数据，调整参数（例如 Round 2 超时值）
- 优化 Vernier 重选策略（基于失败案例）

### 长期
- 建立失败案例库，对应不同失败原因的 Round 2 策略
- 考虑 Option C：多轮框架切换（现阶段不需要）

---

**签署**: InSynBio AbEngineCore Owner  
**最后修改**: 2026-03-27  
**状态**: 生效中 ✓  
**下一审查**: 执行 muMAb4D5 后
