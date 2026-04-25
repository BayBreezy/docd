/**
 * Package manager name type
 */
export type PackageManagerName = "npm" | "pnpm" | "bun" | "yarn";

/**
 * Package manager interface
 */
export interface PackageManager {
  name: PackageManagerName;
  command: string;
  install: string;
  installEmpty: string;
  run: string;
  x: string;
  saveDev: string;
  icon: string;
}

/**
 * List of supported package managers
 */
const PACKAGE_MANAGERS: readonly PackageManager[] = [
  {
    name: "npm",
    command: "npm ",
    install: "i ",
    installEmpty: "install",
    run: "run ",
    x: "npx ",
    saveDev: "-D ",
    icon: "material-icon-theme:npm",
  },
  {
    name: "pnpm",
    command: "pnpm ",
    install: "i ",
    installEmpty: "install",
    run: "run ",
    x: "pnpm dlx ",
    saveDev: "-D ",
    icon: "material-icon-theme:pnpm",
  },
  {
    name: "bun",
    command: "bun ",
    install: "add ",
    installEmpty: "install",
    run: "run ",
    x: "bun x ",
    saveDev: "-d ",
    icon: "material-icon-theme:bun",
  },
  {
    name: "yarn",
    command: "yarn ",
    install: "add ",
    installEmpty: "install",
    run: "run ",
    x: "yarn dlx ",
    saveDev: "-D ",
    icon: "material-icon-theme:yarn",
  },
] as const;

/**
 * Composable to access package manager data
 */
export function usePm() {
  return {
    packageManagers: PACKAGE_MANAGERS,
  };
}
