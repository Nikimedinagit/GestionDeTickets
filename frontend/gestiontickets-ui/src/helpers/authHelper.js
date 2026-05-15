export const getUserRole = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return "INVITADO";

    const user = JSON.parse(userStr);
    return user?.rol || "INVITADO";
  } catch {
    return "INVITADO";
  }
};