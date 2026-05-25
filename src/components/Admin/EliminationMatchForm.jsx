import { useState } from "react";
import { updateEliminationTeams } from "../../firebase/collections";
import { logAction } from "../../firebase/audit";
import { useMatches } from "../../hooks/useMatches";
import { PHASE_LABELS } from "../../utils/bracketUtils";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";

const EliminationMatchForm = ({ user }) => {
  const { matches, loading } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  if (loading) return <ProgressSpinner />;

  const elimMatches = matches.filter((m) => m.phase !== "grupos");

  const matchOptions = elimMatches.map((m) => ({
    label: `[${PHASE_LABELS[m.phase]}] ${m.homeTeam ?? m.home} vs ${m.awayTeam ?? m.away}`,
    value: m.id,
  }));

  const handleSave = async () => {
    if (!selectedMatch || !homeTeam || !awayTeam) return;
    setSaving(true);
    try {
      await updateEliminationTeams(selectedMatch, homeTeam, awayTeam);
      await logAction({
        userId: user.id,
        userName: user.name,
        action: "RESULT_EDITED",
        detail: `Equipos asignados: ${homeTeam} vs ${awayTeam}`,
        matchId: selectedMatch,
        isAdmin: true,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error("Error:", e);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-column gap-3 max-w-lg">
      <p className="text-color-secondary">
        Asigna los equipos clasificados a los partidos eliminatorios conforme avanza el torneo.
      </p>

      <div className="flex flex-column gap-1">
        <label className="font-semibold">Partido</label>
        <Dropdown
          value={selectedMatch}
          options={matchOptions}
          onChange={(e) => setSelectedMatch(e.value)}
          placeholder="Selecciona el partido"
          filter
        />
      </div>

      <div className="flex flex-column gap-1">
        <label className="font-semibold">Equipo Local</label>
        <InputText
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          placeholder="Ej. México"
        />
      </div>

      <div className="flex flex-column gap-1">
        <label className="font-semibold">Equipo Visitante</label>
        <InputText
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          placeholder="Ej. España"
        />
      </div>

      {success && (
        <Message severity="success" text="¡Equipos asignados correctamente!" />
      )}

      <Button
        label="Asignar equipos"
        icon="pi pi-check"
        loading={saving}
        disabled={!selectedMatch || !homeTeam || !awayTeam}
        onClick={handleSave}
      />
    </div>
  );
};

export default EliminationMatchForm;