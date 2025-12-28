class HabitTracker {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setDefaultDate();
        this.loadRecords();
    }
    
    bindEvents() {
        // 表單提交
        document.getElementById('recordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRecord();
        });
        
        // 查詢按鈕
        document.getElementById('queryBtn').addEventListener('click', () => {
            this.loadRecords();
        });
    }
    
    setDefaultDate() {
        document.getElementById('recordDate').value = Utils.getTodayDate();
    }
    
    async addRecord() {
        try {
            Utils.clearError();
            
            const form = document.getElementById('recordForm');
            const formData = new FormData(form);
            
            const habitName = formData.get('habitName');
            const date = formData.get('recordDate');
            const completed = formData.get('completed') === 'true';
            const notes = formData.get('notes');
            
            const result = await HabitAPI.addRecord(habitName, date, completed, notes);
            
            if (result.success) {
                alert('記錄新增成功！');
                form.reset();
                this.setDefaultDate();
                this.loadRecords();
            } else {
                Utils.showError(result.message);
            }
        } catch (error) {
            Utils.showError('新增記錄失敗：' + error.message);
        }
    }
    
    async loadRecords() {
        try {
            Utils.showLoading(true);
            Utils.clearError();
            
            const days = parseInt(document.getElementById('queryDays').value);
            const habitName = document.getElementById('queryHabit').value || null;
            
            const result = await HabitAPI.getRecords(days, habitName);
            
            if (result.success) {
                this.displayHabits(result.data);
                this.updateHabitFilter(result.data.habits);
            } else {
                Utils.showError(result.message);
            }
        } catch (error) {
            Utils.showError('載入記錄失敗：' + error.message);
        } finally {
            Utils.showLoading(false);
        }
    }
    
    displayHabits(data) {
        const container = document.getElementById('habitsContainer');
        
        if (!data.habits || data.habits.length === 0) {
            container.innerHTML = '<p>目前沒有記錄</p>';
            return;
        }
        
        let html = `<h3>查詢期間：${Utils.formatDate(data.period.start_date)} ~ ${Utils.formatDate(data.period.end_date)}</h3>`;
        
        data.habits.forEach(habit => {
            html += this.renderHabitCard(habit);
        });
        
        container.innerHTML = html;
    }
    
    renderHabitCard(habit) {
        const status = habit.status;
        const completionPercent = Math.round(status.completion_rate * 100);
        
        let recordsHtml = '';
        habit.records.forEach(record => {
            const statusIcon = record.completed ? '✅' : '❌';
            recordsHtml += `
                <div class="record-item">
                    <span>${Utils.formatDate(record.date)}</span>
                    <span>${statusIcon}</span>
                    ${record.notes ? `<span class="notes">${record.notes}</span>` : ''}
                </div>
            `;
        });
        
        return `
            <div class="habit-card">
                <h4>${habit.habit_name}</h4>
                <div class="status-summary">
                    <div class="status-item">
                        <label>完成率：</label>
                        <span>${completionPercent}%</span>
                    </div>
                    <div class="status-item">
                        <label>目前連續：</label>
                        <span>${status.current_streak} 天</span>
                    </div>
                    <div class="status-item">
                        <label>最長連續：</label>
                        <span>${status.longest_streak} 天</span>
                    </div>
                    <div class="status-item">
                        <label>趨勢：</label>
                        <span>${Utils.getTrendText(status.trend)}</span>
                    </div>
                </div>
                <div class="records-list">
                    <h5>記錄明細：</h5>
                    ${recordsHtml}
                </div>
            </div>
        `;
    }
    
    updateHabitFilter(habits) {
        const select = document.getElementById('queryHabit');
        const currentValue = select.value;
        
        // 清空選項，保留「所有習慣」
        select.innerHTML = '<option value="">所有習慣</option>';
        
        // 取得所有習慣名稱
        const habitNames = [...new Set(habits.map(h => h.habit_name))];
        
        habitNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
        
        // 恢復之前的選擇
        select.value = currentValue;
    }
}

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});