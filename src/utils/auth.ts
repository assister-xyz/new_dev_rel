export function loginCheckHandler(): string {
  // if client is logged in, then a client key must be present in "localStorage", if not, then the client is not logged in
  const targetClient: string | null = localStorage.getItem("client");
  if (!targetClient) {
    return "unauthorized";
  }
  return "authorized";
}
