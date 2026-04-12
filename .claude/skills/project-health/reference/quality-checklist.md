# Quality Checklist

Evaluate each item and mark as PASS, WARN, or FAIL.

## Structure
- [ ] Has a clear directory structure with separation of concerns
- [ ] Entry point is easy to identify (index, main, app)
- [ ] Configuration is separated from code
- [ ] No deeply nested directories (>5 levels)

## Documentation
- [ ] README.md exists and describes the project
- [ ] README has setup/install instructions
- [ ] README has usage examples
- [ ] API endpoints or public interfaces are documented
- [ ] CONTRIBUTING guide exists (for open source)

## Code Quality
- [ ] Consistent code style (formatter/linter configured)
- [ ] No files exceeding max line threshold
- [ ] No functions exceeding max line threshold
- [ ] No hardcoded secrets or credentials
- [ ] Environment variables used for configuration
- [ ] Error handling is present and consistent

## Testing
- [ ] Test files exist
- [ ] Test runner is configured (scripts in package.json, pytest, etc.)
- [ ] Tests cover critical paths
- [ ] CI runs tests automatically

## Security
- [ ] .gitignore excludes sensitive files (.env, credentials)
- [ ] No secrets committed in git history
- [ ] Dependencies are reasonably up to date
- [ ] No known critical vulnerabilities in dependencies

## DevOps
- [ ] CI/CD pipeline configured
- [ ] Build process is documented or scripted
- [ ] Environment setup is reproducible
- [ ] Lockfile is committed
