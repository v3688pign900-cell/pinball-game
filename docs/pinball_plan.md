# Mini Pinball Plan

## 目標
建立一個可直接部署在 GitHub Pages 的 `Mini Pinball` 靜態網頁遊戲，不使用 webpack、不依賴外部素材，僅用 `HTML + CSS + Vanilla JavaScript + Canvas` 完成。

## 參考架構
參考 boxbox 的 GitHub Pages 佈署思路：

- `index.html` 放 repo 根目錄
- `style.css` 放 repo 根目錄
- `game.js` 放 repo 根目錄
- 由 GitHub Pages 直接指向 branch root
- 使用瀏覽器直接開啟 GitHub Pages 網址即可執行

## 功能範圍

### 必做功能
1. Canvas 畫布
2. 彈珠可移動
3. 牆壁反彈
4. 左右拍板（flippers）
5. 左右方向鍵控制拍板
6. 分數系統
7. 掉球 Game Over
8. 按 `R` 重新開始

### 實作策略
- 用 2D Canvas 手刻簡化物理
- 不做完整 pinball engine，只做可玩版本
- 使用固定 timestep 近似更新
- 拍板以旋轉角度 + 擊球速度修正實作
- 以 bumper、牆壁、底部出界構成基礎關卡

## 檔案規劃

```text
pinball-game/
├── index.html
├── style.css
├── game.js
├── README.md
├── task.json
└── docs/
   ├── pinball_plan.md
   └── github_pages_setup.md
```

## 架構說明

### index.html
- 載入標題、操作說明、HUD、Canvas
- 透過 `<script src="./game.js"></script>` 啟動遊戲
- 為 GitHub Pages 提供預設入口

### style.css
- 提供 arcade 風格 UI
- 讓頁面在桌面瀏覽器可直接遊玩
- 響應式縮放畫布容器

### game.js
- 建立遊戲狀態
- 管理輸入、物理更新、碰撞、分數、重開
- 繪製 playfield、flippers、ball、bumpers、文字

## 碰撞與遊戲邏輯

### 彈珠
- 狀態：位置、速度、半徑
- 每幀受重力影響往下掉
- 撞牆時反彈

### Bumpers
- 固定圓形障礙
- 撞到後反彈並加分
- 用亮色表現碰撞區

### Flippers
- 左右各一個
- 預設朝下，按左右鍵時抬起
- 碰撞時給額外 upward impulse，做出拍球手感

### Game Over
- 球中心超過底部邊界時結束
- 顯示 `Game Over` 與重新開始提示

## 驗收標準
- 開啟 `index.html` 可直接執行
- 部署 GitHub Pages 後可直接執行
- 左右鍵可控制 flippers
- 球會因重力移動並在牆壁 / bumper / flipper 間反彈
- 分數會增加
- 掉球後顯示 Game Over
- `R` 可重開

## 風險與取捨
- 不使用外部 physics library，物理會偏簡化
- 為了 GitHub Pages 直接跑，避免 build step
- 第一版優先穩定與清楚結構，不追求真實 pinball 手感

## 後續可擴充
- 多顆球 / 多命
- 音效（自製或程式產生）
- 發射器（plunger）
- 特效與 combo
- 手機觸控按鍵
