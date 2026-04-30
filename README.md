# Aura Gym Tracker (React)

Aura is now converted to a modern React app using functional components and
hooks while preserving the original behavior, data model, and LocalStorage
logic.

## Tech Stack

- React + Vite
- Functional components + hooks
- Chart.js (analytics)
- Tailwind utility classes via CDN + existing custom CSS tokens

## Features

- **React-only Pages**: Landing page and dashboard are both rendered via React
  Router.
- **Workout Logging Modal** with dynamic exercises and sets
- **Dashboard Summary** with total workouts, volume load, and set count
- **History View** with full workout details and delete actions
- **Analytics View** with exercise progression chart
- **Theme Toggle** persisted in LocalStorage
- **Offline Persistence** using `aura_workouts_data`

## Scripts

- `npm install`
- `npm run dev`
- `npm start`
- `npm run build`
- `npm run preview`

## Routes

- `/` → Landing page
- `/dashboard` → Tracker dashboard app

## Suggested Folder Structure

```txt
src/
	components/
		AnalyticsPanel.jsx
		ExerciseItem.jsx
		ProgressChart.jsx
		ToastContainer.jsx
		TrackerDashboard.jsx
		WorkoutList.jsx
		WorkoutModal.jsx
	data/
		mockData.js
	services/
		workoutStorage.js
	utils/
		workoutUtils.js
	App.jsx
	main.jsx
styles/
	main.css
```

## Notes

- The original workout schema is preserved for compatibility.
- Existing LocalStorage data continues to work in the React app.
