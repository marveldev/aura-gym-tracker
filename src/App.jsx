import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import AuthPage from "./pages/AuthPage.jsx"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth" element={<AuthPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
