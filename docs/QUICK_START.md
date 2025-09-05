# 🚀 Quick Start Guide

Get your Claude Code + OpenRouter Enterprise System running in under 15 minutes!

## 📋 Prerequisites Checklist

- [ ] Windows 10/11, macOS, or Linux
- [ ] Claude Code CLI installed
- [ ] Python 3.8+ installed  
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] OpenRouter account (free)

## ⚡ 15-Minute Setup

### Step 1: Get OpenRouter API Key (2 minutes)

1. Visit https://openrouter.ai/keys
2. Sign up for free account  
3. Click "Create Key"
4. Copy your API key (starts with `sk-or-v1-`)

### Step 2: Clone and Setup (3 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/claude-openrouter-enterprise-system.git
cd claude-openrouter-enterprise-system

# Set API key (Windows)
setx OPENROUTER_API_KEY "sk-or-v1-your-key-here"

# Set API key (Linux/macOS)
export OPENROUTER_API_KEY="sk-or-v1-your-key-here"
```

### Step 3: Configure Claude Code MCP (5 minutes)

```bash
# Install filesystem MCP server
npm install -g @anthropic-ai/mcp-server-filesystem

# Copy MCP configuration
cp config/claude-code-mcp-config.json ~/.claude/claude-code-mcp-config.json

# Restart Claude Code to load new config
claude code restart
```

### Step 4: Test Everything (3 minutes)

```bash
# Test OpenRouter connection
python scripts/test_new_key.py

# Should show:
# ✅ SUCCESS! Found 57 free models
# ✅ Chat completion test: SUCCESS  
# ✅ OpenRouter integration fully operational!
```

### Step 5: Launch Dashboard (2 minutes)

```bash
# Windows
start dashboards/ENHANCED_ENTERPRISE_DASHBOARD.html

# macOS
open dashboards/ENHANCED_ENTERPRISE_DASHBOARD.html

# Linux
xdg-open dashboards/ENHANCED_ENTERPRISE_DASHBOARD.html
```

## 🎉 You're Done!

Your enterprise AI system is now running with:
- ✅ 57+ free AI models
- ✅ $0.00 operating cost
- ✅ Claude limit protection
- ✅ Enterprise dashboards
- ✅ Memory persistence

## 🔧 Verify Installation

Run these commands to verify everything works:

```bash
# Check system status
python scripts/system_status.py

# Test all free models
python scripts/test_all_models.py

# Launch monitoring dashboard
start dashboards/MULTI_AI_DASHBOARD_MONITOR.html
```

## 🆘 Common Issues

### "API Key Not Found"
```bash
# Windows: Make sure environment variable is set
echo %OPENROUTER_API_KEY%

# Linux/macOS: Check environment
echo $OPENROUTER_API_KEY

# If empty, set it again and restart terminal
```

### "403 Key Limit Exceeded"  
```bash
# Your free daily limit was hit, wait 24 hours or:
# 1. Create new OpenRouter account
# 2. Get new API key
# 3. Update environment variable
```

### "MCP Connection Failed"
```bash
# Restart Claude Code
claude code restart

# Verify MCP config location
ls ~/.claude/claude-code-mcp-config.json

# If missing, copy it again
cp config/claude-code-mcp-config.json ~/.claude/
```

### "Dashboard Won't Load"
```bash
# Check file permissions
chmod +r dashboards/*.html

# Try different browser
# Chrome/Edge/Firefox all supported
```

## 🎯 Next Steps

Now that you're running, explore these advanced features:

1. **[Advanced Configuration](ADVANCED_SETUP.md)** - Multi-account setup
2. **[Enterprise Features](ENTERPRISE_GUIDE.md)** - Production deployment  
3. **[Performance Tuning](PERFORMANCE.md)** - Optimization tips
4. **[Cost Optimization](COST_OPTIMIZATION.md)** - Maximize free usage

## 💡 Pro Tips

- **Bookmark Dashboards**: Pin your main dashboard for quick access
- **Monitor Usage**: Keep Claude Protection Monitor open
- **Test Models**: Different models excel at different tasks
- **Backup Config**: Keep your API keys and configs backed up

## 🚀 Ready to Build

Your unlimited AI enterprise system is ready! Start building:

- Content creation workflows
- Development assistance tools  
- Business process automation
- Customer service solutions
- Data analysis pipelines

**Happy coding with unlimited AI power! 🎉**