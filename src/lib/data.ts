import "server-only";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function loadData<T = any>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function saveData<T = any>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
