import { getFlag } from "../../data/teamFlags";
import { getTeamDisplay, matchHasResult } from "../../utils/bracketUtils";

const BracketMatch = ({ match }) => {
  const homeTeam = getTeamDisplay(match, "home");
  const awayTeam = getTeamDisplay(match, "away");
  const hasResult = matchHasResult(match);

  const homeWon = hasResult && match.realHome > match.realAway;
  const awayWon = hasResult && match.realAway > match.realHome;

  const teamRow = (team, score, won) => (
    <div
      className="flex align-items-center justify-content-between px-2 py-1"
      style={{
        background: won
          ? "var(--green-900)"
          : "var(--surface-100)",
        borderRadius: "4px",
        opacity: hasResult && !won ? 0.6 : 1,
      }}
    >
      <div className="flex align-items-center gap-2">
        <span>{getFlag(team)}</span>
        <span
          className="text-sm"
          style={{
            fontWeight: won ? "bold" : "normal",
            maxWidth: "110px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {team}
        </span>
      </div>
      {hasResult && (
        <span className="font-bold ml-2">{score}</span>
      )}
    </div>
  );

  return (
    <div
      className="flex flex-column gap-1 p-2 border-round"
      style={{
        border: "1px solid var(--surface-border)",
        background: "var(--surface-card)",
      }}
    >
      {teamRow(homeTeam, match.realHome, homeWon)}
      <div
        className="text-center text-xs text-color-secondary"
        style={{ lineHeight: "1" }}
      >
        vs
      </div>
      {teamRow(awayTeam, match.realAway, awayWon)}

      {/* Fecha si existe */}
      {match.date && (
        <div className="text-center text-xs text-color-secondary mt-1">
          📅 {match.date} {match.time && `· ${match.time} ET`}
        </div>
      )}
    </div>
  );
};

export default BracketMatch;