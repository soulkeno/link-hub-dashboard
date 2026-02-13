import { Navigate } from "react-router-dom";

// Signup is now handled in the Login page with a toggle
const Signup = () => <Navigate to="/login" replace />;

export default Signup;
