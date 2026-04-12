Generate the GenAI Art newsletter using the genai-art-newsletter skill.

Follow ALL steps in the SKILL.md file at .claude/skills/genai-art-newsletter/SKILL.md sequentially:

## Part 1: Content Generation

0. **Parse Input & Discover Content** — Read data sources config. If $ARGUMENTS provides URLs, use those. Otherwise, fetch newsletter archive pages (The Neuron, Futurepedia, Superhuman, The Rundown AI, TAAFT, Ben's Bites) and extract the latest article URLs.
1. **Fetch Article Content** — Use WebFetch to retrieve full content from each article URL. Extract title, author, date, links, and body text (~500 words per source, target 10-15 articles).
2. **Pick Top Stories** — Apply story selection criteria to choose the 3 best stories. Lead story must be the catchiest for email opens.
3. **Write Subject Line** — Generate subject line (7-9 words), pre-header (15-20 words, "PLUS:" format), and 5-8 alternatives.
4. **Write Story Segments** — Write 3 segments using "What's new / What matters / Why it matters" structure with writing style, hyperlinking rules, and word blacklist.
5. **Write Intro** — Generate intro with personalized greeting, lead story paragraphs, "In today's GenAI Art:" transition, and 3 bullet points.
6. **Write The Shortlist** — From remaining content (not main 3 stories), write 3-5 summaries in "**Bold** [verb](URL) description" format.
7. **Assemble Final Newsletter** — Combine all sections using the assembly template and full newsletter example as reference. Output as single markdown document.

## Part 2: Publish to beehiiv

8. **Browser Setup** — Verify agent-browser is connected to Chrome via CDP on port 9222. If not connected, guide user to launch Chrome with remote debugging.
9. **Create Post from Template** — Open beehiiv template library, click the daily_gen_ai_news template to create a new post.
10. **Fill Title, Subtitle, Thumbnail, and Content** — Fill title (with leading space), subtitle (PLUS: prefix), upload thumbnail, and replace template placeholders with newsletter content using base64-encoded JS eval.
11. **Claim Ads** — Place up to 3 ads (1 primary, up to 2 secondary). Use template "Select offer" slots when intact. Follow offer selection priority: estimated earnings > rate model > audience relevance.
12. **Configure Tabs and Verify** — Update Email tab (subject line, preview text), verify Audience tab, Web tab, and Review tab. Run final verification to confirm ads are claimed and no empty slots remain. Do NOT schedule unless user requests.

If no URLs are provided, the skill automatically fetches from the pre-configured newsletter archive sources.

Arguments: $ARGUMENTS (optional — URLs separated by spaces, or a path to a file containing URLs one per line. If omitted, uses configured data sources automatically.)
