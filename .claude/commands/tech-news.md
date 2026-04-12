Generate the Tech News newsletter using the tech-news skill.

Follow all steps in the SKILL.md file at .claude/skills/tech-news/SKILL.md to:
1. Fetch content from configured tech news sources (TechCrunch, The Verge, Wired, Ars Technica, Reuters) or from provided URLs
2. Pick the top 3 stories
3. Write a subject line and pre-header
4. Write story segments for each story
5. Write the newsletter intro
6. Write "The Shortlist" section
7. Assemble and output the complete newsletter

If no URLs are provided, the skill automatically fetches from the 5 pre-configured tech news sources.

Arguments: $ARGUMENTS (optional — URLs separated by spaces, or a path to a file containing URLs. If omitted, uses configured data sources automatically.)
