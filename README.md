# 節奏型行為追蹤 Web App 🎯

一個現代化的習慣追蹤應用，幫助你建立良好的生活節奏！

## 🌐 線上體驗

**網址**: [https://vibe-tracker-98ca59.web.app](https://vibe-tracker-98ca59.web.app)

## ✨ 功能特色

- ✅ **習慣記錄追蹤** - 簡單標記每日完成狀態
- 📊 **智能統計分析** - 自動計算完成率、連續天數
- 📈 **趨勢分析** - 了解你的進步方向（上升/下降/穩定）
- 🔥 **連續天數統計** - 追蹤目前和最長連續記錄
- 💾 **雲端資料同步** - Firestore 資料庫持久化儲存
- 📱 **響應式設計** - 支援桌面和行動裝置
- 🎨 **現代化 UI** - 簡潔美觀的使用者介面

## 🚀 快速開始

1. 開啟 [線上應用](https://vibe-tracker-98ca59.web.app)
2. 輸入習慣名稱（如：運動、閱讀、早睡）
3. 選擇日期和完成狀態
4. 添加備註（可選）
5. 點擊查詢查看統計資料和趨勢分析

## 📊 統計指標說明

### 完成率 (Completion Rate)
- **計算方式**: 完成天數 ÷ 查詢天數
- **範圍**: 0% - 100%
- **意義**: 在查詢期間內的習慣完成比例

### 目前連續 (Current Streak)
- **計算方式**: 從最新日期往回計算連續完成天數
- **意義**: 目前正在進行的連續完成天數

### 最長連續 (Longest Streak)
- **計算方式**: 查詢期間內最長的連續完成天數
- **意義**: 歷史最佳連續記錄

### 趨勢分析 (Trend)
- **improving** 📈: 後半段完成率 > 前半段
- **declining** 📉: 後半段完成率 < 前半段
- **stable** ➡️: 兩段完成率相等

## 🔧 技術架構

### 前端
- **框架**: Vanilla JavaScript (ES6+)
- **樣式**: CSS3 + Flexbox/Grid
- **響應式**: Mobile-first 設計
- **部署**: Firebase Hosting

### 後端
- **運行環境**: Firebase Functions (Node.js 18)
- **框架**: Express.js
- **資料庫**: Cloud Firestore
- **API**: RESTful 設計

### 雲端服務
- **託管**: Firebase Hosting
- **函數**: Firebase Functions
- **資料庫**: Cloud Firestore
- **CDN**: 全球內容分發網路

## 📁 專案結構

```
vibe-tracker/
├── frontend/          # 前端應用
│   ├── index.html     # 主頁面
│   ├── css/style.css  # 樣式檔
│   └── js/            # JavaScript 檔案
│       ├── app.js     # 主要應用邏輯
│       ├── api.js     # API 呼叫封裝
│       └── utils.js   # 工具函數
├── backend/           # 本地開發 Flask API
├── functions/         # Firebase Functions
│   ├── index.js       # Cloud Functions 主檔案
│   └── package.json   # 依賴套件
├── .github/           # GitHub Actions 自動部署
└── firebase.json      # Firebase 專案設定
```

## 🛠️ 本地開發

### 前端開發
```bash
# 使用 Live Server 開啟 frontend/index.html
# 或直接在瀏覽器開啟檔案
```

### 後端開發 (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
# 服務運行在 http://localhost:5000
```

### Firebase Functions 本地測試
```bash
cd functions
npm install
firebase emulators:start --only functions
# 模擬器運行在 http://localhost:5002
```

## 🚀 部署指南

### Firebase 部署
```bash
# 登入 Firebase
firebase login

# 設定專案
firebase use vibe-tracker-98ca59

# 部署全部
firebase deploy

# 或分別部署
firebase deploy --only hosting  # 前端
firebase deploy --only functions # 後端
```

### GitHub Actions 自動部署
1. 推送程式碼到 GitHub
2. GitHub Actions 自動觸發部署
3. 部署完成後更新線上版本

## 📱 API 文件

### POST /api/records - 新增習慣記錄
```json
{
  "habit_name": "運動",
  "date": "2024-01-15",
  "completed": true,
  "notes": "跑步30分鐘"
}
```

### GET /api/records - 查詢習慣記錄
**參數**:
- `days`: 查詢天數 (預設 7)
- `habit`: 習慣名稱篩選 (可選)

**回應**: 包含習慣記錄列表與統計資料

## 💡 使用技巧

- **建議每天固定時間記錄**，養成記錄習慣
- **可以同時追蹤多個習慣**，全面管理生活
- **利用備註功能記錄心得**，回顧成長過程
- **定期查看統計數據**，調整策略和目標
- **關注趨勢變化**，及時調整行為模式

## 🎯 未來規劃

- [ ] 用戶認證系統
- [ ] 習慣提醒通知
- [ ] 數據視覺化圖表
- [ ] 社群分享功能
- [ ] 習慣模板庫
- [ ] 數據匯出功能
- [ ] 深度分析報告

## 📄 授權條款

MIT License - 自由使用、修改和分發

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

開始你的習慣追蹤之旅，建立更好的生活節奏！ 🌟