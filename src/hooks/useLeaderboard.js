import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { buildLeaderboard } from "../utils/scoring";

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escucha cambios en usuarios y predicciones en tiempo real
    const unsubUsers = onSnapshot(collection(db, "users"), (usersSnap) => {
      const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const unsubPreds = onSnapshot(collection(db, "predictions"), (predsSnap) => {
        const predictions = predsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const table = buildLeaderboard(users, predictions);
        setLeaderboard(table);
        setLoading(false);
      });

      return () => unsubPreds();
    });

    return () => unsubUsers();
  }, []);

  return { leaderboard, loading };
};