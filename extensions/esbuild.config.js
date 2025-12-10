import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";

// .env ファイルを読み込む
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  const env = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      // コメント行と空行をスキップ
      if (!trimmed || trimmed.startsWith("#")) continue;

      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join("=").trim();
      }
    }
  }

  return env;
}

const env = loadEnv();
const isWatch = process.argv.includes("--watch");

// 環境変数をdefineに変換
const define = {
  "process.env.API_BASE_URL": JSON.stringify(
    env.API_BASE_URL || "https://fraudalert.citron-tree.jp/api"
  ),
};

console.log("Build config:", { define, isWatch });

const buildOptions = {
  entryPoints: ["src/content.ts"],
  bundle: true,
  outfile: "dist/js/content.js",
  target: "es2020",
  jsx: "automatic",
  jsxImportSource: "preact",
  define,
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await esbuild.build(buildOptions);
  console.log("Build complete!");
}
