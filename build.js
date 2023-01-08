const Watcher = {
  onRebuild(error, result) {
    if (error) console.error("watch build failed:", error);
    else console.log("watch build succeeded:");
  },
};

const FILE = "dist/lib.mjs";
const MINIFY = true;
const BANNER = `
/*! 
* Fastberry @ Copyright 2023
* MIT @ License 
*/
/* eslint-disable */
`;

require("esbuild")
  .build({
    entryPoints: ["app.js"],
    platform: "node",
    target: ["node10.4"],
    format: "esm",
    charset: "utf8",
    watch: Watcher,
    outfile: FILE,
    minify: MINIFY,
    treeShaking: true,
    bundle: true,
    banner: {
      js: BANNER.trim(),
    },
  })
  .then((result) => {
    console.log("watching...");
  });
