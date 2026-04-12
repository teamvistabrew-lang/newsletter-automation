#!/bin/bash
# Code Statistics Collector
# Usage: bash collect-stats.sh [project-directory]

PROJECT_DIR="${1:-.}"

echo "=== Code Statistics ==="
echo "Directory: $PROJECT_DIR"
echo ""

# Count files by extension (excluding ignored dirs)
echo "## File Counts by Type"
find "$PROJECT_DIR" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -not -path "*/__pycache__/*" \
    -not -path "*/.venv/*" \
    -not -path "*/vendor/*" \
    -not -path "*/target/*" \
    -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -20

echo ""

# Total lines of code (top extensions)
echo "## Lines of Code (top languages)"
for ext in ts tsx js jsx py go rs java rb; do
    COUNT=$(find "$PROJECT_DIR" \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/dist/*" \
        -not -path "*/build/*" \
        -name "*.$ext" -type f -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
    if [ -n "$COUNT" ] && [ "$COUNT" != "0" ]; then
        echo "  .$ext: $COUNT lines"
    fi
done

echo ""

# Count TODOs and FIXMEs
echo "## TODO/FIXME Count"
TODO_COUNT=$(grep -r --include="*.{ts,tsx,js,jsx,py,go,rs,java,rb}" -c "TODO\|FIXME\|HACK\|XXX" "$PROJECT_DIR" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --exclude-dir=build 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')
echo "Total: $TODO_COUNT"

echo ""

# Git stats
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "## Git Statistics"
    echo "Total commits: $(git -C "$PROJECT_DIR" rev-list --count HEAD 2>/dev/null || echo 'N/A')"
    echo "Contributors: $(git -C "$PROJECT_DIR" shortlog -sn HEAD 2>/dev/null | wc -l | tr -d ' ')"
    echo "Last commit: $(git -C "$PROJECT_DIR" log -1 --format='%cr' 2>/dev/null || echo 'N/A')"
    echo "Branches: $(git -C "$PROJECT_DIR" branch -a 2>/dev/null | wc -l | tr -d ' ')"
fi

echo ""

# Test file count
echo "## Test Files"
TEST_COUNT=$(find "$PROJECT_DIR" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    \( -name "*.test.*" -o -name "*.spec.*" -o -path "*/test/*" -o -path "*/__tests__/*" \) \
    -type f 2>/dev/null | wc -l | tr -d ' ')
echo "Test files found: $TEST_COUNT"

echo ""
echo "=== End Statistics ==="
