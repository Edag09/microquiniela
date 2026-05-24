import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getUser, saveUser } from "./firebase/collections";
import { logAction } from "./firebase/audit";

// Layout
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import BracketPage from "./pages/BracketPage";
import PredictionsPage from "./pages/PredictionsPage";
import AdminPage from "./pages/AdminPage";

// Auth
import LoginScreen from "./components/Auth/LoginScreen";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si ya hay sesión guardada
  useEffect(() => {
    const savedUser = localStorage.getItem("quinielaUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (name, isAdmin = false) => {
    // Generamos un ID simple basado en el nombre
    const userId = name.toLowerCase().replace(/\s/g, "_") + "_" + Date.now();

    // Verificar si ya existe el usuario
    let existingUser = null;
    const savedUser = localStorage.getItem("quinielaUser");
    if (savedUser) {
      existingUser = JSON.parse(savedUser);
    }

    const userData = existingUser ?? { id: userId, name, isAdmin };

    // Guardar en Firestore si es nuevo
    if (!existingUser) {
      await saveUser(userData.id, name, isAdmin);
    }

    // Guardar en localStorage
    localStorage.setItem("quinielaUser", JSON.stringify(userData));
    setUser(userData);

    // Auditoría
    await logAction({
      userId: userData.id,
      userName: name,
      action: "USER_LOGIN",
      detail: `${name} ingresó a la quiniela`,
      isAdmin,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("quinielaUser");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }} />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-column min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1 p-3">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/grupos" element={<GroupsPage />} />
            <Route path="/bracket" element={<BracketPage />} />
            <Route path="/predicciones" element={<PredictionsPage user={user} />} />
            <Route
              path="/admin"
              element={
                user.isAdmin
                  ? <AdminPage user={user} />
                  : <Navigate to="/" replace />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;