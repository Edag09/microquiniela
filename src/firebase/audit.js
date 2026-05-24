import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const logAction = async ({ userId, userName, action, detail, matchId = null, isAdmin = false }) => {
  try {
    await addDoc(collection(db, "auditLog"), {
      userId,
      userName,
      action,
      detail,
      matchId,
      isAdmin,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error al registrar auditoría:", error);
  }
};