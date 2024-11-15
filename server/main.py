from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from submit_content import handle_submit_content
# from analyze import handle_analyze

app = Flask(__name__)
CORS(app)

# New Report 
@app.route('/submit-content', methods=['POST'])
def submit_content():
    '''
    Params: proof_image = i, proof_text = t
     prompt:  i == public property
              i == problem == statement_equal(t)
              isMatching = true if score > 80
              response: isMatching: <bool>, matching: <str>, score: <int>/100
    '''
    return handle_submit_content(request)

app.run("0.0.0.0", port=8080, debug=True)