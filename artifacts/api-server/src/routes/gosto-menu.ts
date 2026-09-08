import { Router, type IRouter } from "express";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  GetGostoMenuResponse,
  UpdateGostoMenuBody,
  UpdateGostoMenuResponse,
} from "@workspace/api-zod";
import initialMenu from "../data/gosto-menu.json";
import { requireDashboardSession } from "./dashboard-auth";

const router: IRouter = Router();

const JSONBIN_API = "https://api.jsonbin.io/v3/b";
const binStatePath = path.resolve(
  process.cwd(),
  ".data/gosto-jsonbin-bin.json",
);

type MenuDocument = {
  categories: unknown[];
  binId?: string;
  updatedAt?: string;
};

async function readStoredBinId() {
  if (process.env.JSONBIN_BIN_ID) return process.env.JSONBIN_BIN_ID;

  try {
    const stored = JSON.parse(await readFile(binStatePath, "utf8")) as {
      binId?: string;
    };
    return stored.binId;
  } catch {
    return undefined;
  }
}

async function storeBinId(binId: string) {
  await mkdir(path.dirname(binStatePath), { recursive: true });
  await writeFile(binStatePath, JSON.stringify({ binId }, null, 2) + "\n");
}

function jsonBinHeaders() {
  const masterKey = process.env.JSONBIN_MASTER_KEY;
  if (!masterKey) {
    throw new Error("JSONBIN_MASTER_KEY is not configured");
  }

  return {
    "Content-Type": "application/json",
    "X-Master-Key": masterKey,
    "X-Bin-Versioning": "false",
  };
}

async function createBin() {
  const response = await fetch(JSONBIN_API, {
    method: "POST",
    headers: jsonBinHeaders(),
    body: JSON.stringify(initialMenu),
  });

  if (!response.ok) {
    throw new Error(`JSONBin create failed with ${response.status}`);
  }

  const payload = (await response.json()) as { metadata?: { id?: string } };
  const binId = payload.metadata?.id;
  if (!binId) throw new Error("JSONBin did not return a bin id");

  await storeBinId(binId);
  return binId;
}

async function getBinId() {
  return (await readStoredBinId()) ?? (await createBin());
}

async function readMenu(): Promise<MenuDocument> {
  const binId = await getBinId();
  const response = await fetch(`${JSONBIN_API}/${binId}/latest`, {
    headers: jsonBinHeaders(),
  });

  if (!response.ok) {
    throw new Error(`JSONBin read failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    record?: { categories?: unknown[] };
  };
  const menu = {
    categories: payload.record?.categories ?? [],
    binId,
    updatedAt: new Date().toISOString(),
  };

  return GetGostoMenuResponse.parse(menu);
}

async function writeMenu(categories: unknown[]) {
  const binId = await getBinId();
  const response = await fetch(`${JSONBIN_API}/${binId}`, {
    method: "PUT",
    headers: jsonBinHeaders(),
    body: JSON.stringify({ categories }),
  });

  if (!response.ok) {
    throw new Error(`JSONBin update failed with ${response.status}`);
  }

  return UpdateGostoMenuResponse.parse({
    categories,
    binId,
    updatedAt: new Date().toISOString(),
  });
}

router.get("/gosto/menu", async (_req, res) => {
  try {
    res.json(await readMenu());
  } catch (error) {
    _req.log.error({ err: error }, "Failed to read GOSTO menu from JSONBin");
    res.status(502).json({ error: "تعذر تحميل المنيو من JSONBin" });
  }
});

router.put("/gosto/menu", requireDashboardSession, async (req, res) => {
  const parsed = UpdateGostoMenuBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات المنيو غير صالحة" });
    return;
  }

  try {
    res.json(await writeMenu(parsed.data.categories));
  } catch (error) {
    req.log.error({ err: error }, "Failed to update GOSTO menu in JSONBin");
    res.status(502).json({ error: "تعذر حفظ المنيو في JSONBin" });
  }
});

export default router;