import { useLeaderboard } from "../hooks/useLeaderboard";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";

const HomePage = () => {
  const { leaderboard, loading } = useLeaderboard();

  const rankTemplate = (rowData, { rowIndex }) => {
    const medals = ["🥇", "🥈", "🥉"];
    return (
      <span className="font-bold text-lg">
        {medals[rowIndex] ?? `#${rowIndex + 1}`}
      </span>
    );
  };

  const nameTemplate = (rowData) => (
    <div className="flex align-items-center gap-2">
      <span className="font-semibold">{rowData.name}</span>
      {rowData.isAdmin && (
        <Tag value="Admin" severity="warning" icon="pi pi-star" />
      )}
    </div>
  );

  const pointsTemplate = (rowData) => (
    <span className="font-bold text-xl" style={{ color: "var(--primary-color)" }}>
      {rowData.totalPoints}
    </span>
  );

  const exactosTemplate = (rowData) => (
    <Tag
      value={rowData.exactos}
      severity="success"
      icon="pi pi-star-fill"
      rounded
    />
  );

  const ganadoresTemplate = (rowData) => (
    <Tag
      value={rowData.ganadores}
      severity="info"
      icon="pi pi-check"
      rounded
    />
  );

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-1">🏆 Microquiniela</h1>
        <p className="text-color-secondary text-lg">Mundial 2026 — USA · México · Canadá</p>
      </div>

      {/* Tabla de posiciones */}
      <Card title="📊 Tabla de Posiciones">
        {leaderboard.length === 0 ? (
          <div className="text-center p-4 text-color-secondary">
            <i className="pi pi-users text-4xl mb-3 block" />
            <p>Aún no hay participantes registrados.</p>
          </div>
        ) : (
          <DataTable
            value={leaderboard}
            stripedRows
            showGridlines
            responsiveLayout="scroll"
          >
            <Column header="#" body={rankTemplate} style={{ width: "60px" }} />
            <Column header="Participante" body={nameTemplate} />
            <Column
              header="Pts"
              body={pointsTemplate}
              style={{ width: "80px", textAlign: "center" }}
            />
            <Column
              header="⭐ Exactos"
              body={exactosTemplate}
              style={{ width: "100px", textAlign: "center" }}
            />
            <Column
              header="✅ Ganadores"
              body={ganadoresTemplate}
              style={{ width: "110px", textAlign: "center" }}
            />
            <Column
              header="Jugados"
              field="jugados"
              style={{ width: "90px", textAlign: "center" }}
            />
          </DataTable>
        )}
      </Card>

      {/* Leyenda de puntos */}
      <Card className="mt-3">
        <div className="flex flex-wrap justify-content-center gap-4 text-center">
          <div>
            <div className="text-2xl font-bold" style={{ color: "var(--green-400)" }}>
              5 pts
            </div>
            <div className="text-color-secondary text-sm">Marcador exacto</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: "var(--blue-400)" }}>
              3 pts
            </div>
            <div className="text-color-secondary text-sm">Ganador o empate</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: "var(--red-400)" }}>
              0 pts
            </div>
            <div className="text-color-secondary text-sm">Fallo total</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;