# ENEM 31

ENEM 31 is a desktop study planner for the final 31 days before Brazil’s National High School Exam (ENEM). It combines a daily checklist, subject-specific topics, and progress tracking in a Brazilian Portuguese interface.

## Features

- A 31-day timeline with daily activities and topics for mathematics, languages, humanities, natural sciences, and essay writing.
- A developer preview of an editor for the daily study plan and checklist. To preview it in a browser, open `index.html` and append `#dev` to the file URL.
- XP, levels, streaks, and achievements tied to study activity.
- Local storage for progress and plan settings. On Windows, the app saves them in `%APPDATA%\ENEM31\storage.json`.

## Run locally

Install Node.js with npm, then run these commands from the repository root:

```sh
npm ci
npm start
```

To build the Windows installer and portable app, run `npm run build-win`. Electron Builder writes both outputs to `dist/`.

## Project structure

- `main.js` creates the Electron window.
- `preload.js` exposes local storage to the interface.
- `index.html`, `Css/`, `Javascript/`, and `Images/` contain the study planner interface, logic, and illustrations.
