const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { minify } = require("terser");

const ASSETS_DIR = path.join(__dirname, "..", "assets");

async function minifyFile(filePath) {
  const file = path.basename(filePath);
  if (file.endsWith(".min.js")) return;

  const outputName = file.replace(/\.js$/, ".min.js");
  const outputPath = path.join(ASSETS_DIR, outputName);

  try {
    const code = fs.readFileSync(filePath, "utf8");
    const result = await minify(code, {
      compress: {
        drop_console: false,
        passes: 2,
      },
      mangle: true,
      module: file === "main-product.js",
      sourceMap: false,
    });

    if (result.code) {
      fs.writeFileSync(outputPath, result.code, "utf8");
      const originalSize = Buffer.byteLength(code, "utf8");
      const minifiedSize = Buffer.byteLength(result.code, "utf8");
      const savings = (
        ((originalSize - minifiedSize) / originalSize) *
        100
      ).toFixed(1);
      console.log(
        `[JS] ${file} → ${outputName} (-${savings}%) at ${new Date().toLocaleTimeString()}`
      );
    }
  } catch (err) {
    console.error(`[JS] ERROR ${file}: ${err.message}`);
  }
}

console.log("Watching JS files in assets/ for changes...\n");

const watcher = chokidar.watch(path.join(ASSETS_DIR, "*.js"), {
  ignored: /\.min\.js$/,
  persistent: true,
  ignoreInitial: true,
});

watcher.on("change", minifyFile);
watcher.on("add", minifyFile);
