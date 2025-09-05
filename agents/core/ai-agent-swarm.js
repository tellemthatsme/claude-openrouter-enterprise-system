/**
 * 🧠 AI Agent Swarm System
 * Coordinated multi-agent analysis using OpenRouter + Grok
 * Built for Technical Excellence & Scale
 */

class AIAgentSwarm {
    constructor(openRouterWrapper, config = {}) {
        this.wrapper = openRouterWrapper;
        this.config = {
            maxConcurrentAgents: config.maxConcurrentAgents || 6,
            taskTimeout: config.taskTimeout || 120000, // 2 minutes
            retryAttempts: config.retryAttempts || 2,
            coordinationModel: config.coordinationModel || 'x-ai/grok-code-fast-1',
            ...config
        };
        
        this.agents = new Map();
        this.activeTasks = new Map();
        this.swarmMetrics = {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            averageTaskTime: 0,
            agentEfficiency: {}
        };
        
        this.initializeAgents();
    }

    initializeAgents() {
        // Specialized agents for different analysis types
        const agentDefinitions = {
            'architect': {
                name: 'Architecture Analyst',
                model: 'x-ai/grok-code-fast-1',
                specialization: 'system-architecture',
                capabilities: ['architecture-analysis', 'design-patterns', 'scalability-assessment'],
                prompt: 'You are an expert software architect specializing in system design analysis.'
            },
            'security': {
                name: 'Security Auditor',
                model: 'deepseek/deepseek-chat-v3.1:free',
                specialization: 'security-analysis',
                capabilities: ['vulnerability-detection', 'security-patterns', 'compliance-check'],
                prompt: 'You are a cybersecurity expert specializing in code security analysis.'
            },
            'performance': {
                name: 'Performance Optimizer',
                model: 'qwen/qwen3-30b-a3b-thinking-2507',
                specialization: 'performance-analysis',
                capabilities: ['performance-optimization', 'bottleneck-detection', 'scalability'],
                prompt: 'You are a performance optimization expert focusing on code efficiency.'
            },
            'quality': {
                name: 'Code Quality Assessor',
                model: 'openai/gpt-oss-120b:free',
                specialization: 'code-quality',
                capabilities: ['code-review', 'best-practices', 'maintainability'],
                prompt: 'You are a code quality expert focusing on maintainability and best practices.'
            },
            'testing': {
                name: 'Test Engineer',
                model: 'x-ai/grok-code-fast-1',
                specialization: 'test-generation',
                capabilities: ['test-design', 'coverage-analysis', 'test-strategy'],
                prompt: 'You are a test automation expert specializing in comprehensive test strategies.'
            },
            'documentation': {
                name: 'Documentation Specialist',
                model: 'google/gemini-2.5-flash-image-preview:free',
                specialization: 'documentation',
                capabilities: ['technical-writing', 'api-documentation', 'user-guides'],
                prompt: 'You are a technical writing expert creating clear, comprehensive documentation.'
            }
        };

        Object.entries(agentDefinitions).forEach(([id, definition]) => {
            this.agents.set(id, {
                id,
                ...definition,
                status: 'idle',
                tasksCompleted: 0,
                averageResponseTime: 0,
                successRate: 100,
                lastActive: null
            });
            
            this.swarmMetrics.agentEfficiency[id] = {
                tasksAssigned: 0,
                tasksCompleted: 0,
                averageTime: 0,
                successRate: 100
            };
        });

        console.log(`🧠 Initialized swarm with ${this.agents.size} specialized agents`);
    }

    /**
     * Coordinate swarm analysis of a repository
     */
    async analyzeRepositorySwarm(repository, analysisTypes = ['comprehensive']) {
        console.log(`🚀 Starting swarm analysis of ${repository.owner}/${repository.repo}`);
        
        const swarmTasks = this.createSwarmTasks(repository, analysisTypes);
        const results = await this.executeSwarmTasks(swarmTasks);
        
        const coordinatedResult = await this.coordinateResults(results, repository);
        
        this.updateSwarmMetrics(results);
        
        return {
            repository: `${repository.owner}/${repository.repo}`,
            swarmAnalysis: coordinatedResult,
            individualResults: results,
            swarmMetrics: this.getSwarmMetrics(),
            timestamp: new Date()
        };
    }

    /**
     * Create specialized tasks for different agents
     */
    createSwarmTasks(repository, analysisTypes) {
        const tasks = [];
        
        // Repository overview task
        if (analysisTypes.includes('comprehensive') || analysisTypes.includes('architecture')) {
            tasks.push({
                id: `arch-${Date.now()}`,
                agentId: 'architect',
                type: 'architecture-analysis',
                repository,
                priority: 'high',
                description: 'Analyze system architecture and design patterns'
            });
        }

        // Security analysis task
        if (analysisTypes.includes('comprehensive') || analysisTypes.includes('security')) {
            tasks.push({
                id: `sec-${Date.now()}`,
                agentId: 'security',
                type: 'security-analysis',
                repository,
                priority: 'high',
                description: 'Comprehensive security vulnerability assessment'
            });
        }

        // Performance analysis task
        if (analysisTypes.includes('comprehensive') || analysisTypes.includes('performance')) {
            tasks.push({
                id: `perf-${Date.now()}`,
                agentId: 'performance',
                type: 'performance-analysis',
                repository,
                priority: 'medium',
                description: 'Performance bottleneck identification and optimization'
            });
        }

        // Code quality task
        if (analysisTypes.includes('comprehensive') || analysisTypes.includes('quality')) {
            tasks.push({
                id: `qual-${Date.now()}`,
                agentId: 'quality',
                type: 'quality-analysis',
                repository,
                priority: 'medium',
                description: 'Code quality assessment and best practices review'
            });
        }

        // Testing strategy task
        if (analysisTypes.includes('comprehensive') || analysisTypes.includes('testing')) {
            tasks.push({
                id: `test-${Date.now()}`,
                agentId: 'testing',
                type: 'testing-analysis',
                repository,
                priority: 'low',
                description: 'Test coverage analysis and strategy recommendations'
            });
        }

        // Documentation task
        if (analysisTypes.includes('comprehensive') || analysisTypes.includes('documentation')) {
            tasks.push({
                id: `doc-${Date.now()}`,
                agentId: 'documentation',
                type: 'documentation-analysis',
                repository,
                priority: 'low',
                description: 'Documentation completeness and improvement suggestions'
            });
        }

        return tasks;
    }

    /**
     * Execute tasks across the swarm in parallel
     */
    async executeSwarmTasks(tasks) {
        console.log(`⚡ Executing ${tasks.length} tasks across agent swarm`);
        
        const results = new Map();
        const activeTasks = [];
        
        // Sort tasks by priority
        tasks.sort((a, b) => {
            const priority = { high: 3, medium: 2, low: 1 };
            return priority[b.priority] - priority[a.priority];
        });

        // Execute tasks with concurrency control
        for (const task of tasks) {
            if (activeTasks.length >= this.config.maxConcurrentAgents) {
                // Wait for a task to complete
                const completedTask = await Promise.race(activeTasks);
                const index = activeTasks.findIndex(t => t.id === completedTask.id);
                activeTasks.splice(index, 1);
            }

            // Start new task
            const taskPromise = this.executeAgentTask(task);
            taskPromise.id = task.id;
            activeTasks.push(taskPromise);
        }

        // Wait for all remaining tasks to complete
        const finalResults = await Promise.allSettled(activeTasks);
        
        finalResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                results.set(result.value.taskId, result.value);
            } else {
                console.error(`Task ${tasks[index]?.id} failed:`, result.reason);
            }
        });

        return results;
    }

    /**
     * Execute a single agent task
     */
    async executeAgentTask(task) {
        const agent = this.agents.get(task.agentId);
        if (!agent) {
            throw new Error(`Agent ${task.agentId} not found`);
        }

        const startTime = Date.now();
        agent.status = 'active';
        agent.lastActive = new Date();

        try {
            const prompt = this.buildAgentPrompt(agent, task);
            
            const result = await Promise.race([
                this.wrapper.chat([{ role: 'user', content: prompt }], {
                    model: agent.model,
                    reasoning: true,
                    max_tokens: 2000,
                    temperature: 0.1
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Task timeout')), this.config.taskTimeout)
                )
            ]);

            const executionTime = Date.now() - startTime;
            
            // Update agent metrics
            agent.tasksCompleted++;
            agent.averageResponseTime = Math.round((agent.averageResponseTime + executionTime) / 2);
            agent.status = 'idle';

            this.swarmMetrics.agentEfficiency[task.agentId].tasksCompleted++;
            this.swarmMetrics.agentEfficiency[task.agentId].averageTime = 
                Math.round((this.swarmMetrics.agentEfficiency[task.agentId].averageTime + executionTime) / 2);

            return {
                taskId: task.id,
                agentId: task.agentId,
                type: task.type,
                success: result.success,
                result: result.success ? result.data.choices[0].message.content : null,
                reasoning: result.success ? result.data.choices[0].message.reasoning : null,
                error: result.success ? null : result.error,
                executionTime,
                timestamp: new Date()
            };

        } catch (error) {
            agent.status = 'idle';
            this.swarmMetrics.agentEfficiency[task.agentId].tasksAssigned++;
            
            return {
                taskId: task.id,
                agentId: task.agentId,
                type: task.type,
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime,
                timestamp: new Date()
            };
        }
    }

    /**
     * Build specialized prompt for each agent
     */
    buildAgentPrompt(agent, task) {
        const repository = task.repository;
        const repoContext = this.buildRepositoryContext(repository);
        
        const specializationPrompts = {
            'architecture-analysis': `${agent.prompt}

Analyze the architecture of this repository:

${repoContext}

Focus on:
- Overall system architecture and design patterns
- Component relationships and dependencies
- Scalability considerations and bottlenecks
- Architectural strengths and weaknesses
- Improvement recommendations for system design

Provide a detailed architectural assessment with specific recommendations.`,

            'security-analysis': `${agent.prompt}

Perform a comprehensive security analysis of this repository:

${repoContext}

Focus on:
- Authentication and authorization mechanisms
- Input validation and sanitization
- Potential injection vulnerabilities
- Sensitive data handling
- Security misconfigurations
- Dependency vulnerabilities

Provide specific security findings with remediation steps.`,

            'performance-analysis': `${agent.prompt}

Analyze this repository for performance issues and optimization opportunities:

${repoContext}

Focus on:
- Performance bottlenecks and inefficiencies
- Resource utilization patterns
- Scalability limitations
- Database query optimization
- Caching opportunities
- Algorithm improvements

Provide specific performance recommendations with implementation guidance.`,

            'quality-analysis': `${agent.prompt}

Assess the code quality and maintainability of this repository:

${repoContext}

Focus on:
- Code organization and structure
- Adherence to best practices
- Code complexity and readability
- Technical debt indicators
- Maintainability concerns
- Refactoring opportunities

Provide specific code quality improvements with examples.`,

            'testing-analysis': `${agent.prompt}

Analyze the testing strategy and coverage of this repository:

${repoContext}

Focus on:
- Current test coverage and quality
- Testing strategy effectiveness
- Missing test scenarios
- Test automation opportunities
- Testing framework recommendations
- Quality assurance processes

Provide comprehensive testing improvement recommendations.`,

            'documentation-analysis': `${agent.prompt}

Evaluate the documentation completeness and quality of this repository:

${repoContext}

Focus on:
- Documentation coverage and accuracy
- API documentation completeness
- User guide effectiveness
- Code comment quality
- Setup and deployment instructions
- Missing documentation areas

Provide specific documentation improvement recommendations.`
        };

        return specializationPrompts[task.type] || `${agent.prompt}\n\nAnalyze this repository:\n\n${repoContext}`;
    }

    /**
     * Coordinate and synthesize results from all agents
     */
    async coordinateResults(results, repository) {
        const successful = Array.from(results.values()).filter(r => r.success);
        
        if (successful.length === 0) {
            return {
                summary: 'Swarm analysis failed - no agents completed successfully',
                recommendations: [],
                confidence: 'low'
            };
        }

        // Combine all results for coordination
        const combinedAnalysis = successful.map(r => `**${r.type.toUpperCase()}**:\n${r.result}`).join('\n\n');
        
        const coordinationPrompt = `As the swarm coordinator, synthesize these specialized analyses into a cohesive assessment:

Repository: ${repository.owner}/${repository.repo}

Individual Agent Results:
${combinedAnalysis}

Provide:
1. Executive Summary of overall repository health
2. Top 5 Priority Recommendations (ranked by impact)
3. Risk Assessment (high/medium/low)
4. Implementation Roadmap
5. Confidence Level in Analysis

Focus on actionable insights that combine multiple agent perspectives.`;

        try {
            const coordination = await this.wrapper.chat([{
                role: 'user',
                content: coordinationPrompt
            }], {
                model: this.config.coordinationModel,
                reasoning: true,
                max_tokens: 1500,
                temperature: 0.2
            });

            if (coordination.success) {
                return {
                    summary: coordination.data.choices[0].message.content,
                    reasoning: coordination.data.choices[0].message.reasoning,
                    agentContributions: successful.length,
                    analysisTypes: successful.map(r => r.type),
                    confidence: successful.length >= 4 ? 'high' : successful.length >= 2 ? 'medium' : 'low',
                    timestamp: new Date()
                };
            }
        } catch (error) {
            console.error('Coordination failed:', error);
        }

        // Fallback: simple aggregation
        return {
            summary: 'Multiple specialized analyses completed. Individual agent results available.',
            agentContributions: successful.length,
            analysisTypes: successful.map(r => r.type),
            confidence: 'medium',
            note: 'Coordination synthesis failed, but individual analyses succeeded'
        };
    }

    /**
     * Generate dependency analysis and advanced intelligence
     */
    async generateDependencyGraph(repository) {
        const dependencyTask = {
            id: `dep-${Date.now()}`,
            agentId: 'architect',
            type: 'dependency-analysis',
            repository,
            priority: 'high',
            description: 'Generate comprehensive dependency graph and analysis'
        };

        const agent = this.agents.get('architect');
        const prompt = `${agent.prompt}

Analyze the dependencies and create a comprehensive dependency graph for this repository:

${this.buildRepositoryContext(repository)}

Provide:
1. Dependency Graph Visualization (in text/ASCII format)
2. Circular Dependency Detection
3. Unused Dependency Identification
4. Version Conflict Analysis
5. Security Risk Assessment of Dependencies
6. Dependency Update Recommendations
7. Architectural Impact Analysis
8. Cross-file Reference Analysis
9. Module Coupling Assessment
10. Import/Export Pattern Analysis

Format as structured analysis with clear sections and actionable insights.`;

        try {
            const result = await this.wrapper.chat([{ role: 'user', content: prompt }], {
                model: agent.model,
                reasoning: true,
                max_tokens: 3000,
                temperature: 0.1
            });

            if (result.success) {
                return {
                    repository: `${repository.owner}/${repository.repo}`,
                    dependencyGraph: result.data.choices[0].message.content,
                    reasoning: result.data.choices[0].message.reasoning,
                    generatedAt: new Date(),
                    metrics: this.calculateDependencyMetrics(repository),
                    complexity: this.assessDependencyComplexity(repository)
                };
            }
        } catch (error) {
            return {
                error: `Dependency analysis failed: ${error.message}`,
                repository: `${repository.owner}/${repository.repo}`
            };
        }
    }

    /**
     * Calculate advanced dependency metrics
     */
    calculateDependencyMetrics(repository) {
        const files = repository.files || [];
        let totalImports = 0;
        let totalExports = 0;
        let circularRefs = 0;
        let externalDeps = 0;
        
        const importPatterns = [
            /import\s+.*\s+from\s+['"]([^'"]+)['"]/g,
            /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
            /from\s+['"]([^'"]+)['"]/g,
            /#include\s*<([^>]+)>/g,
            /#include\s*"([^"]+)"/g
        ];

        files.forEach(file => {
            if (file.content) {
                importPatterns.forEach(pattern => {
                    const matches = [...file.content.matchAll(pattern)];
                    totalImports += matches.length;
                    
                    matches.forEach(match => {
                        const depPath = match[1];
                        if (depPath.startsWith('.') || depPath.startsWith('/')) {
                            // Local dependency
                        } else {
                            externalDeps++;
                        }
                    });
                });
            }
        });

        return {
            totalFiles: files.length,
            totalImports,
            totalExports,
            externalDependencies: externalDeps,
            avgImportsPerFile: files.length > 0 ? Math.round(totalImports / files.length * 100) / 100 : 0,
            dependencyDensity: files.length > 0 ? Math.round((totalImports / files.length) * 100) : 0
        };
    }

    /**
     * Assess dependency complexity
     */
    assessDependencyComplexity(repository) {
        const metrics = this.calculateDependencyMetrics(repository);
        let complexity = 'low';
        let score = 0;

        if (metrics.externalDependencies > 50) score += 3;
        else if (metrics.externalDependencies > 20) score += 2;
        else if (metrics.externalDependencies > 5) score += 1;

        if (metrics.avgImportsPerFile > 10) score += 3;
        else if (metrics.avgImportsPerFile > 5) score += 2;
        else if (metrics.avgImportsPerFile > 2) score += 1;

        if (score >= 5) complexity = 'high';
        else if (score >= 3) complexity = 'medium';

        return {
            level: complexity,
            score,
            factors: {
                externalDependencies: metrics.externalDependencies,
                avgImportsPerFile: metrics.avgImportsPerFile,
                totalFiles: metrics.totalFiles
            }
        };
    }

    /**
     * Advanced code intelligence with cross-file analysis
     */
    async performAdvancedIntelligence(repository, options = {}) {
        const intelligenceTasks = [];

        // Cross-file pattern detection
        intelligenceTasks.push(this.executeAdvancedTask({
            id: `pattern-${Date.now()}`,
            agentId: 'architect',
            type: 'pattern-detection',
            repository,
            priority: 'high',
            description: 'Detect patterns and relationships across multiple files',
            specialPrompt: this.buildPatternDetectionPrompt(repository)
        }));

        // Technical debt analysis with metrics
        intelligenceTasks.push(this.executeAdvancedTask({
            id: `debt-${Date.now()}`,
            agentId: 'quality',
            type: 'technical-debt',
            repository,
            priority: 'medium',
            description: 'Comprehensive technical debt analysis with metrics',
            specialPrompt: this.buildTechnicalDebtPrompt(repository)
        }));

        // Architecture evolution recommendations
        intelligenceTasks.push(this.executeAdvancedTask({
            id: `evolution-${Date.now()}`,
            agentId: 'architect',
            type: 'architecture-evolution',
            repository,
            priority: 'medium',
            description: 'Strategic architecture evolution recommendations',
            specialPrompt: this.buildArchitectureEvolutionPrompt(repository)
        }));

        // Code duplication and refactoring opportunities
        intelligenceTasks.push(this.executeAdvancedTask({
            id: `refactor-${Date.now()}`,
            agentId: 'quality',
            type: 'refactoring-analysis',
            repository,
            priority: 'low',
            description: 'Identify refactoring opportunities and code duplication',
            specialPrompt: this.buildRefactoringPrompt(repository)
        }));

        const results = await Promise.allSettled(intelligenceTasks);
        const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);

        // Generate intelligence summary
        const intelligenceSummary = await this.generateIntelligenceSummary(successful, repository);

        return {
            repository: `${repository.owner}/${repository.repo}`,
            intelligenceAnalysis: successful,
            summary: intelligenceSummary,
            metrics: this.calculateIntelligenceMetrics(successful),
            timestamp: new Date(),
            confidence: successful.length >= 3 ? 'high' : successful.length >= 2 ? 'medium' : 'low'
        };
    }

    /**
     * Execute advanced intelligence task with specialized prompting
     */
    async executeAdvancedTask(task) {
        const agent = this.agents.get(task.agentId);
        if (!agent) {
            throw new Error(`Agent ${task.agentId} not found`);
        }

        const startTime = Date.now();
        agent.status = 'active';
        agent.lastActive = new Date();

        try {
            const prompt = task.specialPrompt || this.buildAgentPrompt(agent, task);
            
            const result = await Promise.race([
                this.wrapper.chat([{ role: 'user', content: prompt }], {
                    model: agent.model,
                    reasoning: true,
                    max_tokens: 3000,
                    temperature: 0.1
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Task timeout')), this.config.taskTimeout)
                )
            ]);

            const executionTime = Date.now() - startTime;
            
            // Update agent metrics
            agent.tasksCompleted++;
            agent.averageResponseTime = Math.round((agent.averageResponseTime + executionTime) / 2);
            agent.status = 'idle';

            return {
                taskId: task.id,
                agentId: task.agentId,
                type: task.type,
                success: result.success,
                result: result.success ? result.data.choices[0].message.content : null,
                reasoning: result.success ? result.data.choices[0].message.reasoning : null,
                error: result.success ? null : result.error,
                executionTime,
                timestamp: new Date()
            };

        } catch (error) {
            agent.status = 'idle';
            return {
                taskId: task.id,
                agentId: task.agentId,
                type: task.type,
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime,
                timestamp: new Date()
            };
        }
    }

    /**
     * Build specialized prompts for advanced intelligence
     */
    buildPatternDetectionPrompt(repository) {
        return `You are an expert code analyst specializing in cross-file pattern detection and architectural insights.

Analyze this repository for patterns, relationships, and architectural insights:

${this.buildRepositoryContext(repository)}

Focus on:
1. **Design Patterns**: Identify implemented design patterns (MVC, Observer, Factory, etc.)
2. **Cross-file Relationships**: Map how components interact across files
3. **Data Flow Patterns**: Trace data flow through the application
4. **Common Abstractions**: Identify reusable abstractions and utilities
5. **Architectural Layers**: Detect layered architecture patterns
6. **Code Conventions**: Analyze consistency in naming, structure, organization
7. **Integration Patterns**: How external services/APIs are integrated
8. **Error Handling Patterns**: Common error handling approaches

Provide specific examples and actionable recommendations for pattern improvements.`;
    }

    buildTechnicalDebtPrompt(repository) {
        return `You are a technical debt analysis expert focusing on long-term code maintainability.

Analyze technical debt in this repository:

${this.buildRepositoryContext(repository)}

Focus on:
1. **Code Smells**: Identify specific code smells with locations
2. **Complexity Metrics**: Assess cyclomatic complexity and nesting levels
3. **Maintenance Burden**: Code sections requiring frequent changes
4. **Legacy Code**: Outdated patterns or deprecated practices
5. **Documentation Debt**: Missing or outdated documentation
6. **Test Debt**: Insufficient test coverage areas
7. **Refactoring Priority**: Rank areas by refactoring urgency
8. **Technical Risk**: Assess risk of delaying debt resolution

Provide quantified debt metrics and prioritized action plan.`;
    }

    buildArchitectureEvolutionPrompt(repository) {
        return `You are a software architect specializing in system evolution and modernization strategies.

Analyze this repository for architecture evolution opportunities:

${this.buildRepositoryContext(repository)}

Focus on:
1. **Current Architecture Assessment**: Strengths and limitations
2. **Scalability Bottlenecks**: Areas limiting growth
3. **Modernization Opportunities**: Technology stack improvements
4. **Microservices Potential**: Decomposition opportunities
5. **Performance Optimizations**: Architecture-level improvements
6. **Cloud-Native Adaptations**: Cloud architecture patterns
7. **API Design Evolution**: RESTful/GraphQL improvements
8. **Future-Proofing**: Preparing for expected growth

Provide strategic evolution roadmap with implementation phases.`;
    }

    buildRefactoringPrompt(repository) {
        return `You are a code quality expert specializing in refactoring and code optimization.

Analyze this repository for refactoring opportunities:

${this.buildRepositoryContext(repository)}

Focus on:
1. **Code Duplication**: Identify duplicate code blocks for extraction
2. **Long Methods/Classes**: Oversized components needing breakdown
3. **Extract Patterns**: Common code that should be abstracted
4. **Simplification Opportunities**: Complex code that can be simplified
5. **Performance Refactoring**: Code optimizations for better performance
6. **Readability Improvements**: Making code more self-documenting
7. **Interface Improvements**: Better API designs
8. **Test Refactoring**: Improving test structure and coverage

Provide specific refactoring recommendations with code examples.`;
    }

    /**
     * Generate comprehensive intelligence summary
     */
    async generateIntelligenceSummary(analysisResults, repository) {
        if (analysisResults.length === 0) {
            return { error: 'No analysis results to summarize' };
        }

        const combinedInsights = analysisResults.filter(r => r.success)
            .map(r => `**${r.type.toUpperCase()}**:\n${r.result}`)
            .join('\n\n');

        const summaryPrompt = `Synthesize these advanced code intelligence analyses into strategic insights:

Repository: ${repository.owner}/${repository.repo}

Analysis Results:
${combinedInsights}

Provide:
1. **Executive Intelligence Summary** - Key strategic insights
2. **Priority Action Items** - Top 5 recommended actions
3. **Risk Assessment** - Technical risks and mitigation strategies  
4. **Architecture Recommendations** - Strategic architecture guidance
5. **Implementation Roadmap** - Phased approach to improvements
6. **Success Metrics** - How to measure improvement progress

Focus on actionable insights that combine multiple analysis perspectives.`;

        try {
            const summary = await this.wrapper.chat([{
                role: 'user',
                content: summaryPrompt
            }], {
                model: this.config.coordinationModel,
                reasoning: true,
                max_tokens: 2000,
                temperature: 0.2
            });

            if (summary.success) {
                return {
                    executiveSummary: summary.data.choices[0].message.content,
                    reasoning: summary.data.choices[0].message.reasoning,
                    analysisCount: analysisResults.length,
                    timestamp: new Date()
                };
            }
        } catch (error) {
            console.error('Intelligence summary failed:', error);
            return { 
                error: 'Summary generation failed',
                fallbackSummary: 'Advanced intelligence analysis completed with multiple insights available.'
            };
        }
    }

    /**
     * Calculate intelligence analysis metrics
     */
    calculateIntelligenceMetrics(results) {
        const successful = results.filter(r => r.success);
        const totalTime = successful.reduce((sum, r) => sum + r.executionTime, 0);

        return {
            totalAnalyses: results.length,
            successfulAnalyses: successful.length,
            successRate: Math.round((successful.length / results.length) * 100),
            averageAnalysisTime: successful.length > 0 ? Math.round(totalTime / successful.length) : 0,
            analysisTypes: successful.map(r => r.type),
            totalProcessingTime: totalTime
        };
    }

    // Helper methods

    buildRepositoryContext(repository) {
        return `Repository: ${repository.owner}/${repository.repo}
Description: ${repository.info?.description || 'No description'}
Primary Language: ${repository.info?.language || 'Mixed'}
File Count: ${repository.files?.length || 0}
Repository Size: ${repository.stats ? Math.round(repository.stats.totalSize / 1024) + 'KB' : 'Unknown'}

Languages: ${repository.stats ? Object.keys(repository.stats.languages).join(', ') : 'Unknown'}

Key Files:
${repository.files ? repository.files.filter(f => 
    f.path.includes('README') || 
    f.path.includes('package.json') || 
    f.path.includes('main.') || 
    f.path.includes('index.')
).slice(0, 3).map(f => `- ${f.path}`).join('\n') : 'No key files identified'}

Repository Statistics: ${JSON.stringify(repository.stats, null, 2)}`;
    }

    updateSwarmMetrics(results) {
        this.swarmMetrics.totalTasks += results.size;
        this.swarmMetrics.completedTasks += Array.from(results.values()).filter(r => r.success).length;
        this.swarmMetrics.failedTasks += Array.from(results.values()).filter(r => !r.success).length;
        
        const completedTasks = Array.from(results.values()).filter(r => r.success);
        if (completedTasks.length > 0) {
            const totalTime = completedTasks.reduce((sum, task) => sum + task.executionTime, 0);
            this.swarmMetrics.averageTaskTime = Math.round(totalTime / completedTasks.length);
        }
    }

    getSwarmMetrics() {
        return {
            ...this.swarmMetrics,
            agents: Object.fromEntries(this.agents),
            activeAgents: Array.from(this.agents.values()).filter(a => a.status === 'active').length,
            totalAgents: this.agents.size,
            swarmEfficiency: this.calculateSwarmEfficiency()
        };
    }

    calculateSwarmEfficiency() {
        const totalTasks = this.swarmMetrics.totalTasks;
        if (totalTasks === 0) return 100;
        
        return Math.round((this.swarmMetrics.completedTasks / totalTasks) * 100);
    }

    // Public API methods

    getAvailableAgents() {
        return Array.from(this.agents.entries()).map(([id, agent]) => ({
            id,
            name: agent.name,
            specialization: agent.specialization,
            status: agent.status,
            capabilities: agent.capabilities,
            model: agent.model,
            performance: {
                tasksCompleted: agent.tasksCompleted,
                averageResponseTime: agent.averageResponseTime,
                successRate: agent.successRate
            }
        }));
    }

    async getAgentStatus(agentId) {
        const agent = this.agents.get(agentId);
        if (!agent) return null;

        return {
            ...agent,
            efficiency: this.swarmMetrics.agentEfficiency[agentId],
            currentTask: this.activeTasks.get(agentId) || null
        };
    }

    async resetSwarm() {
        // Stop all active tasks
        this.activeTasks.clear();
        
        // Reset agent states
        this.agents.forEach(agent => {
            agent.status = 'idle';
            agent.tasksCompleted = 0;
            agent.averageResponseTime = 0;
            agent.successRate = 100;
        });

        // Reset metrics
        this.swarmMetrics = {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            averageTaskTime: 0,
            agentEfficiency: {}
        };

        Object.keys(this.agents.keys()).forEach(agentId => {
            this.swarmMetrics.agentEfficiency[agentId] = {
                tasksAssigned: 0,
                tasksCompleted: 0,
                averageTime: 0,
                successRate: 100
            };
        });

        console.log('🔄 Swarm reset completed');
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAgentSwarm;
}

if (typeof window !== 'undefined') {
    window.AIAgentSwarm = AIAgentSwarm;
}

console.log('🧠 AI Agent Swarm System initialized!');