import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");
    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (role === "admin") navigate("/admin");
      else if (role === "employer") navigate("/employer");
      else if (role === "student") navigate("/student");
      else navigate("/jobs"); // Guest users go to jobs page
    } else {
      navigate("/");
    }
  }, [navigate, location]);

  return null;
}

export default AuthCallback;