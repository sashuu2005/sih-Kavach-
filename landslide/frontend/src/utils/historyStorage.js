const STORAGE_KEY = "prediction_history";

export const saveHistory = (record) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  existing.unshift(record); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

export const getHistory = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
