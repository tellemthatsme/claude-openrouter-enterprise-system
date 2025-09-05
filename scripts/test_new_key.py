import requests

# Test new OpenRouter key directly
api_key = "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"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Test with models endpoint first
try:
    print("Testing OpenRouter API with new key...")
    response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        models = response.json()
        free_models = [m for m in models.get('data', []) if m.get('pricing', {}).get('prompt') == '0']
        print(f"SUCCESS! Found {len(free_models)} free models")
        
        # Test a simple completion
        test_data = {
            "model": "deepseek/deepseek-r1:free",
            "messages": [{"role": "user", "content": "Hello"}],
            "max_tokens": 10
        }
        
        chat_response = requests.post("https://openrouter.ai/api/v1/chat/completions", 
                                    headers=headers, json=test_data)
        
        if chat_response.status_code == 200:
            print("Chat completion test: SUCCESS")
            print("OpenRouter integration fully operational!")
        else:
            print(f"Chat test failed: {chat_response.status_code}")
            print(chat_response.text)
    else:
        print(f"Failed: {response.text}")
        
except Exception as e:
    print(f"Error: {e}")