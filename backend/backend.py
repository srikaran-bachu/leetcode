import openai
import os
import io
import contextlib
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the React frontend

# Set up your OpenAI API key
def get_openai_api_key():
    return os.getenv("OPENAI_API_KEY", "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")

# Endpoint to process user prompts for the chatbot
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

# Endpoint to run code based on selected language
@app.route('/api/run-code', methods=['POST'])
def run_code():
    code = request.json.get('code')
    language = request.json.get('language')

    if not code or not language:
        return jsonify({"error": "Code and language are required"}), 400

    # Run Python code
    if language == 'python':
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            try:
                exec(code)
            except Exception as e:
                return jsonify({"error": str(e)})
        return jsonify({"output": output.getvalue()})

    # Run JavaScript code
    elif language == 'javascript':
        try:
            process = subprocess.Popen(['node', '-e', code], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate()
            if stderr:
                return jsonify({"error": stderr.decode()})
            return jsonify({"output": stdout.decode()})
        except Exception as e:
            return jsonify({"error": str(e)})

    # Run Java code
    elif language == 'java':
        try:
            # Write code to a temporary Java file
            with open('Main.java', 'w') as file:
                file.write(code)

            # Compile Java code
            compile_process = subprocess.run(['javac', 'Main.java'], capture_output=True)
            if compile_process.stderr:
                return jsonify({"error": compile_process.stderr.decode()})

            # Run Java code
            run_process = subprocess.Popen(['java', 'Main'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = run_process.communicate()
            if stderr:
                return jsonify({"error": stderr.decode()})
            return jsonify({"output": stdout.decode()})
        except Exception as e:
            return jsonify({"error": str(e)})

    # Run C# code
    elif language == 'csharp':
        try:
            # Write code to a temporary C# file
            with open('Program.cs', 'w') as file:
                file.write(code)

            # Compile C# code
            compile_process = subprocess.run(['csc', 'Program.cs'], capture_output=True)
            if compile_process.stderr:
                return jsonify({"error": compile_process.stderr.decode()})

            # Run C# executable
            run_process = subprocess.Popen(['./Program.exe'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = run_process.communicate()
            if stderr:
                return jsonify({"error": stderr.decode()})
            return jsonify({"output": stdout.decode()})
        except Exception as e:
            return jsonify({"error": str(e)})

    else:
        return jsonify({"error": "Unsupported language"}), 400

# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)
