import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const workspaces = ["docs"];

for (const workspace of workspaces) {
  const cwd = resolve(process.cwd(), workspace);
  const result = spawnSync("bun", ["run", "dev:prepare"], {
    cwd,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
