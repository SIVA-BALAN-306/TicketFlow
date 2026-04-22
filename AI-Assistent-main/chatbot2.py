from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

RAPIDAPI_KEY = "3f9450d9f9msh5261f17a1f48238p1f718djsn7f61b97a936c"  # Replace with your own key
RAPIDAPI_HOST = "chatgpt-42.p.rapidapi.com"

def get_response(user_input):
    url = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2"
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": user_input
            }
        ],
        "system_prompt": "",
        "temperature": 0.9,
        "top_k": 5,
        "top_p": 0.9,
        "max_tokens": 256,
        "web_access": False
    }
    
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        try:
            data = response.json()
            return data['result'] if 'result' in data else "Unexpected response format from API."
        except (KeyError, IndexError):
            return "Unexpected response format from API."
    else:
        return "Error: " + str(response.status_code)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/bot', methods=['POST'])
def chat():
    user_input = request.json.get('message')  # Adjusting to match the frontend key
    if user_input:
        response = get_response(user_input)
        return jsonify({"message": response})  # Returning the response
    return jsonify({"error": "Invalid input"}), 400

if __name__ == "__main__":
    app.run(debug=True)
