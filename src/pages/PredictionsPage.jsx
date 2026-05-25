import { useState } from "react";
import { useMatches } from "../hooks/useMatches";
import { usePredictions } from "../hooks/usePredictions";
import { savePrediction } from "../firebase/collections";
import { logAction } from "../firebase/audit";
import { initialGroups } from "../utils/groupStandings";
import { PHASE_LABELS } from "../utils/bracketUtils";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabView, TabPanel } from "primereact/tabview";
import PredictionList from "../components/Predictions/PredictionList";

const PredictionsPage = ({ user }) => {
  const { matches, loading: loadingMatches } = useMatches();
  const { predictions, loading: loadingPreds } = usePredictions(user?.id);
  const [saving, setSaving] = useState(false);

  if (loadingMatches || loadingPreds) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <ProgressSpinner />
      </div>
    );
  }

  const handleSavePrediction = async (matchId, predHome, predAway, isEdit) => {
    if (!user) return;
    setSaving(true);

    try {
      await savePrediction(user.id, matchId, predHome, predAway);
      await logAction({
        userId: user.id,
        userName: user.name,
        action: isEdit ? "PREDICTION_EDITED" : "PREDICTION_SAVED",
        detail: `${predHome} - ${predAway}`,
        matchId,
        isAdmin: user.isAdmin,
      });
    } catch (e) {
      console.error("Error guardando predicción:", e);
    }

    setSaving(false);
  };

  // Partidos de grupos separados por grupo
  const groupMatches = Object.keys(initialGroups).reduce((acc, group) => {
    acc[group] = matches.filter(
      (m) => m.group === group && m.phase === "grupos"
    );
    return acc;
  }, {});

  // Partidos eliminatorios por fase
  const elimPhases = ["dieciseisavos", "octavos", "cuartos", "semis", "tercerlugar", "final"];
  const elimMatches = elimPhases.reduce((acc, phase) => {
    acc[phase] = matches.filter((m) => m.phase === phase);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-3">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-1">✏️ Mis Predicciones</h1>
        <p className="text-color-secondary">
          Hola <strong>{user?.name}</strong> — ingresa tus marcadores antes de que inicien los partidos
        </p>
      </div>

      <TabView>
        {/* Tab por cada grupo */}
        {Object.keys(initialGroups).map((group) => (
          <TabPanel key={group} header={`Grupo ${group}`}>
            <PredictionList
              matches={groupMatches[group]}
              predictions={predictions}
              onSave={handleSavePrediction}
              saving={saving}
              user={user}
            />
          </TabPanel>
        ))}

        {/* Tabs eliminatorias */}
        {elimPhases.map((phase) => (
          elimMatches[phase]?.length > 0 && (
            <TabPanel key={phase} header={PHASE_LABELS[phase]}>
              <PredictionList
                matches={elimMatches[phase]}
                predictions={predictions}
                onSave={handleSavePrediction}
                saving={saving}
                user={user}
              />
            </TabPanel>
          )
        ))}
      </TabView>
    </div>
  );
};

export default PredictionsPage;