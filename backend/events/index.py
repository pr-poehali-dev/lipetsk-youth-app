import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с событиями: получение списка, создание, добавление в избранное
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            category = query_params.get('category')
            
            if category and category != 'все':
                cur.execute("""
                    SELECT e.id, e.title, e.description, c.name as category, 
                           e.event_date, e.event_time, e.location, e.participants_count
                    FROM events e
                    LEFT JOIN categories c ON e.category_id = c.id
                    WHERE c.name = %s
                    ORDER BY e.event_date ASC
                """, (category,))
            else:
                cur.execute("""
                    SELECT e.id, e.title, e.description, c.name as category, 
                           e.event_date, e.event_time, e.location, e.participants_count
                    FROM events e
                    LEFT JOIN categories c ON e.category_id = c.id
                    ORDER BY e.event_date ASC
                """)
            
            events = []
            for row in cur.fetchall():
                events.append({
                    'id': str(row[0]),
                    'title': row[1],
                    'description': row[2],
                    'category': row[3] or 'другое',
                    'date': row[4].strftime('%d %B') if row[4] else '',
                    'time': row[5].strftime('%H:%M') if row[5] else '',
                    'location': row[6] or '',
                    'participants': row[7] or 0
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'events': events}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title')
            description = body_data.get('description')
            category_name = body_data.get('category')
            event_date = body_data.get('event_date')
            event_time = body_data.get('event_time')
            location = body_data.get('location')
            
            if not all([title, category_name, event_date, event_time]):
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing required fields'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT id FROM categories WHERE name = %s", (category_name,))
            category_row = cur.fetchone()
            category_id = category_row[0] if category_row else None
            
            cur.execute("""
                INSERT INTO events (title, description, category_id, event_date, event_time, location)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (title, description, category_id, event_date, event_time, location))
            
            event_id = cur.fetchone()[0]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': event_id, 'message': 'Event created'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        if not cur.closed:
            cur.close()
        if not conn.closed:
            conn.close()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }
