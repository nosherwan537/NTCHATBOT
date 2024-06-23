from flask import Blueprint, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

chat_bp = Blueprint('chat', __name__)
CORS(chat_bp, resources={r"/*": {"origins": "http://localhost:5173"}})

mysql = MySQL()

# Example training data with more variety
conversations = [
    ("Hello", "Hi there!"),
    ("How are you?", "I'm good, thanks! How can I help you?"),
    ("What is your name?", "I'm an AI chatbot."),
    ("Can you help me?", "Of course! What do you need help with?"),
    ("Tell me a joke", "Why don't scientists trust atoms? Because they make up everything!"),
    ("Help me", "Sure, what do you need help with?")
]

X_train = [conv[0] for conv in conversations]
y_train = [conv[1] for conv in conversations]

# Vectorization and model training
vectorizer = TfidfVectorizer()
X_train_vectorized = vectorizer.fit_transform(X_train)
model = LogisticRegression()
model.fit(X_train_vectorized, y_train)

@chat_bp.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'POST':
        user_input = request.json.get('message')
        user_input_vectorized = vectorizer.transform([user_input])
        bot_response = model.predict(user_input_vectorized)[0]

        # Store message and bot response in MySQL database
        sender = "User"
        store_message(sender, user_input, bot_response)

        return jsonify({'response': bot_response})
    else:  # Handle OPTIONS requests
        return jsonify({'message': 'This is a CORS pre-flight request'})

def store_message(sender, message, response):
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO messages (sender, message, response) VALUES (%s, %s, %s)", (sender, message, response))
    mysql.connection.commit()
    cur.close()

@chat_bp.route('/messages', methods=['GET'])
def get_messages():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM messages ORDER BY created_at DESC LIMIT 10")
    rows = cur.fetchall()
    messages = [{'id': row[0], 'sender': row[1], 'message': row[2], 'response': row[3], 'created_at': row[4].strftime('%Y-%m-%d %H:%M:%S')} for row in rows]
    cur.close()
    return jsonify({'messages': messages})

def configure_mysql(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = 'sq@nosho789'
    app.config['MYSQL_DB'] = 'myappdb'
    mysql.init_app(app)
