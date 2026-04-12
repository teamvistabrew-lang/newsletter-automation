---
name: tech-news
description: Generates the Tech News newsletter from provided URLs or configured tech news sources. Fetches content, picks top stories, writes segments, and assembles the final newsletter. Use when the user wants to generate Tech News newsletter content.
allowed-tools: WebFetch Read Glob Grep
---

# Tech News Newsletter Generator

You are generating a complete technology newsletter called "Tech News" from provided data sources. Cover a broad tech scope: AI, cloud, cybersecurity, hardware, fintech, social media, startups, and regulatory developments. Follow all steps sequentially. Do NOT pause for human review — run all stages end-to-end and output the final assembled newsletter.

## Step 0: Parse Input & Discover Content

Read the data sources configuration:
- `${CLAUDE_SKILL_DIR}/config/data-sources.md`

If `$ARGUMENTS` provides explicit URLs, use those directly.

If `$ARGUMENTS` is empty, automatically fetch content from configured data sources:

### Step 0a: Fetch Tech News Pages

Use `WebFetch` to fetch each public news site URL:

- TechCrunch: `https://techcrunch.com/`
- The Verge: `https://www.theverge.com/tech`
- Wired Business: `https://www.wired.com/category/business/`
- Ars Technica: `https://arstechnica.com/`
- Reuters Technology: `https://www.reuters.com/technology/`

### Step 0b: Extract Latest Article URLs

From each page, extract URLs of the most recent articles. Filter to today or yesterday. Collect up to 10-15 unique article URLs.

## Step 1: Fetch Article Content

For each article URL, use `WebFetch` to retrieve full content. Extract:
- Title, Author(s), Publication date
- All URLs/links mentioned
- Full article body text

Skip sources that return minimal or garbled content. Cap at ~500 words per source. Target 10-15 articles.

## Step 2: Pick Top Stories

Read and apply:
- `${CLAUDE_SKILL_DIR}/prompts/01-pick-top-stories.md`
- `${CLAUDE_SKILL_DIR}/guidelines/story-selection-criteria.md`

Select the 3 best stories. First story MUST be the most impactful.

## Step 3: Write Subject Line

Read and apply:
- `${CLAUDE_SKILL_DIR}/prompts/02-write-subject-line.md`
- `${CLAUDE_SKILL_DIR}/examples/subject-lines.md`

Generate subject line (7-9 words), pre-header ("PLUS:" format), and 5-8 alternatives.

## Step 4: Write Story Segments

Read and apply:
- `${CLAUDE_SKILL_DIR}/prompts/03-write-story-segment.md`
- `${CLAUDE_SKILL_DIR}/guidelines/writing-style.md`
- `${CLAUDE_SKILL_DIR}/guidelines/hyperlinking-rules.md`
- `${CLAUDE_SKILL_DIR}/examples/story-segment-example.md`

Write 3 segments following "What's new / What matters / Why it matters" structure.

## Step 5: Write Intro

Read and apply:
- `${CLAUDE_SKILL_DIR}/prompts/04-write-intro.md`

Generate intro with:
- "Good morning, **{{first_name | tech professionals}}**." opening
- Two paragraphs about lead story
- "**In today's Tech News:**" transition
- 3 bullet points

## Step 6: Write The Shortlist

Read and apply:
- `${CLAUDE_SKILL_DIR}/prompts/05-write-shortlist.md`
- `${CLAUDE_SKILL_DIR}/examples/shortlist-example.md`
- `${CLAUDE_SKILL_DIR}/guidelines/hyperlinking-rules.md`

Write 3-5 additional stories in "**Bold** [verb](URL) description" format.

## Step 7: Assemble Final Newsletter

Read:
- `${CLAUDE_SKILL_DIR}/templates/newsletter-output.md`
- `${CLAUDE_SKILL_DIR}/examples/full-newsletter-example.md`

Combine: subject/pre-header (HTML comments) → intro → 3 story segments → The Shortlist. Separate with `---`. Output as single markdown document.
