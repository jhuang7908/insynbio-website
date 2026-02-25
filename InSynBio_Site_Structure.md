# InSynBio 网站结构

## 文件列表

| 文件 | 用途 |
|------|------|
| `InSynBio_index.html` | 首页（About Us、Services、Workflow、Contact Us） |
| `InSynBio_Antibody_Developability_Assessment_Page.html` | 抗体评估服务页（含表单） |
| `InSynBio_thanks.html` | 表单提交成功后的感谢页 |

## 部署建议

1. **根目录**：将 `InSynBio_index.html` 部署为 `index.html` 或配置服务器默认页
2. **感谢页**：将 `InSynBio_thanks.html` 部署为 `thanks.html`（表单提交后跳转）
3. **抗体页**：部署为 `antibody.html` 或 `services/antibody.html`（可选，便于 SEO）

## 导航结构

- **About Us**：公司使命、技术、长远目标
- **Services**：抗体（已上线）、CAR-T、双抗（coming soon）
- **Workflow**：免费评估 → 交费 → 交付 → 尾款（可按质量/验证免）→ 文献发表优惠
- **Contact Us**：技术咨询、药物评估、CRO/Biotech 合作

## 表单

- Formspree ID：`mnjblezr`
- 提交后跳转：`https://insynbio.com/thanks.html`
- 详见 `InSynBio_Form_Setup.md`
