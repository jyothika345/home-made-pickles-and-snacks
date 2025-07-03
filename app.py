from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/products")
def products():
    return jsonify([
        {"id": 1, "name": "Mango Pickle", "price": 120},
        {"id": 2, "name": "Lemon Pickle", "price": 100},
        {"id": 3, "name": "Chicken Pickle", "price": 180},
        {"id": 4, "name": "Prawn Pickle", "price": 200},
        {"id": 5, "name": "Fish Pickle", "price": 190},
        {"id": 6, "name": "Murukku", "price": 60},
        {"id": 7, "name": "Banana Chips", "price": 50},
        {"id": 8, "name": "Ragi Laddus", "price": 70}
    ])

if __name__ == "__main__":
    print("🟢 Backend running successfully on http://127.0.0.0:5000/")
    app.run(debug=True)
