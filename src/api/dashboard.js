import api from "./client";

export async function getDashboardStats() {
  const { data } = await api.get("/orders/admin/dashboard");
  return data.dashboard;
}
