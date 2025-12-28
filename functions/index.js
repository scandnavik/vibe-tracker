const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// 初始化 Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// 初始化 Express 應用
const app = express();

// 設定 CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// 工具函數
function calculateStatus(habitRecords, days) {
  if (!habitRecords || habitRecords.length === 0) {
    return {
      completion_rate: 0.0,
      current_streak: 0,
      longest_streak: 0,
      trend: 'stable'
    };
  }

  // 計算完成率
  const completedCount = habitRecords.filter(r => r.completed).length;
  const completion_rate = days > 0 ? completedCount / days : 0.0;

  // 計算目前連續天數
  const sortedRecords = habitRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  let current_streak = 0;
  for (const record of sortedRecords) {
    if (record.completed) {
      current_streak++;
    } else {
      break;
    }
  }

  // 計算最長連續天數
  let longest_streak = 0;
  let temp_streak = 0;
  const chronologicalRecords = habitRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
  for (const record of chronologicalRecords) {
    if (record.completed) {
      temp_streak++;
      longest_streak = Math.max(longest_streak, temp_streak);
    } else {
      temp_streak = 0;
    }
  }

  // 計算趨勢
  const mid_point = Math.floor(days / 2);
  const first_half = habitRecords.slice(0, mid_point);
  const second_half = habitRecords.slice(mid_point);

  const first_rate = first_half.length > 0 ? 
    first_half.filter(r => r.completed).length / first_half.length : 0;
  const second_rate = second_half.length > 0 ? 
    second_half.filter(r => r.completed).length / second_half.length : 0;

  let trend = 'stable';
  if (second_rate > first_rate) {
    trend = 'improving';
  } else if (second_rate < first_rate) {
    trend = 'declining';
  }

  return {
    completion_rate: Math.round(completion_rate * 100) / 100,
    current_streak,
    longest_streak,
    trend
  };
}

// API 路由
app.post('/records', async (req, res) => {
  try {
    const { habit_name, date, completed, notes } = req.body;

    if (!habit_name || !date || completed === undefined) {
      return res.status(400).json({
        success: false,
        message: '缺少必要欄位'
      });
    }

    const record = {
      habit_name,
      date,
      completed,
      notes: notes || null,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('habitRecords').add(record);
    const savedRecord = await docRef.get();

    res.status(201).json({
      success: true,
      message: '記錄已新增',
      data: {
        id: docRef.id,
        ...savedRecord.data(),
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get('/records', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const habit_name = req.query.habit;

    const end_date = new Date();
    const start_date = new Date();
    start_date.setDate(end_date.getDate() - (days - 1));

    // 查詢 Firestore
    let query = db.collection('habitRecords')
      .where('date', '>=', start_date.toISOString().split('T')[0])
      .where('date', '<=', end_date.toISOString().split('T')[0]);

    if (habit_name) {
      query = query.where('habit_name', '==', habit_name);
    }

    const snapshot = await query.get();
    const records = [];
    snapshot.forEach(doc => {
      records.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // 按習慣分組
    const habits_summary = {};
    records.forEach(record => {
      if (!habits_summary[record.habit_name]) {
        habits_summary[record.habit_name] = [];
      }
      habits_summary[record.habit_name].push(record);
    });

    // 建立回應資料
    const habits_data = [];
    if (habit_name && habits_summary[habit_name]) {
      habits_data.push({
        habit_name,
        records: habits_summary[habit_name].map(r => ({
          date: r.date,
          completed: r.completed,
          notes: r.notes
        })),
        status: calculateStatus(habits_summary[habit_name], days)
      });
    } else if (!habit_name) {
      Object.keys(habits_summary).forEach(name => {
        habits_data.push({
          habit_name: name,
          records: habits_summary[name].map(r => ({
            date: r.date,
            completed: r.completed,
            notes: r.notes
          })),
          status: calculateStatus(habits_summary[name], days)
        });
      });
    }

    res.json({
      success: true,
      data: {
        period: {
          start_date: start_date.toISOString().split('T')[0],
          end_date: end_date.toISOString().split('T')[0],
          days
        },
        habits: habits_data
      }
    });
  } catch (error) {
    console.error('Error getting records:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 導出為 Firebase Function
exports.api = functions.https.onRequest(app);