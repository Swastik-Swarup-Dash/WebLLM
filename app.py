from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get Llama API token
GROQ_TOKEN = os.getenv('GROQ_TOKEN')
API_URL = "https://api.groq.com/openai/v1/chat/completions"

# List of available Llama models
MODELS = [
    {
        "id": "llama-3.3-70b-versatile",
        "name": "llama-3.3-70b-versatile",
        "description": "Meta's Llama 2 7B model optimized for chat"
    }
]

@app.route('/')
def index():
    return render_template('index.html', models=MODELS)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        model_id = data.get('model_id')
        prompt = data.get('prompt')
        
        if not model_id or not prompt:
            return jsonify({"error": "Model ID and prompt are required"}), 400

        if not GROQ_TOKEN:
            return jsonify({
                "error": "Llama API token not found. Please check your .env file."
            }), 401

        # Set up the API request
        headers = {
            "Authorization": f"Bearer {GROQ_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model_id,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 100,
            "temperature": 0.7,
            "top_p": 0.95
        }

        # Make the API request
        response = requests.post(
            API_URL,
            headers=headers,
            json=payload
        )

        if response.status_code == 200:
            result = response.json()
            generated_text = result.get('choices', [{}])[0].get('message', {}).get('content', '')
            
            return jsonify({
                "response": generated_text,
                "model": model_id
            })
        elif response.status_code == 401:
            return jsonify({
                "error": "Invalid API token. Please check your Llama API token."
            }), 401
        elif response.status_code == 403:
            return jsonify({
                "error": "Permission denied. Please make sure you have access to the Llama API."
            }), 403
        else:
            return jsonify({
                "error": f"API Error: {response.status_code} - {response.text}"
            }), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)