from datetime import datetime, timedelta
from typing import List, Optional
from models import HabitRecord

class InMemoryDatabase:
    def __init__(self):
        self.records = []
        self.next_id = 1
    
    def add_record(self, record: HabitRecord) -> HabitRecord:
        record.id = self.next_id
        self.next_id += 1
        self.records.append(record)
        return record
    
    def get_records(self, days: int, habit_name: Optional[str] = None) -> List[HabitRecord]:
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days-1)
        
        filtered_records = []
        for record in self.records:
            record_date = datetime.strptime(record.date, '%Y-%m-%d').date()
            if start_date <= record_date <= end_date:
                if habit_name is None or record.habit_name == habit_name:
                    filtered_records.append(record)
        
        return filtered_records
    
    def get_habits_summary(self, days: int) -> dict:
        records = self.get_records(days)
        habits = {}
        
        for record in records:
            if record.habit_name not in habits:
                habits[record.habit_name] = []
            habits[record.habit_name].append(record)
        
        return habits

# 全域資料庫實例
db = InMemoryDatabase()