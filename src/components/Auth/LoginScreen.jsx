import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { Message } from "primereact/message";

const ADMIN_PASSWORD = "mundial2026admin"; // Cámbiala cuando quieras

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) {
      setError("Por favor ingresa tu nombre.");
      return;
    }

    if (isAdmin && adminPass !== ADMIN_PASSWORD) {
      setError("Contraseña de administrador incorrecta.");
      return;
    }

    setLoading(true);
    await onLogin(name.trim(), isAdmin);
    setLoading(false);
  };

  return (
    <div
      className="flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "var(--surface-ground)" }}
    >
      <Card
        style={{ width: "100%", maxWidth: "420px" }}
        className="shadow-4 m-3"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div style={{ fontSize: "3rem" }}>🏆</div>
          <h1 className="text-3xl font-bold mt-2 mb-1">Microquiniela</h1>
          <p className="text-color-secondary">Mundial 2026</p>
        </div>

        {/* Nombre */}
        <div className="flex flex-column gap-2 mb-3">
          <label className="font-semibold">Tu nombre</label>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Eduardo"
            className="w-full"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {/* Toggle Admin */}
        <div className="flex align-items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="isAdmin"
            checked={isAdmin}
            onChange={(e) => {
              setIsAdmin(e.target.checked);
              setAdminPass("");
              setError("");
            }}
          />
          <label htmlFor="isAdmin" className="cursor-pointer">
            Soy administrador
          </label>
        </div>

        {/* Password Admin */}
        {isAdmin && (
          <div className="flex flex-column gap-2 mb-3">
            <label className="font-semibold">Contraseña admin</label>
            <Password
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="Contraseña"
              className="w-full"
              feedback={false}
              toggleMask
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <Message severity="error" text={error} className="w-full mb-3" />
        )}

        {/* Botón */}
        <Button
          label="Entrar a la quiniela"
          icon="pi pi-sign-in"
          className="w-full"
          onClick={handleSubmit}
          loading={loading}
        />

        <p className="text-center text-color-secondary text-sm mt-3">
          🌍 USA · México · Canadá — Junio/Julio 2026
        </p>
      </Card>
    </div>
  );
};

export default LoginScreen;