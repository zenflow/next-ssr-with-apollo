import fs from "node:fs";
import type { NextApiRequest, NextApiResponse } from "next";

const SERVER_LOGS_FILE = "server-logs.txt";

function readLogs(): string {
  try {
    return fs.readFileSync(SERVER_LOGS_FILE, "utf-8");
  } catch (error) {
    return "";
  }
}

function writeLogs(logs: string) {
  fs.writeFileSync(SERVER_LOGS_FILE, logs);
}

export function addServerLog(req: NextApiRequest, res: NextApiResponse): void {
  const log = `from ${
    req.headers["user-agent"] === "undici" ? "backend" : "frontend"
  } - ${JSON.stringify(req.body)}`;
  writeLogs(readLogs() + log + "\n");
}

const serve = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.clear) {
    writeLogs("");
  }
  res.status(200).send(readLogs());
};

export default serve;
