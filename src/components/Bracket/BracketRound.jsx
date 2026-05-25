import BracketMatch from "./BracketMatch";

const BracketRound = ({ phase, label, matches }) => {
  return (
    <div
      className="flex flex-column gap-3"
      style={{ minWidth: "200px", flex: 1 }}
    >
      {/* Header de la fase */}
      <div
        className="text-center font-bold p-2 border-round"
        style={{
          background: "var(--primary-color)",
          color: "var(--primary-color-text)",
          fontSize: "0.85rem",
        }}
      >
        {label}
      </div>

      {/* Partidos */}
      <div className="flex flex-column gap-2">
        {matches.length === 0 ? (
          <div
            className="text-center p-3 border-round text-color-secondary text-sm"
            style={{ border: "1px dashed var(--surface-border)" }}
          >
            Por definir
          </div>
        ) : (
          matches.map((match) => (
            <BracketMatch key={match.id} match={match} />
          ))
        )}
      </div>
    </div>
  );
};

export default BracketRound;