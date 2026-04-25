import { workerData, parentPort } from "node:worker_threads";

import { getComponentMeta } from "nuxt-component-meta/parser";

const { batch, rootDir, cacheDir } = workerData;

const results = [];

for (const { manifestPath, absolutePath } of batch) {
  try {
    const raw = getComponentMeta(absolutePath, {
      rootDir,
      cache: true,
      cacheDir,
    });
    results.push({ manifestPath, raw, ok: true });
  } catch (err) {
    results.push({ manifestPath, raw: null, ok: false, error: String(err) });
  }
}

parentPort.postMessage(results);
