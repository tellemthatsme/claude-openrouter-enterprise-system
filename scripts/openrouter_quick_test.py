import os
import requests

# Simple OpenRouter test without Unicode characters
print("OpenRouter Setup Test")
print("=" * 40)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    print("ERROR: OPENROUTER_API_KEY environment variable not set.")
    print("Set it with: setx OPENROUTER_API_KEY \"your-api-key\"")
    print("Get your key from: https://openrouter.ai/keys")
    exit(1)

print(f"API Key found: {OPENROUTER_API_KEY[:8]}...{OPENROUTER_API_KEY[-4:]}")

headers = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://localhost",
    "X-Title": "OpenRouter Test"
}

data = {
    "model": "openrouter/auto",
    "messages": [
        {"role": "user", "content": "Say 'Working!' if you can see this."}
    ],
    "max_tokens": 50
}

try:
    print("Testing OpenRouter API...")
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions", 
        headers=headers, 
        json=data,
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        message = result.get('choices', [{}])[0].get('message', {}).get('content', 'No content')
        print(f"SUCCESS! Response: {message.strip()}")
        print(f"Model used: {result.get('model', 'Unknown')}")
        
        usage = result.get('usage', {})
        if usage:
            print(f"Tokens used: {usage.get('total_tokens', 0)}")
            
    else:
        print(f"FAILED: {response.status_code}")
        print(f"Response: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
except Exception as e:
    print(f"Error: {e}")