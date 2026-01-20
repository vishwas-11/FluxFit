const inFlightRequests = new Map<string, Promise<any>>();

export const getInFlight = (key: string) =>
  inFlightRequests.get(key);

export const setInFlight = (key: string, promise: Promise<any>) =>
  inFlightRequests.set(key, promise);

export const clearInFlight = (key: string) =>
  inFlightRequests.delete(key);
