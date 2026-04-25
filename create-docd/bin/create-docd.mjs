#!/usr/bin/env node
import { cancel, intro, isCancel, outro, text } from "@clack/prompts";
import pc from "picocolors";

async function main() {
  intro(pc.cyan("create-docd"));

  const argDir = process.argv[2]?.trim();

  let targetDir;
  if (argDir) {
    targetDir = argDir;
  } else {
    const directory = await text({
      message: "Where should the project be created?",
      placeholder: "./my-docd-site",
      validate(value) {
        if (typeof value !== "string" || !value.trim()) {
          return "A destination directory is required.";
        }
      },
    });

    if (isCancel(directory)) {
      cancel("Project creation canceled.");
      process.exit(0);
    }

    targetDir = directory.trim();
  }

  try {
    const { runCommand } = await import("@nuxt/cli");
    await runCommand("init", [targetDir, "-t", "gh:BayBreezy/docd/.starters/default"]);

    outro(
      [
        pc.green("Docd project created."),
        `  ${pc.bold("cd")} ${targetDir}`,
        `  ${pc.bold("npx ni")}`,
        `  ${pc.bold("npx nr dev")}`,
      ].join("\n")
    );
  } catch (error) {
    cancel(error instanceof Error ? error.message : "Unable to create the project.");
    process.exit(1);
  }
}

void main();
