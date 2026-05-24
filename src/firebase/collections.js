import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

// ── USUARIOS ──────────────────────────────
export const saveUser = async (userId, name, isAdmin = false) => {
  await setDoc(doc(db, "users", userId), {
    name,
    isAdmin,
    createdAt: serverTimestamp()
  });
};

export const getUser = async (userId) => {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
};

// ── PARTIDOS ──────────────────────────────
export const getMatches = async () => {
  const snap = await getDocs(collection(db, "matches"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateMatchResult = async (matchId, realHome, realAway) => {
  await updateDoc(doc(db, "matches", matchId), { realHome, realAway });
};

// ── PREDICCIONES ──────────────────────────
export const savePrediction = async (userId, matchId, predHome, predAway) => {
  const id = `${userId}_${matchId}`;
  await setDoc(doc(db, "predictions", id), {
    userId,
    matchId,
    predHome,
    predAway,
    points: 0,
    editedAt: serverTimestamp()
  });
};

export const getUserPredictions = async (userId) => {
  const snap = await getDocs(collection(db, "predictions"));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(p => p.userId === userId);
};

export const getAllPredictions = async () => {
  const snap = await getDocs(collection(db, "predictions"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};