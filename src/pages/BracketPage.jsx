import { useMatches } from "../hooks/useMatches";
import { groupMatchesByPhase, PHASES, PHASE_LABELS } from "../utils/bracketUtils";
import { ProgressSpinner } from "primereact/progressspinner";
import BracketView from "../components/Bracket/BracketView";

const BracketPage = () => {
  const { matches, loading } = useMatches();

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <ProgressSpinner />
      </div>
    );
  }

  const eliminationMatches = matches.filter((m) => m.phase !== "grupos");
  const matchesByPhase = groupMatchesByPhase(eliminationMatches);

  return (
    <div className="max-w-7xl mx-auto p-3">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-1">🏆 Fase Eliminatoria</h1>
        <p className="text-color-secondary">
          Dieciseisavos · Octavos · Cuartos · Semis · Final
        </p>
      </div>

      <BracketView matchesByPhase={matchesByPhase} />
    </div>
  );
};

export default BracketPage;