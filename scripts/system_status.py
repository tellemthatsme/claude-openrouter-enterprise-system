#!/usr/bin/env python3
"""
Claude Code + OpenRouter Enterprise System Status Checker
Comprehensive system health and status monitoring
"""

import os
import sys
import json
import time
import requests
from datetime import datetime

def print_banner():
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║           Claude Code + OpenRouter System Status             ║
    ║                Real-time Health Monitor                      ║
    ╚══════════════════════════════════════════════════════════════╝
    """)

def check_environment():
    """Check environment variables and configuration"""
    print("🌍 Environment Check:")
    
    api_key = os.getenv('OPENROUTER_API_KEY')
    if api_key:
        print(f"  ✅ OpenRouter API Key: {api_key[:12]}...{api_key[-4:]}")
        return api_key
    else:
        print("  ❌ OpenRouter API Key: Not found")
        return None

def test_openrouter_connection(api_key):
    """Test OpenRouter API connection and get model info"""
    print("\n🔌 OpenRouter Connection Test:")
    
    if not api_key:
        print("  ❌ No API key available for testing")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Test models endpoint
        print("  🧪 Testing models endpoint...")
        response = requests.get("https://openrouter.ai/api/v1/models", 
                              headers=headers, timeout=10)
        
        if response.status_code == 200:
            models_data = response.json()
            total_models = len(models_data.get('data', []))
            free_models = [m for m in models_data.get('data', []) 
                          if m.get('pricing', {}).get('prompt') == '0']
            
            print(f"  ✅ Connection successful")
            print(f"  📊 Total models: {total_models}")
            print(f"  🆓 Free models: {len(free_models)}")
            
            # Test a simple chat completion
            print("  🧪 Testing chat completion...")
            test_payload = {
                "model": "deepseek/deepseek-r1:free",
                "messages": [{"role": "user", "content": "Hello"}],
                "max_tokens": 10
            }
            
            chat_response = requests.post("https://openrouter.ai/api/v1/chat/completions",
                                        headers=headers, json=test_payload, timeout=15)
            
            if chat_response.status_code == 200:
                print("  ✅ Chat completion test: SUCCESS")
                return True
            else:
                print(f"  ⚠️ Chat completion test failed: {chat_response.status_code}")
                return False
                
        else:
            print(f"  ❌ Connection failed: {response.status_code}")
            if response.status_code == 401:
                print("  🔑 Invalid API key")
            elif response.status_code == 403:
                print("  🚫 API key limit exceeded")
            return False
            
    except requests.exceptions.Timeout:
        print("  ❌ Connection timeout")
        return False
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Connection error: {e}")
        return False

def check_config_files():
    """Check configuration files"""
    print("\n📁 Configuration Files:")
    
    config_files = [
        "config/openrouter_free_config.json",
        "config/OPENROUTER_ONLY_STATUS.json",
        "config/claude-code-mcp-config.json"
    ]
    
    all_good = True
    for config_file in config_files:
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    json.load(f)
                print(f"  ✅ {config_file}")
            except json.JSONDecodeError:
                print(f"  ❌ {config_file} - Invalid JSON")
                all_good = False
        else:
            print(f"  ⚠️ {config_file} - Not found")
    
    return all_good

def check_dashboard_files():
    """Check dashboard files"""
    print("\n📊 Dashboard Files:")
    
    dashboards = [
        "dashboards/ENHANCED_ENTERPRISE_DASHBOARD.html",
        "dashboards/MULTI_AI_DASHBOARD_MONITOR.html",
        "dashboards/OpenRouter_Dashboard.html",
        "dashboards/CLAUDE_PROTECTION_MONITOR.html",
        "dashboards/PROJECT_DIRECTORY.html",
        "dashboards/ULTIMATE_ENTERPRISE_PLATFORM.html"
    ]
    
    available_dashboards = 0
    for dashboard in dashboards:
        if os.path.exists(dashboard):
            print(f"  ✅ {os.path.basename(dashboard)}")
            available_dashboards += 1
        else:
            print(f"  ❌ {os.path.basename(dashboard)} - Not found")
    
    print(f"\n  📈 Available dashboards: {available_dashboards}/{len(dashboards)}")
    return available_dashboards == len(dashboards)

def check_scripts():
    """Check essential scripts"""
    print("\n🔧 Essential Scripts:")
    
    scripts = [
        "scripts/test_new_key.py",
        "scripts/openrouter_quick_test.py",
        "scripts/emergency_openrouter_setup.py",
        "scripts/setup_system.py"
    ]
    
    available_scripts = 0
    for script in scripts:
        if os.path.exists(script):
            print(f"  ✅ {os.path.basename(script)}")
            available_scripts += 1
        else:
            print(f"  ❌ {os.path.basename(script)} - Not found")
    
    return available_scripts == len(scripts)

def check_mcp_setup():
    """Check MCP setup"""
    print("\n🔗 MCP Configuration:")
    
    claude_dir = os.path.expanduser("~/.claude")
    mcp_config_path = os.path.join(claude_dir, "mcp_settings.json")
    
    if os.path.exists(mcp_config_path):
        try:
            with open(mcp_config_path, 'r') as f:
                mcp_config = json.load(f)
            print("  ✅ MCP configuration found")
            
            if 'mcpServers' in mcp_config:
                servers = list(mcp_config['mcpServers'].keys())
                print(f"  📡 Configured servers: {', '.join(servers)}")
            else:
                print("  ⚠️ No MCP servers configured")
                
            return True
        except json.JSONDecodeError:
            print("  ❌ MCP configuration - Invalid JSON")
            return False
    else:
        print("  ⚠️ MCP configuration not found")
        return False

def get_system_metrics():
    """Get system performance metrics"""
    print("\n📊 System Metrics:")
    
    # Current timestamp
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"  🕒 Current time: {current_time}")
    
    # Check if this is a git repository
    if os.path.exists('.git'):
        try:
            import subprocess
            result = subprocess.run(['git', 'log', '--oneline', '-1'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                last_commit = result.stdout.strip()
                print(f"  📝 Last commit: {last_commit[:60]}...")
        except:
            print("  📝 Git status: Unable to check")
    
    # System load (if available)
    try:
        load_avg = os.getloadavg()
        print(f"  💻 System load: {load_avg[0]:.2f}")
    except:
        print("  💻 System load: Not available on this platform")

def print_recommendations(status_results):
    """Print recommendations based on status check results"""
    print("\n💡 Recommendations:")
    
    if not status_results.get('api_key'):
        print("  🔑 Set up your OpenRouter API key:")
        print("     export OPENROUTER_API_KEY='your-key-here'")
    
    if not status_results.get('openrouter_connection'):
        print("  🔌 OpenRouter connection issues:")
        print("     - Check your API key validity")
        print("     - Verify internet connection")
        print("     - Check for rate limits")
    
    if not status_results.get('config_files'):
        print("  📁 Missing configuration files:")
        print("     - Run setup_system.py to recreate configs")
    
    if not status_results.get('dashboards'):
        print("  📊 Missing dashboard files:")
        print("     - Re-clone the repository")
        print("     - Check file permissions")
    
    if status_results.get('all_good'):
        print("  🎉 System is fully operational!")
        print("  🚀 Ready for unlimited AI access")
        print("  💰 Operating cost: $0.00")

def generate_status_report(status_results):
    """Generate a detailed status report"""
    print("\n📋 System Status Report:")
    print("=" * 50)
    
    total_checks = len(status_results) - 1  # Exclude 'all_good'
    passed_checks = sum(1 for k, v in status_results.items() if k != 'all_good' and v)
    
    print(f"Overall Health: {passed_checks}/{total_checks} checks passed")
    print(f"System Status: {'🟢 OPERATIONAL' if status_results.get('all_good') else '🟡 PARTIAL' if passed_checks > total_checks//2 else '🔴 CRITICAL'}")
    
    status_details = {
        'api_key': 'OpenRouter API Key',
        'openrouter_connection': 'OpenRouter Connection',
        'config_files': 'Configuration Files',
        'dashboards': 'Dashboard Files',
        'scripts': 'Essential Scripts',
        'mcp_setup': 'MCP Configuration'
    }
    
    for key, description in status_details.items():
        status = "✅ PASS" if status_results.get(key) else "❌ FAIL"
        print(f"{description}: {status}")

def main():
    """Main status check function"""
    print_banner()
    
    # Initialize status tracking
    status_results = {}
    
    # Run all checks
    api_key = check_environment()
    status_results['api_key'] = api_key is not None
    
    status_results['openrouter_connection'] = test_openrouter_connection(api_key)
    status_results['config_files'] = check_config_files()
    status_results['dashboards'] = check_dashboard_files()
    status_results['scripts'] = check_scripts()
    status_results['mcp_setup'] = check_mcp_setup()
    
    # Get system metrics
    get_system_metrics()
    
    # Determine overall system health
    critical_checks = ['api_key', 'openrouter_connection']
    status_results['all_good'] = all(status_results.get(check, False) for check in critical_checks)
    
    # Print recommendations
    print_recommendations(status_results)
    
    # Generate status report
    generate_status_report(status_results)
    
    return status_results['all_good']

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Status check cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)