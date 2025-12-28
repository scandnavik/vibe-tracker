// 純前端版本 - 使用 localStorage 模擬後端
const API_BASE_URL = 'LOCAL_STORAGE'; // 標記使用本地儲存

class LocalStorageAPI {
    static getRecords() {
        const records = localStorage.getItem('habitRecords');
        return records ? JSON.parse(records) : [];
    }
    
    static saveRecords(records) {
        localStorage.setItem('habitRecords', JSON.stringify(records));
    }
    
    static getNextId() {
        const nextId = localStorage.getItem('nextId');
        return nextId ? parseInt(nextId) : 1;
    }
    
    static setNextId(id) {
        localStorage.setItem('nextId', id.toString());
    }
}

class HabitAPI {
    static async addRecord(habitName, date, completed, notes = '') {
        // 模擬網路延遲
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const records = LocalStorageAPI.getRecords();
        const nextId = LocalStorageAPI.getNextId();
        
        const record = {
            id: nextId,
            habit_name: habitName,
            date: date,
            completed: completed,
            notes: notes,
            created_at: new Date().toISOString()
        };
        
        records.push(record);
        LocalStorageAPI.saveRecords(records);
        LocalStorageAPI.setNextId(nextId + 1);
        
        return {
            success: true,
            message: '記錄已新增',
            data: record
        };
    }
    
    static async getRecords(days = 7, habitName = null) {
        // 模擬網路延遲
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const allRecords = LocalStorageAPI.getRecords();
        const end_date = new Date();
        const start_date = new Date();
        start_date.setDate(end_date.getDate() - (days - 1));
        
        // 過濾記錄
        let filtered_records = allRecords.filter(record => {
            const record_date = new Date(record.date);
            return record_date >= start_date && record_date <= end_date;
        });
        
        if (habitName) {
            filtered_records = filtered_records.filter(r => r.habit_name === habitName);
        }
        
        // 按習慣分組
        const habits_summary = {};
        filtered_records.forEach(record => {
            if (!habits_summary[record.habit_name]) {
                habits_summary[record.habit_name] = [];
            }
            habits_summary[record.habit_name].push(record);
        });
        
        // 計算狀態
        const calculateStatus = (habitRecords, days) => {
            if (!habitRecords || habitRecords.length === 0) {
                return {
                    completion_rate: 0.0,
                    current_streak: 0,
                    longest_streak: 0,
                    trend: 'stable'
                };
            }
            
            const completedCount = habitRecords.filter(r => r.completed).length;
            const completion_rate = days > 0 ? completedCount / days : 0.0;
            
            const sortedRecords = habitRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
            let current_streak = 0;
            for (const record of sortedRecords) {
                if (record.completed) {
                    current_streak++;
                } else {
                    break;
                }
            }
            
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
        };
        
        // 建立回應資料
        const habits_data = [];
        if (habitName && habits_summary[habitName]) {
            habits_data.push({
                habit_name: habitName,
                records: habits_summary[habitName].map(r => ({
                    date: r.date,
                    completed: r.completed,
                    notes: r.notes
                })),
                status: calculateStatus(habits_summary[habitName], days)
            });
        } else if (!habitName) {
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
        
        return {
            success: true,
            data: {
                period: {
                    start_date: start_date.toISOString().split('T')[0],
                    end_date: end_date.toISOString().split('T')[0],
                    days
                },
                habits: habits_data
            }
        };
    }
}