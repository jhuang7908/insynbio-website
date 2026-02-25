# InSynBio 表单邮件递交设置说明

表单提交到您的邮箱需要配置 Formspree。

## 步骤

1. **注册 Formspree**：访问 [formspree.io](https://formspree.io)，注册账号。

2. **创建表单**：
   - 登录后点击 "New Form"
   - 填写接收邮件的地址（如 `contact@insynbio.com` 或您的个人邮箱）
   - 创建后获得 Form ID（形如 `xjvolzqy`）

3. **修改 HTML**：
   - 打开 `InSynBio_Antibody_Developability_Assessment_Page.html`
   - 搜索 `YOUR_FORM_ID`
   - 替换为您的 Form ID，例如：
     ```html
     action="https://formspree.io/f/xjvolzqy"
     ```

4. **提交后跳转**：已设置为 `https://insynbio.com/thanks.html`。请将 `InSynBio_thanks.html` 部署为站点的 `/thanks.html`。

## 注意

- **PDB 文件**：表单不包含文件上传。客户若有 PDB 文件，可单独发送至 contact@insynbio.com。
- **联系邮箱**：页面上显示的 `contact@insynbio.com` 需与您域名邮箱一致。若使用 Gmail 转发，请确保已配置好。
