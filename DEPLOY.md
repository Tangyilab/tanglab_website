# 部署到 GitHub Pages 指南

本网站是纯静态站点，已初始化好本地 git 仓库（分支 `main`），可直接推送部署。

## 第一步：在 GitHub 网页创建一个空仓库
1. 登录 https://github.com （没有账号先注册）。
2. 右上角 **+** → **New repository**。
3. 仓库名（Repository name）二选一：
   - **`<你的用户名>.github.io`** —— 网站地址将是 `https://<你的用户名>.github.io/`（根路径，最简洁，推荐）。
   - 或任意名字，如 **`tanglab`** —— 网站地址将是 `https://<你的用户名>.github.io/tanglab/`。
     （本站用相对路径，子路径也能正常工作，放心。）
4. 设为 **Public**（GitHub Pages 免费版需公开）。
5. **不要**勾选 "Add a README / .gitignore / license"（保持空仓库）。
6. 点 **Create repository**，记下页面给出的仓库地址，形如：
   `https://github.com/<用户名>/<仓库名>.git`

## 第二步：把本地代码推送上去
在本网站目录（`site/`）里执行（把下面的 URL 换成你刚建的仓库地址）：

```bash
cd /data/pygao/Claude_Output/Tanglab_website/site
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

> 推送时会要求登录。用户名填 GitHub 用户名，**密码处不能填登录密码**，要填
> **Personal Access Token (PAT)**：
> GitHub 网页 → 右上角头像 → Settings → Developer settings →
> Personal access tokens → Tokens (classic) → Generate new token，
> 勾选 **repo** 权限，生成后复制，粘贴到命令行的密码位置。

## 第三步：开启 GitHub Pages
1. 进入仓库页面 → **Settings** → 左侧 **Pages**。
2. **Source** 选 **Deploy from a branch**。
3. Branch 选 **`main`**，文件夹选 **`/ (root)`**，点 **Save**。
4. 等 1–2 分钟，刷新该页面，顶部会显示网站地址。打开即可访问。

## 以后更新内容
改完 `data/*.json` 后先重新打包数据，再提交推送：
```bash
python3 build.py
git add -A
git commit -m "更新内容"
git push
```
GitHub Pages 会自动重新发布（约 1 分钟生效）。

## 备选：完全不用命令行（网页拖拽上传）
建好空仓库后，在仓库页面点 **Add file → Upload files**，把 `site/` 里的
**所有文件和文件夹**拖进去提交，然后同样在 Settings → Pages 开启即可。
（注意要保持 `assets/`、`data/` 等文件夹结构完整，`.nojekyll` 也要一起传。）
