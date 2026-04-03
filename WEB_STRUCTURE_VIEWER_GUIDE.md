# 🌐 网页交互式结构查看器 — 完整指南

## 问题解决

### ✅ 问题 1：ECD 和 VHH FR 颜色太相近
**解决方案：** 每条链独立配色，清晰区分
```
VHH (紫红色) ≠ HER2 ECD (青色)
```

### ✅ 问题 2：侧链遮挡接触面
**解决方案：** 交互式显示/隐藏控制
- 旋转视角查看不同角度
- 一键切换侧链显示
- 调整透明度查看内部结构

---

## 🚀 快速开始

### Step 1: 生成网页查看器
```bash
# 预设配置（VHH-HER2）
python scripts/web_structure_viewer.py \
    --pdb vhh_her2_complex.pdb \
    --preset vhh_her2 \
    --output viewer.html

# 预设配置（FAB-抗原）
python scripts/web_structure_viewer.py \
    --pdb fab_antigen_complex.pdb \
    --preset fab_antigen \
    --output viewer.html

# 自定义标题
python scripts/web_structure_viewer.py \
    --pdb complex.pdb \
    --preset vhh_her2 \
    --title "My VHH-HER2 Complex" \
    --output viewer.html
```

### Step 2: 在浏览器中打开
```
File → Open → viewer.html
或直接拖动到浏览器
```

### Step 3: 交互操作

| 操作 | 功能 |
|------|------|
| 🖱️ **拖动** | 旋转结构 |
| 🔄 **滚轮** | 放大/缩小 |
| 🔀 **Shift+拖** | 平移视图 |
| ☑️ **Show Sidechains** | 显示/隐藏侧链 |
| ⚪ **Opacity Slider** | 调整透明度 |
| 🎯 **Quick Views** | 快速切换视角 |

---

## 💡 预设配置

### 预设 1：VHH-HER2
```bash
--preset vhh_her2
```

包含：
- ✅ VHH 链（紫红色）
- ✅ HER2 ECD 链（青色）
- ✅ VHH-HER2 接触面高亮
- ✅ 预定义视角：
  - Overall（全景）
  - VHH Only（仅抗体）
  - HER2 Only（仅抗原）
  - Interface（接触面）

### 预设 2：FAB-抗原
```bash
--preset fab_antigen
```

包含：
- ✅ VH 链（红色）
- ✅ VL 链（蓝色）
- ✅ 抗原链（绿色）
- ✅ VH-抗原接触面
- ✅ VL-抗原接触面
- ✅ 预定义视角：
  - Overall（全景）
  - CDR Sidechains（CDR 侧链）
  - Interface（接触面）

---

## 🎨 链颜色方案

### VHH-HER2 复合物
```
🟣 VHH          #FF00FF (紫红)
🔵 HER2 ECD     #00CCFF (青)
```

### FAB-抗原复合物
```
🔴 VH           #FF0000 (红)
🔵 VL           #0000FF (蓝)
🟢 Antigen      #00AA00 (绿)
```

---

## 🛠️ 自定义配置

### 创建自定义配置文件

创建 `viewer_config.json`：
```json
{
  "title": "My Custom Complex",
  "height": 800,
  "width": 1200,
  "chains": {
    "A": {
      "color": "#FF00FF",
      "representation": "cartoon",
      "name": "VHH"
    },
    "B": {
      "color": "#00CCFF",
      "representation": "cartoon",
      "name": "HER2"
    }
  },
  "interfaces": [
    {
      "chain1": "A",
      "chain2": "B",
      "color": "#FFFF00",
      "distance": 4.5
    }
  ],
  "views": [
    {
      "name": "Overall",
      "style": "all",
      "sidechain": false
    },
    {
      "name": "With Sidechains",
      "style": "all",
      "sidechain": true
    }
  ]
}
```

### 使用自定义配置
```bash
python scripts/web_structure_viewer.py \
    --pdb complex.pdb \
    --config viewer_config.json \
    --output viewer.html
```

---

## 🎯 常见使用场景

### 场景 1：展示接触面
1. 生成网页
2. 点击 "Interface" 快速视角
3. ☑️ 勾选 "Show Sidechains"
4. 调整透明度查看深层接触

### 场景 2：区分不同链
1. 生成网页
2. 参考左侧颜色图例
3. 旋转鼠标查看各链位置
4. 使用 "Quick Views" 快速定位

### 场景 3：演讲展示
1. 全屏浏览器（F11）
2. 使用鼠标控制旋转
3. 根据讲述内容切换视角
4. 透明度调整突出重点

### 场景 4：论文图表
1. 生成特定视角
2. 用浏览器截图工具截图
3. 用于论文/演讲稿

---

## 📱 浏览器兼容性

| 浏览器 | 支持 |
|------|------|
| Chrome / Edge | ✅ 完全支持 |
| Firefox | ✅ 完全支持 |
| Safari | ✅ 完全支持 |
| IE 11 | ❌ 不支持 |

---

## 🔧 技术细节

### 使用的库
- **3Dmol.js** — 开源 3D 分子查看器
- 完全在浏览器中运行（无需服务器）
- 支持 PDB、MOL、SDF 等格式

### 文件大小
- 生成的 HTML 通常 < 5 MB（包含 PDB 数据）
- 可直接发送给合作者

### 性能
- 支持大型复合物（< 10,000 原子推荐）
- 平滑交互，无延迟

---

## 💾 保存和共享

### 保存网页
1. 在浏览器中打开 viewer.html
2. 右键 → 另存为 → 选择"网页，完整"
3. 或直接复制 viewer.html 文件

### 分享给合作者
```bash
# 生成网页后，直接发送 viewer.html
# 对方用浏览器打开即可，无需安装任何软件

# 支持离线查看（无需网络连接）
```

### 生成论文图表
1. 在浏览器中打开 viewer.html
2. 调整到理想角度
3. 使用 F12 开发者工具或截图软件
4. 导出为 PNG/PDF

---

## 🎨 配色参考

### 常用 HEX 颜色

| 颜色 | HEX 码 | 用途 |
|------|--------|------|
| 紫红 | #FF00FF | 抗体 (VHH/VH) |
| 青色 | #00CCFF | 抗原 (ECD) |
| 红色 | #FF0000 | VH 链 |
| 蓝色 | #0000FF | VL 链 |
| 绿色 | #00AA00 | 第三链 |
| 黄色 | #FFFF00 | 接触面 |
| 灰色 | #CCCCCC | 背景 |

---

## 📋 快速参考

### 命令汇总
```bash
# VHH-HER2 (预设)
python scripts/web_structure_viewer.py --pdb complex.pdb --preset vhh_her2 --output viewer.html

# FAB-抗原 (预设)
python scripts/web_structure_viewer.py --pdb complex.pdb --preset fab_antigen --output viewer.html

# 自定义标题
python scripts/web_structure_viewer.py --pdb complex.pdb --preset vhh_her2 --title "MyTitle" --output viewer.html

# 查看帮助
python scripts/web_structure_viewer.py --help
```

### 鼠标控制
```
左键拖动    → 旋转
滚轮        → 缩放
Shift+拖    → 平移
```

### 快捷操作
```
☑ Show Sidechains   → 显示侧链（查看接触细节）
⚪ Opacity Slider    → 透明度（查看内部结构）
🎯 Quick Views      → 快速视角切换
🔄 Reset View       → 恢复默认视角
```

---

## ✨ 典型应用流程

### 流程 1：查看接触面

```
1. 生成网页
   python scripts/web_structure_viewer.py --pdb complex.pdb --preset vhh_her2 --output viewer.html

2. 打开网页
   在浏览器中打开 viewer.html

3. 选择接触面视角
   点击左侧 "Interface" 按钮

4. 显示侧链
   ☑ Show Sidechains

5. 调整视角
   用鼠标旋转查看接触细节

6. 调整透明度
   用滑块突出重点结构
```

### 流程 2：论文制图

```
1. 生成网页（自定义标题）
   python scripts/web_structure_viewer.py --pdb complex.pdb --preset vhh_her2 --title "Figure 2A" --output viewer.html

2. 打开网页

3. 调整到最佳角度
   - 使用 Quick Views 快速定位
   - 用鼠标微调旋转
   - 取消 Show Sidechains（简洁效果）

4. 截图
   F12 开发者工具 → 截图
   或使用系统截图工具

5. 导入论文
```

---

## 🔗 相关工具

| 工具 | 文件 | 功能 |
|------|------|------|
| 接触面着色 | `colorize_interface_pdb.py` | 生成彩色 PDB（用于其他查看器） |
| 接触面分析 | `visualize_interface_contacts.py` | 生成接触矩阵 JSON |
| 网页查看器 | `web_structure_viewer.py` | 本工具，网页交互式查看 |

---

## 📖 完整示例

### 示例：VHH-HER2 复合物分析
```bash
# Step 1: 生成网页查看器
python scripts/web_structure_viewer.py \
    --pdb vhh_her2_complex.pdb \
    --preset vhh_her2 \
    --title "VHH-HER2 Complex Analysis" \
    --output analysis_viewer.html

# Step 2: 生成彩色 PDB（可选）
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme publication \
    --ab_chains A --ag_chain B \
    --output vhh_her2_colored.pdb

# Step 3: 在浏览器中打开 analysis_viewer.html
# 即可交互式查看结构
```

---

**创建时间：** 2026-03-27  
**状态：** ✅ 完全可用  
**浏览器要求：** 现代浏览器（Chrome, Firefox, Safari）  
**网络要求：** 可离线使用
