from urllib.request import Request
import openai
import io
import contextlib
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the React frontend

# Set up your OpenAI API key
def get_openai_api_key():
    return ""
# Sample questions with test cases
questions = [
    {
        "id": 1,
        "title": "Two Sum",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "test_cases": [
            {"input": "[2,7,11,15], 9", "expected_output": "[0, 1]"},
            {"input": "[3,2,4], 6", "expected_output": "[1, 2]"},
            {"input": "[3,3], 6", "expected_output": "[0, 1]"},
            {"input": "[1,2,3], 5", "expected_output": "[1, 2]"},
            {"input": "[1,5,5,3], 10", "expected_output": "[1, 2]"}
        ],
        "starterCode": "def two_sum(nums, target):\n    return []",

    },
    {
        "id": 2,
        "title": "Palindrome Number",
        "description": "Given an integer x, return true if x is a palindrome, and false otherwise.",
        "test_cases": [
            {"input": "121", "expected_output": "True"},
            {"input": "-121", "expected_output": "False"},
            {"input": "10", "expected_output": "False"},
            {"input": "12321", "expected_output": "True"},
            {"input": "0", "expected_output": "True"}
        ],
        "starterCode": "def is_palindrome(x):\n    # Your code here\n    return False"

    },
    {
        "id": 3,
        "title": "Reverse Integer",
        "description": "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, return 0.",
        "test_cases": [
            {"input": "123", "expected_output": "321"},
            {"input": "-123", "expected_output": "-321"},
            {"input": "120", "expected_output": "21"},
            {"input": "0", "expected_output": "0"},
            {"input": "1534236469", "expected_output": "0"}  # Overflow case
        ],
        "starterCode": "def reverse_integer(x):\n    # Your code here\n    return 0"

    },
    {
        "id": 4,
        "title": "FizzBuzz",
        "description": "Given an integer n, return a string array where:\n1. 'Fizz' for multiples of 3,\n2. 'Buzz' for multiples of 5,\n3. 'FizzBuzz' for multiples of both,\n4. Otherwise, the number itself as a string.",
        "test_cases": [
            {"input": "3", "expected_output": "['1','2','Fizz']"},
            {"input": "5", "expected_output": "['1','2','Fizz','4','Buzz']"},
            {"input": "15", "expected_output": "['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz']"},
            {"input": "1", "expected_output": "['1']"},
            {"input": "0", "expected_output": "[]"}
        ],
        "starterCode": "def fizz_buzz(n):\n    # Your code here\n    return []"

    },
    {
        "id": 5,
        "title": "Valid Parentheses",
        "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        "test_cases": [
            {"input": "'()'", "expected_output": "true"},
            {"input": "'()[]{}'", "expected_output": "true"},
            {"input": "'(]'", "expected_output": "false"},
            {"input": "'([)]'", "expected_output": "false"},
            {"input": "'{'", "expected_output": "false"}
        ],
        "starterCode": "def is_valid(s):\n    # Your code here\n    return False"

    },
    {
        "id": 6,
        "title": "Merge Two Sorted Lists",
        "description": "Merge two sorted linked lists and return it as a new sorted list. The new list should be made by splicing together the nodes of the first two lists.",
        "test_cases": [
            {"input": "[1,2,4], [1,3,4]", "expected_output": "[1,1,2,3,4,4]"},
            {"input": "[], [0]", "expected_output": "[0]"},
            {"input": "[], []", "expected_output": "[]"},
            {"input": "[1,3,5], [2,4,6]", "expected_output": "[1,2,3,4,5,6]"},
            {"input": "[1], [2,3,4]", "expected_output": "[1,2,3,4]"}
        ],
        "starterCode": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef merge_two_lists(list1, list2):\n    # Your code here\n    return None"

    },
    {
        "id": 7,
        "title": "Climbing Stairs",
        "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        "test_cases": [
            {"input": "2", "expected_output": "2"},
            {"input": "3", "expected_output": "3"},
            {"input": "5", "expected_output": "8"},
            {"input": "10", "expected_output": "89"},
            {"input": "1", "expected_output": "1"}
        ],
        "starterCode": "def climb_stairs(n):\n    # Your code here\n    return 0"

    },
    {
        "id": 8,
        "title": "Maximum Subarray",
        "description": "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        "test_cases": [
            {"input": "[-2,1,-3,4,-1,2,1,-5,4]", "expected_output": "6"},
            {"input": "[1]", "expected_output": "1"},
            {"input": "[5,4,-1,7,8]", "expected_output": "23"},
            {"input": "[-1,-2,-3,-4]", "expected_output": "-1"},
            {"input": "[0]", "expected_output": "0"}
        ],
        "starterCode": "def max_subarray(nums):\n    # Your code here\n    return 0"

    },
    {
        "id": 9,
        "title": "Plus One",
        "description": "Given a non-empty array of decimal digits representing a non-negative integer, increment one to the integer.",
        "test_cases": [
            {"input": "[1,2,3]", "expected_output": "[1,2,4]"},
            {"input": "[4,3,2,1]", "expected_output": "[4,3,2,2]"},
            {"input": "[0]", "expected_output": "[1]"},
            {"input": "[9]", "expected_output": "[1,0]"},
            {"input": "[9,9,9]", "expected_output": "[1,0,0,0]"}
        ],
        "starterCode": "def plus_one(digits):\n    # Your code here\n    return []"

    },
    {
        "id": 10,
        "title": "Rotate Array",
        "description": "Given an array, rotate the array to the right by k steps, where k is non-negative.",
        "test_cases": [
            {"input": "[1,2,3,4,5,6,7], 3", "expected_output": "[5,6,7,1,2,3,4]"},
            {"input": "[-1,-100,3,99], 2", "expected_output": "[3,99,-1,-100]"},
            {"input": "[1,2], 3", "expected_output": "[2,1]"},
            {"input": "[1], 1", "expected_output": "[1]"},
            {"input": "[1,2,3,4,5,6], 6", "expected_output": "[1,2,3,4,5,6]"}
        ],
        "starterCode": "def rotate_array(nums, k):\n    # Your code here\n    return"

    }
]


# Endpoint to fetch all questions
@app.route('/api/questions', methods=['GET'])
def get_questions():
    return jsonify(questions)

# Endpoint to fetch a specific question by ID
@app.route('/api/question/<int:question_id>', methods=['GET'])
def get_question(question_id):
    question = next((q for q in questions if q["id"] == question_id), None)
    if not question:
        return jsonify({"error": "Question not found"}), 404
    return jsonify(question)

# Endpoint to run Python code against test cases
@app.route('/api/test-code', methods=['POST'])
def test_code():
    try:
        data = request.json
        code = data.get("code", "")
        test_cases = data.get("test_cases", [])

        # Create a local namespace for the exec call
        local_namespace = {}

        # Execute the user's code
        try:
            exec(code, {}, local_namespace)  # Execute code in isolated namespace
        except Exception as e:
            return jsonify([
                {
                    "input": test_case["input"],
                    "expected_output": test_case["expected_output"],
                    "actual_output": f"Syntax Error: {e}",
                    "passed": False
                }
                for test_case in test_cases
            ])

        # Get the function name (assumes the function name is the first one defined)
        function_name = next(iter(local_namespace))

        # Run the function on each test case and collect results
        results = []
        for test_case in test_cases:
            try:
                # Prepare inputs
                inputs = eval(test_case["input"])
                if not isinstance(inputs, tuple):  # Ensure inputs are passed as tuple
                    inputs = (inputs,)

                # Call the user's function
                output = local_namespace[function_name](*inputs)

                # Compare output
                passed = str(output) == test_case["expected_output"]
                results.append({
                    "input": test_case["input"],
                    "expected_output": test_case["expected_output"],
                    "actual_output": str(output),
                    "passed": passed
                })
            except Exception as e:
                results.append({
                    "input": test_case["input"],
                    "expected_output": test_case["expected_output"],
                    "actual_output": f"Runtime Error: {e}",
                    "passed": False
                })

        return jsonify(results)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# Endpoint to process user prompts for the chatbot
@app.route('/api/chatbot', methods=['POST'])
def handle_prompt():
    try:
        # Get user input and editor code from the request
        user_input = request.json.get('prompt')
        editor_code = request.json.get('code', "")  # Default to empty string if no code
        question_id = request.json.get("question_id")

        if not user_input:
            return jsonify({"error": "Prompt is required"}), 400
        if not question_id:
            return jsonify({"error": "question_id is required"}), 400

        # Fetch the question details using the question_id
        question = next((q for q in questions if q["id"] == question_id), None)
        if not question:
            return jsonify({"error": "Question not found"}), 404
        
        # Extract the question's title and description
        question_title = question.get("title", "Unknown Question")
        question_description = question.get("description", "No description available.")
        print('question_title')
        if not user_input:
            return jsonify({"error": "Prompt is required"}), 400


        # Generate response from ChatGPT
        openai.api_key = get_openai_api_key()
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                # System prompt for "pretraining"
                {
                    "role": "system",
                    "content": (
                        "You are an AI-powered coding assistant designed to help users solve coding problems, debug their code, "
                        "and understand programming concepts. You specialize in guiding users through algorithmic challenges, "
                        "data structures, and problem-solving strategies, particularly in the context of LeetCode-style questions. "
                        "Here are your core guidelines:\n\n"
                        "1. **Guidance-Oriented**:\n"
                        "   - When users ask for help with a problem, focus on understanding their specific challenges or misunderstandings.\n"
                        "   - Provide hints, strategies, or explanations to guide users toward solving the problem themselves. Avoid providing "
                        "the complete solution unless explicitly asked.\n\n"
                        "2. **Support Coders of All Levels**:\n"
                        "   - Adapt your explanations based on the user's skill level, ensuring beginner-friendly responses for less experienced "
                        "coders and deeper insights for advanced users.\n"
                        "   - Use simple language when introducing complex concepts but remain technically accurate.\n\n"
                        "3. **Encourage Problem-Solving**:\n"
                        "   - When users share code, help debug it by pointing out issues, explaining why they occur, and suggesting fixes.\n"
                        "   - Suggest approaches, pseudocode, or breakdowns of the problem without jumping straight to the answer.\n\n"
                        "4. **Provide the Answer Only When Explicitly Asked**:\n"
                        "   - If the user says something like 'just give me the answer,' provide the solution but include a brief explanation "
                        "of how the solution works to ensure they learn from it.\n\n"
                        "5. **Explain Concepts Clearly**:\n"
                        "   - Be ready to explain programming concepts, algorithms, or data structures that may be relevant to the problem.\n"
                        "   - Use examples and visualizations when appropriate to make abstract concepts easier to grasp.\n\n"
                        "6. **Interact Collaboratively**:\n"
                        "   - Use a conversational tone to engage with users, asking clarifying questions to understand their needs or gaps in understanding.\n"
                        "   - Avoid overwhelming users with too much information at once; provide step-by-step guidance.\n\n"
                        "7. **Respect Coding Best Practices**:\n"
                        "   - When suggesting code or approaches, emphasize readability, efficiency, and real-world coding practices.\n"
                        "   - Encourage users to test and iterate on their code.\n\n"
                        "8. **Standalone Context**:\n"
                        "   - Assume the user is working within your integrated coding environment with its own compiler.\n"
                        "   - Do not reference external systems, APIs, or features specific to LeetCode unless explicitly mentioned by the user.\n\n"
                        "Current Question:\n"
                        f"Title: {question_title}\n"
                        f"Description: {question_description}\n\n"
                        "Remember, your goal is to empower users to become better coders by fostering learning and problem-solving skills. "
                        "Be helpful, patient, and adaptive to their needs."
                    )
                },
                # User's input
            {"role": "user", "content": f"User input: {user_input}\nCode editor content: {editor_code}"}
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
