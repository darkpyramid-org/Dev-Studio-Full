import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "../src");
const distDir = path.resolve(__dirname, "../dist");

function copyFiles(src, dest) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyFiles(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      const destParent = path.dirname(destPath);
      if (!fs.existsSync(destParent)) {
        fs.mkdirSync(destParent, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`[copy-assets] Copied ${path.relative(srcDir, srcPath)} -> dist`);
    }
  }
}

copyFiles(srcDir, distDir);
console.log("[copy-assets] All static JSON assets copied to dist successfully.");
