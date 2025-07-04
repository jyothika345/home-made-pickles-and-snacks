from flask import Flask, request, jsonify, session
from flask_cors import CORS
import boto3
import uuid
import hashlib

app = Flask(__name__)
app.secret_key = 'your-secret-key'
CORS(app)

# DynamoDB setup
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
users_table = dynamodb.Table('Users')
orders_table = dynamodb.Table('PickleOrders')
contact_table = dynamodb.Table('ContactForms')

# SNS setup
sns = boto3.client('sns', region_name='ap-south-1')
topic_arn = 'arn:aws:sns:ap-south-1:123456789012:YourTopicName'  # Replace with your ARN

# Utility: hash password
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    name = data['name']
    password = hash_password(data['password'])

    # Check if user exists
    resp = users_table.get_item(Key={'email': email})
    if 'Item' in resp:
        return jsonify({'message': 'Email already registered'}), 409

    users_table.put_item(Item={'email': email, 'name': name, 'password': password})
    return jsonify({'message': 'Signup successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = hash_password(data['password'])

    resp = users_table.get_item(Key={'email': email})
    if 'Item' not in resp or resp['Item']['password'] != password:
        return jsonify({'message': 'Invalid credentials'}), 401

    session['user'] = email
    return jsonify({'message': 'Login successful'}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out'}), 200

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify([
        {"id": 1, "name": "Mango Pickle", "price": 120},
        {"id": 2, "name": "Lemon Pickle", "price": 100},
        {"id": 3, "name": "Chicken Pickle", "price": 180},
        {"id": 4, "name": "Fish Pickle", "price": 160},
        {"id": 5, "name": "Prawn Pickle", "price": 200},
        {"id": 6, "name": "Muruku", "price": 80},
        {"id": 7, "name": "Banana Chips", "price": 60},
        {"id": 8, "name": "Ragi Laddu", "price": 50}
    ])

@app.route('/order', methods=['POST'])
def place_order():
    data = request.get_json()
    order_id = str(uuid.uuid4())

    orders_table.put_item(Item={
        'order_id': order_id,
        'customer_name': data['customerName'],
        'email': data['email'],
        'phone': data['phone'],
        'address': data['address'],
        'items': data['items'],
        'total': data['total']
    })

    sns.publish(
        TopicArn=topic_arn,
        Message=f"New Order from {data['customerName']} (Phone: {data['phone']})",
        Subject="New Pickle Order"
    )

    return jsonify({'message': 'Order placed successfully!'})

@app.route('/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    contact_table.put_item(Item={
        'contact_id': str(uuid.uuid4()),
        'name': data['name'],
        'email': data['email'],
        'message': data['message']
    })
    return jsonify({'message': 'Contact form submitted!'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
