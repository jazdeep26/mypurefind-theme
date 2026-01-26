const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const CleanCSS = require("clean-css");

const ASSETS_DIR = path.join(__dirname, "..", "assets");

const cleanCSS = new CleanCSS({
  level: {
    1: { all: true },
    2: { mergeMedia: true, removeEmpty: true },
  },
});

function minifyFile(filePath) {
  const file = path.basename(filePath);
  if (file.endsWith(".min.css")) return;

  const outputName = file.replace(/\.css$/, ".min.css");
  const outputPath = path.join(ASSETS_DIR, outputName);

  try {
    const code = fs.readFileSync(filePath, "utf8");
    const result = cleanCSS.minify(code);

    if (result.errors.length > 0) {
      console.error(
        `[CSS] ERROR ${file}: ${result.errors.join(", ")}`
      );
      return;
    }

    fs.writeFileSync(outputPath, result.styles, "utf8");
    const originalSize = Buffer.byteLength(code, "utf8");
    const minifiedSize = Buffer.byteLength(result.styles, "utf8");
    const savings = (
      ((originalSize - minifiedSize) / originalSize) *
      100
    ).toFixed(1);
    console.log(
      `[CSS] ${file} → ${outputName} (-${savings}%) at ${new Date().toLocaleTimeString()}`
    );
  } catch (err) {
    console.error(`[CSS] ERROR ${file}: ${err.message}`);
  }
}

console.log("Watching CSS files in assets/ for changes...\n");

const watcher = chokidar.watch(path.join(ASSETS_DIR, "*.css"), {
  ignored: /\.min\.css$/,
  persistent: true,
  ignoreInitial: true,
});

watcher.on("change", minifyFile);
watcher.on("add", minifyFile);
