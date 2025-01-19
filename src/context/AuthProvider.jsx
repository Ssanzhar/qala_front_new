import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [access, setAccess] = useState("");
  const [refresh, setRefresh] = useState("");
  const navigate = useNavigate();

  const login = async (username, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAccess(data.access);
      setRefresh(data.refresh);
      console.log(data);
      navigate("/");
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setAccess("");
    setRefresh("");
    navigate("/login");
  };

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (!refresh) return;

      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccess(data.access);
      } else {
        logout();
      }
    };
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{ refresh, setRefresh, access, setAccess, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
