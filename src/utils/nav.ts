import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function navigationHandler(url: string, router: AppRouterInstance): void {
  router.push(url);
}
