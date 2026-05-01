import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function ProtectedRoute({ children }) {
	const { currentUser } = useAuth()
	const location = useLocation()

	if (!currentUser) {
		return <Navigate to="/" replace state={{ from: location }} />
	}

	return children
}

export default ProtectedRoute
