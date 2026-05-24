import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { worldcupMatches } from "../data/worldcupMatches";

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "matches"), orderBy("date", "asc"));

    const unsub = onSnapshot(q,
      (snap) => {
        if (snap.empty) {
          // Si no hay partidos en Firestore usamos los hardcodeados
          setMatches(worldcupMatches);
        } else {
          setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { matches, loading, error };
};