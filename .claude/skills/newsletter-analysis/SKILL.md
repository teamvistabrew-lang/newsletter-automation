---
name: newsletter-analysis
description: Analyze newsletter email performance — open rates, CTR, subject line patterns, content-performance correlation, link-type analysis, and campaign optimization recommendations. Use when the user wants to analyze newsletter performance, optimize email campaigns, run a retro, or improve engagement metrics.
allowed-tools: WebFetch WebSearch Read Glob Grep Bash Write Edit Agent
---

# Newsletter Performance Analysis Skill

You are an expert newsletter operator and email marketing analyst. You analyze
beehiiv newsletter data to identify what drives opens and clicks, then produce
actionable optimization recommendations.

## Step 0: Identify Publication and Date Range

Read the configuration:
- `${CLAUDE_SKILL_DIR}/config/publications.md`

If `$ARGUMENTS` specifies a publication name, use that. Otherwise default to
"Generative AI Art".

If `$ARGUMENTS` specifies a date range (e.g., "last 90 days", "Q1 2026"), use that.
Otherwise default to the past 365 days.

## Step 1: Browser Setup

Use headed Chrome with the persistent profile (never headless):

```bash
agent-browser close 2>/dev/null || true
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.agent-browser/chrome-debug-profile" \
  --no-first-run &
agent-browser connect 9222
```

Verify beehiiv session:
```bash
agent-browser open "https://app.beehiiv.com/posts"
```
If redirected to login, ask user to log in in the Chrome window.

## Step 2: Collect Post-Level Data

Navigate to the published posts list:
```bash
agent-browser open "https://app.beehiiv.com/posts?status=published"
```

Extract post data by repeatedly clicking "Load more" until all posts in the date
range are visible. Then extract from the page:

For each post, capture:
- **Subject line** (title)
- **Subtitle** (pre-header / PLUS: text)
- **Publication date**
- **Sent count**
- **Open rate** (%)
- **CTR** (%)

Use JS eval to parse the page text. Posts follow the pattern:
`Title → PLUS: subtitle → Published on [date] → [sent count] → [open %] → [ctr %]`

Save raw data to `/tmp/newsletter-posts-raw.json`.

## Step 3: Collect Report-Level Data

Navigate to the beehiiv Posts Report (Metabase dashboard):
```bash
agent-browser open "https://app.beehiiv.com/reports/post"
```

The report is inside an iframe. Navigate directly to the Metabase dashboard URL
(extract it from the iframe src attribute).

### 3a: Set Date Range

Click "Post Sent At" filter, change interval to match the requested range (e.g., 365 days),
click "Update filter".

### 3b: Extract Aggregate Metrics

From the Overview tab, capture:
- Delivered, Opened, Unique Clicks, Verified Unique Clicks
- Open Rate, CTR, Verified CTR
- Unsubscribe Rate, Spam Rate
- Unique Subscribers, Unique Posts
- **Top URLs table** (position, url, total clicks, unique clicks) — ALL rows
- **Email Performance by Date** chart data (monthly open rate + CTR trends)
- **Posts by Date** table (all rows)

### 3c: Extract Top Posts Data

Switch to the "Top Posts" tab if available and capture ranked post data.

## Step 4: Subject Line Analysis

Apply these analyses using Python (via Bash):

### 4a: Length Analysis
Bucket subject lines by word count (1-5, 6-7, 8-9, 10+) and compute avg open/CTR per bucket.

### 4b: Brand/Company Analysis
Check for these brands in subject lines: OpenAI, Google, Anthropic, Claude, Microsoft,
Meta, Apple, Nvidia, Amazon, Samsung, Tesla, DeepSeek, Sora, Gemini, GPT, ChatGPT,
Midjourney, Adobe. Compute avg open/CTR and delta vs overall average for each.

### 4c: Pattern Analysis
Test these patterns against performance:
- Possessive format ("X's Y")
- Numbers in title
- Negative/alarm framing
- Question marks
- Colon usage
- Active vs passive verbs

### 4d: Word-Level Analysis
Tokenize all subject lines, remove stopwords, compute avg open/CTR for each word
appearing 3+ times. Identify top 10 and bottom 10 words for both opens and CTR.

### 4e: First Word Analysis
Group by first word (or brand before apostrophe) and compute performance.

## Step 5: Content-Performance Correlation

### 5a: Topic Category Analysis
Classify each post into categories and compute performance:
- Creative/Art (art, image, video, sora, midjourney, creative, editor)
- Model Releases (model, release, launch, arrives, gpt, gemini, claude)
- Robotics/Hardware (robot, humanoid, chip, hardware, device)
- Business/Fundraise (billion, valuation, deal, funding)
- Code/Dev (code, coding, developer, agent)
- Health/Science (health, tumor, disease, science)
- Controversy (red, dangerous, fallout, crisis, war)

### 5b: Day-of-Week Analysis
Group posts by send day and compute avg open/CTR per day.

### 5c: Link Type Analysis
From the Top URLs data, classify each link:
- **Tutorial/practical** (LinkedIn posts, shared ChatGPT conversations)
- **News article** (techcrunch, theverge, etc.)
- **Tool/product** (landing pages, app stores)
- **Ad/sponsored** (hubspot offers, wellput, ad network)
- **Internal** (polls, subscribe, partner links)

Compute click share by type.

### 5d: Double Winners
Identify posts above average on BOTH open rate AND CTR. Analyze common patterns.

## Step 6: Trend Analysis

### 6a: Monthly Trends
Plot open rate and CTR month over month. Identify:
- Direction (improving/declining/stable)
- Inflection points (when did things change?)
- Correlation between opens and CTR (do they move together?)

### 6b: Subscriber Trend
Track sent count over time to show subscriber growth/decline.

### 6c: Unsubscribe Patterns
Identify posts with highest unsubscribe rates and correlate with content type.

## Step 7: Generate Recommendations

Read the optimization framework:
- `${CLAUDE_SKILL_DIR}/prompts/optimization-framework.md`

Based on all analysis, generate:
1. **Subject line rules** — specific dos and don'ts backed by data
2. **Content mix recommendations** — what topics to increase/decrease
3. **Format changes** — structural changes to the newsletter template
4. **Send timing** — optimal day/time
5. **Link strategy** — what link types to prioritize for CTR
6. **Experiments to run** — A/B tests with hypotheses and success criteria

## Step 8: Write Output

### 8a: Save analysis to project
Write the full analysis to `analysis/performance-analysis-YYYY-MM-DD.md` in the
newsletter-automation project directory.

### 8b: Write to Obsidian vault (if configured)
Read the output configuration:
- `${CLAUDE_SKILL_DIR}/config/publications.md`

If an Obsidian vault path is configured for the publication, write the analysis
there using proper Obsidian frontmatter and formatting. Follow the vault's
existing conventions for frontmatter fields, tags, and directory structure.

The Obsidian output should include:
- Performance Analysis note (in `Analysis/` directory)
- Optimization Playbook note (in `Strategy/` directory)
- Updated content rules (in `Strategy/` directory)

Use wikilinks for cross-references between notes.
