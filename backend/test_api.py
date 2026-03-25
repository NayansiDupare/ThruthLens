import time
import requests
import json

start = time.time()
print('Testing backend API...')
try:
    response = requests.post(
        'http://127.0.0.1:8000/api/analyze/text', 
        json={'text': 'This is a sample breaking news article to test the latency.'},
        stream=True,
        timeout=60
    )
    print(f'Initial connection time: {time.time() - start:.2f}s')
    
    for line in response.iter_lines():
        if line:
            print(f'[{time.time() - start:.2f}s] {line.decode("utf-8")}')
            
except Exception as e:
    print(f'Error: {e}')

