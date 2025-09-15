// This is a placeholder for your auth store.
// You can replace this with a more robust solution like Zustand or Redux.

let token = null;

export const setToken = (newToken) => {
  token = newToken;
};

export const useAuthStore = () => {
  return { token };
};
