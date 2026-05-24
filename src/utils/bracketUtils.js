// Fases en orden
export const PHASES = [
  "dieciseisavos",
  "octavos",
  "cuartos",
  "semis",
  "tercerlugar",
  "final",
];

export const PHASE_LABELS = {
  dieciseisavos: "Dieciseisavos",
  octavos: "Octavos de Final",
  cuartos: "Cuartos de Final",
  semis: "Semifinales",
  tercerlugar: "3er y 4to Lugar",
  final: "Final",
};

// Agrupa los partidos eliminatorios por fase
export const groupMatchesByPhase = (matches) => {
  const result = {};
  PHASES.forEach((phase) => {
    result[phase] = matches
      .filter((m) => m.phase === phase)
      .sort((a, b) => a.bracketPosition - b.bracketPosition);
  });
  return result;
};

// Retorna el nombre a mostrar de un equipo en el bracket
export const getTeamDisplay = (match, side) => {
  if (side === "home") {
    return match.homeTeam ?? match.home ?? "Por definir";
  }
  return match.awayTeam ?? match.away ?? "Por definir";
};

// Determina si un partido ya tiene resultado
export const matchHasResult = (match) =>
  match.realHome !== null && match.realAway !== null;

// Determina el ganador de un partido
export const getWinner = (match) => {
  if (!matchHasResult(match)) return null;
  if (match.realHome > match.realAway) return match.homeTeam ?? match.home;
  if (match.realHome < match.realAway) return match.awayTeam ?? match.away;
  return null; // empate — en eliminatorias se define por penales, admin lo maneja
};