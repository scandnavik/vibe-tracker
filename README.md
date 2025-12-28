# 節奏型行為追蹤 Web App

一個簡單的習慣追蹤應用，支援記錄每日習慣完成狀況並提供統計分析。

## 專案結構

```
vibe-tracker/
├── frontend/          # 前端靜態檔案
│   ├── index.html     # 主頁面
│   ├── css/style.css  # 樣式檔
│   └── js/            # JavaScript 檔案
├── backend/           # 後端 API 服務
│   ├── app.py         # Flask 應用入口
│   ├── models.py      # 資料模型
│   ├── routes.py      # API 路由
│   └── database.py    # 資料庫操作
└── README.md          # 專案說明
```

## 功能特色

- ✅ 新增每日習慣記錄
- 📊 查詢最近 N 天的記錄與統計
- 📈 自動計算完成率、連續天數、趨勢分析
- 🎯 支援多種習慣同時追蹤
- 📱 響應式設計，支援行動裝置

## 本地開發環境設定

### 1. 啟動後端服務

```bash
# 進入後端目錄
cd backend

# 安裝依賴套件
pip install -r requirements.txt

# 啟動 Flask 服務
python app.py
```

後端服務將在 `http://localhost:5000` 啟動

### 2. 啟動前端服務

```bash
# 進入前端目錄
cd frontend

# 使用 Live Server 或直接開啟 index.html
# 推薦使用 VS Code 的 Live Server 擴充功能
```

前端將在 `http://localhost:5500` 或類似位址啟動

## API 文件

### POST /api/records - 新增記錄
```json
{
  "habit_name": "運動",
  "date": "2024-01-15",
  "completed": true,
  "notes": "跑步30分鐘"
}
```

### GET /api/records - 查詢記錄
- 參數：`days` (查詢天數), `habit` (習慣名稱，可選)
- 回傳：習慣記錄列表與統計資料

## 測試流程

1. 啟動後端服務
2. 啟動前端服務
3. 在前端頁面新增習慣記錄
4. 查詢記錄確認狀態計算正確

## 技術架構

- **前端**: 純 HTML/CSS/JavaScript
- **後端**: Python Flask
- **資料庫**: 記憶體儲存 (可擴展為 SQLite)
- **API**: RESTful 設計

## 注意事項

- 資料目前儲存在記憶體中，重啟後端會清空資料
- 前端 API_BASE_URL 設定在 `frontend/js/api.js`
- 如遇 CORS 問題，請檢查後端 CORS 設定