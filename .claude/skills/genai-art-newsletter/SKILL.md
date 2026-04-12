---
name: genai-art-newsletter
description: Generates the GenAI Art newsletter from provided URLs or data sources. Fetches content, picks top stories, writes segments, and assembles the final newsletter. Use when the user wants to generate GenAI Art newsletter content.
allowed-tools: WebFetch Read Glob Grep
---

# GenAI Art Newsletter Generator

You are generating a complete AI newsletter called "GenAI Art" from provided data sources. Follow all steps sequentially, applying the prompts and guidelines from the resource files. Do NOT pause for human review — run all stages end-to-end and output the final assembled newsletter.

## Step 0: Parse Input & Discover Content

Read the data sources configuration:
- `${CLAUDE_SKILL_DIR}/config/data-sources.md`

If `$ARGUMENTS` provides explicit URLs, use those directly.

If `$ARGUMENTS` is empty (no URLs provided), automatically fetch content from the configured data sources:

### Step 0a: Fetch Newsletter Archive Pages

Use `WebFetch` to fetch each of the public newsletter archive URLs listed in the data sources config:

- The Neuron: `https://www.theneurondaily.com/archive`
- Futurepedia: `https://futurepedia.beehiiv.com/archive`
- Superhuman: `https://www.superhuman.ai/archive`
- The Rundown AI: `https://www.therundown.ai/archive`
- TAAFT: `https://newsletter.theresanaiforthat.com/archive`
- Ben's Bites: `https://bensbites.beehiiv.com/archive`

### Step 0b: Extract Latest Article URLs

From each archive page, extract the URLs of the most recent posts (typically the first few links on the page). Filter to only articles published today or yesterday. Collect up to 10-15 unique article URLs across all archives.

## Step 1: Fetch Article Content

For each article URL (either from the feeds or from `$ARGUMENTS`), use `WebFetch` to retrieve the full content. For each fetched page, extract:
- Title
- Author(s) / publication source
- Publication date
- All URLs/links mentioned in the article
- The full article body text

Use each source URL as its identifier. Collect all fetched content into a working set. If WebFetch returns minimal or garbled content for a URL, note it and skip that source.

Cap content extraction at approximately 500 words per source to manage context. Target 10-15 articles for a good newsletter.

## Step 2: Pick Top Stories

Read and apply these resource files:
- `${CLAUDE_SKILL_DIR}/prompts/01-pick-top-stories.md`
- `${CLAUDE_SKILL_DIR}/guidelines/story-selection-criteria.md`

From all fetched content, select the 3 best stories following the prompt instructions and selection criteria. The first story MUST be the "catchiest" — the one most likely to drive email opens.

Output for this step:
- Chain-of-thought reasoning explaining your selections
- 3 stories, each with: title, summary, source URLs, external source links

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

For each of the 3 selected stories, write a complete newsletter segment following the "What's new / What matters / Why it matters" structure. Apply all writing style guidelines, the word blacklist, and hyperlinking rules.

## Step 5: Write Intro

Read and apply this resource file:
- `${CLAUDE_SKILL_DIR}/prompts/04-write-intro.md`

Using the subject line, pre-header, and the 3 written story segments, generate the newsletter intro:
- "Good morning, **{{first_name | AI enthusiast}}**." opening
- Two paragraphs about the lead story
- "**In today's GenAI Art:**" transition
- 3 bullet points summarizing each story

## Step 6: Write The Shortlist

Read and apply these resource files:
- `${CLAUDE_SKILL_DIR}/prompts/05-write-shortlist.md`
- `${CLAUDE_SKILL_DIR}/examples/shortlist-example.md`
- `${CLAUDE_SKILL_DIR}/guidelines/hyperlinking-rules.md`

From the remaining content (NOT the 3 main stories), write 3-5 additional story summaries in the "**Bold** [verb](URL) description" format.

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
6. "The Shortlist" section

Separate each major section with `---`.

Output the complete assembled newsletter as a single markdown document.
