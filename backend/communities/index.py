import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с сообществами: получение списка, создание, вступление
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
                    SELECT com.id, com.name, com.description, c.name as category, com.members_count
                    FROM communities com
                    LEFT JOIN categories c ON com.category_id = c.id
                    WHERE c.name = %s
                    ORDER BY com.members_count DESC
                """, (category,))
            else:
                cur.execute("""
                    SELECT com.id, com.name, com.description, c.name as category, com.members_count
                    FROM communities com
                    LEFT JOIN categories c ON com.category_id = c.id
                    ORDER BY com.members_count DESC
                """)
            
            communities = []
            for row in cur.fetchall():
                communities.append({
                    'id': str(row[0]),
                    'name': row[1],
                    'description': row[2],
                    'category': row[3] or 'другое',
                    'members': row[4] or 0
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'communities': communities}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name')
            description = body_data.get('description')
            category_name = body_data.get('category')
            
            if not all([name, category_name]):
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
                INSERT INTO communities (name, description, category_id, members_count)
                VALUES (%s, %s, %s, 1)
                RETURNING id
            """, (name, description, category_id))
            
            community_id = cur.fetchone()[0]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': community_id, 'message': 'Community created'}, ensure_ascii=False),
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
