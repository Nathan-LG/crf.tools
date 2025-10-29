"use client";

export const stateNumberToString = (stateNumber) => {
  const stateMap = {
    0: "Non calibré",
    1: "Verrouillé",
    2: "Déverrouillage",
    3: "Déverrouillé",
    4: "Verrouillage",
    5: "Déclenché",
    6: "Déverrouillé temporairement",
    7: "Déclenchage",
    253: "Démarrage",
    254: "Moteur bloqué",
  };
  return stateMap[stateNumber] || "Inconnu";
};
