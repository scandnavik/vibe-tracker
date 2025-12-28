// 請將此 URL 中的 PROJECT_ID 替換為你的 Firebase 專案 ID
// 例如：如果你的專案 ID 是 vibe-tracker-2024
// 就改為：https://us-central1-vibe-tracker-2024.cloudfunctions.net/api

const API_BASE_URL = 'https://us-central1-PROJECT_ID.cloudfunctions.net/api';

class HabitAPI {
    static async addRecord(habitName, date, completed, notes = '') {
        const response = await fetch(`${API_BASE_URL}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                habit_name: habitName,
                date: date,
                completed: completed,
                notes: notes
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    static async getRecords(days = 7, habitName = null) {
        let url = `${API_BASE_URL}/records?days=${days}`;
        if (habitName) {
            url += `&habit=${encodeURIComponent(habitName)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
}