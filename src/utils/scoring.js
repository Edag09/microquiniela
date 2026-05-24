// Calcula los puntos de una predicción vs el resultado real
export const calculatePoints = (predHome, predAway, realHome, realAway) => {
  // Resultado exacto + ganador correcto = 5 puntos
  if (predHome === realHome && predAway === realAway) return 5;

  // Acertó ganador o empate = 3 puntos
  const predResult = Math.sign(predHome - predAway);
  const realResult = Math.sign(realHome - realAway);
  if (predResult === realResult) return 3;

  // Falló todo = 0 puntos
  return 0;
};

// Calcula el puntaje total de un usuario
export const calculateUserScore = (predictions) => {
  return predictions.reduce((total, pred) => total + (pred.points || 0), 0);
};

// Ordena usuarios por puntaje para el leaderboard
export const buildLeaderboard = (users, predictions) => {
  return users
    .map(user => {
      const userPreds = predictions.filter(p => p.userId === user.id);
      const totalPoints = calculateUserScore(userPreds);
      const exactos = userPreds.filter(p => p.points === 5).length;
      const ganadores = userPreds.filter(p => p.points === 3).length;

      return {
        ...user,
        totalPoints,
        exactos,
        ganadores,
        jugados: userPreds.filter(p => p.points > 0).length
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);
};