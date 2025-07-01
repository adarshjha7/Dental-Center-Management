// Custom event system for real-time data updates within the same tab

export const DATA_EVENTS = {
  PATIENTS_UPDATED: "patients-updated",
  INCIDENTS_UPDATED: "incidents-updated",
  USERS_UPDATED: "users-updated",
} as const;

export const dispatchDataUpdate = (eventType: string, data?: any) => {
  window.dispatchEvent(new CustomEvent(eventType, { detail: data }));

  // Also dispatch storage event for cross-tab compatibility
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: getStorageKeyFromEvent(eventType),
      storageArea: localStorage,
    }),
  );
};

export const addDataUpdateListener = (
  eventType: string,
  callback: (data?: any) => void,
) => {
  const handler = (event: any) => {
    callback(event.detail);
  };

  window.addEventListener(eventType, handler);

  // Also listen to storage events for cross-tab updates
  const storageHandler = (event: StorageEvent) => {
    const storageKey = getStorageKeyFromEvent(eventType);
    if (event.key === storageKey) {
      callback();
    }
  };

  window.addEventListener("storage", storageHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener(eventType, handler);
    window.removeEventListener("storage", storageHandler);
  };
};

const getStorageKeyFromEvent = (eventType: string): string => {
  switch (eventType) {
    case DATA_EVENTS.PATIENTS_UPDATED:
      return "dental_center_patients";
    case DATA_EVENTS.INCIDENTS_UPDATED:
      return "dental_center_incidents";
    case DATA_EVENTS.USERS_UPDATED:
      return "dental_center_users";
    default:
      return "dental_center_data";
  }
};
