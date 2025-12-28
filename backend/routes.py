from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from models import HabitRecord, HabitStatus
from database import db

api_bp = Blueprint('api', __name__)

@api_bp.route('/records', methods=['POST'])
def add_record():
    try:
        data = request.get_json()
        
        # 驗證必要欄位
        if not data or 'habit_name' not in data or 'date' not in data or 'completed' not in data:
            return jsonify({'success': False, 'message': '缺少必要欄位'}), 400
        
        # 建立記錄
        record = HabitRecord(
            habit_name=data['habit_name'],
            date=data['date'],
            completed=data['completed'],
            notes=data.get('notes')
        )
        
        # 儲存記錄
        saved_record = db.add_record(record)
        
        return jsonify({
            'success': True,
            'message': '記錄已新增',
            'data': saved_record.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/records', methods=['GET'])
def get_records():
    try:
        # 取得查詢參數
        days = int(request.args.get('days', 7))
        habit_name = request.args.get('habit')
        
        # 計算日期範圍
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days-1)
        
        # 取得資料
        if habit_name:
            # 單一習慣
            records = db.get_records(days, habit_name)
            habits_data = [{
                'habit_name': habit_name,
                'records': [{'date': r.date, 'completed': r.completed, 'notes': r.notes} for r in records],
                'status': HabitStatus.calculate_status(records, days)
            }]
        else:
            # 所有習慣
            habits_summary = db.get_habits_summary(days)
            habits_data = []
            for habit_name, records in habits_summary.items():
                habits_data.append({
                    'habit_name': habit_name,
                    'records': [{'date': r.date, 'completed': r.completed, 'notes': r.notes} for r in records],
                    'status': HabitStatus.calculate_status(records, days)
                })
        
        return jsonify({
            'success': True,
            'data': {
                'period': {
                    'start_date': start_date.strftime('%Y-%m-%d'),
                    'end_date': end_date.strftime('%Y-%m-%d'),
                    'days': days
                },
                'habits': habits_data
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500