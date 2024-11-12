import openai
import os
from flask import Flask, request, jsonify, render_template_string

# Set up your OpenAI API key
def get_openai_api_key():
    return os.getenv("OPENAI_API_KEY", "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")
#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
# Initialize Flask app
app = Flask(__name__)

# Homepage route to allow testing via browser
@app.route('/', methods=['GET'])
def home():
    return render_template_string('''
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chatbot API Test</title>
        </head>
        <body>
            <h1>Chatbot API Test</h1>
            <form id="chatForm">
                <label for="prompt">Enter your prompt:</label><br>
                <input type="text" id="prompt" name="prompt" required><br><br>
                <button type="button" onclick="sendPrompt()">Submit</button>
            </form>
            <h2>Response:</h2>
            <pre id="response"></pre>

            <script>
                function sendPrompt() {
                    const prompt = document.getElementById('prompt').value;
                    fetch("/api/chatbot", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ prompt: prompt })
                    })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('response').innerText = data.response || data.error;
                    })
                    .catch(error => {
                        document.getElementById('response').innerText = "Error: " + error;
                    });
                }
            </script>
        </body>
        </html>
    ''')

# Endpoint to process user prompts for coding tasks
@app.route('/api/chatbot', methods=['POST'])
def handle_prompt():
    try:
        # Get user input from the request
        user_input = request.json.get('prompt')
        if not user_input:
            return jsonify({"error": "Prompt is required"}), 400

        # Generate response from ChatGPT
        openai.api_key = get_openai_api_key()
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": user_input}
            ]
        )

        # Extract the chatbot's response
        bot_response = response['choices'][0]['message']['content']
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)
