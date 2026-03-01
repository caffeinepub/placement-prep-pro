# Gars X – Skill Gap Analyzer Upgrade

## Current State
SkillGapAnalyzer.tsx shows role cards and a skill comparison table based on skills already stored in the backend (via `useSkills` hook). It has a readiness meter, skill comparison with levels, resources, and a basic improvement plan listing gaps. There is no free-text skill input from the user, no "Analyze My Skills" button, no ✅/❌ split view, no weekly roadmap, no project ideas, and no interview prep tips.

## Requested Changes (Diff)

### Add
- Skill input form below role cards: a comma-separated text input + "Analyze My Skills" button
- After analysis:
  - ✅ Skills You Have section (green chips/badges)
  - ❌ Skills Missing section (red chips/badges)
  - 📈 Skill Readiness Percentage with an animated progress bar
- Detailed Improvement Plan section:
  - 4-week weekly roadmap (per role)
  - Recommended topics per week
  - Practice suggestions
  - Project ideas
  - Interview preparation tips
- Smooth CSS/framer-motion-style animations when switching roles (fade + slide transition)
- Role short description shown prominently in the expanded section
- Required Skills list displayed as readable badge chips

### Modify
- SkillGapAnalyzer.tsx: replace the backend-dependent `useSkills` skill comparison with a client-side array comparison between typed skills and required skills list
- Role cards: clicking opens an animated expandable section below the grid
- The skills comparison section now uses the user's typed skills (not backend levels) for the ✅/❌ split

### Remove
- Dependency on `useSkills` backend hook for the skill comparison (keep it optional or remove entirely since input is now manual)
- The old progress-bar per skill (replaced by overall readiness % bar)

## Implementation Plan
1. Define per-role data: description, required skills (string array), 4-week improvement plan (topics, practice, projects, interview tips), resources
2. Add `userSkillsInput` state (string) and `analyzedSkills` state (parsed array)
3. Render expandable animated section below the cards on role selection
4. Show role title, emoji, description, and required skills as badge chips in the expanded area
5. Add textarea/input + "Analyze My Skills" button
6. On analyze: parse comma-separated input, normalize to lowercase for comparison, compute intersection (have) and difference (missing), calculate readiness %
7. Show ✅ Skills You Have (green badges), ❌ Skills Missing (red badges), and animated progress bar
8. Show Improvement Plan: 4-week roadmap cards, recommended topics, practice suggestions, project ideas, interview tips
9. Animate section entrance with CSS transitions (opacity + translateY), role switch resets state with fade-out/in
10. Ensure full responsiveness and dark/light mode support
