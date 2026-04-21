# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root:

```bash
npm install        # install dependencies
npm run serve      # dev server with hot reload
npm run build      # production build (output: dist/)
npm run lint       # lint and auto-fix
```

## Deployment

Deployed via Vercel. `vercel.json` rewrites all routes to `index.html` for SPA support. Vercel auto-detects Vue CLI and uses `npm run build` with `dist/` as the output directory.

## Architecture

The app is a Vue 3 single-page quiz application built with Vue CLI. State is managed via Pinia stores.

**Data flow:**
1. User uploads a CSV file → `CsvReaderComponent` parses it with PapaParse and emits `questions-loaded`
2. `QuizComponent` receives the questions array, lets user set how many to attempt, then shuffles and starts the quiz
3. Each question is rendered by `QuestionComponent`, which emits `option-selected` back to `QuizComponent`
4. Correct answers increment `score`; wrong answers are pushed to `wrongAnswerStore`
5. After all questions, `QuestionSummaryComponent` renders each wrong answer with correct/user answer highlighted

**CSV format:** Each row is `question, correct_answer, option1, option2, option3, ...` — blank option cells are filtered out, so variable number of options per question is supported.

**Pinia stores (`src/`):**
- `counterStore.js` — tracks current question number (`count`, `increment`, `reset`)
- `wrongAnswerStore.js` — accumulates wrong answers for end-of-quiz review (`wrongQuestions`, `addWrongQuestion`, `resetWrongQuestions`)
- `store.js` — creates and exports the Pinia instance (registered in `main.js`)

**Styling:** Bootstrap 4.5.2 loaded via CDN in `public/index.html`. Dark theme (#1e1e1e background, white text) applied globally in `App.vue`.
