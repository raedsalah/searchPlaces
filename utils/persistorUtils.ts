import { persistor } from "@/store";

export const clearPersistedStore = async () => {
  try {
    await persistor.purge();
    console.log("Persisted store has been cleared.");
  } catch (error) {
    console.error("Failed to clear persisted store:", error);
  }
};
