import { PHASES, PHASE_LABELS } from "../../utils/bracketUtils";
import BracketRound from "./BracketRound";
import { ScrollPanel } from "primereact/scrollpanel";

const BracketView = ({ matchesByPhase }) => {
  return (
    <ScrollPanel style={{ width: "100%", overflowX: "auto" }}>
      <div className="flex gap-3 pb-3" style={{ minWidth: "900px" }}>
        {PHASES.map((phase) => (
          <BracketRound
            key={phase}
            phase={phase}
            label={PHASE_LABELS[phase]}
            matches={matchesByPhase[phase] ?? []}
          />
        ))}
      </div>
    </ScrollPanel>
  );
};

export default BracketView;