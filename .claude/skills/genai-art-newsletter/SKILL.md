---
name: genai-art-newsletter
description: End-to-end GenAI Art newsletter. Fetches news, picks stories, writes content, publishes to beehiiv with ads and formatting. Use when the user wants to generate, edit, or publish the GenAI Art newsletter.
allowed-tools: WebFetch WebSearch Read Glob Grep Bash Write Edit Agent
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

---

# PART 2: Publish to beehiiv

After generating the newsletter content (Steps 0-7), publish it to beehiiv
using the editor automation reference. Read the full reference before proceeding:

- `${CLAUDE_SKILL_DIR}/beehiiv/editor-reference.md`

## Step 8: Browser Setup

**IMPORTANT:** Always use **headed** real Chrome (not Chrome for Testing) with the
**persistent** profile at `~/.agent-browser/chrome-debug-profile`. This preserves
login sessions across runs so the user never has to re-authenticate.

**NEVER** let `agent-browser` launch its own headless Chrome for Testing — it uses
a temporary profile directory that loses all cookies on exit.

### Setup sequence:

1. Close any existing headless agent-browser instance:
   ```bash
   agent-browser close 2>/dev/null || true
   ```

2. Launch **headed** Chrome with the persistent profile and CDP:
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --remote-debugging-port=9222 \
     --user-data-dir="$HOME/.agent-browser/chrome-debug-profile" \
     --no-first-run &
   ```

3. Connect agent-browser to it:
   ```bash
   agent-browser connect 9222
   ```

4. Verify connection and session:
   ```bash
   agent-browser get url
   agent-browser open "https://app.beehiiv.com/posts"
   ```
   If the page title shows "Posts - Generative AI Art - beehiiv", the session is active.
   If redirected to login, the user must log in **once** in the visible Chrome window —
   the session will persist for future runs.

If Cloudflare blocks access, ask user to solve the challenge in the Chrome window.

## Step 9: Create Post from Template

```bash
agent-browser open "https://app.beehiiv.com/posts/template-library?tab=my_templates"
agent-browser wait --load networkidle
# Click daily_gen_ai_news template
agent-browser eval 'var h3s = document.querySelectorAll("h3"); h3s.forEach(function(h){ if(h.textContent.trim()==="daily_gen_ai_news"){ var card = h.closest("[class*=border][class*=group]"); if(card){ var btn = card.querySelector("button.absolute"); if(btn) btn.click(); }}})'
agent-browser wait --load networkidle
```

## Step 10: Fill Title, Subtitle, Thumbnail, and Content

Use the assembled newsletter from Step 7 to fill:

1. **Title** (leading space): `agent-browser fill "textarea.editor-title-textarea" " Title"`
2. **Subtitle** (PLUS: prefix): `agent-browser fill "textarea.editor-subtitle-textarea" "PLUS: ..."`
3. **Thumbnail**: Download relevant image, upload via `agent-browser upload "input[type=file].w-0" /tmp/thumbnail.jpg`
4. **Editor content**: Write JS to replace template placeholders with newsletter content.
   Use base64-encoded eval. Find elements by text content, never by index.
   See editor-reference.md for exact HTML formatting rules (smart quotes, em-dashes, centered nav, etc.)

Content to replace: intro P, headline UL, 3x stories (H3 linked, What's new, bullets, analysis),
Everything else items.

Content to KEEP: nav header, Partner links, ad slots, HRs, GUIDE, image block, reading list, poll, footer.

## Step 11: Claim Ads

Read the Ad Monetization section in editor-reference.md.

### Phase 1: Plan ad placement

Before touching anything, identify:
1. **Which offers** to claim — evaluate available offers by estimated earnings, rate
   model (CPM for slot 1, CPC for slot 2), and audience relevance.
   Good fits for AI/tech: Deel, Superhuman AI, Mintlify, Proton, The Deep View, 1440 Media.
   Avoid: Fisher Investments, generic finance.
2. **Where each ad goes** — locate the exact positions in the editor:
   - **Slot 1 (primary):** After headline bullets UL, before "*Partner with us→" — no header label
   - **Slot 2 (secondary):** After "SPONSORED BY [BRAND]" H6, before "*Partner with us→" — between Story 2 and Story 3

### Phase 2: Place ads one at a time

For each ad slot, follow this exact sequence:

1. **Scroll to the slot position** in the editor:
   ```bash
   agent-browser eval 'var ed = document.querySelector(".tiptap.ProseMirror"); ed.children[SLOT_INDEX].scrollIntoView({block:"center"})'
   ```

2. **Take a snapshot** to get the "Select offer" button's ref:
   ```bash
   agent-browser snapshot -i   # Look for: button "Select offer" [ref=eNN]
   ```

3. **Click using the snapshot ref** (CRITICAL — never use JS `.click()` or `eval` to click
   the slot button; always use `agent-browser click @ref`):
   ```bash
   agent-browser click @eNN
   ```

4. **Wait for offers modal**, then claim the chosen offer by its ref:
   ```bash
   agent-browser wait 2000
   agent-browser snapshot -i   # Find "Claim" button next to your chosen brand
   agent-browser click @ref    # Click the Claim button
   ```

5. **Confirm angle selection** (check that "Confirm & add to post" is NOT disabled):
   ```bash
   agent-browser wait 2000
   agent-browser snapshot -i   # Verify "Confirm & add to post" is not disabled
   agent-browser click @ref    # Click Confirm
   ```
   If "Confirm & add to post" is **disabled**, the offer is already claimed elsewhere.
   Click "Back" and pick a different offer.

6. **Dismiss confirmation**:
   ```bash
   agent-browser wait 2000
   agent-browser find role button click --name "Done"
   ```

7. **Verify placement** — the claimed ad must be at the slot index, not at index 0:
   ```bash
   agent-browser eval 'var ed = document.querySelector(".tiptap.ProseMirror"); ...'
   ```
   If the ad landed at index 0 (top), it went to the wrong place. Cancel it via
   View details → Cancel ad → Yes, cancel ad. Reload and retry with snapshot ref click.

If template "Select offer" slots are missing (content replacement removed them), use the
**slash command fallback**: position cursor at the correct location, trigger "/" via JS
KeyboardEvent + `document.execCommand("insertText", false, "/")`, wait 1s, then click
"Ad Network" in the tippy menu. See editor-reference.md for exact JS.

### Phase 3: Post-claim cleanup

- After claiming secondary ad, rename the H6 above it to match the actual advertiser:
  `SPONSORED BY BRANDNAME` (uppercase)
- **Max 3 ads** per issue: 1 primary (no header), up to 2 secondary (each needs H6)
- **NEVER** use "Browse available ad offers" banner (places ads at wrong position)
- **NEVER** move ads via DOM manipulation (breaks React state permanently)

### Key Lesson

The difference between ads landing correctly vs at index 0 is HOW you click the "Select
offer" button. Using `agent-browser click @ref` (snapshot ref) preserves the React
association between the slot and the claim action. Using JS `eval` with
`.querySelector("button").click()` breaks this association and the ad lands at position 0.

## Step 12: Configure Tabs and Verify

**Email tab** (MUST update every post):
- Subject line: short, punchy, from Step 3 output (under 60 chars)
- Preview text: teaser from Step 3 pre-header output (under 150 chars)

**Audience tab**: Verify Email+Web, All subscribers, exclusions set.
**Web tab**: Verify slug, SEO meta title/description.
**Review tab**: Verify title, subject, template style. Do NOT click Schedule unless user requests.

Final verification:
```bash
agent-browser eval 'var ed=document.querySelector(".tiptap.ProseMirror");var a=ed.querySelectorAll(".node-advertisementOpportunity");var s=ed.querySelectorAll(".node-advertisementSearch");JSON.stringify({claimedAds:a.length,emptySlots:s.length})'
```
Expected: `{claimedAds: 2, emptySlots: 0}`
