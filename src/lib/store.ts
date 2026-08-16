import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "family.json");
const KV_KEY = "family-db";

type KvStore = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

async function cloudflareKv(): Promise<KvStore | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as { FAMILY_KV?: KvStore }).FAMILY_KV;
    return kv ?? null;
  } catch {
    return null;
  }
}

export async function loadStore(): Promise<string | null> {
  const kv = await cloudflareKv();
  if (kv) return kv.get(KV_KEY);
  try {
    return await readFile(dataFile, "utf8");
  } catch {
    return null;
  }
}

export async function saveStore(raw: string): Promise<void> {
  const kv = await cloudflareKv();
  if (kv) {
    await kv.put(KV_KEY, raw);
    return;
  }
  await mkdir(path.dirname(dataFile), { recursive: true });
  await writeFile(dataFile, raw, "utf8");
}
