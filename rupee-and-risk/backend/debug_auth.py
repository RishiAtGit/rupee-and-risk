import urllib.request, json
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/auth/register', 
    data=json.dumps({'email': 'debug2@test.com', 'password': 'pw', 'full_name': 'test'}).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)
try:
    res = urllib.request.urlopen(req)
    print("SUCCESS:")
    print(res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP ERROR {e.code}:")
    print(e.read().decode('utf-8'))
except Exception as e:
    print("OTHER ERROR:", e)
