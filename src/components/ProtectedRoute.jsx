import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function ProtectedRoute({ children }) {
	const { currentUser, isGuest } = useAuth()
	const location = useLocation()

	if (!currentUser && !isGuest) {
		return <Navigate to="/" replace state={{ from: location }} />
	}

	return children
}

export default ProtectedRoute
