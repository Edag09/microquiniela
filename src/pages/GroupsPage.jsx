import { useMatches } from "../hooks/useMatches";
import { calculateAllGroups, initialGroups } from "../utils/groupStandings";
import { ProgressSpinner } from "primereact/progressspinner";
import GroupStage from "../components/Groups/GroupStage";

const GroupsPage = () => {
  const { matches, loading } = useMatches();

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <ProgressSpinner />
      </div>
    );
  }

  const groupStandings = calculateAllGroups(matches);
  const groupMatches = Object.keys(initialGroups).reduce((acc, group) => {
    acc[group] = matches.filter(
      (m) => m.group === group && m.phase === "grupos"
    );
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-3">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-1">⚽ Fase de Grupos</h1>
        <p className="text-color-secondary">
          Mundial 2026 — 12 grupos · 72 partidos
        </p>
      </div>

      <GroupStage
        groupStandings={groupStandings}
        groupMatches={groupMatches}
      />
    </div>
  );
};

export default GroupsPage;