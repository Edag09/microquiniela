import { getFlag } from "../data/teamFlags";

// Equipos iniciales por grupo
export const initialGroups = {
  A: ["México", "Sudáfrica", "República de Corea", "Chequia"],
  B: ["Canadá", "Bosnia y Herzegovina", "Catar", "Suiza"],
  C: ["Brasil", "Marruecos", "Haití", "Escocia"],
  D: ["Estados Unidos", "Paraguay", "Australia", "Turquía"],
  E: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"],
  F: ["Países Bajos", "Japón", "Suecia", "Túnez"],
  G: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"],
  H: ["España", "Cabo Verde", "Arabia Saudí", "Uruguay"],
  I: ["Francia", "Senegal", "Irak", "Noruega"],
  J: ["Argentina", "Argelia", "Austria", "Jordania"],
  K: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"],
  L: ["Inglaterra", "Croacia", "Ghana", "Panamá"],
};

// Genera tabla vacía para un grupo
export const buildEmptyStandings = (group) => {
  return initialGroups[group].map((team) => ({
    team,
    flag: getFlag(team),
    pj: 0, g: 0, e: 0, p: 0,
    gf: 0, gc: 0, dg: 0, pts: 0,
  }));
};

// Calcula la tabla de un grupo a partir de los resultados reales
export const calculateGroupStandings = (group, matches) => {
  const standings = buildEmptyStandings(group);

  const groupMatches = matches.filter(
    (m) => m.group === group &&
    m.phase === "grupos" &&
    m.realHome !== null &&
    m.realAway !== null
  );

  groupMatches.forEach((match) => {
    const home = standings.find((s) => s.team === match.home);
    const away = standings.find((s) => s.team === match.away);
    if (!home || !away) return;

    const rH = Number(match.realHome);
    const rA = Number(match.realAway);

    // Goles
    home.gf += rH; home.gc += rA;
    away.gf += rA; away.gc += rH;

    // Partidos jugados
    home.pj++; away.pj++;

    // Resultado
    if (rH > rA) {
      home.g++; home.pts += 3;
      away.p++;
    } else if (rH < rA) {
      away.g++; away.pts += 3;
      home.p++;
    } else {
      home.e++; home.pts++;
      away.e++; away.pts++;
    }
  });

  // Diferencia de goles
  standings.forEach((s) => { s.dg = s.gf - s.gc; });

  // Ordenar: pts > dg > gf
  return standings.sort((a, b) =>
    b.pts - a.pts || b.dg - a.dg || b.gf - a.gf
  );
};

// Calcula todas las tablas de todos los grupos
export const calculateAllGroups = (matches) => {
  const result = {};
  Object.keys(initialGroups).forEach((group) => {
    result[group] = calculateGroupStandings(group, matches);
  });
  return result;
};