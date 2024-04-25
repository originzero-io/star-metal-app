import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import personelHttp from "services/personeller.http";
import { useUIContext } from "./UIProvider";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setSelectedPage } = useUIContext();

  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("star-metal-login")), // İlk değeri doğrudan localStorage'dan oku
  );
  const navigate = useNavigate();

  const login = async (_user) => {
    const data = await personelHttp.login(_user);
    localStorage.setItem("star-metal-login", JSON.stringify(data));
    setUser(data);
    navigate("/uretim/devam-eden");
    setSelectedPage("/uretim/devam-eden");
  };

  const logout = () => {
    localStorage.removeItem("star-metal-login");
    setUser(null);
    navigate("/giris", { replace: true });
    setSelectedPage("");
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
