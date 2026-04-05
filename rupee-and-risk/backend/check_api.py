import requests
r = requests.get('http://127.0.0.1:8000/api/companies')
data = r.json()
print(f'Total companies: {len(data)}')
for c in data:
    print(f'  - {c["ticker"]} | {c["name"]}')
