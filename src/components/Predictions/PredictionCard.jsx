import { useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { getFlag } from "../../data/teamFlags";

const PredictionCard = ({ match, prediction, onSave, saving, user }) => {
  const [predHome, setPredHome] = useState(null);
  const [predAway, setPredAway] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prediction) {
      setPredHome(prediction.predHome);
      setPredAway(prediction.predAway);
    }
  }, [prediction]);

  const homeTeam = match.homeTeam ?? match.home;
  const awayTeam = match.awayTeam ?? match.away;
  const hasResult = match.realHome !== null && match.realAway !== null;
  const isLocked = !match.isOpen || hasResult;
  const isEdit = !!prediction;

  const handleSave = async () => {
    if (predHome === null || predAway === null) return;
    await onSave(match.id, predHome, predAway, isEdit);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getPointsBadge = () => {
    if (!hasResult || !prediction) return null;
    const pts = prediction.points;
    if (pts === 5) return <Tag value="⭐ +5 pts" severity="success" />;
    if (pts === 3) return <Tag value="✅ +3 pts" severity="info" />;
    return <Tag value="❌ 0 pts" severity="danger" />;
  };

  return (
    <div
      className="p-3 border-round"
      style={{
        border: "1px solid var(--surface-border)",
        background: isLocked ? "var(--surface-50)" : "var(--surface-card)",
        opacity: isLocked && !hasResult ? 0.7 : 1,
      }}
    >
      {/* Fecha y estadio */}
      <div className="flex justify-content-between align-items-center mb-2">
        <span className="text-xs text-color-secondary">
          📅 {match.date} {match.time && `· ${match.time} ET`}
        </span>
        <span className="text-xs text-color-secondary hidden md:inline">
          🏟️ {match.stadium}
        </span>
        {isLocked && !hasResult && (
          <Tag value="🔒 Cerrado" severity="warning" />
        )}
        {hasResult && getPointsBadge()}
      </div>

      {/* Equipos */}
      <div className="flex align-items-center justify-content-between gap-2">

        {/* Local */}
        <div className="flex align-items-center gap-2 flex-1 justify-content-end">
          <span className="font-semibold text-sm text-right">{homeTeam}</span>
          <span className="text-xl">{getFlag(homeTeam)}</span>
        </div>

        {/* Marcadores */}
        <div className="flex align-items-center gap-2">
          {hasResult ? (
            // Resultado real
            <div className="flex align-items-center gap-1">
              <span
                className="font-bold text-xl px-2 py-1 border-round"
                style={{ background: "var(--green-900)", color: "var(--green-200)" }}
              >
                {match.realHome}
              </span>
              <span className="font-bold">-</span>
              <span
                className="font-bold text-xl px-2 py-1 border-round"
                style={{ background: "var(--green-900)", color: "var(--green-200)" }}
              >
                {match.realAway}
              </span>
            </div>
          ) : (
            // Inputs de predicción
            <div className="flex align-items-center gap-1">
              <InputNumber
                value={predHome}
                onValueChange={(e) => setPredHome(e.value)}
                min={0}
                max={20}
                disabled={isLocked}
                inputStyle={{ width: "50px", textAlign: "center" }}
                showButtons={false}
              />
              <span className="font-bold">-</span>
              <InputNumber
                value={predAway}
                onValueChange={(e) => setPredAway(e.value)}
                min={0}
                max={20}
                disabled={isLocked}
                inputStyle={{ width: "50px", textAlign: "center" }}
                showButtons={false}
              />
            </div>
          )}
        </div>

        {/* Visitante */}
        <div className="flex align-items-center gap-2 flex-1">
          <span className="text-xl">{getFlag(awayTeam)}</span>
          <span className="font-semibold text-sm">{awayTeam}</span>
        </div>
      </div>

      {/* Predicción previa + botón guardar */}
      {!hasResult && !isLocked && (
        <div className="flex justify-content-between align-items-center mt-2">
          {prediction && (
            <span className="text-xs text-color-secondary">
              Tu predicción: {prediction.predHome} - {prediction.predAway}
            </span>
          )}
          <Button
            label={saved ? "¡Guardado!" : isEdit ? "Actualizar" : "Guardar"}
            icon={saved ? "pi pi-check" : "pi pi-save"}
            size="small"
            severity={saved ? "success" : "primary"}
            loading={saving}
            disabled={predHome === null || predAway === null}
            onClick={handleSave}
            className="ml-auto"
          />
        </div>
      )}
    </div>
  );
};

export default PredictionCard;