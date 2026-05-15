import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import WorkoutPage from "./pages/WorkoutPage"
import HistoryPage from "./pages/HistoryPage.jsx"
import AnalyticsPage from "./pages/AnalyticsPage.jsx"
import AuthPage from "./pages/AuthPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import HandbookPage from "./pages/HandbookPage.jsx"
import HandbookDashboardPage from "./pages/HandbookDashboardPage.jsx"
import HandbookSectionPage from "./pages/HandbookSectionPage.jsx"
import HandbookEncyclopediaTopicPage from "./pages/HandbookEncyclopediaTopicPage.jsx"
import HandbookNutritionPage from "./pages/HandbookNutritionPage.jsx"
import HandbookFoodPage from "./pages/HandbookFoodPage.jsx"
import HandbookFoodCategoryPage from "./pages/HandbookFoodCategoryPage.jsx"
import HandbookExerciseMusclePage from "./pages/HandbookExerciseMusclePage.jsx"
import HandbookExerciseDetailPage from "./pages/HandbookExerciseDetailPage.jsx"
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
					path="/history"
					element={
						<ProtectedRoute>
							<HistoryPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/analytics"
					element={
						<ProtectedRoute>
							<AnalyticsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/handbook"
					element={
						<ProtectedRoute>
							<HandbookDashboardPage />
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
					path="/handbook/nutrition/:macro"
					element={
						<ProtectedRoute>
							<HandbookNutritionPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/handbook/food"
					element={
						<ProtectedRoute>
							<HandbookFoodPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/handbook/food/:category"
					element={
						<ProtectedRoute>
							<HandbookFoodCategoryPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/handbook/encyclopedia/:topic"
					element={
						<ProtectedRoute>
							<HandbookEncyclopediaTopicPage />
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
