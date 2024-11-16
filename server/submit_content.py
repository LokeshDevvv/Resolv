import os
import requests
import json
from flask import jsonify
from flask import Flask, request
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

@app.route('/api/submit-content', methods=['POST'])
def handle_submit_content(request):
    print("Received payload:", request.json)
    proof_image = request.json.get('proof_image')  
    proof_text = request.json.get('proof_text')

    # Prompt for AI model
    prompt = """
    Check if the image is public property or city property. Check if the image contains a problem or everything is fine. Also check if the given STATEMENT matches the problem in the image. Calculate the relevancy score between the image and the STATEMENT. "isMatching" is "true" when the "score" is greater than "80%". Return in JSON string following this format.
    Analyze the following situation and predict the severity of the problem based on the description provided. 
    If the situation is a severe or urgent problem (e.g., broken infrastructure, safety hazards, major delays), 
    it should be assigned a high severity score. If the problem is less urgent or involves minor issues 
    (e.g., minor road problems or typical delays), it should be assigned a lower severity score.

    Return a severity score between **0 to 10**, with **10 being the most severe** and **0 being the least severe**. 
    The score should reflect the urgency and seriousness of the situation described.

    OUTPUT FORMAT: {"isMatching": <bool>, "score": <int>, "severity_score": <int>, "reason_severity_score":<str>}
    """

    # API Configuration
    api_url = "https://api.hyperbolic.xyz/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('hyperbolic_key')}",
    }

    # Prepare API payload
    req_text = f"{prompt}\n\nSTATEMENT: {proof_text}"
    payload = {
        "messages": [
            {"role": "user", "content": req_text},
            {"role": "user", "content": f"Image: {proof_image}"}
        ],
        "model": "mistralai/Pixtral-12B-2409",
        "max_tokens": 2048,
        "temperature": 0.7,
        "top_p": 0.9,
    }

    try:
        response = requests.post(api_url, headers=headers, json=payload)

        if response.status_code != 200:
            return jsonify({"error": f"API request failed with status {response.status_code}", "details": response.text}), 500

        # Parse the response JSON
        response_data = response.json()
        if "choices" not in response_data:
            return jsonify({"error": "Unexpected API response format", "response": response_data}), 500

        output = response_data["choices"][0]["message"]["content"]
        
        # Parse the JSON string output
        try:
            json_string = output.strip('```json\n').strip('```')
            parsed_dict = json.loads(json_string)
            return jsonify(parsed_dict)
        except json.JSONDecodeError as e:
            return jsonify({"error": "Failed to parse JSON response", "details": str(e), "output": output}), 500

    except requests.RequestException as e:
        return jsonify({"error": "API request failed", "details": str(e)}), 500
