---
name: newsletter-gen
description: Generates an AI newsletter from provided URLs or data sources. Fetches content, picks top stories, writes segments, and assembles the final newsletter. Use when the user wants to generate newsletter content.
allowed-tools: WebFetch Read Glob Grep
---

# Newsletter Generator

You are generating a complete AI newsletter called "AI Brief" from provided data sources. Follow all steps sequentially, applying the prompts and guidelines from the resource files. Do NOT pause for human review — run all stages end-to-end and output the final assembled newsletter.

## Step 0: Parse Input

`$ARGUMENTS` contains either:
- A space/newline-separated list of URLs
- A path to a file containing URLs (one per line)
- If empty, ask the user to provide URLs or data sources

Read the input and collect all URLs to fetch.

## Step 1: Fetch Content

For each URL provided, use `WebFetch` to retrieve the content. For each fetched page, extract:
- Title
- Author(s) / publication source
- Publication date
- All URLs/links mentioned in the article
- The full article body text

Use each source URL as its identifier. Collect all fetched content into a working set. If WebFetch returns minimal or garbled content for a URL, note it and skip that source.

Recommended: 8-15 URLs is the sweet spot. Cap content extraction at approximately 500 words per source to manage context.

## Step 2: Pick Top Stories

Read and apply these resource files:
- `${CLAUDE_SKILL_DIR}/prompts/01-pick-top-stories.md`
- `${CLAUDE_SKILL_DIR}/guidelines/story-selection-criteria.md`

From all fetched content, select the 4 best stories following the prompt instructions and selection criteria. The first story MUST be the "catchiest" — the one most likely to drive email opens.

Output for this step:
- Chain-of-thought reasoning explaining your selections
- 4 stories, each with: title, summary, source URLs, external source links

## Step 3: Write Subject Line

Read and apply these resource files:
- `${CLAUDE_SKILL_DIR}/prompts/02-write-subject-line.md`
- `${CLAUDE_SKILL_DIR}/examples/subject-lines.md`

Generate:
- A subject line (7-9 words, focused on the lead story)
- A pre-header text (15-20 words, "PLUS:" format teasing other stories)
- 5-8 alternative subject lines

## Step 4: Write Story Segments

Read and apply these resource files:
- `${CLAUDE_SKILL_DIR}/prompts/03-write-story-segment.md`
- `${CLAUDE_SKILL_DIR}/guidelines/writing-style.md`
- `${CLAUDE_SKILL_DIR}/guidelines/hyperlinking-rules.md`
- `${CLAUDE_SKILL_DIR}/examples/story-segment-example.md`

For each of the 4 selected stories, write a complete newsletter segment following the "What's new / What matters / Why it matters" structure. Apply all writing style guidelines, the word blacklist, and hyperlinking rules.

## Step 5: Write Intro

Read and apply this resource file:
- `${CLAUDE_SKILL_DIR}/prompts/04-write-intro.md`

Using the subject line, pre-header, and the 4 written story segments, generate the newsletter intro:
- "Good morning, **{{first_name | AI enthusiast}}**." opening
- Two paragraphs about the lead story
- "**In today's AI Brief:**" transition
- 4 bullet points summarizing each story

## Step 6: Write The Shortlist

Read and apply these resource files:
- `${CLAUDE_SKILL_DIR}/prompts/05-write-shortlist.md`
- `${CLAUDE_SKILL_DIR}/examples/shortlist-example.md`
- `${CLAUDE_SKILL_DIR}/guidelines/hyperlinking-rules.md`

From the remaining content (NOT the 4 main stories), write 3-5 additional story summaries in the "**Bold** [verb](URL) description" format.

## Step 7: Assemble Final Newsletter

Read the assembly template:
- `${CLAUDE_SKILL_DIR}/templates/newsletter-output.md`

Reference the full newsletter example for the gold standard:
- `${CLAUDE_SKILL_DIR}/examples/full-newsletter-example.md`

Combine all sections in this order:
1. Subject line and pre-header (as HTML comments)
2. Intro section
3. Story segment 1 (lead story)
4. Story segment 2
5. Story segment 3
6. Story segment 4
7. "The Shortlist" section

Separate each major section with `---`.

Output the complete assembled newsletter as a single markdown document.
