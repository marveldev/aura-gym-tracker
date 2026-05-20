# Cleanup Analysis Report (20 May 2026)

Scope: conservative static analysis from `src/main.jsx` entrypoint, route map in
`src/App.jsx`, import graph, and dependency usage checks.

## 1) Unused files (high confidence)

| File                                           | Why it appears unused                                                                                | Imported anywhere                             | Risk if removed                                                                                                           |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/DashboardPage.jsx`                  | Not referenced in `src/App.jsx` routes; legacy multi-view container with old `?view=` redirect logic | No (0 reachable imports from app entry)       | **Low** if current routes are source of truth; **Medium** if someone still deep-links to legacy dashboard module manually |
| `src/components/TrackerDashboard.jsx`          | Only used by unused `DashboardPage.jsx`                                                              | Yes, only by `src/pages/DashboardPage.jsx`    | **Low** when removing/moving together with `DashboardPage.jsx`                                                            |
| `src/components/ExerciseRow.jsx`               | Not used by any active page/component in reachable graph                                             | No active imports                             | **Low** unless planned for upcoming workout list redesign                                                                 |
| `src/components/ExerciseApiImage.jsx`          | Only used by unused `ExerciseRow.jsx`                                                                | Yes, only by `src/components/ExerciseRow.jsx` | **Low** when moved with `ExerciseRow.jsx`                                                                                 |
| `src/components/ExerciseIllustration.jsx`      | No imports in project                                                                                | No                                            | **Low**                                                                                                                   |
| `src/components/dashboard/LoadingSkeleton.jsx` | No imports in dashboard components                                                                   | No                                            | **Low**                                                                                                                   |
| `src/vite-env.d.ts`                            | Type helper file is not referenced from runtime and project is JS-first                              | No runtime imports                            | **Low–Medium** (keep if future TS expansion is expected)                                                                  |

## 2) Duplicate or overlapping components

- `src/pages/DashboardPage.jsx` overlaps conceptually with current split routes
  (`/dashboard`, `/history`, `/analytics`, `/workout`, `/handbook`) and appears
  to be a legacy monolithic shell.
- `src/components/TrackerDashboard.jsx` overlaps with current dashboard UI path
  now implemented by `src/pages/Dashboard.jsx` plus
  `src/components/dashboard/*`.

## 3) Dead code findings

- Unused import in `src/App.jsx`: `HandbookPage` (removed during cleanup).
- Dead route logic in unused `DashboardPage.jsx` (`viewPathMap`, legacy
  query-param redirect handlers).
- Dead image fallback flow in unused `ExerciseApiImage.jsx`.

## 4) Unused images/assets

- No unused image files detected in workspace.
- `logo.svg` is actively used in landing/auth/frame views.
- Legacy files reference non-existent `src/assets/exercises/*.svg` paths; those
  references are dead because those files/components are not active.

## 5) Unused routes

- No unused route declarations in `src/App.jsx`.
- Legacy route-like behavior exists only in unused
  `src/pages/DashboardPage.jsx`.

## 6) Unused dependencies

Dependency check (`depcheck`) flagged:

- `typescript` (devDependency) as unused.

Conservative decision:

- Keep for now because repository still contains `tsconfig.json` and
  `src/api/wger.ts`; safe to remove later if you confirm no TS
  tooling/type-checking workflow is required.

## 7) Unused hooks/utilities

- `src/hooks/` folder exists but is empty.
- No unused utility file found (`src/utils/workoutUtils.js` is actively used).

## 8) Outdated example/demo candidates

High-confidence legacy/demo candidates moved to backup:

- `src/pages/DashboardPage.jsx`
- `src/components/TrackerDashboard.jsx`
- `src/components/ExerciseRow.jsx`
- `src/components/ExerciseApiImage.jsx`
- `src/components/ExerciseIllustration.jsx`
- `src/components/dashboard/LoadingSkeleton.jsx`
- `src/vite-env.d.ts`

---

## Safety notes

- Authentication, navigation, API services, shared active UI, workout data, and
  dashboard route flow were preserved.
- Build verification should be run after moves/removals (`npm run build`).
