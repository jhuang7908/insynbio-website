# 🌐 网页结构查看器 — 60 秒快速开始

## ⚡ 一条命令生成网页

### VHH-HER2 复合物
```bash
python scripts/web_structure_viewer.py \
    --pdb vhh_her2_complex.pdb \
    --preset vhh_her2 \
    --output viewer.html
```

### FAB-抗原复合物
```bash
python scripts/web_structure_viewer.py \
    --pdb fab_antigen_complex.pdb \
    --preset fab_antigen \
    --output viewer.html
```

### 自定义标题
```bash
python scripts/web_structure_viewer.py \
    --pdb complex.pdb \
    --preset vhh_her2 \
    --title "My Complex" \
    --output viewer.html
```

---

## 🎨 解决的问题

| 问题 | 解决方案 |
|------|---------|
| ECD 和 FR 颜色相近 | 每条链独立配色（紫红 ≠ 青色） |
| 侧链遮挡接触面 | 一键切换显示/隐藏侧链 |
| 固定视角看不清 | 鼠标自由旋转，任意角度观看 |
| 论文截图困难 | 网页中调整到最佳角度后截图 |

---

## 🖱️ 鼠标操作

| 操作 | 功能 |
|------|------|
| 🎯 拖动 | 旋转结构 |
| 🔄 滚轮 | 放大/缩小 |
| ↔️ Shift+拖 | 平移 |

---

## 🎯 左侧控制面板

### 色彩图例
- 紫红色 = VHH/抗体
- 青色 = HER2/抗原
- 黄色 = 接触面

### 快速视角
- **Overall** — 全景
- **VHH Only** — 仅抗体
- **HER2 Only** — 仅抗原
- **Interface** — 接触面

### 显示选项
- ☑️ **Show Sidechains** — 显示侧链（看接触细节）
- ⚪ **Opacity Slider** — 调整透明度

---

## 💾 使用场景

### 📊 查看接触面
```
1. 点击 "Interface" 快速视角
2. ☑️ Show Sidechains
3. 鼠标旋转微调角度
4. 调整透明度突出重点
```

### 📰 论文制图
```
1. 调整到最佳角度
2. 取消 Show Sidechains（简洁）
3. F12 截图或系统截图
4. 导入论文
```

### 🎤 演讲展示
```
1. F11 全屏浏览器
2. 用鼠标控制旋转
3. 根据讲述内容切换视角
4. 用 Quick Views 快速定位
```

---

## 📋 链颜色速查

| 链 | 颜色 | 用途 |
|----|------|------|
| A (VHH) | 🟣 紫红 #FF00FF | 抗体 |
| B (HER2) | 🔵 青 #00CCFF | 抗原 |
| VH | 🔴 红 #FF0000 | 重链 |
| VL | 🔵 蓝 #0000FF | 轻链 |
| Ag | 🟢 绿 #00AA00 | 抗原 |

---

## 🌍 浏览器要求

✅ Chrome / Edge / Firefox / Safari  
❌ IE 11

---

## 📁 输出文件

```
viewer.html  ← 自包含 HTML 文件
             • 包含 PDB 数据
             • 可离线打开
             • 可直接发送
             • 无需网络连接
```

---

**用时：** 60 秒  
**复杂度：** ⭐☆☆☆☆  
**效果：** 🌟🌟🌟🌟🌟
