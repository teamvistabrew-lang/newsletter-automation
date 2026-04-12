
# beehiiv Post Editor Skill

Create, edit, and publish posts on beehiiv using `agent-browser` connected to Chrome via CDP.

## Prerequisites

Chrome must be running with `--remote-debugging-port=9222`:

```bash
# User must quit Chrome first (Cmd+Q), then relaunch:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.agent-browser/chrome-debug-profile" \
  --no-first-run &
```

Then connect agent-browser:

```bash
agent-browser connect 9222
```

If the user is already connected from a prior session, skip the above. Verify with:

```bash
agent-browser get url
```

## Authentication

Beehiiv uses Cloudflare protection that blocks headless browsers.
The user must log in manually through the headed Chrome window.
Once logged in, the session persists via `--user-data-dir` profile.

If redirected to login page, ask the user to log in in the Chrome window
and tell you when they're done.

---

## Editor Structure Map

### URL Pattern

- Post list: `https://app.beehiiv.com/posts`
- Edit post: `https://app.beehiiv.com/posts/{post-id}/edit`
- New post: Navigate to post list, click the "+" or "New Post" button

### Top-Level Navigation (5 tabs, linear workflow)

| Tab | Purpose | Button selector |
|-----|---------|-----------------|
| **Compose** | Write content, set title/subtitle/thumbnail/tags | `agent-browser find role button click --name "Compose"` |
| **Audience** | Choose publish target, tiers, segments | `agent-browser find role button click --name "Audience"` |
| **Email** | Subject line, preview text, header buttons | `agent-browser find role button click --name "Email"` |
| **Web** | Post URL slug, thumbnail, SEO, Open Graph, comments | `agent-browser find role button click --name "Web"` |
| **Review** | Final review before schedule/publish | `agent-browser find role button click --name "Review"` |

Navigation buttons: **Back**, **Next**, **Preview**, **Schedule** (on Review tab)

### Publication Selector

Located in left sidebar. Selects which publication to post to.

```bash
# Publications are in a listbox
agent-browser snapshot -i  # Look for listbox "Publications"
agent-browser click @ref   # Click the desired publication option
```

Current publications: Generative AI Art, StartupNews AI, Tech Front, The AI Brief

---

## COMPOSE TAB (Main Editor)

### Sub-tabs: Write | Style

```bash
agent-browser find role button click --name "Write"   # Editor mode
agent-browser find role button click --name "Style"    # Email preview with styles
```

### Header Section (above tiptap editor)

The header section lives in `div.layout-content.mb-4` and contains:

#### 1. Featured Image / Thumbnail

- Located above title. Shows as a large image block.
- Image selector: `figure.relative img` (inside the header layout)
- Upload via hidden file input: `input[type="file"]` (class `w-0 h-0 overflow-hidden`)
- **Eye icon** button next to it controls visibility in email/web

```bash
# Upload/replace thumbnail via the hidden file input
# 1. Download an image (e.g., from Unsplash)
curl -sL "https://unsplash.com/photos/PHOTO_ID/download?force=true&w=1200" -o /tmp/thumbnail.jpg
# 2. Upload via the hidden file input (works reliably)
agent-browser upload "input[type=file].w-0" /tmp/thumbnail.jpg
# 3. Wait for upload to complete
agent-browser wait 3000
```

Choose thumbnail images that match the main story topic. Good sources:
- Unsplash (free, no attribution needed): search for tech/AI/chip/data related images
- Use `w=1200` parameter for appropriate resolution

#### 2. Content Tags

```bash
agent-browser find role button click --name "Add content tags"
# Tags appear as buttons with a "remove" button next to each
# Current tag example: "Gen AI Art" with a remove button
```

#### 3. Title Field

- Element: `textarea.editor-title-textarea`
- Placeholder: "Add a title"
- Classes: `h-[3rem] w-full editor-title-textarea ... font-semibold text-4xl resize-none`

```bash
# Clear and fill title
agent-browser fill "textarea.editor-title-textarea" "Your New Title Here"
# Or use snapshot ref
agent-browser snapshot -i  # Find textbox "Add a title" ref
agent-browser fill @ref "Your New Title Here"
```

#### 4. Subtitle Field

- Element: `textarea.editor-subtitle-textarea`
- Placeholder: "Add a subtitle"
- Classes: `h-8 editor-subtitle-textarea ... mt-1 text-gray-600 resize-none w-full`

```bash
agent-browser fill "textarea.editor-subtitle-textarea" "Your subtitle here"
```

#### 5. Eye Icon Buttons (Visibility Toggles)

Four "Eye icon" buttons control visibility of sections in email vs web:
1. Featured image visibility
2. Title visibility
3. Subtitle visibility
4. Authors/tags visibility

```bash
# These buttons toggle content visibility for email/web
agent-browser snapshot -i  # Find buttons labeled "Eye icon"
```

### Tiptap Editor (Main Content Body)

- Container: `div.tiptap.ProseMirror.pb-[42rem]`
- Attribute: `contenteditable="true"`, `translate="no"`, `tabindex="0"`
- The editor is a standard ProseMirror/tiptap instance

#### Status Bar (above editor)

Shows: Draft status | Sync status | Word count (e.g., "685 words") | Size gauge

#### Supported Content Node Types

| Node | HTML Tag | CSS Class | Notes |
|------|----------|-----------|-------|
| Heading 3 | `<h3>` | none | Main section headings (linked) |
| Heading 4 | `<h4>` | none | Sub-section headings |
| Heading 5 | `<h5>` | none | Small headings, used for navigation links |
| Heading 6 | `<h6>` | none | Label headings (e.g., "GUIDE") |
| Paragraph | `<p>` | none | Body text |
| Bullet List | `<ul>` | none | Unordered lists |
| List Item | `<li>` | none | With `<p>` inside for content |
| Horizontal Rule | `<div>` | `data-type="horizontalRule"` | Section dividers |
| Image Block | `<div>` | `react-renderer node-imageBlock` | Contains `<figure data-type="imageBlock">` |
| Advertisement | `<div>` | `react-renderer node-advertisementSearch` | Ad placement blocks |
| Poll | `<div>` | `react-renderer node-poll` | Reader feedback polls |
| Node Indicator | `<div>` | `node-indicator node-indicator--anchor ProseMirror-widget` | Left gutter "+" markers |

#### Inline Formatting

| Format | HTML | Usage |
|--------|------|-------|
| Bold | `<strong>` | Key phrases, section labels ("What's new?", "Why it matters?") |
| Link | `<a href="...">` | Inline and heading links |
| Superscript | `<sup>` | Used in header nav links |
| Subscript | `<sub>` | Used in footer links |
| Image (inline) | `<img>` inside text | Emoji-style icons in headings |

#### Writing Content to the Editor

The tiptap editor is contenteditable. To write content:

```bash
# Click into the editor
agent-browser click ".tiptap.ProseMirror"

# For simple text, click at position and type
agent-browser click ".tiptap.ProseMirror p"
agent-browser press "End"
agent-browser press "Enter"
agent-browser keyboard type "Your new paragraph text"

# Select all content and replace (nuclear option)
agent-browser click ".tiptap.ProseMirror"
agent-browser press "Control+a"
agent-browser press "Backspace"
# Then type/paste new content
```

#### Recommended: Set Content via Clipboard Paste

The most reliable way to insert formatted HTML into the tiptap editor
is to write it to the clipboard and paste:

```bash
# 1. Write HTML content to a temp file
cat > /tmp/post-content.html << 'EOF'
<h3>My Headline</h3>
<p><strong>What's new?</strong> Your content here...</p>
EOF

# 2. Use JS to copy that HTML to clipboard
agent-browser eval 'fetch("/tmp/post-content.html").then(r=>r.text()).then(html=>{var blob=new Blob([html],{type:"text/html"});return navigator.clipboard.write([new ClipboardItem({"text/html":blob})])})'

# 3. Focus editor, select all, paste
agent-browser click ".tiptap.ProseMirror"
agent-browser press "Control+a"
agent-browser press "Control+v"
```

Alternatively, type content line by line using keyboard shortcuts
for formatting (Control+b for bold, etc.).

---

## AD MONETIZATION (beehiiv Ad Network)

beehiiv has a built-in ad network. You can claim up to **5 offers at a time** and must
publish within **5 days** of claiming. Offers have limited availability and disappear once filled.

### CRITICAL: How Ad Placement Works

There are TWO ways to add ads, and only ONE is correct:

| Method | How | Result | Use this? |
|--------|-----|--------|-----------|
| **Click "Select offer" in-editor slot** | Click the "Select offer" button inside an existing `node-advertisementSearch` block in the editor | Ad is placed **in that exact slot position** | **YES, ALWAYS** |
| **Click "Browse available ad offers" banner** | Click the banner button above the editor | Ad lands at **index 0 (top of editor)**, wrong position | **NO, NEVER** |

**NEVER use "Browse available ad offers" from the banner.** It places ads at the top of the
editor. Moving them via DOM manipulation (`insertBefore`, `remove`) **breaks their React state**
permanently. The ad shows "No advertisement selected" and cannot be recovered even after
page reload. Mouse drag does not work in headless/CDP mode either.

**TWO CORRECT METHODS (in priority order):**

1. **Template "Select offer" slots** (preferred): The `daily_gen_ai_news` template has ad
   slots pre-positioned at the correct locations. Click "Select offer" on those slots to
   claim in-place. Use this when the template slots are still intact.

2. **Slash command insertion** (fallback): If template slots are gone or you need to add
   ads to a blank post, use the tiptap slash command to insert an ad at cursor position.
   Position cursor, trigger "/" menu, select "Ad Network", claim an offer. The ad is placed
   at the cursor position. This is the ONLY reliable way to place ads without template slots.
   
   To trigger the slash menu via JS (since `press "/"` and `keyboard type "/"` are unreliable):
   ```bash
   agent-browser eval 'var ed = document.querySelector(".tiptap.ProseMirror"); ed.dispatchEvent(new KeyboardEvent("keydown",{key:"/",code:"Slash",keyCode:191,bubbles:true})); ed.dispatchEvent(new KeyboardEvent("keypress",{key:"/",code:"Slash",keyCode:191,bubbles:true})); document.execCommand("insertText",false,"/"); ed.dispatchEvent(new KeyboardEvent("keyup",{key:"/",code:"Slash",keyCode:191,bubbles:true}))'
   ```
   Then wait 1s and click "Ad Network":
   ```bash
   agent-browser wait 1000
   agent-browser eval 'var tippy = document.querySelector("[data-tippy-root]"); var items = tippy.querySelectorAll("button"); items.forEach(function(item){ if(item.textContent.trim()==="Ad Network") item.click(); })'
   ```

### Ad Placement Rules (STRICT)

| Rule | Detail |
|------|--------|
| **Max ads per issue** | 3 (hard limit, never exceed) |
| **Primary ad** | Exactly 1. No header label. Placed after headline bullets, before "*Partner with us". |
| **Secondary ads** | 0, 1, or 2. Each MUST have a `SPONSORED BY [BRAND]` H6 header directly above it. |
| **Header format** | `<h6><span style="...">SPONSORED BY BRANDNAME</span></h6>` (uppercase, matches GUIDE style) |

### Ad Slot Positions in the `daily_gen_ai_news` Template

The template has **2 ad slots** (can add a 3rd secondary via slash command if needed):

| Slot | Type | Position | Header | Best for |
|------|------|----------|--------|----------|
| **Slot 1** | Primary | After headline bullets, before "*Partner with us" | None | CPM ads (high impressions) |
| **Slot 2** | Secondary | Between Story 2 and Story 3 | `SPONSORED BY [BRAND]` H6 above | CPC ads (engaged readers) |
| **Slot 3** (optional) | Secondary | Between "Everything else" and "Reading List" | `SPONSORED BY [BRAND]` H6 above | CPC ads (deep readers) |

### Claiming Ads (Correct Workflow)

```bash
# 1. Find "Select offer" buttons in the editor (there should be 2)
agent-browser eval 'var ed = document.querySelector(".tiptap.ProseMirror");
  var slots = ed.querySelectorAll(".node-advertisementSearch");
  JSON.stringify(Array.from(slots).map(function(s,i){
    return {index: Array.from(ed.children).indexOf(s), text: s.textContent.trim()};
  }))'

# 2. Click the FIRST "Select offer" slot's button directly
agent-browser eval 'var slot = document.querySelectorAll(".node-advertisementSearch")[0];
  slot.scrollIntoView({block:"center"});
  slot.querySelector("button").click()'

# 3. Offers modal opens. Find and claim by estimated earnings (highest first)
agent-browser snapshot -i  # Find "Claim" buttons next to offer names

# 4. Click Claim for the desired offer
agent-browser click @ref

# 5. Angle selection modal: check if "Confirm & add to post" is enabled
#    If disabled, the offer may already be claimed on another post. Go Back and pick another.
agent-browser snapshot -i  # Look for "Confirm & add to post" [disabled] or not
agent-browser find role button click --name "Confirm"  # Only if not disabled

# 6. Dismiss confirmation
agent-browser wait 1000
agent-browser find role button click --name "Done"

# 7. Repeat for SECOND "Select offer" slot
agent-browser eval 'var slots = document.querySelectorAll(".node-advertisementSearch");
  if(slots.length > 0){ slots[0].scrollIntoView({block:"center"}); slots[0].querySelector("button").click(); }'
# ... same claim flow
```

### "SPONSORED BY [BRAND]" Label

The template has an H6 heading `SPONSORED BY HUBSPOT` before the second ad slot.
After claiming the second ad, **rename this to match the actual advertiser**:

```bash
agent-browser eval 'var ed = document.querySelector(".tiptap.ProseMirror");
  for(var i=0;i<ed.children.length;i++){
    if(ed.children[i].tagName==="H6" && ed.children[i].textContent.indexOf("SPONSORED BY")>-1){
      var span = ed.children[i].querySelector("span");
      if(span) span.textContent = "SPONSORED BY BRANDNAME";
      else ed.children[i].textContent = "SPONSORED BY BRANDNAME";
      break;
    }
  } ed.dispatchEvent(new Event("input",{bubbles:true}))'
```

Replace `BRANDNAME` with the actual advertiser name (e.g., DEEL, CYTONICS, PROTON).
Always use UPPERCASE to match the template style.

**Note:** The template may say "PRESENTED BY" from older versions. Always rename to
"SPONSORED BY [BRAND]" to match current convention. Primary ads have NO header label.

### Offer Selection Strategy

When choosing which offer to claim, evaluate in this order:

1. **Estimated earnings** (highest first, not just rate)
2. **Rate model**: CPM for Slot 1 (high position = more impressions), CPC for Slot 2
3. **Audience relevance**: Tech/AI advertisers perform better than generic finance
4. **Availability**: Check for "Ends in X days" urgency markers
5. **Confirm button state**: If "Confirm & add to post" is **disabled**, the offer is
   already claimed on another post or has conflicts. Go Back and pick a different one.

**Good fits for AI/tech audience:** Deel, Superhuman AI, Mintlify, Proton, WarpStream,
The Deep View, 1440 Media

**Avoid for this audience:** Fisher Investments, generic finance offers

### Troubleshooting Ads

| Problem | Cause | Fix |
|---------|-------|-----|
| Ad shows "No advertisement selected" | DOM manipulation broke React state | Delete the broken ad block, reload page, re-claim via "Select offer" slot |
| "Confirm & add to post" is disabled | Offer already claimed on another post | Go Back, pick a different offer |
| Ad lands at top of editor | Used "Browse available ad offers" banner | NEVER do this. Delete the ad. Use template "Select offer" slots, or slash command "/" > Ad Network at correct cursor position. |
| Template ad slots gone | Content replacement removed them, or ads were claimed then broken | Use slash command to insert fresh ad at cursor position: position cursor, trigger "/" via JS KeyboardEvent + execCommand, click "Ad Network" in tippy menu. |
| Empty H5/P elements appear around ads | React wrapper artifacts from DOM manipulation | Ignore if ads work. If ads are broken, reload and re-claim |
| Ad slot disappears after claiming | Normal behavior | The `node-advertisementSearch` is replaced by `node-advertisementOpportunity` |

### Ad Node Types in Editor

| Node | CSS Class | Description |
|------|-----------|-------------|
| Unclaimed slot | `react-renderer node-advertisementSearch` | "Select offer" placeholder. **Click this to claim.** |
| Claimed ad | `react-renderer node-advertisementOpportunity` | Active ad. Shows "Advertisement" label + brand. **Do not move via DOM.** |

---

## AUDIENCE TAB

### Publish Target

Three options (button group):
- **Email and web** (default)
- **Email only**
- **Web only**

```bash
agent-browser find role button click --name "Email and web"
```

### Email Audience

- **Tiers**: Checkbox list (e.g., "All subscribers")
- **Include and exclude segments**: Toggle switch
  - Included segments: Searchable dropdown ("Search and select")
  - Excluded segments: Searchable dropdown with tags (e.g., "Bounced 0 subscribers", "0 Openers 30 6,347 subscribers")

### Web Audience

- Same tier structure as Email audience

---

## EMAIL TAB

### Sending Details

#### Subject Line
- Input field, 35/200 char limit shown
- "A/B test" toggle available
- Default: same as post title unless modified

```bash
agent-browser snapshot -i  # Find the subject line input
agent-browser fill @ref "Your subject line here"
```

#### Preview Text
- Input field, 84/200 char limit shown
- Default: same as post subtitle unless modified

```bash
agent-browser snapshot -i  # Find the preview text input
agent-browser fill @ref "Preview text here..."
```

### Email Header Buttons

Toggles for:
- **Socials** (share buttons) - off by default
- **Likes & Comments** - off by default

### Advanced Settings

Expandable section with additional email configuration.

---

## WEB TAB

### Post URL

- Base URL shown: `https://polygraph.beehiiv.com/p/`
- Slug input: `input[required]` with current slug (e.g., "openai-s-pentagon-fallout-1")
- Auto-generated from title

```bash
agent-browser snapshot -i  # Find the slug textbox
agent-browser fill @ref "your-custom-slug"
```

### Post Thumbnail

- Same image as Compose tab thumbnail
- Toggle: "Show thumbnail on top in web"

### Advanced Email Capture

- Popup configuration dropdown

### Comments

- Dropdown: "All subscribers" (who can comment)

### SEO Fields

- **Title**: Input for SEO title (defaults to post title)
- **Description**: Input for SEO description (defaults to subtitle)

### Social Sharing

- **Open Graph (Facebook and LinkedIn)**: Expandable, custom title/description/image
- **X (previously Twitter)**: Expandable, custom card settings

### Post Visibility

- "Hide the post from feed" toggle
- "Feature the post" button
- "Manage featured posts" link

### Advanced Settings

Expandable section.

---

## REVIEW TAB

Final pre-publish screen. Shows:
- **Back** button
- **Schedule** button (replaces "Next")
- **Preview** button
- Summary of post settings

---

## Content Template (Exact HTML Reference)

Extracted from reference post `53bd0872`. Every new post MUST follow this exact
formatting. The HTML below strips `data-id`, `data-anchor-*`, and node-indicator
widgets for clarity. Those are auto-generated by tiptap.

### Canonical URLs (hardcoded across all issues)

| Purpose | URL |
|---------|-----|
| Subscribe | `https://aigenart.beehiiv.com/subscribe` |
| Best AI UseCases | `https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders` |
| Advertise / Partner | `https://app.beehiiv.com/direct_sponsorships/ccff88d5-71cf-43e9-a766-50baba847be5` |
| AI Prompts bundle | `https://godofprompt.ai/complete-ai-bundle?via=aigenart` |
| GPT Prompting Guide | `https://cookbook.openai.com/examples/gpt4-1_prompting_guide` |
| 601 use cases | `https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders` |
| Prompt Eng 101 | `https://www.kaggle.com/whitepaper-prompt-engineering` |
| 100+ AI tools | `https://github.com/mahseema/awesome-ai-tools` |

### Element-by-Element Breakdown

**[0] H5 - Header Nav (CENTERED, superscript, linked)**
```html
<h5 style="text-align: center;">
  <a target="_blank" rel="noopener noreferrer nofollow" class="link"
     href="https://aigenart.beehiiv.com/subscribe"><sup>Subscribe for Free</sup></a>
  <sup> | </sup>
  <a target="_blank" rel="noopener noreferrer nofollow" class="link"
     href="https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders"><sup>Best AI UseCases</sup></a>
  <sup> | </sup>
  <a target="_blank" rel="noopener noreferrer nofollow" class="link"
     href="https://app.beehiiv.com/direct_sponsorships/ccff88d5-71cf-43e9-a766-50baba847be5"><sup>Advertise with us</sup></a>
</h5>
```
Key: `text-align: center`, `<sup>` wraps text inside each `<a>`, pipes are `<sup> | </sup>`.

**[1] P - Intro paragraph (plain text)**
```html
<p>DYNAMIC CONTENT. 2-3 sentences hooking today's stories. Use em-dash (&#8212;).</p>
```

**[2] H5 - "Today in AI:" (bold, leading space for icon)**
```html
<h5><strong> Today in AI:</strong></h5>
```
Key: entire content wrapped in `<strong>`. Leading space before "Today" is intentional (icon spacing).

**[3] UL - Headline bullets (plain text, no bold)**
```html
<ul>
  <li><p>Headline 1 summary &#8212; short teaser</p></li>
  <li><p>Headline 2 summary</p></li>
</ul>
```
Key: bullets are plain text, NOT bold. Each `<li>` wraps a `<p>`. Use em-dashes.

**[4] AD - Advertisement block (claimed via ad network)**
Placed automatically when claimed. See Ad Monetization section.

**[5] H5 - "Partner with us" (RIGHT-ALIGNED, subscript, linked)**
```html
<h5 style="text-align: right;">
  <sub>*</sub>
  <a target="_blank" rel="noopener noreferrer nofollow" class="link"
     href="https://app.beehiiv.com/direct_sponsorships/ccff88d5-71cf-43e9-a766-50baba847be5"><sub>Partner with us&#8594;</sub></a>
</h5>
```
Key: `text-align: right`, uses `<sub>` (subscript not superscript), `*` is outside the link, arrow is `&#8594;`.

**[6] HR - Horizontal rule**
```html
<div data-type="horizontalRule" contenteditable="false"><hr></div>
```

**[7] H3 - Story headline (entire text is a link to source)**
```html
<h3><a target="_blank" rel="noopener noreferrer nofollow" class="link"
       href="SOURCE_ARTICLE_URL">Story Headline &#8212; With Subtitle</a></h3>
```
Key: the ENTIRE heading text is wrapped in one `<a>` link pointing to the source article.

**[8] P - "What's new?" + body**
```html
<p><strong>What&#8217;s new?</strong> Body text here with em-dashes (&#8212;) between clauses.</p>
```
Key: uses smart curly apostrophe `&#8217;` (Unicode \u2019), NOT straight quote.

**[9] P - "What matters?" (standalone bold paragraph)**
```html
<p><strong>What matters?</strong></p>
```

**[10] UL - Key bullet points (with bold highlights and inline links)**
```html
<ul>
  <li><p><a target="_blank" rel="noopener noreferrer nofollow" class="link"
            href="URL"><strong>Linked bold phrase</strong></a> rest of the bullet text &#8212; using em-dashes.</p></li>
  <li><p>Text with <strong>bold highlight phrase</strong> and more text.</p></li>
</ul>
```
Key: bold key phrases inline, links wrap `<strong>` text when linking out.

**[11] P - "Why it matters?" (standalone bold paragraph)**
```html
<p><strong>Why it matters?</strong></p>
```

**[12] P - Analysis paragraph (plain text)**
```html
<p>Plain analysis text. No bold. Use em-dashes for flow.</p>
```

**[13] HR**

**[14] H6 - "GUIDE" label (custom inline font style)**
```html
<h6><span style="font-size: 14px; font-weight: 400; font-family: Helvetica, Arial, sans-serif; color: rgb(34, 34, 34);">GUIDE</span></h6>
```
Key: NOT bold. Uses inline `<span>` with specific font styling.

**[15] DIV - Image block (with caption)**
```html
<div class="react-renderer node-imageBlock">
  <figure data-type="imageBlock" data-caption-visible="true">...</figure>
</div>
```
Caption format: `Credits: <a href="LINKEDIN_URL">Author Name</a>`

**[16] HR**

**[17-22] Story 2 - Same structure as Story 1 (elements 7-12)**

**[23] HR**

**[24] AD - Second advertisement block**

**[25] HR**

**[26] H3 - "Everything else in AI" (left-aligned, plain text, NO bold)**
```html
<h3 style="text-align: left;">Everything else in AI</h3>
```
Key: NOT bold, NOT linked. Plain text with left alignment.

**[27-29] P - News items (bold lead word + plain body)**
```html
<p><strong>Lead word/name</strong> rest of the news item using em-dashes.</p>
```
Key: Only the first word/name is bold. Rest is plain text.

**[30] HR**

**[31] H3 - "Essential AI Guides - Reading List:" (bold wrapped)**
```html
<h3><strong>Essential AI Guides - Reading List:</strong></h3>
```
Key: entire text wrapped in `<strong>`.

**[32] UL - Reading list (left-aligned, bold linked items)**
```html
<ul>
  <li><p style="text-align: left;"><a target="_blank" rel="noopener noreferrer nofollow" class="link"
       href="URL"><strong>Link text</strong></a><strong><sup>*</sup></strong></p></li>
  <li><p style="text-align: left;"><a target="_blank" rel="noopener noreferrer nofollow" class="link"
       href="URL"><strong>Link text</strong></a></p></li>
</ul>
```
Key: each `<p>` has `style="text-align: left;"`. Link text is bold. First item has `<strong><sup>*</sup></strong>` asterisk after link.

**[33] HR**

**[34] H3 - "Let us know!" (bold wrapped, left-aligned)**
```html
<h3 style="text-align: left;"><strong>Let us know!</strong></h3>
```

**[35] POLL - Reader feedback (react-renderer node-poll)**
This is a beehiiv poll widget block. It is NOT typed as HTML. It must be added via the editor UI (type `/` then select Poll, or copy from an existing post).
Options: "What did you think of today's email?" with choices:
- `&#127919;&#127919;&#127919;&#127919;&#127919; It was awesome`
- `&#128077;&#128077;&#128077; It was okay`
- `&#128200; Can do better`

**[36] HR**

**[37] H4 - "Work with us" (JUSTIFY-aligned, plain text)**
```html
<h4 style="text-align: justify;">Work with us</h4>
```
Key: NOT bold. `text-align: justify`.

**[38] P - Sponsorship CTA (JUSTIFY-aligned, mixed bold)**
```html
<p style="text-align: justify;">
  <strong>Reach 100k+ engaged </strong>Tech Professionals, Engineers, Managers and decision makers<strong>.</strong>
  Join brands like MorningBrew, HubSpot, Prezi, Nike, Ahref, Roku, 1440, Superhuman, and others in showcasing your product to our audience.
  <a target="_blank" rel="noopener noreferrer nofollow" class="link"
     href="https://app.beehiiv.com/direct_sponsorships/ccff88d5-71cf-43e9-a766-50baba847be5"><strong>Get in touch now &#8594;</strong></a>
</p>
```
Key: "Reach 100k+ engaged " is bold (note trailing space), middle text is plain, period after "decision makers" is bold, "Get in touch now &#8594;" is bold+linked.

### Title and Subtitle Formatting

- **Title**: Has a leading space before the text (e.g., `" OpenAI's Pentagon Fallout"`)
- **Subtitle**: Starts with "PLUS: " prefix (e.g., `"PLUS: Samsung Is Putting Gemini..."`)

### Typography Rules

- Use em-dash `&#8212;` (or `\u2014`) between clauses, NOT double hyphen
- Use smart curly apostrophe `&#8217;` (or `\u2019`) in contractions like "What's"
- Use right arrow `&#8594;` (or `\u2192`) in CTAs like "Partner with us&#8594;"
- All links use `target="_blank" rel="noopener noreferrer nofollow" class="link"`

---

## Workflow: Create a New Post (TEMPLATE-BASED, preferred)

Always use `daily_gen_ai_news` template. It has correct formatting, ad slots,
poll, reading list, and footer pre-built. Only replace dynamic content.

### Step 1: Create from Template

```bash
agent-browser open "https://app.beehiiv.com/posts/template-library?tab=my_templates"
agent-browser wait --load networkidle
# Click the daily_gen_ai_news template card overlay button
agent-browser eval 'var h3s = document.querySelectorAll("h3"); h3s.forEach(function(h){ if(h.textContent.trim()==="daily_gen_ai_news"){ var card = h.closest("[class*=border][class*=group]"); if(card){ var btn = card.querySelector("button.absolute"); if(btn) btn.click(); }}})'
agent-browser wait --load networkidle
```

### Step 2: Set Title and Subtitle

IMPORTANT: Use `agent-browser fill`, NOT JS value setter (doesn't persist).
Title: leading space + main story. Subtitle: "PLUS: " prefix.

```bash
agent-browser fill "textarea.editor-title-textarea" " Title Here"
agent-browser fill "textarea.editor-subtitle-textarea" "PLUS: Second Story, and Third Story"
```

### Step 3: Replace Dynamic Content via Base64 JS

Write JS to /tmp/replace-content.js. Find elements by text content (never index).
Encode and run via base64 to avoid special character issues:

```bash
JS_B64=$(base64 -i /tmp/replace-content.js | tr -d '\n')
agent-browser eval "atob('${JS_B64}')"
```

Replace: intro P, headline UL items, 3x story (H3 linked headline, What's new P,
bullet UL, analysis P), Everything else P items.
Keep: nav H5, Partner H5, ad slots, HRs, GUIDE, image, reading list, poll, footer.

### Step 4: Claim Ads via In-Editor "Select offer" Slots

CRITICAL: Click "Select offer" button INSIDE the editor slot, NOT the
"Browse available ad offers" banner. Slot-based approach places ads in position.

```bash
# Click FIRST "Select offer" slot
agent-browser eval 'var s=document.querySelectorAll(".node-advertisementSearch")[0]; if(s){s.scrollIntoView({block:"center"});s.querySelector("button").click()}'
agent-browser wait 1000
# Pick highest-earning offer, Claim, Confirm, Done
# Then click SECOND slot (now [0] since first was replaced)
agent-browser eval 'var s=document.querySelectorAll(".node-advertisementSearch"); if(s.length>0){s[0].scrollIntoView({block:"center"});s[0].querySelector("button").click()}'
```

After claiming second ad, rename SPONSORED BY to match the brand:
```bash
agent-browser eval 'var ed=document.querySelector(".tiptap.ProseMirror"); for(var i=0;i<ed.children.length;i++){if(ed.children[i].tagName==="H6"&&ed.children[i].textContent.indexOf("SPONSORED BY")>-1){var s=ed.children[i].querySelector("span");if(s)s.textContent="SPONSORED BY BRANDNAME";else ed.children[i].textContent="SPONSORED BY BRANDNAME";break;}}ed.dispatchEvent(new Event("input",{bubbles:true}))'
```

If "Confirm & add to post" is DISABLED, the offer is already claimed
on another post. Go Back and pick a different offer.

### Step 5: Configure Tabs (Audience, Email, Web)

After composing content and claiming ads, check each tab before review:

**Audience tab** (usually no changes needed):
- Verify "Email and web" is selected
- Verify "All subscribers" tier is checked
- Verify excluded segments are set (Bounced, 0 Openers)

**Email tab** (MUST update subject line and preview text):
```bash
agent-browser find role button click --name "Email"
agent-browser wait --load networkidle
agent-browser snapshot -i  # Find subject and preview textboxes
# Subject line: short, punchy, matches main story (under 60 chars)
agent-browser fill @ref "Your subject line here"
# Preview text: teaser covering all 3 stories (under 150 chars)
agent-browser fill @ref "Story 1 teaser. Story 2 teaser. Story 3 teaser."
```
The subject line and preview text default to the TEMPLATE's old content.
You MUST replace them every time or the email goes out with wrong text.

**Web tab** (usually auto-populated correctly):
- Verify slug matches the story (auto-generated from title)
- Verify SEO meta title and description are correct (auto-pulled from title/subtitle)
- Comments: "All subscribers"

### Step 6: Verify

```bash
agent-browser eval 'var ed=document.querySelector(".tiptap.ProseMirror");var a=ed.querySelectorAll(".node-advertisementOpportunity");var s=ed.querySelectorAll(".node-advertisementSearch");JSON.stringify({claimedAds:a.length,emptySlots:s.length})'
```
Expected: `{claimedAds: 2, emptySlots: 0}`

### Template: `daily_gen_ai_news` (3 stories + sponsored section)

```
[H5 center]    Nav links (Subscribe | Best AI UseCases | Advertise)
[P]            Intro paragraph
[H5]           Today in AI: (strong, leading space)
[UL]           3 headline bullets
[AD SLOT 1]    "Select offer" - after headlines (best for CPM)
[H5 right]     *Partner with us
[HR]
[H3]           Story 1 (linked headline)
[P/P/UL/P/P]  What's new, What matters, bullets, Why, analysis
[HR]
[H6]           GUIDE (custom font span)
[DIV]          Image block with caption
[HR]
[H3]           Story 2 (linked headline)
[P/P/UL/P/P]  What's new, What matters, bullets, Why, analysis
[HR]
[H6]           SPONSORED BY [BRAND] (rename after ad claim)
[AD SLOT 2]    "Select offer" - mid-read (best for CPC)
[H5 right]     *Partner with us
[HR]
[H3]           Story 3 (linked headline)
[P/P/UL/P/P]  What's new, What matters, bullets, Why, analysis
[HR]
[H3]           Everything else in AI (plain, left-aligned)
[P] x3-4       News items (bold lead word)
[HR]
[H3]           Essential AI Guides (strong) - DO NOT MODIFY
[UL]           5 canonical links - DO NOT MODIFY
[HR]
[H3]           Let us know! (strong)
[POLL]         3 emoji options - DO NOT MODIFY
[HR]
[H4 justify]   Work with us - DO NOT MODIFY
[P justify]    CTA paragraph - DO NOT MODIFY
```

## Workflow: Edit an Existing Post

```bash
agent-browser open "https://app.beehiiv.com/posts/{post-id}/edit"
agent-browser wait --load networkidle
# Make edits using text-match JS patterns (never by index)
# Changes auto-save (status shows "Synced")
```

---

## Operational Lessons (What Works, What Breaks)

### Things That Work

| Technique | Notes |
|-----------|-------|
| `agent-browser fill` for title/subtitle | Triggers React state. Always use this. |
| Base64-encoded JS for content replacement | Avoids `/` parsing issues with file-based eval. |
| Finding elements by text content | Robust against index shifts. |
| Claiming ads via in-editor "Select offer" | Ad placed in correct position automatically. |
| Slash command "/" > Ad Network at cursor | Fallback when template slots are gone. Trigger via JS: KeyboardEvent("keydown/press/up") + execCommand("insertText","/"). Wait 1s, click "Ad Network" button in tippy menu. Ad is placed at cursor. |
| Cursor positioning via Range API | `document.createRange()` + `setStartBefore(targetElement)` to place cursor precisely before inserting ads. |
| Template-based post creation | Preserves formatting, ad slots, poll, footer. |

### Things That Break (NEVER DO)

| Technique | What goes wrong |
|-----------|----------------|
| DOM `insertBefore`/`remove` on ad blocks | Permanently breaks React state. Ad becomes unrecoverable. |
| `keyboard type` with pipe char | CDP "Invalid text parameter" error. |
| File-based eval with URLs containing `//` | "Invalid regular expression flags". Use base64. |
| JS textarea value setter | Doesn't trigger React sync. Reverts on reload. |
| Mouse drag for ad repositioning | Doesn't trigger tiptap drag events in CDP mode. |
| "Browse available ad offers" banner | Places ad at index 0 (wrong). Use in-editor slots. |

### Tips

- **Auto-save**: No save button needed. Status shows "Draft | Synced".
- **Undo/Redo**: `Control+z` / `Control+Shift+z` in tiptap editor.
- **Refs change**: Snapshot `@e` refs regenerate each call. Re-snapshot before clicking.
- **Cloudflare**: Blocks headless. User solves challenges in headed Chrome.
- **Ad expiry**: 5 days after claiming. Publish before deadline.
