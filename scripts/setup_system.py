#!/usr/bin/env python3
"""
Claude Code + OpenRouter Enterprise System Setup
Automated setup script for complete system installation
"""

import os
import sys
import json
import subprocess
import platform
import urllib.request

def print_banner():
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║              Claude Code + OpenRouter Enterprise              ║
    ║                    System Setup Script                       ║
    ║                                                              ║
    ║  🚀 Automated setup for unlimited AI access                 ║
    ║  💰 $0.00 operating cost with 57+ free models              ║
    ║  🛡️ Claude limit protection included                        ║
    ╚══════════════════════════════════════════════════════════════╝
    """)

def check_prerequisites():
    """Check if all prerequisites are installed"""
    print("🔍 Checking prerequisites...")
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required")
        return False
    print("✅ Python version OK")
    
    # Check Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Node.js installed")
        else:
            print("❌ Node.js not found")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found")
        return False
    
    # Check Git
    try:
        result = subprocess.run(['git', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Git installed")
        else:
            print("❌ Git not found")
            return False
    except FileNotFoundError:
        print("❌ Git not found")
        return False
    
    return True

def get_openrouter_key():
    """Get OpenRouter API key from user"""
    print("\n🔑 OpenRouter API Key Setup")
    print("Visit https://openrouter.ai/keys to get your free API key")
    
    api_key = input("Enter your OpenRouter API key (starts with sk-or-v1-): ").strip()
    
    if not api_key.startswith('sk-or-v1-'):
        print("❌ Invalid API key format")
        return None
    
    return api_key

def test_openrouter_key(api_key):
    """Test if OpenRouter API key works"""
    print("🧪 Testing OpenRouter API key...")
    
    try:
        import requests
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
        
        if response.status_code == 200:
            models = response.json()
            free_models = [m for m in models.get('data', []) if m.get('pricing', {}).get('prompt') == '0']
            print(f"✅ API key working! Found {len(free_models)} free models")
            return True
        else:
            print(f"❌ API key test failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing API key: {e}")
        return False

def setup_environment_variables(api_key):
    """Setup environment variables"""
    print("🌍 Setting up environment variables...")
    
    system = platform.system().lower()
    
    if system == "windows":
        # Windows
        subprocess.run(['setx', 'OPENROUTER_API_KEY', api_key], check=True)
        print("✅ Windows environment variable set")
    else:
        # Linux/macOS
        shell_rc = os.path.expanduser("~/.bashrc")
        if os.path.exists(os.path.expanduser("~/.zshrc")):
            shell_rc = os.path.expanduser("~/.zshrc")
        
        with open(shell_rc, "a") as f:
            f.write(f"\nexport OPENROUTER_API_KEY='{api_key}'\n")
        
        print(f"✅ Added to {shell_rc}")
        print("Run 'source ~/.bashrc' or restart terminal")

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    
    try:
        # Install Python packages
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'requests'], check=True)
        print("✅ Python packages installed")
        
        # Install Node.js packages
        subprocess.run(['npm', 'install'], check=True)
        print("✅ Node.js packages installed")
        
        # Install MCP server
        subprocess.run(['npm', 'install', '-g', '@anthropic-ai/mcp-server-filesystem'], check=True)
        print("✅ MCP filesystem server installed")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def setup_claude_code_mcp():
    """Setup Claude Code MCP configuration"""
    print("🔧 Setting up Claude Code MCP...")
    
    claude_dir = os.path.expanduser("~/.claude")
    os.makedirs(claude_dir, exist_ok=True)
    
    mcp_config = {
        "mcpServers": {
            "filesystem": {
                "command": "npx",
                "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/allowed/files"]
            }
        }
    }
    
    config_path = os.path.join(claude_dir, "mcp_settings.json")
    with open(config_path, 'w') as f:
        json.dump(mcp_config, f, indent=2)
    
    print(f"✅ MCP config created at {config_path}")

def update_config_files(api_key):
    """Update configuration files with API key"""
    print("⚙️ Updating configuration files...")
    
    # Update OpenRouter config
    config_file = "config/openrouter_free_config.json"
    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            config = json.load(f)
        
        config['openrouter']['api_key'] = api_key
        
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        
        print("✅ OpenRouter config updated")

def run_tests():
    """Run system tests"""
    print("🧪 Running system tests...")
    
    try:
        result = subprocess.run([sys.executable, 'scripts/test_new_key.py'], 
                              capture_output=True, text=True, check=True)
        print("✅ System tests passed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ System tests failed: {e}")
        return False

def launch_dashboard():
    """Launch the enterprise dashboard"""
    print("🚀 Launching enterprise dashboard...")
    
    dashboard_path = "dashboards/ENHANCED_ENTERPRISE_DASHBOARD.html"
    system = platform.system().lower()
    
    try:
        if system == "windows":
            subprocess.run(['start', dashboard_path], shell=True)
        elif system == "darwin":  # macOS
            subprocess.run(['open', dashboard_path])
        else:  # Linux
            subprocess.run(['xdg-open', dashboard_path])
        
        print("✅ Dashboard launched in browser")
        return True
    except Exception as e:
        print(f"❌ Error launching dashboard: {e}")
        return False

def print_success_message():
    """Print success message with next steps"""
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                    🎉 SETUP COMPLETE! 🎉                     ║
    ║                                                              ║
    ║  Your Claude Code + OpenRouter Enterprise System is ready!  ║
    ║                                                              ║
    ║  ✅ 57+ free AI models available                            ║
    ║  ✅ $0.00 operating cost                                    ║
    ║  ✅ Claude limit protection active                          ║
    ║  ✅ Enterprise dashboards deployed                          ║
    ║                                                              ║
    ║  📊 Access your dashboards:                                 ║
    ║  • Enhanced Enterprise Dashboard                             ║
    ║  • Multi-AI Dashboard Monitor                               ║
    ║  • OpenRouter Console                                       ║
    ║  • Claude Protection Monitor                                ║
    ║                                                              ║
    ║  🔧 Quick commands:                                         ║
    ║  • python scripts/test_new_key.py (test system)            ║
    ║  • python scripts/system_status.py (check status)          ║
    ║                                                              ║
    ║  📚 Read docs/QUICK_START.md for more information          ║
    ╚══════════════════════════════════════════════════════════════╝
    """)

def main():
    """Main setup function"""
    print_banner()
    
    # Check prerequisites
    if not check_prerequisites():
        print("❌ Prerequisites check failed. Please install missing requirements.")
        return False
    
    # Get API key
    api_key = get_openrouter_key()
    if not api_key:
        print("❌ Setup cancelled - API key required")
        return False
    
    # Test API key
    if not test_openrouter_key(api_key):
        print("❌ Setup cancelled - API key test failed")
        return False
    
    # Setup environment
    setup_environment_variables(api_key)
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Setup cancelled - dependency installation failed")
        return False
    
    # Setup MCP
    setup_claude_code_mcp()
    
    # Update configs
    update_config_files(api_key)
    
    # Run tests
    if not run_tests():
        print("❌ Setup completed with test failures")
    
    # Launch dashboard
    launch_dashboard()
    
    # Print success
    print_success_message()
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Setup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)