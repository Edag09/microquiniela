import PredictionCard from "./PredictionCard";

const PredictionList = ({ matches, predictions, onSave, saving, user }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center p-4 text-color-secondary">
        <i className="pi pi-clock text-4xl mb-2 block" />
        <p>No hay partidos disponibles aún.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-column gap-3">
      {matches.map((match) => {
        const prediction = predictions.find((p) => p.matchId === match.id) ?? null;
        return (
          <PredictionCard
            key={match.id}
            match={match}
            prediction={prediction}
            onSave={onSave}
            saving={saving}
            user={user}
          />
        );
      })}
    </div>
  );
};

export default PredictionList;