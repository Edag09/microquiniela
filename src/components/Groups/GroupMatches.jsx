import { Tag } from "primereact/tag";
import { getFlag } from "../../data/teamFlags";

const GroupMatches = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  const hasResult = (match) =>
    match.realHome !== null && match.realAway !== null;

  return (
    <div className="flex flex-column gap-2">
      {matches.map((match) => (
        <div
          key={match.id}
          className="flex align-items-center justify-content-between p-2 border-round"
          style={{ background: "var(--surface-100)" }}
        >
          {/* Fecha y hora */}
          <div className="text-xs text-color-secondary w-5rem">
            <div>{match.date}</div>
            <div>{match.time} ET</div>
          </div>

          {/* Equipos y resultado */}
          <div className="flex align-items-center gap-2 flex-1 justify-content-center">
            <span>{getFlag(match.home)}</span>
            <span className="font-semibold text-sm">{match.home}</span>

            {hasResult(match) ? (
              <Tag
                value={`${match.realHome} - ${match.realAway}`}
                severity="success"
                className="mx-2"
              />
            ) : (
              <span
                className="mx-2 font-bold text-color-secondary"
              >
                vs
              </span>
            )}

            <span className="font-semibold text-sm">{match.away}</span>
            <span>{getFlag(match.away)}</span>
          </div>

          {/* Estadio */}
          <div
            className="text-xs text-color-secondary text-right hidden md:block"
            style={{ maxWidth: "120px" }}
          >
            {match.stadium}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupMatches;