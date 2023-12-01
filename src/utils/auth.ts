export function loginCheckHandler(): string {
  const targetClient: string | null = localStorage.getItem("client");
  if (!targetClient) {
    return "unauthorized";
  }
  return "authorized";
}
