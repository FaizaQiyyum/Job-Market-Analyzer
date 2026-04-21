from flask import Flask, request, jsonify, send_from_directory, send_file
import pandas as pd
import os
import io
import json
from data_processor import process_job_data

app = Flask(__name__, static_folder="static")
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_data():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if file and file.filename.endswith('.csv'):
        try:
            df = pd.read_csv(file)
            results = process_job_data(df)
            return jsonify(results)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Please upload a CSV file'}), 400

@app.route('/api/sample', methods=['GET'])
def analyze_sample():
    try:
        if os.path.exists('sample_data.csv'):
            df = pd.read_csv('sample_data.csv')
            results = process_job_data(df)
            return jsonify(results)
        return jsonify({'error': 'Sample data not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download_report():
    data = request.json
    if not data:
        return jsonify({'error': 'No output data provided'}), 400
        
    # Generate JSON file in memory
    mem = io.BytesIO()
    mem.write(json.dumps(data, indent=4).encode('utf-8'))
    mem.seek(0)
    
    return send_file(
        mem,
        mimetype='application/json',
        as_attachment=True,
        download_name='analysis_report.json'
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)
