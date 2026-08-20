import fs from "node:fs";
import path from "node:path";

const srcDir = path.resolve("node_modules/@electric-sql/pglite/dist");
const targets = [
  path.resolve(".vercel/output/functions/__server.func/_libs"),
  path.resolve(".vercel/output/functions/__server.func"),
];

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  for (const target of targets) {
    if (fs.existsSync(target)) {
      for (const file of files) {
        if (file.endsWith(".data") || file.endsWith(".wasm") || file.endsWith(".tar.gz")) {
          const srcFile = path.join(srcDir, file);
          const destFile = path.join(target, file);
          fs.copyFileSync(srcFile, destFile);
          console.log("[copy-pglite] Copied", file, "->", target);
        }
      }
    }
  }
}
