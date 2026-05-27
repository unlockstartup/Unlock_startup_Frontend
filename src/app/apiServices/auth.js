export const saveToken = (token) => localStorage.setItem("publisher_token", token);
export const getToken  = ()      => localStorage.getItem("publisher_token");
export const logout    = ()      => localStorage.removeItem("publisher_token");
export const isLoggedIn= ()      => !!localStorage.getItem("publisher_token");