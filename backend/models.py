from datetime import datetime, timedelta
from typing import List, Dict, Any

class HabitRecord:
    def __init__(self, habit_name: str, date: str, completed: bool, notes: str = None):
        self.id = None
        self.habit_name = habit_name
        self.date = date
        self.completed = completed
        self.notes = notes
        self.created_at = datetime.now().isoformat() + 'Z'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'habit_name': self.habit_name,
            'date': self.date,
            'completed': self.completed,
            'notes': self.notes,
            'created_at': self.created_at
        }

class HabitStatus:
    @staticmethod
    def calculate_status(records: List[HabitRecord], days: int) -> Dict[str, Any]:
        if not records:
            return {
                'completion_rate': 0.0,
                'current_streak': 0,
                'longest_streak': 0,
                'trend': 'stable'
            }
        
        # 計算完成率
        completed_count = sum(1 for r in records if r.completed)
        completion_rate = completed_count / days if days > 0 else 0.0
        
        # 計算目前連續天數（從最新日期往回）
        sorted_records = sorted(records, key=lambda x: x.date, reverse=True)
        current_streak = 0
        for record in sorted_records:
            if record.completed:
                current_streak += 1
            else:
                break
        
        # 計算最長連續天數
        longest_streak = 0
        temp_streak = 0
        for record in sorted(records, key=lambda x: x.date):
            if record.completed:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 0
        
        # 計算趨勢
        mid_point = days // 2
        first_half = records[:mid_point] if mid_point > 0 else []
        second_half = records[mid_point:] if mid_point > 0 else records
        
        first_rate = sum(1 for r in first_half if r.completed) / len(first_half) if first_half else 0
        second_rate = sum(1 for r in second_half if r.completed) / len(second_half) if second_half else 0
        
        if second_rate > first_rate:
            trend = 'improving'
        elif second_rate < first_rate:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return {
            'completion_rate': round(completion_rate, 2),
            'current_streak': current_streak,
            'longest_streak': longest_streak,
            'trend': trend
        }