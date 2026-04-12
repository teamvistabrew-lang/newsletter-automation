#!/bin/bash
# Dependency Health Checker
# Usage: bash check-deps.sh [project-directory]

PROJECT_DIR="${1:-.}"

echo "=== Dependency Health Check ==="
echo "Directory: $PROJECT_DIR"
echo ""

# Node.js (package.json)
if [ -f "$PROJECT_DIR/package.json" ]; then
    echo "## Node.js Dependencies"
    echo "Package manager: $([ -f "$PROJECT_DIR/yarn.lock" ] && echo 'yarn' || ([ -f "$PROJECT_DIR/pnpm-lock.yaml" ] && echo 'pnpm' || echo 'npm'))"

    DEPS=$(node -e "const p=require('$PROJECT_DIR/package.json'); console.log(Object.keys(p.dependencies||{}).length)" 2>/dev/null || echo "0")
    DEV_DEPS=$(node -e "const p=require('$PROJECT_DIR/package.json'); console.log(Object.keys(p.devDependencies||{}).length)" 2>/dev/null || echo "0")

    echo "Production dependencies: $DEPS"
    echo "Dev dependencies: $DEV_DEPS"
    echo "Total: $((DEPS + DEV_DEPS))"

    # Check for lockfile
    if [ -f "$PROJECT_DIR/package-lock.json" ] || [ -f "$PROJECT_DIR/yarn.lock" ] || [ -f "$PROJECT_DIR/pnpm-lock.yaml" ]; then
        echo "Lockfile: PRESENT"
    else
        echo "Lockfile: MISSING (warning)"
    fi
    echo ""
fi

# Python (requirements.txt or pyproject.toml)
if [ -f "$PROJECT_DIR/requirements.txt" ]; then
    echo "## Python Dependencies"
    PYTHON_DEPS=$(grep -c -v '^\s*#\|^\s*$' "$PROJECT_DIR/requirements.txt" 2>/dev/null || echo "0")
    echo "Dependencies: $PYTHON_DEPS"
    echo "Source: requirements.txt"
    echo ""
fi

if [ -f "$PROJECT_DIR/pyproject.toml" ]; then
    echo "## Python Project (pyproject.toml)"
    echo "Found pyproject.toml"
    echo ""
fi

# Go (go.mod)
if [ -f "$PROJECT_DIR/go.mod" ]; then
    echo "## Go Dependencies"
    GO_DEPS=$(grep -c "^\t" "$PROJECT_DIR/go.mod" 2>/dev/null || echo "0")
    echo "Dependencies: $GO_DEPS"
    echo ""
fi

# Rust (Cargo.toml)
if [ -f "$PROJECT_DIR/Cargo.toml" ]; then
    echo "## Rust Dependencies"
    echo "Found Cargo.toml"
    echo ""
fi

# If no dependency files found
if [ ! -f "$PROJECT_DIR/package.json" ] && [ ! -f "$PROJECT_DIR/requirements.txt" ] && [ ! -f "$PROJECT_DIR/pyproject.toml" ] && [ ! -f "$PROJECT_DIR/go.mod" ] && [ ! -f "$PROJECT_DIR/Cargo.toml" ]; then
    echo "No recognized dependency files found."
fi

echo "=== End Dependency Check ==="
