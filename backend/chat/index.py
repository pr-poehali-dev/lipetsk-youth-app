import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для общего чата: получение сообщений и отправка новых
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Username',
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
            limit = int(query_params.get('limit', 50))
            
            cur.execute("""
                SELECT id, username, message, created_at
                FROM chat_messages
                ORDER BY created_at DESC
                LIMIT %s
            """, (limit,))
            
            messages = []
            for row in cur.fetchall():
                messages.append({
                    'id': str(row[0]),
                    'username': row[1],
                    'message': row[2],
                    'timestamp': row[3].isoformat() if row[3] else ''
                })
            
            messages.reverse()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'messages': messages}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            username = body_data.get('username', 'Гость')
            message = body_data.get('message', '').strip()
            
            if not message:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Message cannot be empty'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO chat_messages (username, message, created_at)
                VALUES (%s, %s, %s)
                RETURNING id, created_at
            """, (username, message, datetime.now()))
            
            row = cur.fetchone()
            message_id = row[0]
            created_at = row[1]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': message_id,
                    'username': username,
                    'message': message,
                    'timestamp': created_at.isoformat()
                }, ensure_ascii=False),
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
