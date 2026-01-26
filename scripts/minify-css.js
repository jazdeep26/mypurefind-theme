const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");

const ASSETS_DIR = path.join(__dirname, "..", "assets");

function minifyAllCSS() {
  const files = fs.readdirSync(ASSETS_DIR).filter((f) => {
    return f.endsWith(".css") && !f.endsWith(".min.css");
  });

  console.log(`Found ${files.length} CSS files to minify...\n`);

  let totalOriginal = 0;
  let totalMinified = 0;

  const cleanCSS = new CleanCSS({
    level: {
      1: { all: true },
      2: { mergeMedia: true, removeEmpty: true },
    },
  });

  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const outputName = file.replace(/\.css$/, ".min.css");
    const outputPath = path.join(ASSETS_DIR, outputName);

    try {
      const code = fs.readFileSync(inputPath, "utf8");
      const result = cleanCSS.minify(code);

      if (result.errors.length > 0) {
        console.error(`  ERROR minifying ${file}: ${result.errors.join(", ")}`);
        continue;
      }

      fs.writeFileSync(outputPath, result.styles, "utf8");
      const originalSize = Buffer.byteLength(code, "utf8");
      const minifiedSize = Buffer.byteLength(result.styles, "utf8");
      totalOriginal += originalSize;
      totalMinified += minifiedSize;
      const savings = (
        ((originalSize - minifiedSize) / originalSize) *
        100
      ).toFixed(1);
      console.log(
        `  ${file} → ${outputName} (${formatBytes(originalSize)} → ${formatBytes(minifiedSize)}, -${savings}%)`
      );
    } catch (err) {
      console.error(`  ERROR minifying ${file}: ${err.message}`);
    }
  }

  console.log(
    `\nTotal: ${formatBytes(totalOriginal)} → ${formatBytes(totalMinified)} (-${(((totalOriginal - totalMinified) / totalOriginal) * 100).toFixed(1)}%)`
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  return (bytes / 1024).toFixed(1) + " KB";
}

minifyAllCSS();
