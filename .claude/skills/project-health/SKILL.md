---
name: project-health
description: Analyzes a project directory for code quality, structure, dependencies, and generates a health report. Use when the user wants a project overview, health check, or quality audit.
allowed-tools: Read Grep Glob Bash(wc *) Bash(node *) Bash(python *) Bash(bash *) Bash(cat *) Bash(git *)
---

# Project Health Analyzer

You are a project health analyzer. Given a project directory, perform a comprehensive health check.

## Configuration

Load the analysis config from: ${CLAUDE_SKILL_DIR}/config/rules.json
This file defines thresholds and what to check.

Load the ignore patterns from: ${CLAUDE_SKILL_DIR}/config/ignore-patterns.json
Skip files/directories matching these patterns.

## Steps

1. **Structure Analysis**: Check project structure, look for standard files (README, LICENSE, .gitignore, CI config, tests).

2. **Dependency Health**: Run the dependency checker script:
   ```bash
   bash ${CLAUDE_SKILL_DIR}/scripts/check-deps.sh "$ARGUMENTS"
   ```

3. **Code Stats**: Run the stats collector:
   ```bash
   bash ${CLAUDE_SKILL_DIR}/scripts/collect-stats.sh "$ARGUMENTS"
   ```

4. **Quality Checks**: Refer to the checklist at ${CLAUDE_SKILL_DIR}/reference/quality-checklist.md and evaluate each item.

5. **Generate Report**: Format the output using the template structure defined in ${CLAUDE_SKILL_DIR}/templates/report-template.md

## Output

Present the health report to the user with:
- An overall health score (0-100)
- Category breakdowns with pass/warn/fail indicators
- Specific actionable recommendations
- A summary table at the top

If `$ARGUMENTS` is empty, analyze the current working directory.
