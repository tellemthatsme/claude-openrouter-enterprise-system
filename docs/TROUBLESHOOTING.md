# 🛠️ Troubleshooting Guide

Complete troubleshooting guide for the Claude Code + OpenRouter Enterprise System.

## 🚨 Quick Diagnostic Commands

Run these commands first to identify issues:

```bash
# System status check
python scripts/system_status.py

# Test OpenRouter connection
python scripts/test_new_key.py

# Check environment
echo $OPENROUTER_API_KEY  # Linux/macOS
echo %OPENROUTER_API_KEY% # Windows
```

## 🔍 Common Issues & Solutions

### 1. API Key Issues

#### ❌ "OPENROUTER_API_KEY not found"
**Symptoms:**
- Scripts fail with "API key not found"
- Environment variable empty
- Tests fail immediately

**Solutions:**
```bash
# Windows
setx OPENROUTER_API_KEY "sk-or-v1-your-key-here"
# Restart terminal after setting

# Linux/macOS
export OPENROUTER_API_KEY="sk-or-v1-your-key-here"
echo 'export OPENROUTER_API_KEY="sk-or-v1-your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**Verify Fix:**
```bash
python scripts/test_new_key.py
# Should show: "SUCCESS! Found XX free models"
```

#### ❌ "403 Key limit exceeded"
**Symptoms:**
- API returns 403 status code
- "Key limit exceeded" error message
- Models not accessible

**Solutions:**
1. **Wait for reset** (24 hours for free tier)
2. **Create new OpenRouter account**
3. **Get new API key**
4. **Update environment variable**

```bash
# Update with new key
setx OPENROUTER_API_KEY "sk-or-v1-new-key-here"  # Windows
export OPENROUTER_API_KEY="sk-or-v1-new-key-here"  # Linux/macOS
```

#### ❌ "401 Invalid API key"
**Symptoms:**
- Authentication failures
- "Invalid API key" errors
- Unable to access models

**Solutions:**
1. **Check key format** (must start with `sk-or-v1-`)
2. **Regenerate key** at https://openrouter.ai/keys
3. **Verify account status** on OpenRouter dashboard

### 2. Dashboard Issues

#### ❌ Dashboard won't load
**Symptoms:**
- Blank page or error in browser
- Dashboard files not opening
- JavaScript errors in console

**Solutions:**
```bash
# Check file exists and permissions
ls -la dashboards/ENHANCED_ENTERPRISE_DASHBOARD.html
chmod +r dashboards/*.html  # Linux/macOS

# Try different browser
# Clear browser cache
# Disable ad blockers/extensions temporarily
```

#### ❌ Dashboard shows no data
**Symptoms:**
- Dashboard loads but shows empty widgets
- "No data available" messages
- API connection failures

**Solutions:**
1. **Check API key**: `python scripts/test_new_key.py`
2. **Verify internet connection**
3. **Check browser console for errors** (F12)
4. **Try refreshing page** (Ctrl+R)

**Browser Console Check:**
```javascript
// Open browser console (F12) and look for:
// ❌ CORS errors
// ❌ Network failures  
// ❌ JavaScript errors
// ❌ API timeout messages
```

### 3. MCP Server Issues

#### ❌ "MCP connection failed"
**Symptoms:**
- Claude Code can't connect to MCP servers
- Memory operations fail
- Filesystem operations fail

**Solutions:**
```bash
# Check MCP server installation
npm list -g @anthropic-ai/mcp-server-filesystem

# Reinstall if missing
npm install -g @anthropic-ai/mcp-server-filesystem

# Check Claude Code MCP config
ls ~/.claude/mcp_settings.json

# Restart Claude Code
claude code restart
```

#### ❌ MCP server not responding
**Symptoms:**
- Timeout errors from MCP servers
- Slow or hanging operations
- Connection drops

**Solutions:**
1. **Restart MCP servers**
2. **Check system resources** (CPU/memory)
3. **Verify file permissions**
4. **Update MCP server packages**

```bash
# Update MCP packages
npm update -g @anthropic-ai/mcp-server-filesystem

# Check system resources
top  # Linux/macOS
taskmgr  # Windows
```

### 4. System Performance Issues

#### ❌ Slow response times
**Symptoms:**
- API calls taking >10 seconds
- Dashboard loading slowly
- Script timeouts

**Solutions:**
1. **Check internet connection speed**
2. **Try different OpenRouter models**
3. **Reduce concurrent requests**
4. **Check system resources**

```bash
# Test connection speed
curl -w "@curl-format.txt" -o /dev/null -s https://openrouter.ai/api/v1/models

# Check system resources
python -c "import psutil; print(f'CPU: {psutil.cpu_percent()}%, RAM: {psutil.virtual_memory().percent}%')"
```

#### ❌ Memory issues
**Symptoms:**
- System running out of memory
- Browser tabs crashing
- Scripts failing with memory errors

**Solutions:**
1. **Close unnecessary browser tabs**
2. **Restart browser**
3. **Check available system memory**
4. **Reduce dashboard refresh rates**

### 5. Network and Connectivity Issues

#### ❌ "Connection timeout" errors
**Symptoms:**
- Requests timing out
- Intermittent connectivity
- Network errors in logs

**Solutions:**
```bash
# Test basic connectivity
ping openrouter.ai
curl -I https://openrouter.ai

# Check DNS resolution
nslookup openrouter.ai

# Try with different DNS
# 8.8.8.8 (Google)
# 1.1.1.1 (Cloudflare)
```

#### ❌ Corporate firewall blocking
**Symptoms:**
- Requests blocked by firewall
- SSL certificate errors
- Proxy authentication required

**Solutions:**
1. **Configure proxy settings**
2. **Add OpenRouter domains to whitelist**
3. **Contact IT administrator**

```bash
# Configure proxy (if needed)
export https_proxy=http://proxy.company.com:8080
export http_proxy=http://proxy.company.com:8080

# OpenRouter domains to whitelist:
# - openrouter.ai
# - api.openrouter.ai
```

### 6. Installation Issues

#### ❌ "Command not found" errors
**Symptoms:**
- `python` command not found
- `node` command not found
- `git` command not found

**Solutions:**

**Python:**
```bash
# Windows: Download from python.org
# macOS: brew install python
# Ubuntu: sudo apt install python3 python3-pip
# Verify: python --version (should be 3.8+)
```

**Node.js:**
```bash
# Windows: Download from nodejs.org
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
# Verify: node --version (should be 18+)
```

**Git:**
```bash
# Windows: Download from git-scm.com
# macOS: brew install git
# Ubuntu: sudo apt install git
# Verify: git --version
```

#### ❌ Permission errors during installation
**Symptoms:**
- "Permission denied" errors
- Unable to create directories
- Cannot write to system directories

**Solutions:**
```bash
# Linux/macOS - Use sudo for global installs
sudo npm install -g @anthropic-ai/mcp-server-filesystem

# Windows - Run as Administrator
# Right-click Command Prompt -> "Run as administrator"

# Or install locally instead of globally
npm install @anthropic-ai/mcp-server-filesystem
```

## 🔧 Advanced Troubleshooting

### Debug Mode
Enable detailed logging for complex issues:

```bash
# Enable debug mode
export DEBUG=true
export LOG_LEVEL=debug

# Run with verbose output
python scripts/system_status.py --verbose
python scripts/test_new_key.py --debug
```

### Log Analysis
Check system logs for detailed error information:

```bash
# Windows Event Viewer
eventvwr.msc

# Linux system logs
tail -f /var/log/syslog
journalctl -f

# macOS system logs
log stream --predicate 'process == "claude"'
```

### Network Debugging
Detailed network troubleshooting:

```bash
# Trace network path
traceroute openrouter.ai  # Linux/macOS
tracert openrouter.ai     # Windows

# Check open connections
netstat -an | grep 443
lsof -i :443  # macOS/Linux

# Monitor network traffic
tcpdump -i any host openrouter.ai  # Linux
```

### Performance Profiling
Profile system performance:

```python
# Add to scripts for performance profiling
import cProfile
import pstats

def profile_function():
    pr = cProfile.Profile()
    pr.enable()
    
    # Your code here
    
    pr.disable()
    stats = pstats.Stats(pr)
    stats.sort_stats('cumulative').print_stats(10)
```

## 🆘 Emergency Procedures

### System Recovery
If system is completely broken:

```bash
# 1. Emergency API key setup
python scripts/emergency_openrouter_setup.py

# 2. Reset all configurations
rm -rf config/
git checkout -- config/

# 3. Reinstall dependencies
pip install -r requirements.txt
npm install

# 4. Run full system test
python scripts/system_status.py
```

### Data Backup
Before making changes:

```bash
# Backup current configuration
cp -r config/ config_backup_$(date +%Y%m%d)/

# Export current settings
python scripts/export_settings.py > settings_backup.json

# Create system snapshot
git commit -am "Backup before troubleshooting"
```

### Factory Reset
Complete system reset:

```bash
# 1. Backup important data
cp config/openrouter_free_config.json ~/openrouter_backup.json

# 2. Clean installation
rm -rf node_modules/
rm -rf __pycache__/
rm -rf .claude/

# 3. Reinstall everything
npm install
pip install -r requirements.txt
python scripts/setup_system.py
```

## 📞 Getting Help

### Self-Help Resources
1. **Run system status**: `python scripts/system_status.py`
2. **Check documentation**: `docs/` directory
3. **Review logs**: Look for error messages
4. **Test components**: Use individual test scripts

### Community Support
1. **GitHub Issues**: Report bugs and get help
2. **Discussions**: Ask questions and share solutions
3. **Wiki**: Community-contributed solutions
4. **Stack Overflow**: Tag questions with relevant tags

### Professional Support
For enterprise deployments:
1. **Priority Support**: Guaranteed response times
2. **Custom Integration**: Professional services
3. **Training**: Team training and onboarding
4. **Consulting**: Architecture and optimization

## 📋 Troubleshooting Checklist

Before asking for help, verify:

- [ ] **System Status**: `python scripts/system_status.py` passes
- [ ] **API Key**: Valid and not exceeded
- [ ] **Dependencies**: All required packages installed
- [ ] **Network**: Can reach openrouter.ai
- [ ] **Permissions**: Files readable/writable as needed
- [ ] **Browser**: Latest version, cache cleared
- [ ] **Environment**: Variables set correctly
- [ ] **Logs**: Checked for specific error messages

## 🎯 Prevention Tips

### Regular Maintenance
1. **Weekly**: Run system status checks
2. **Monthly**: Update dependencies
3. **Quarterly**: Review and optimize configuration
4. **Annually**: Full system audit and upgrade

### Monitoring
1. **Set up alerts** for API key limits
2. **Monitor system resources** regularly
3. **Track response times** and performance
4. **Review error logs** weekly

### Best Practices
1. **Keep backups** of working configurations
2. **Test changes** in development environment first
3. **Document customizations** and changes
4. **Train team members** on troubleshooting basics

---

**🔧 When in doubt, start with `python scripts/system_status.py` - it will identify most common issues automatically!**