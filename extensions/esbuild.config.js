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

// 共通のビルドオプション
const commonOptions = {
  bundle: true,
  target: "es2020",
  jsx: "automatic",
  jsxImportSource: "preact",
  define,
};

// エントリーポイント
const entries = [
  { in: "src/content.ts", out: "dist/js/content.js" },
  { in: "src/popup.tsx", out: "dist/js/popup.js" },
];

async function build() {
  for (const entry of entries) {
    await esbuild.build({
      ...commonOptions,
      entryPoints: [entry.in],
      outfile: entry.out,
    });
    console.log(`Built: ${entry.out}`);
  }
  console.log("Build complete!");
}

async function watch() {
  const contexts = await Promise.all(
    entries.map((entry) =>
      esbuild.context({
        ...commonOptions,
        entryPoints: [entry.in],
        outfile: entry.out,
      })
    )
  );

  await Promise.all(contexts.map((ctx) => ctx.watch()));
  console.log("Watching for changes...");
}

if (isWatch) {
  watch();
} else {
  build();
}
