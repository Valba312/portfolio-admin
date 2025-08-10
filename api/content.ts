
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";
const KEY = "portfolio:content";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method === "GET") {
    try { const content = await kv.get(KEY); res.setHeader("Content-Type", "application/json"); return res.status(200).send(JSON.stringify(content ?? null)); }
    catch { return res.status(500).json({ error: "KV get failed" }); }
  }
  if (req.method === "POST") {
    const adminToken = process.env.ADMIN_TOKEN;
    const auth = req.headers["authorization"] || ""; const token = String(auth).startsWith("Bearer ") ? String(auth).slice(7) : "";
    if (!adminToken || token !== adminToken) return res.status(401).json({ error: "Unauthorized" });
    try { const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; if (!body || typeof body !== "object") return res.status(400).json({ error: "Invalid JSON" }); await kv.set(KEY, body); return res.status(200).json({ ok: true }); }
    catch { return res.status(400).json({ error: "Invalid JSON" }); }
  }
  res.setHeader("Allow", "GET, POST, OPTIONS"); return res.status(405).end("Method Not Allowed");
}
