# VHH人源化策略变更日志

**版本**: v2.2.0  
**变更日期**: 2025-01-20  
**变更类型**: 重大策略调整

---

## 变更概述

从 **"CDR优先筛选"** 策略正式改为 **"FR优先 + CDR优化"** 策略。

---

## 变更详情

### 1. 核心策略调整

#### 旧策略（v2.1.0及之前）
- ❌ CDR兼容性得分 < 0.7 的模板被**硬筛选过滤**
- ❌ Unknown CDR导致优秀FR模板被排除
- ❌ 可能出现"FR匹配好但CDR不明确"导致无候选的情况

#### 新策略（v2.2.0）
- ✅ **所有FR匹配的模板都进入候选**（不进行CDR硬筛选）
- ✅ Unknown CDR**允许通过**，但记录warning
- ✅ CDR只用于**排序**，不决定生死
- ✅ 确保在FR匹配良好的情况下总能找到候选模板

### 2. 评分权重调整

#### 旧权重
```
combined_score = 0.5 × FR Identity 
               + 0.25 × CDR Compatibility 
               + 0.25 × Developability
```

#### 新权重（FR优先）
```
combined_score = 0.6 × FR Identity      (提升)
               + 0.15 × CDR Compatibility (降低)
               + 0.25 × Developability
```

### 3. 代码变更

#### 3.1 `core/vhh_humanization.py`

**变更前**:
```python
# 过滤掉兼容性得分过低的模板（阈值0.7）
if compatibility['compatibility_score'] < 0.7:
    continue  # 硬筛选，直接排除
```

**变更后**:
```python
# FR优先策略：不进行CDR硬筛选，只计算得分用于排序
cdr_compatibility_score = compatibility['compatibility_score']
# 允许所有候选通过，包括Unknown CDR
```

#### 3.2 `config.yaml`

**变更前**:
```yaml
scoring_weights:
  framework_identity: 0.5
  cdr_compatibility: 0.25
  developability: 0.25
```

**变更后**:
```yaml
scoring_weights:
  framework_identity: 0.6  # FR优先策略
  cdr_compatibility: 0.15   # CDR优化因子
  developability: 0.25
```

### 4. 文档变更

- ✅ 新增 `docs/VHH_HUMANIZATION_FR_PRIORITY_STRATEGY.md` - 正式策略文档
- ✅ 更新报告生成脚本，说明FR优先策略
- ✅ 更新客户/内部说明模板

---

## 影响分析

### 正面影响

1. **提高成功率**: EGFR VHH等FR匹配好但CDR不明确的案例现在可以成功人源化
2. **更合理的优先级**: FR匹配是结构基础，权重应该最高
3. **避免误杀**: 不再因Unknown CDR而排除优秀FR模板

### 潜在影响

1. **CDR警告增加**: 更多Unknown CDR会通过，需要记录warning
2. **需要实验验证**: 对于Unknown CDR的变体，建议进行实验验证

---

## 向后兼容性

### 配置兼容

- ✅ 旧的`scoring_weights`配置仍然有效，但建议更新为新权重
- ✅ 环境变量覆盖仍然支持

### API兼容

- ✅ `humanize_vhh()`函数接口不变
- ✅ 返回结果结构不变，但增加了`quality_flags['cdr_warnings']`字段

### 数据兼容

- ✅ 模板库格式不变
- ✅ 对齐矩阵格式不变

---

## 迁移指南

### 对于现有项目

1. **更新配置**: 建议更新`config.yaml`中的评分权重
2. **重新生成报告**: 使用新策略重新生成人源化报告
3. **检查CDR警告**: 查看新增的`cdr_warnings`字段

### 对于新项目

1. **使用默认配置**: 新策略已作为默认配置
2. **关注CDR警告**: 在报告中检查CDR兼容性警告
3. **实验验证**: 对于有CDR警告的变体，建议进行实验验证

---

## 测试验证

### EGFR VHH案例

- **变更前**: 因CDR兼容性得分0.00被过滤，导致无候选
- **变更后**: ✅ 成功找到5个候选模板，FR identity 88.8%

### 其他测试案例

- ✅ 标准VHH序列：正常通过
- ✅ Unknown CDR序列：允许通过，记录warning
- ✅ 极端CDR3序列：允许通过，记录warning

---

## 版本信息

- **v2.2.0** (2025-01-20): FR优先策略正式实施
- **v2.1.0** (之前): CDR优先筛选策略

---

**变更批准**: 策略设计原则文档  
**维护者**: VHH人源化平台开发团队


















