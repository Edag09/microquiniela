import { TabView, TabPanel } from "primereact/tabview";
import AdminPanel from "../components/Admin/AdminPanel";
import EliminationMatchForm from "../components/Admin/EliminationMatchForm";
import AuditLog from "../components/Admin/AuditLog";

const AdminPage = ({ user }) => {
  return (
    <div className="max-w-5xl mx-auto p-3">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-1">⚙️ Panel Admin</h1>
        <p className="text-color-secondary">
          Bienvenido <strong>{user?.name}</strong> — gestiona resultados y partidos
        </p>
      </div>

      <TabView>
        <TabPanel header="📋 Resultados Grupos">
          <AdminPanel user={user} phase="grupos" />
        </TabPanel>
        <TabPanel header="🏆 Resultados Eliminatorias">
          <AdminPanel user={user} phase="eliminacion" />
        </TabPanel>
        <TabPanel header="➕ Crear Partido Eliminatorio">
          <EliminationMatchForm user={user} />
        </TabPanel>
        <TabPanel header="📝 Auditoría">
          <AuditLog />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default AdminPage;