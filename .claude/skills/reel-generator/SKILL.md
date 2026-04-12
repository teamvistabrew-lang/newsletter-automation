---
name: reel-generator
description: Generates Instagram Reels from newsletter content. Takes newsletter output (3 stories + subject line), converts to reel slides, and renders MP4 via Remotion. Use when the user wants to create a reel, generate a video, or make Instagram content from newsletter stories.
allowed-tools: Read Bash Write Glob Grep
---

# Newsletter Reel Generator

You generate Instagram Reels (MP4 video) from newsletter content using the Remotion project at `/Users/hari/Projects/newsletter-reels/`.

## Step 0: Get Newsletter Content

If `$ARGUMENTS` contains newsletter content (stories, headlines), use that directly.

If `$ARGUMENTS` is empty, check the current conversation for recently generated newsletter content. If none found, ask the user which newsletter to generate content for first.

## Step 1: Extract Reel Slides

From the newsletter content, extract exactly **4 slides** plus metadata:

### Slide 1 — Hook (the scroll-stopper)
- **title**: The subject line or a punchy rewrite of the lead story headline (max 7 words)
- **tag**: "BREAKING" or "AI NEWS" or relevant label
- **accent**: Comma-separated keywords to highlight in cyan (company names, key terms)
- **body**: Leave empty

### Slide 2 — Lead Story Details
- **title**: What happened (short, punchy — max 8 words)
- **tag**: "WHAT'S NEW"
- **body**: 3 bullet points from the lead story's "What matters?" section, separated by `•`
- **accent**: Key company/product names

### Slide 3 — Second Story
- **title**: Second story headline (max 8 words)
- **tag**: "ALSO TODAY"
- **body**: 1-2 sentence summary from the story
- **accent**: Key terms

### Slide 4 — Third Story or Takeaway
- **title**: Third story headline or a compelling takeaway line
- **tag**: "ONE MORE" or "BOTTOM LINE"
- **body**: 1 sentence summary or leave empty for a clean closing slide
- **accent**: Key terms

### Metadata
- **brandName**: The newsletter name (e.g., "GenAI Art", "Startup News AI", "Tech News", "The AI Brief")
- **handle**: The Instagram handle (default "@genaiart")
- **accentColor**: Primary accent color (default "#3B82F6")
- **accentColor2**: Secondary accent color (default "#8B5CF6")

## Step 2: Build Props JSON

Construct the Remotion props object:

```json
{
  "slides": [
    {"title": "...", "body": "", "tag": "BREAKING", "accent": "OpenAI,GPT-5"},
    {"title": "...", "body": "bullet 1•bullet 2•bullet 3", "tag": "WHAT'S NEW", "accent": "..."},
    {"title": "...", "body": "...", "tag": "ALSO TODAY", "accent": "..."},
    {"title": "...", "body": "...", "tag": "ONE MORE", "accent": "..."}
  ],
  "brandName": "GenAI Art",
  "handle": "@genaiart",
  "accentColor": "#3B82F6",
  "accentColor2": "#8B5CF6",
  "durationPerSlide": 5
}
```

## Step 3: Render the Reel

Run the Remotion render command:

```bash
cd /Users/hari/Projects/newsletter-reels && npx remotion render src/index.ts NewsRecapReel out/reel-YYYY-MM-DD.mp4 --codec=h264 --props='<JSON from Step 2>'
```

Use today's date in the filename.

If the render fails, check the error output and fix the props JSON (common issues: unescaped quotes, missing fields).

## Step 4: Output

After successful render:
1. Report the file path and size
2. Open the video: `open out/reel-YYYY-MM-DD.mp4`
3. Remind the user to add trending audio in CapCut or Instagram before posting

## Slide Writing Guidelines

- **Hook title**: Must stop the scroll. Use the subject line format — 5 words ideal, possessive format ("X's Y"), specific company/product names.
- **Keep text short**: Max 7-8 words per title. Each bullet max 15 words. Less text = more impact on video.
- **Accent words**: Always highlight company names, product names, and numbers. These get cyan glow in the video.
- **Bullets**: Use `•` to separate. Keep to exactly 3 bullets for the lead story slide.
- **Body text**: For non-bullet slides, keep to 1 short sentence or leave empty.

## Brand Presets

| Newsletter | brandName | handle | accentColor | accentColor2 |
|-----------|-----------|--------|-------------|-------------|
| GenAI Art | GenAI Art | @genaiart | #3B82F6 | #8B5CF6 |
| Startup News AI | Startup News AI | @startupnewsai | #F97316 | #EF4444 |
| Tech News | Tech News | @technews | #22D3EE | #3B82F6 |
| The AI Brief | The AI Brief | @theaibrief | #8B5CF6 | #3B82F6 |
