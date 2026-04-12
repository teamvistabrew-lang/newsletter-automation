Analyze newsletter email performance using the newsletter-analysis skill.

Follow ALL steps in the SKILL.md file at .claude/skills/newsletter-analysis/SKILL.md to:

0. **Identify publication and date range** from arguments or defaults (Generative AI Art, 365 days)
1. **Browser setup** — headed Chrome with persistent profile, verify beehiiv session
2. **Collect post-level data** — scrape published posts list (subject, open rate, CTR, date, sent count)
3. **Collect report-level data** — Metabase Posts Report (aggregate metrics, top URLs, monthly trends)
4. **Subject line analysis** — length, brand mentions, patterns, word-level signals
5. **Content-performance correlation** — topic categories, day-of-week, link types, double winners
6. **Trend analysis** — monthly open/CTR trends, subscriber trajectory, unsubscribe patterns
7. **Generate recommendations** — subject line rules, content mix, format changes, send timing, link strategy, experiments
8. **Write output** — save to project analysis/ dir and Obsidian vault (if configured)

Arguments: $ARGUMENTS (optional — publication name and/or date range, e.g., "Generative AI Art last 90 days". Defaults to Generative AI Art, 365 days.)
