import type { MenuCategory } from "@workspace/api-client-react";

// Public demo configuration: replace the placeholder with your JSONBin key.
// Warning: any key placed here is visible to every visitor of the website.
export const JSONBIN_BIN_ID = "6a9e1eed2afc621060aad c295".replace(" ", "");
export const JSONBIN_MASTER_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXX";

const JSONBIN_URL = "https://api.jsonbin.io/v3/b/" + JSONBIN_BIN_ID;

export type GostoMenuDocument = {
  categories: MenuCategory[];
};

export async function readGostoMenu(): Promise<GostoMenuDocument> {
  const response = await fetch(JSONBIN_URL + "/latest", {
    headers: { "X-Master-Key": JSONBIN_MASTER_KEY },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("JSONBin read failed");
  const payload = (await response.json()) as { record?: GostoMenuDocument };
  return { categories: payload.record?.categories ?? [] };
}

export async function writeGostoMenu(categories: MenuCategory[]): Promise<GostoMenuDocument> {
  const response = await fetch(JSONBIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSONBIN_MASTER_KEY,
    },
    body: JSON.stringify({ categories }),
  });
  if (!response.ok) throw new Error("JSONBin write failed");
  return { categories };
}
