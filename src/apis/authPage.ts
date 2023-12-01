import { DOMAIN } from "@/constants/domains";

export async function loginApi(crediential: { clientName: string; passcode: string }): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(crediential),
  });
  return response;
}
