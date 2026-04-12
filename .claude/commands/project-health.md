Analyze a project directory for code quality, structure, dependencies, and generate a health report.

## Configuration

Read the analysis config from: .claude/skills/project-health/config/rules.json (defines thresholds and what to check).
Read the ignore patterns from: .claude/skills/project-health/config/ignore-patterns.json (files/dirs to skip).

## Steps

1. **Structure Analysis**: Check project structure, look for standard files (README, LICENSE, .gitignore, CI config, tests).

2. **Dependency Health**: Run the dependency checker script:
   ```bash
   bash .claude/skills/project-health/scripts/check-deps.sh "$ARGUMENTS"
   ```

3. **Code Stats**: Run the stats collector:
   ```bash
   bash .claude/skills/project-health/scripts/collect-stats.sh "$ARGUMENTS"
   ```

4. **Quality Checks**: Read and evaluate each item in .claude/skills/project-health/reference/quality-checklist.md

5. **Generate Report**: Format the output using the template structure defined in .claude/skills/project-health/templates/report-template.md

## Output

Present the health report with:
- An overall health score (0-100)
- Category breakdowns with pass/warn/fail indicators
- Specific actionable recommendations
- A summary table at the top

If no path argument is given, analyze the current working directory.
