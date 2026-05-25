import { useState } from "react";
import { useMatches } from "../../hooks/useMatches";
import { updateMatchResult, toggleMatchOpen, recalculatePoints } from "../../firebase/collections";
import { logAction } from "../../firebase/audit";
import { getFlag } from "../../data/teamFlags";
import { initialGroups } from "../../utils/groupStandings";
import { PHASE_LABELS } from "../../utils/bracketUtils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

const AdminPanel = ({ user, phase }) => {
  const { matches, loading } = useMatches();
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState({});
  const [filterGroup, setFilterGroup] = useState("A");

  if (loading) return <ProgressSpinner />;

  const groupOptions = Object.keys(initialGroups).map((g) => ({
    label: `Grupo ${g}`,
    value: g,
  }));

  const phaseOptions = ["dieciseisavos", "octavos", "cuartos", "semis", "tercerlugar", "final"]
    .map((p) => ({ label: PHASE_LABELS[p], value: p }));

  const filteredMatches = phase === "grupos"
    ? matches.filter((m) => m.phase === "grupos" && m.group === filterGroup)
    : matches.filter((m) => m.phase !== "grupos");

  const handleScoreChange = (matchId, side, value) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: value },
    }));
  };

  const handleSaveResult = async (match) => {
    const score = scores[match.id];
    if (score?.home === undefined || score?.home === null) return;
    if (score?.away === undefined || score?.away === null) return;

    setSaving(true);
    try {
      await updateMatchResult(match.id, score.home, score.away);
      await recalculatePoints(match.id, score.home, score.away);
      await logAction({
        userId: user.id,
        userName: user.name,
        action: match.realHome !== null ? "RESULT_EDITED" : "RESULT_SET",
        detail: `${match.home} ${score.home} - ${score.away} ${match.away}`,
        matchId: match.id,
        isAdmin: true,
      });
    } catch (e) {
      console.error("Error guardando resultado:", e);
    }
    setSaving(false);
  };

  const handleToggleOpen = async (match) => {
    await toggleMatchOpen(match.id, !match.isOpen);
  };

  const teamsTemplate = (rowData) => (
    <div className="flex align-items-center gap-1">
      <span>{getFlag(rowData.homeTeam ?? rowData.home)}</span>
      <span className="font-semibold text-sm">
        {rowData.homeTeam ?? rowData.home}
      </span>
      <span className="text-color-secondary mx-1">vs</span>
      <span className="font-semibold text-sm">
        {rowData.awayTeam ?? rowData.away}
      </span>
      <span>{getFlag(rowData.awayTeam ?? rowData.away)}</span>
    </div>
  );

  const resultTemplate = (rowData) => {
    if (rowData.realHome !== null) {
      return (
        <Tag
          value={`${rowData.realHome} - ${rowData.realAway}`}
          severity="success"
        />
      );
    }
    return <Tag value="Sin resultado" severity="secondary" />;
  };

  const inputTemplate = (rowData) => (
    <div className="flex align-items-center gap-1">
      <InputNumber
        value={scores[rowData.id]?.home ?? rowData.realHome ?? null}
        onValueChange={(e) => handleScoreChange(rowData.id, "home", e.value)}
        min={0} max={20}
        inputStyle={{ width: "50px", textAlign: "center" }}
        showButtons={false}
      />
      <span className="font-bold">-</span>
      <InputNumber
        value={scores[rowData.id]?.away ?? rowData.realAway ?? null}
        onValueChange={(e) => handleScoreChange(rowData.id, "away", e.value)}
        min={0} max={20}
        inputStyle={{ width: "50px", textAlign: "center" }}
        showButtons={false}
      />
    </div>
  );

  const actionsTemplate = (rowData) => (
    <div className="flex gap-1">
      <Button
        icon="pi pi-save"
        size="small"
        loading={saving}
        onClick={() => handleSaveResult(rowData)}
        tooltip="Guardar resultado"
        disabled={
          scores[rowData.id]?.home === undefined ||
          scores[rowData.id]?.away === undefined
        }
      />
      <Button
        icon={rowData.isOpen ? "pi pi-lock" : "pi pi-lock-open"}
        size="small"
        severity={rowData.isOpen ? "warning" : "success"}
        onClick={() => handleToggleOpen(rowData)}
        tooltip={rowData.isOpen ? "Cerrar partido" : "Abrir partido"}
      />
    </div>
  );

  return (
    <div>
      {/* Filtro */}
      <div className="mb-3">
        {phase === "grupos" ? (
          <Dropdown
            value={filterGroup}
            options={groupOptions}
            onChange={(e) => setFilterGroup(e.value)}
            placeholder="Selecciona grupo"
          />
        ) : (
          <p className="text-color-secondary text-sm">
            Mostrando todos los partidos eliminatorios
          </p>
        )}
      </div>

      <DataTable
        value={filteredMatches}
        stripedRows
        showGridlines
        responsiveLayout="scroll"
        size="small"
      >
        <Column header="Partido" body={teamsTemplate} />
        <Column
          header="Fecha"
          field="date"
          style={{ width: "100px" }}
        />
        <Column
          header="Resultado"
          body={resultTemplate}
          style={{ width: "120px" }}
        />
        <Column
          header="Ingresar"
          body={inputTemplate}
          style={{ width: "140px" }}
        />
        <Column
          header="Acciones"
          body={actionsTemplate}
          style={{ width: "100px" }}
        />
      </DataTable>
    </div>
  );
};

export default AdminPanel;