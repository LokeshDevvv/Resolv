import os
import base64
import json
from PIL import Image
import requests
from flask import jsonify, request
from dotenv import load_dotenv

load_dotenv()

def verify_content_handler(request):
    
    submitted_image_file = request.form.get('submitted_image')  
    verification_image_file = request.form.get('verification_image')  
    submitted_text = request.form.get('submitted_text')                         
    verification_text = request.form.get('verification_text')
    
    if not all([submitted_image_file, verification_image_file, submitted_text, verification_text]):
        return jsonify({"error": "All fields are required: 'submitted_image', 'verification_image', 'submitted_text', 'verification_text'"}), 400

    prompt = """
    Compare the following content and determine the relevance of the images and their matching descriptions. 
    Assess the similarities between the submitted image and the verification image, and also compare the corresponding texts.
    If the images and texts match, calculate the relevance score. 
    Consider the relevance between the images and the texts, as well as the overall severity and priority of the situation described.
    """

    reqText = f"{prompt}\nSUBMITTED TEXT: {submitted_text}\nVERIFICATION TEXT: {verification_text}"

    prompt_end = """
    Return the analysis in the following format: 
    {"isMatching": <bool>, "score": <int>, "priority_score": <int>, "reason_severity_score": <str>}
    """

    reqText += f"\n{prompt_end}"

    api = "https://api.hyperbolic.xyz/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('hyperbolic_key')}",
    }

    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": reqText},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"{submitted_image_file}"},
                    },
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Now comparing the submitted image and text with the verification image and text."
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"{verification_image_file}"},
                    },
                ],
            },
        ],
        "model": "mistralai/Pixtral-12B-2409",
        "max_tokens": 2048,
        "temperature": 0.7,
        "top_p": 0.9,
    }
    
    response = requests.post(api, headers=headers, json=payload)

    if response.status_code != 200:
        return jsonify({"error": "Failed to get a valid response from the API"}), 500
    output = response.json()["choices"][0]["message"]["content"]
    json_string = output.strip('```json\n').strip('```')
    parsed_dict = json.loads(json_string)

    return jsonify(parsed_dict)
