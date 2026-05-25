import { useNavigate, useLocation } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      command: () => navigate("/"),
      className: location.pathname === "/" ? "font-bold" : "",
    },
    {
      label: "Grupos",
      icon: "pi pi-th-large",
      command: () => navigate("/grupos"),
      className: location.pathname === "/grupos" ? "font-bold" : "",
    },
    {
      label: "Bracket",
      icon: "pi pi-sitemap",
      command: () => navigate("/bracket"),
      className: location.pathname === "/bracket" ? "font-bold" : "",
    },
    {
      label: "Predicciones",
      icon: "pi pi-pencil",
      command: () => navigate("/predicciones"),
      className: location.pathname === "/predicciones" ? "font-bold" : "",
    },
    ...(user?.isAdmin
      ? [
          {
            label: "Admin",
            icon: "pi pi-cog",
            command: () => navigate("/admin"),
            className: location.pathname === "/admin" ? "font-bold" : "",
          },
        ]
      : []),
  ];

  const start = (
    <div className="flex align-items-center gap-2 mr-3">
      <span style={{ fontSize: "1.5rem" }}>🏆</span>
      <span className="font-bold text-lg">Microquiniela</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <span className="text-color-secondary hidden md:inline">
        👤 {user?.name}
      </span>
      {user?.isAdmin && (
        <Tag value="Admin" severity="warning" icon="pi pi-star" />
      )}
      <Button
        icon="pi pi-sign-out"
        rounded
        text
        severity="secondary"
        tooltip="Cerrar sesión"
        tooltipOptions={{ position: "bottom" }}
        onClick={onLogout}
      />
    </div>
  );

  return (
    <Menubar
      model={items}
      start={start}
      end={end}
      className="border-noround border-bottom-1"
    />
  );
};

export default Navbar;