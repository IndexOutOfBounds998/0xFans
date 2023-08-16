import { LensClient, development, production } from "@lens-protocol/client";
import { MAIN_NETWORK } from "@lib/const";

export async function getAuthenticatedClient(): Promise<LensClient> {
  const lensClient = new LensClient({
    environment: MAIN_NETWORK ? production : development,
    storage: localStorage,
  });

  return lensClient;
}
