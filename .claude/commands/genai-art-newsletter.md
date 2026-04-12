Generate the GenAI Art newsletter using the genai-art-newsletter skill.

Follow all steps in the SKILL.md file at .claude/skills/genai-art-newsletter/SKILL.md to:
1. Fetch content from configured data sources (Google News, Hacker News, Reddit, AI company blogs) or from provided URLs
2. Pick the top 4 stories
3. Write a subject line and pre-header
4. Write story segments for each story
5. Write the newsletter intro
6. Write "The Shortlist" section
7. Assemble and output the complete newsletter

If no URLs are provided, the skill automatically fetches from the pre-configured non-RSS data sources (AI company blogs, news aggregators, Reddit feeds).

Arguments: $ARGUMENTS (optional — URLs separated by spaces, or a path to a file containing URLs one per line. If omitted, uses configured data sources automatically.)
