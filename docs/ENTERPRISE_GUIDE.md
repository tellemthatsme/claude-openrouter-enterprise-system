# 🏢 Enterprise Deployment Guide

Complete guide for deploying the Claude Code + OpenRouter system in enterprise environments.

## 🎯 Enterprise Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 ENTERPRISE LAYER                        │
├─────────────────────────────────────────────────────────┤
│  Load Balancer  │  API Gateway  │  Security Layer      │
├─────────────────────────────────────────────────────────┤
│           CLAUDE CODE + OPENROUTER CORE                │
├─────────────────────────────────────────────────────────┤
│  Dashboard Hub  │  MCP Servers  │  Memory System       │
├─────────────────────────────────────────────────────────┤
│  Model Router   │  Cost Control │  Performance Monitor │
└─────────────────────────────────────────────────────────┘
```

## 📊 Enterprise Features

### Multi-Tenant Architecture
- **Isolated Environments**: Separate configs per department
- **Resource Allocation**: Fair usage distribution
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete activity tracking

### High Availability Setup
- **Redundant API Keys**: 10+ OpenRouter accounts
- **Failover Systems**: Automatic key rotation
- **Health Monitoring**: 24/7 system status
- **Disaster Recovery**: Automated backup/restore

### Enterprise Security
- **SSO Integration**: Active Directory/SAML
- **API Security**: Rate limiting and encryption
- **Data Protection**: GDPR/SOC2 compliance
- **Network Security**: VPN and firewall rules

## 🚀 Production Deployment

### Phase 1: Infrastructure Setup (Week 1)

#### 1.1 Server Requirements
```yaml
# Minimum Production Specs
CPU: 8 cores
RAM: 32GB
Storage: 500GB SSD
Network: 1Gbps
OS: Ubuntu 20.04 LTS / Windows Server 2022

# Recommended Enterprise Specs  
CPU: 16 cores
RAM: 64GB
Storage: 1TB NVMe SSD
Network: 10Gbps
OS: Ubuntu 22.04 LTS
```

#### 1.2 Environment Setup
```bash
# Production environment variables
export NODE_ENV=production
export OPENROUTER_ENVIRONMENT=enterprise
export LOG_LEVEL=info
export METRICS_ENABLED=true
export SECURITY_MODE=strict

# Multiple OpenRouter accounts for high availability
export OPENROUTER_PRIMARY_KEY=sk-or-v1-primary-key
export OPENROUTER_SECONDARY_KEY=sk-or-v1-secondary-key
export OPENROUTER_TERTIARY_KEY=sk-or-v1-tertiary-key
```

#### 1.3 Database Setup
```sql
-- PostgreSQL for enterprise logging and analytics
CREATE DATABASE claude_enterprise;
CREATE USER claude_admin WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE claude_enterprise TO claude_admin;

-- Tables for enterprise monitoring
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT NOW(),
    user_id VARCHAR(255),
    model_used VARCHAR(255),
    tokens_used INTEGER,
    cost DECIMAL(10,4),
    success BOOLEAN
);

CREATE TABLE system_metrics (
    id SERIAL PRIMARY KEY, 
    timestamp TIMESTAMP DEFAULT NOW(),
    metric_name VARCHAR(255),
    metric_value DECIMAL(15,4),
    metadata JSONB
);
```

### Phase 2: Application Deployment (Week 2)

#### 2.1 Docker Production Setup
```dockerfile
# Dockerfile.production
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM python:3.11-alpine AS python-base
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt

FROM base AS final
COPY --from=python-base /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .
EXPOSE 3000 8080
CMD ["npm", "run", "start:production"]
```

#### 2.2 Kubernetes Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claude-enterprise
  labels:
    app: claude-enterprise
spec:
  replicas: 3
  selector:
    matchLabels:
      app: claude-enterprise
  template:
    metadata:
      labels:
        app: claude-enterprise
    spec:
      containers:
      - name: claude-app
        image: claude-enterprise:latest
        ports:
        - containerPort: 3000
        env:
        - name: OPENROUTER_API_KEY
          valueFrom:
            secretKeyRef:
              name: openrouter-secrets
              key: primary-key
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi" 
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### 2.3 Load Balancer Configuration
```nginx
# nginx.conf for production load balancing
upstream claude_backend {
    least_conn;
    server app1.claude.internal:3000 weight=1 max_fails=3 fail_timeout=30s;
    server app2.claude.internal:3000 weight=1 max_fails=3 fail_timeout=30s;
    server app3.claude.internal:3000 weight=1 max_fails=3 fail_timeout=30s;
}

server {
    listen 443 ssl http2;
    server_name claude-enterprise.company.com;
    
    ssl_certificate /etc/ssl/certs/claude-enterprise.crt;
    ssl_certificate_key /etc/ssl/private/claude-enterprise.key;
    
    location / {
        proxy_pass http://claude_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Rate limiting
        limit_req zone=api burst=100 nodelay;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 300s;
    }
}
```

### Phase 3: Monitoring & Analytics (Week 3)

#### 3.1 Prometheus Metrics
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'claude-enterprise'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s
```

#### 3.2 Grafana Dashboards
```json
{
  "dashboard": {
    "title": "Claude Enterprise Metrics",
    "panels": [
      {
        "title": "API Requests per Second",
        "type": "stat",
        "targets": [{"expr": "rate(http_requests_total[1m])"}]
      },
      {
        "title": "Model Usage Distribution", 
        "type": "piechart",
        "targets": [{"expr": "sum by (model) (openrouter_requests_total)"}]
      },
      {
        "title": "Cost Tracking",
        "type": "timeseries", 
        "targets": [{"expr": "sum(openrouter_cost_total)"}]
      },
      {
        "title": "Error Rate",
        "type": "stat",
        "targets": [{"expr": "rate(http_requests_total{status=~'5..'}[5m])"}]
      }
    ]
  }
}
```

#### 3.3 Alerting Rules  
```yaml
# alerting.yml
groups:
- name: claude-enterprise
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "High error rate detected"
      
  - alert: OpenRouterKeyExhausted
    expr: openrouter_key_limit_remaining < 1000
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "OpenRouter key limit nearly exhausted"
      
  - alert: ClaudeUsageHigh
    expr: claude_tokens_used_today > 180000
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Claude usage approaching daily limit"
```

### Phase 4: Security Implementation (Week 4)

#### 4.1 API Security
```javascript
// middleware/security.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting per user
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### 4.2 Authentication & Authorization
```javascript
// auth/enterprise.js
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs');

class EnterpriseAuth {
  async authenticateUser(username, password) {
    // LDAP/Active Directory integration
    const client = ldap.createClient({
      url: process.env.LDAP_URL
    });
    
    return new Promise((resolve, reject) => {
      client.bind(`${username}@${process.env.DOMAIN}`, password, (err) => {
        if (err) {
          reject(new Error('Invalid credentials'));
        } else {
          resolve(this.generateToken(username));
        }
      });
    });
  }
  
  generateToken(username) {
    return jwt.sign(
      { username, role: this.getUserRole(username) },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
  }
  
  getUserRole(username) {
    // Role-based access control
    const adminUsers = process.env.ADMIN_USERS.split(',');
    return adminUsers.includes(username) ? 'admin' : 'user';
  }
}
```

### Phase 5: Multi-Account Management

#### 5.1 Account Pool Configuration
```json
{
  "account_pools": [
    {
      "pool_name": "production",
      "accounts": [
        {
          "key": "sk-or-v1-prod-1",
          "daily_limit": 10000,
          "priority": 1,
          "status": "active"
        },
        {
          "key": "sk-or-v1-prod-2", 
          "daily_limit": 10000,
          "priority": 2,
          "status": "active"
        }
      ],
      "rotation_strategy": "least_used",
      "failover_enabled": true
    },
    {
      "pool_name": "development",
      "accounts": [
        {
          "key": "sk-or-v1-dev-1",
          "daily_limit": 5000,
          "priority": 1,
          "status": "active"
        }
      ]
    }
  ]
}
```

#### 5.2 Intelligent Key Rotation
```javascript
// services/KeyManager.js
class EnterpriseKeyManager {
  constructor() {
    this.accounts = this.loadAccountPools();
    this.metrics = new Map();
  }
  
  async getOptimalKey(requestType = 'standard') {
    const pool = this.getPoolForRequest(requestType);
    const availableAccounts = pool.accounts.filter(acc => 
      acc.status === 'active' && 
      this.getRemainingQuota(acc.key) > 100
    );
    
    if (availableAccounts.length === 0) {
      throw new Error('No available accounts in pool');
    }
    
    // Select based on strategy
    switch (pool.rotation_strategy) {
      case 'least_used':
        return this.getLeastUsedAccount(availableAccounts);
      case 'round_robin':
        return this.getRoundRobinAccount(availableAccounts);
      case 'performance_based':
        return this.getBestPerformingAccount(availableAccounts);
      default:
        return availableAccounts[0];
    }
  }
  
  async handleKeyFailure(key, error) {
    if (error.status === 429) { // Rate limited
      this.markKeyExhausted(key);
      return this.getOptimalKey(); // Get backup key
    } else if (error.status === 403) { // Key invalid
      this.markKeyInactive(key);
      await this.alertAdministrators(`Key ${key} has been deactivated`);
      return this.getOptimalKey();
    }
    
    throw error;
  }
}
```

## 📊 Enterprise Monitoring

### Real-time Dashboards
```javascript
// dashboard/enterprise.js
const enterpriseDashboard = {
  metrics: {
    activeUsers: () => this.getActiveUserCount(),
    requestsPerMinute: () => this.getRequestRate(),
    averageResponseTime: () => this.getAverageResponseTime(),
    costPerHour: () => this.getCurrentHourCost(),
    modelUtilization: () => this.getModelUsageStats(),
    systemHealth: () => this.getSystemHealthScore()
  },
  
  alerts: {
    highUsage: 'Usage approaching 80% of daily limits',
    keyRotation: 'Automatic key rotation performed',
    systemError: 'Error rate exceeds 1% threshold',
    costAlert: 'Hourly costs exceed $10 threshold'
  },
  
  generateReport: async (timeframe) => {
    return {
      period: timeframe,
      totalRequests: await this.getTotalRequests(timeframe),
      totalCost: await this.getTotalCost(timeframe),
      averageResponseTime: await this.getAvgResponseTime(timeframe),
      topModels: await this.getTopModels(timeframe),
      userActivity: await this.getUserActivity(timeframe),
      recommendations: await this.getOptimizationRecommendations()
    };
  }
};
```

## 🔐 Compliance & Governance

### Data Privacy (GDPR/CCPA)
- **Data Minimization**: Store only necessary metadata
- **Right to Deletion**: Automated user data removal
- **Audit Trails**: Complete request logging
- **Data Encryption**: End-to-end encryption for sensitive data

### SOC2 Compliance
- **Access Controls**: Role-based permissions
- **Change Management**: Automated deployment pipelines  
- **Monitoring**: 24/7 system surveillance
- **Incident Response**: Automated alerting and escalation

### Audit Requirements
```sql
-- Audit table for compliance tracking
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT NOW(),
    user_id VARCHAR(255),
    action VARCHAR(255),
    resource VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT
);

-- Index for efficient querying
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_user ON audit_log(user_id);
```

## 💰 Enterprise Cost Management

### Budget Controls
```javascript
// Budget monitoring and enforcement
class BudgetManager {
  constructor() {
    this.dailyBudget = process.env.DAILY_BUDGET || 100;
    this.monthlyBudget = process.env.MONTHLY_BUDGET || 2000;
  }
  
  async checkBudget(requestCost) {
    const dailySpent = await this.getDailySpending();
    const monthlySpent = await this.getMonthlySpending();
    
    if (dailySpent + requestCost > this.dailyBudget) {
      throw new Error('Daily budget exceeded');
    }
    
    if (monthlySpent + requestCost > this.monthlyBudget) {
      throw new Error('Monthly budget exceeded');
    }
    
    return true;
  }
  
  async generateCostReport() {
    return {
      daily: {
        budget: this.dailyBudget,
        spent: await this.getDailySpending(),
        remaining: this.dailyBudget - await this.getDailySpending()
      },
      monthly: {
        budget: this.monthlyBudget,
        spent: await this.getMonthlySpending(), 
        remaining: this.monthlyBudget - await this.getMonthlySpending()
      },
      projectedMonthlySpend: await this.getProjectedSpend()
    };
  }
}
```

## 🚀 Scaling Strategies

### Horizontal Scaling
- **Load Balancing**: Distribute requests across multiple instances
- **Database Sharding**: Partition data for better performance
- **CDN Integration**: Cache static assets globally
- **Auto-scaling**: Automatic instance scaling based on demand

### Performance Optimization
- **Connection Pooling**: Reuse database connections
- **Caching Strategy**: Redis for frequent queries
- **Async Processing**: Queue heavy operations
- **Model Optimization**: Cache model responses when appropriate

### Disaster Recovery
```bash
#!/bin/bash
# disaster-recovery.sh

# Automated backup and recovery procedures
BACKUP_DIR="/backups/claude-enterprise"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump claude_enterprise > "${BACKUP_DIR}/db_backup_${DATE}.sql"

# Configuration backup  
tar -czf "${BACKUP_DIR}/config_backup_${DATE}.tar.gz" /opt/claude-enterprise/config/

# Upload to cloud storage
aws s3 sync $BACKUP_DIR s3://claude-enterprise-backups/

# Test recovery procedures
./test-recovery.sh

echo "Backup completed: ${DATE}"
```

## 📈 ROI Calculation

### Cost Savings Analysis
```javascript
// Calculate ROI vs traditional AI services
const roiCalculator = {
  // Traditional costs (monthly)
  openAICosts: 2000,      // $2000/month for GPT-4
  claudeCosts: 1500,      // $1500/month for Claude Pro
  geminiCosts: 800,       // $800/month for Gemini Pro
  
  // Our system costs (monthly)
  infrastructureCosts: 500, // Server costs
  maintenanceCosts: 200,    // Support and maintenance
  openRouterCosts: 0,       // Free tier usage
  
  calculateSavings: function() {
    const traditionalTotal = this.openAICosts + this.claudeCosts + this.geminiCosts;
    const ourSystemTotal = this.infrastructureCosts + this.maintenanceCosts + this.openRouterCosts;
    
    return {
      traditionalCosts: traditionalTotal,
      ourSystemCosts: ourSystemTotal,
      monthlySavings: traditionalTotal - ourSystemTotal,
      annualSavings: (traditionalTotal - ourSystemTotal) * 12,
      roi: ((traditionalTotal - ourSystemTotal) / ourSystemTotal * 100).toFixed(2) + '%'
    };
  }
};

// Example output:
// {
//   traditionalCosts: 4300,
//   ourSystemCosts: 700,
//   monthlySavings: 3600,
//   annualSavings: 43200,
//   roi: '514.29%'
// }
```

## 🎯 Success Metrics

### KPIs to Track
- **Cost Savings**: Monthly savings vs traditional AI services
- **System Uptime**: Target 99.9% availability
- **Response Times**: <2 seconds average response time
- **User Satisfaction**: >4.5/5 user rating
- **Model Success Rate**: >95% successful completions
- **Security Incidents**: 0 security breaches

### Reporting Dashboard
Enterprise executives receive automated weekly reports including:
- Cost analysis and savings achieved
- Usage patterns and productivity metrics
- System performance and reliability stats
- Security and compliance status
- Optimization recommendations

## 🎉 Launch Checklist

### Pre-Production
- [ ] Load testing completed (1000+ concurrent users)
- [ ] Security audit passed
- [ ] Backup and recovery procedures tested
- [ ] Monitoring and alerting configured
- [ ] Documentation complete
- [ ] Staff training completed

### Go-Live Day
- [ ] DNS cutover scheduled
- [ ] All stakeholders notified
- [ ] Support team on standby
- [ ] Rollback plan ready
- [ ] Success metrics baseline established

### Post-Launch (First Week)
- [ ] Monitor system performance 24/7
- [ ] Collect user feedback
- [ ] Optimize based on real usage patterns
- [ ] Generate first week report
- [ ] Plan next iteration improvements

---

**🚀 Your enterprise AI transformation starts now! Deploy with confidence using this battle-tested architecture.**