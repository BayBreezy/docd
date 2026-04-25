import { spawn } from "node:child_process";

const filteredPatterns = [/Duplicated imports "useAppConfig"/];

const child = spawn("bunx", ["nuxt", "prepare"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
});

let stdoutBuffer = "";
let stderrBuffer = "";

child.stdout.on("data", (chunk) => {
  stdoutBuffer += chunk.toString();
  stdoutBuffer = flushBuffer(stdoutBuffer, process.stdout.write.bind(process.stdout));
});

child.stderr.on("data", (chunk) => {
  stderrBuffer += chunk.toString();
  stderrBuffer = flushBuffer(stderrBuffer, process.stderr.write.bind(process.stderr));
});

child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

child.on("close", (code) => {
  stdoutBuffer = flushBuffer(stdoutBuffer, process.stdout.write.bind(process.stdout), true);
  stderrBuffer = flushBuffer(stderrBuffer, process.stderr.write.bind(process.stderr), true);
  process.exit(code ?? 1);
});

function flushBuffer(buffer, write, flushAll = false) {
  const lines = buffer.split(/\r?\n/);
  const pending = flushAll ? "" : (lines.pop() ?? "");

  for (const line of lines) {
    if (shouldFilter(line)) {
      continue;
    }

    write(`${line}\n`);
  }

  if (flushAll && pending && !shouldFilter(pending)) {
    write(pending);
  }

  return pending;
}

function shouldFilter(line) {
  const trimmed = line.trim();

  if (!trimmed) {
    return false;
  }

  return filteredPatterns.some((pattern) => pattern.test(trimmed));
}
