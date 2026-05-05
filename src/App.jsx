import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import AuthPage from "./pages/AuthPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import HandbookPage from "./pages/HandbookPage.jsx"
import HandbookSectionPage from "./pages/HandbookSectionPage.jsx"
import HandbookExerciseMusclePage from "./pages/HandbookExerciseMusclePage.jsx"
import HandbookExerciseDetailPage from "./pages/HandbookExerciseDetailPage.jsx"
import WorkoutPage from "./pages/WorkoutPage.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth" element={<AuthPage />} />
				<Route
					path="/onboarding"
					element={
						<ProtectedRoute>
							<OnboardingPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/workout"
					element={
						<ProtectedRoute>
							<WorkoutPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/handbook"
					element={
						<ProtectedRoute>
							<HandbookPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/handbook/:section"
					element={
						<ProtectedRoute>
							<HandbookSectionPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/handbook/exercises/:muscle"
					element={
						<ProtectedRoute>
							<HandbookExerciseMusclePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/handbook/exercises/:muscle/:exercise"
					element={
						<ProtectedRoute>
							<HandbookExerciseDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
