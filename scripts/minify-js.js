const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const ASSETS_DIR = path.join(__dirname, "..", "assets");

async function minifyAllJS() {
  const files = fs.readdirSync(ASSETS_DIR).filter((f) => {
    return f.endsWith(".js") && !f.endsWith(".min.js");
  });

  console.log(`Found ${files.length} JS files to minify...\n`);

  let totalOriginal = 0;
  let totalMinified = 0;

  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const outputName = file.replace(/\.js$/, ".min.js");
    const outputPath = path.join(ASSETS_DIR, outputName);

    try {
      const code = fs.readFileSync(inputPath, "utf8");
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
        totalOriginal += originalSize;
        totalMinified += minifiedSize;
        const savings = (
          ((originalSize - minifiedSize) / originalSize) *
          100
        ).toFixed(1);
        console.log(
          `  ${file} → ${outputName} (${formatBytes(originalSize)} → ${formatBytes(minifiedSize)}, -${savings}%)`
        );
      }
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

minifyAllJS();
