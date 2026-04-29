# GitHub Pages Setup

## 為什麼 `index.html` 必須放在 repo 根目錄
GitHub Pages 在設定為 `Deploy from a branch` 且資料夾選擇 `/(root)` 時，會把 repo 根目錄當成網站根路徑。

因此：

- `https://你的帳號.github.io/pinball-game/` 會先找根目錄的 `index.html`
- 如果 `index.html` 不在 repo 根目錄，首頁就不會自動載入
- 除非改用 `docs/` 當 Pages 根目錄，否則入口檔必須放 root

本專案需求已指定：

- Branch: `main`
- Folder: `/(root)`

所以最穩定、最直觀的做法，就是把 `index.html` 放在 repo 根目錄。

## 建議 repo 結構

```text
pinball-game/
├── index.html
├── style.css
├── game.js
├── README.md
├── task.json
└── docs/
```

## GitHub Pages 設定 SOP

1. 把專案 push 到 GitHub repo：`pinball-game`
2. 進入 GitHub repo 頁面
3. 打開 `Settings`
4. 點 `Pages`
5. `Source` 選 `Deploy from a branch`
6. `Branch` 選 `main`
7. `Folder` 選 `/(root)`
8. 按 `Save`
9. 等待 GitHub Pages 建置完成
10. 開啟：`https://你的帳號.github.io/pinball-game/`

## 本專案部署條件
- 不使用 webpack
- 不需要 npm build
- 不依賴外部 CDN 才能啟動主流程
- 只要靜態檔存在 repo root，就能直接部署

## 驗收清單
- [ ] `index.html` 在 repo 根目錄
- [ ] `style.css` 與 `game.js` 路徑正確
- [ ] GitHub Pages 指向 `main` + `/(root)`
- [ ] 開啟 Pages URL 可看到遊戲畫面
- [ ] 左右方向鍵與 `R` 功能正常

## 常見錯誤

### 1. 看到 404
原因：
- repo 名稱或 Pages URL 打錯
- `index.html` 不在根目錄
- Pages 還沒建置完成

### 2. 頁面打開但沒樣式
原因：
- `style.css` 路徑錯誤
- 檔名大小寫不一致

### 3. 頁面打開但遊戲沒跑
原因：
- `game.js` 路徑錯誤
- JavaScript 發生 runtime error
- Canvas 元素 id 對不上

## 一行檢查法
本地快速確認：

```bash
cd pinball-game && python3 -m http.server 8000
```

然後打開：

```text
http://localhost:8000
```
