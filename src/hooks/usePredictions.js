import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const usePredictions = (userId) => {
  const [predictions, setPredictions] = useState([]);
  const [allPredictions, setAllPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predicciones del usuario actual
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "predictions"),
      where("userId", "==", userId)
    );

    const unsub = onSnapshot(q, (snap) => {
      setPredictions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  // Todas las predicciones (para ver tabla general)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "predictions"), (snap) => {
      setAllPredictions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  // Busca la predicción de un partido específico
  const getPrediction = (matchId) =>
    predictions.find((p) => p.matchId === matchId) ?? null;

  return { predictions, allPredictions, getPrediction, loading };
};