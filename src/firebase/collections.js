import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { worldcupMatches } from "../data/worldcupMatches";
import { eliminationMatches } from "../data/eliminationMatches";
import { initialGroups } from "../utils/groupStandings";
import { getFlag } from "../data/teamFlags";

// ── USUARIOS ──────────────────────────────────────────
export const saveUser = async (userId, name, isAdmin = false) => {
  await setDoc(doc(db, "users", userId), {
    name,
    isAdmin,
    createdAt: serverTimestamp(),
  });
};

export const getUser = async (userId) => {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── PARTIDOS ──────────────────────────────────────────
export const seedMatches = async () => {
  const snap = await getDocs(collection(db, "matches"));
  if (!snap.empty) return; // ya existen, no duplicar

  const batch = writeBatch(db);
  worldcupMatches.forEach((match) => {
    const ref = doc(db, "matches", match.id);
    batch.set(ref, {
      ...match,
      realHome: null,
      realAway: null,
      isOpen: true,
    });
  });
  await batch.commit();
};

export const seedEliminationMatches = async () => {
  const batch = writeBatch(db);
  eliminationMatches.forEach((match) => {
    const ref = doc(db, "matches", match.id);
    batch.set(ref, match);
  });
  await batch.commit();
};

export const updateMatchResult = async (matchId, realHome, realAway) => {
  await updateDoc(doc(db, "matches", matchId), {
    realHome: Number(realHome),
    realAway: Number(realAway),
  });
};

export const updateEliminationTeams = async (matchId, homeTeam, awayTeam) => {
  await updateDoc(doc(db, "matches", matchId), {
    homeTeam,
    awayTeam,
    isOpen: true,
  });
};

export const toggleMatchOpen = async (matchId, isOpen) => {
  await updateDoc(doc(db, "matches", matchId), { isOpen });
};

// ── PREDICCIONES ──────────────────────────────────────
export const savePrediction = async (userId, matchId, predHome, predAway) => {
  const id = `${userId}_${matchId}`;
  await setDoc(doc(db, "predictions", id), {
    userId,
    matchId,
    predHome: Number(predHome),
    predAway: Number(predAway),
    points: 0,
    editedAt: serverTimestamp(),
  });
};

export const getUserPredictions = async (userId) => {
  const snap = await getDocs(collection(db, "predictions"));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.userId === userId);
};

export const getAllPredictions = async () => {
  const snap = await getDocs(collection(db, "predictions"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Recalcula puntos de todos los usuarios para un partido
export const recalculatePoints = async (matchId, realHome, realAway) => {
  const { calculatePoints } = await import("../utils/scoring");
  const snap = await getDocs(collection(db, "predictions"));
  const batch = writeBatch(db);

  snap.docs.forEach((d) => {
    const pred = d.data();
    if (pred.matchId !== matchId) return;

    const points = calculatePoints(
      pred.predHome,
      pred.predAway,
      Number(realHome),
      Number(realAway)
    );

    batch.update(doc(db, "predictions", d.id), { points });
  });

  await batch.commit();
};

// ── STANDINGS DE GRUPOS ───────────────────────────────
export const seedGroupStandings = async () => {
  const batch = writeBatch(db);

  Object.entries(initialGroups).forEach(([group, teams]) => {
    teams.forEach((team) => {
      const id = `${group}_${team.replace(/\s/g, "_")}`;
      const ref = doc(db, "groupStandings", id);
      batch.set(ref, {
        group,
        team,
        flag: getFlag(team),
        pj: 0, g: 0, e: 0, p: 0,
        gf: 0, gc: 0, dg: 0, pts: 0,
      });
    });
  });

  await batch.commit();
};