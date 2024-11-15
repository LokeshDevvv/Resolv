import os
from flask import jsonify
from dotenv import load_dotenv
import requests
import json

load_dotenv()

def handle_submit_content(request):
    proof_image = request.form.get('proof_image')
    proof_text = request.form.get('proof_text')
    # prompt = 'Check if the image is public property or city property. Check if the image contains a problem or everything is fine. Also check if the given STATEMENT matches the problem in the image. Calculate the relavancy score between the image and the STATEMENT. Also calculate the seriousness of the problem and predict a priority score from 0 to 10. "isMatching" is "true" when the "score" is greater than "80%". Return in JSON string following this format. OUTPUT FORMAT: {"isMatching": <bool>, "matching": <str>, "score": <int>, "priority_score": <int>}'
    prompt = """
    Check if the image is public property or city property. Check if the image contains a problem or everything is fine. Also check if the given STATEMENT matches the problem in the image. Calculate the relavancy score between the image and the STATEMENT. "isMatching" is "true" when the "score" is greater than "80%". Return in JSON string following this format.
    Analyze the following situation and predict the severity of the problem based on the description provided. 
    If the situation is a severe or urgent problem (e.g., broken infrastructure, safety hazards, major delays), 
    it should be assigned a high severity score. If the problem is less urgent or involves minor issues 
    (e.g., minor road problems or typical delays), it should be assigned a lower severity score.

    Return a severity score between **0 to 10**, with **10 being the most severe** and **0 being the least severe**. 
    The score should reflect the urgency and seriousness of the situation described.

    Please consider the following examples for guidance:
    1. If the situation involves a **broken road**, **damaged infrastructure**, or **safety hazards**, 
       assign a **high severity score** (e.g., 8-10).
    2. If the situation involves a **train delay** or **ride report** that is **minor** or **not urgent** or **pot holes**, 
       assign a **moderate to low severity score** (e.g., 5-7).
    3. For issues like **traffic jams**, **minor road problems**, or **weather-related disruptions**,  
       the severity score should generally be lower (e.g., 3-5).
    4. Also use common sense and context to determine the severity of the situation.
    5. For common activities and day-to-day events, the severity score should be 0.
    6.**Trivial/No Severity (0)**: Situations involving **common day-to-day activities**, **non-urgent tasks**, or things that do not require immediate attention.
    - Example: "A boy eating chocolate."
    - Example: "Someone is walking in the park."
    - Example: "A family having dinner."
    - Example: "Children playing in the yard."

    OUTPUT FORMAT: {"isMatching": <bool>, "score": <int>, "severity_score": <int>, "reason_severity_score":<str>}
    """

    api = "https://api.hyperbolic.xyz/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('hyperbolic_key')}",
    }
    reqText = f"{prompt}. STATEMENT: {proof_text}"
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": reqText},
                    {
                        "type": "image_url",
                        "image_url": {"url": proof_image},
                    },
                ],
            }
        ],
        "model": "mistralai/Pixtral-12B-2409",
        "max_tokens": 2048,
        "temperature": 0.7,
        "top_p": 0.9,
    }
    try:
        response = requests.post(api, headers=headers, json=payload)
    except Exception as e:
        return(jsonify({"error": str(e)}))
        
    # return(jsonify(response.json()))
    output = response.json()["choices"][0]["message"]["content"]
    # return(jsonify(output))
    json_string = output.strip('```json\n').strip('```')
    parsed_dict = json.loads(json_string)
    return(jsonify(parsed_dict))
