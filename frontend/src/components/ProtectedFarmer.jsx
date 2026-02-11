import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedFarmer = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) {
      alert("Login first");
      navigate("/login", { replace: true });
      return;
    }

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      alert("Access denied. Only Owner/Admin allowed.");
      navigate("/404", { replace: true });
      return;
    }
  }, [navigate, allowedRoles]);

  // Don't render until check passes
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user) {
    return null;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
};

export default ProtectedFarmer;