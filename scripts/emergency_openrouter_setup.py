import requests
import json
import time
import os

def create_new_openrouter_account():
    """
    Emergency OpenRouter account setup procedure
    """
    
    print("EMERGENCY OPENROUTER ACCOUNT SETUP")
    print("="*50)
    
    # Manual steps required
    instructions = """
    IMMEDIATE ACTION REQUIRED:
    
    1. Go to: https://openrouter.ai/
    2. Sign up with a new email (use + trick: youremail+or1@gmail.com)
    3. Verify email
    4. Go to Settings -> Keys
    5. Create new API key
    6. Copy key and paste below
    
    NEW ACCOUNT GETS $5 FREE CREDITS!
    """
    
    print(instructions)
    
    # Wait for user input
    new_key = input("Enter your NEW OpenRouter API Key: ").strip()
    
    if not new_key.startswith('sk-or-v1-'):
        print("ERROR: Invalid key format")
        return False
    
    # Test the new key
    headers = {
        "Authorization": f"Bearer {new_key}",
        "Content-Type": "application/json"
    }
    
    print("Testing new key...")
    response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
    
    if response.status_code == 200:
        print("SUCCESS: New key is working!")
        
        # Test chat completion
        data = {
            "model": "openai/gpt-oss-20b:free",
            "messages": [{"role": "user", "content": "Hello! This is a test."}],
            "max_tokens": 50
        }
        
        chat_response = requests.post("https://openrouter.ai/api/v1/chat/completions", 
                                    headers=headers, json=data)
        
        if chat_response.status_code == 200:
            print("SUCCESS: Chat completion working!")
            
            # Update emergency config
            emergency_config = {
                "EMERGENCY_NEW_KEY": new_key,
                "CREATED_AT": time.time(),
                "STATUS": "ACTIVE",
                "FREE_CREDITS": 5.00,
                "MODELS_TESTED": True,
                "CHAT_TESTED": True
            }
            
            with open('EMERGENCY_NEW_OPENROUTER_KEY.json', 'w') as f:
                json.dump(emergency_config, f, indent=2)
            
            print(f"NEW KEY SAVED: {new_key[:20]}...")
            print("System ready for immediate use!")
            return True
        else:
            print(f"Chat test failed: {chat_response.status_code}")
            return False
    else:
        print(f"Key test failed: {response.status_code}")
        print(response.text)
        return False

def quick_test_current_keys():
    """Test all current keys to see what's working"""
    
    keys_to_test = [
        "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",
        "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"
    ]
    
    print("TESTING ALL EXISTING KEYS")
    print("="*30)
    
    working_keys = []
    
    for i, key in enumerate(keys_to_test, 1):
        print(f"Testing key {i}: {key[:20]}...")
        
        headers = {"Authorization": f"Bearer {key}"}
        response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
        
        if response.status_code == 200:
            print(f"✅ Key {i} WORKING")
            working_keys.append(key)
        else:
            print(f"❌ Key {i} FAILED: {response.status_code}")
    
    return working_keys

if __name__ == "__main__":
    print("OpenRouter Emergency Recovery System")
    print("="*50)
    
    # Test existing keys first
    working_keys = quick_test_current_keys()
    
    if not working_keys:
        print("\n🚨 ALL KEYS FAILED - NEED NEW ACCOUNT")
        create_new_openrouter_account()
    else:
        print(f"\n✅ Found {len(working_keys)} working keys")
        for key in working_keys:
            print(f"Working: {key[:20]}...")