#!/bin/bash
# GenAI Art Newsletter — Automated Daily Cron
# Runs at 10 PM PST daily via crontab
# Generates newsletter content, publishes draft to beehiiv

set -euo pipefail

# --- Configuration ---
PROJECT_DIR="/Users/bunty/Desktop/Projects/VistaBrew/Newsletters/newsletter-automation"
LOG_DIR="$HOME/logs/newsletter"
CHROME_PROFILE="$HOME/.agent-browser/chrome-debug-profile"
CLAUDE_BIN="$HOME/.local/bin/claude"
DATE=$(date +%Y-%m-%d)
LOG_FILE="$LOG_DIR/$DATE.log"

# --- Logging ---
exec > >(tee -a "$LOG_FILE") 2>&1
echo "=========================================="
echo "GenAI Art Newsletter — $DATE"
echo "Started: $(date)"
echo "=========================================="

# --- Ensure Chrome is running with persistent profile ---
if ! pgrep -f "remote-debugging-port=9222" > /dev/null 2>&1; then
    echo "[SETUP] Launching headed Chrome with persistent profile..."
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
        --remote-debugging-port=9222 \
        --user-data-dir="$CHROME_PROFILE" \
        --no-first-run &
    sleep 3
    echo "[SETUP] Chrome launched."
else
    echo "[SETUP] Chrome already running with CDP on port 9222."
fi

# --- Connect agent-browser ---
if command -v agent-browser &> /dev/null; then
    agent-browser connect 9222 2>/dev/null || true
    echo "[SETUP] agent-browser connected."
fi

# --- Run Claude Code ---
echo "[RUN] Starting Claude Code newsletter generation..."
cd "$PROJECT_DIR"

"$CLAUDE_BIN" -p \
    --dangerously-skip-permissions \
    --model sonnet \
    --verbose \
    "Run the /genai-art-newsletter command end-to-end. Execute ALL steps 0 through 12.

PART 1 — Content Generation (Steps 0-7):
- Read all skill files at .claude/skills/genai-art-newsletter/
- Fetch latest news from configured archive sources (The Neuron, Futurepedia, Superhuman, The Rundown AI, TAAFT, Ben's Bites)
- Pick top 3 stories using selection criteria (lead must be catchiest)
- Write subject line (5-6 words, product names not company names, no OpenAI fatigue, no numbers, no negative framing, prioritize creative/art AI)
- Write 3 story segments, intro, and shortlist
- Assemble full newsletter and save to output/newsletter-${DATE}.md

PART 2 — Publish to beehiiv (Steps 8-12):
- Close any headless Chrome for Testing instance: agent-browser close
- Connect to headed Chrome on port 9222: agent-browser connect 9222
- Verify beehiiv session: agent-browser open https://app.beehiiv.com/posts (if login page, log failure and exit)
- Create post from daily_gen_ai_news template
- Fill title (with leading space), subtitle (PLUS: prefix), upload thumbnail, fill editor content
- Claim 2 ads: scroll to each 'Select offer' slot, take snapshot, click via agent-browser click @ref (NEVER use JS eval .click()), confirm, dismiss
- Rename secondary ad H6 to SPONSORED BY [BRAND]
- Configure Email tab (subject line + preview text), verify Audience (Email+Web, All subscribers), verify Web tab
- Run final verification: {claimedAds: 2, emptySlots: 0}
- Do NOT click Schedule — leave as draft

Commit the output file: git add output/newsletter-${DATE}.md && git commit -m 'Generate GenAI Art newsletter ${DATE}'"

EXIT_CODE=$?

echo ""
echo "=========================================="
echo "Finished: $(date)"
echo "Exit code: $EXIT_CODE"
echo "=========================================="

exit $EXIT_CODE
