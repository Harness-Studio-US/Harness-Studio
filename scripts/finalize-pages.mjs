import { copyFileSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const output = resolve("dist-gh-pages");
const source = resolve(output, "single.html");
const target = resolve(output, "index.html");

if (existsSync(source)) {
  copyFileSync(source, target);
  rmSync(source);
} else if (!existsSync(target)) {
  throw new Error("The Pages build did not produce single.html or index.html");
}

console.log("Wrote dist-gh-pages/index.html");
