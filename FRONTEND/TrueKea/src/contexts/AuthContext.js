import React, { createContext, useState } from "react";
export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState({ id:1, name:"Test User", email:"user@truekea.com", isAdmin:true });
  const login = data => setUser(data);
  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
