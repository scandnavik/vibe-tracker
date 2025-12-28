class Utils {
    static getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }
    
    static formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-TW');
    }
    
    static showLoading(show = true) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'block' : 'none';
    }
    
    static showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    
    static clearError() {
        const errorDiv = document.getElementById('error');
        errorDiv.style.display = 'none';
    }
    
    static getTrendText(trend) {
        const trendMap = {
            'improving': '上升趨勢 📈',
            'declining': '下降趨勢 📉',
            'stable': '穩定狀態 ➡️'
        };
        return trendMap[trend] || trend;
    }
}