// build.js (run in Node, e.g. "node build.js")

import { readJson, validateIndexDataItem } from './readData.js'; // uses fs
import { generateIndexHTML } from './generateHTML.js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const INDEX_PATH = './data/index.json';
const DIST_DIR = 'dist';

async function main() {
  console.log('Building site...');

  await mkdir(DIST_DIR, { recursive: true });

  // 1. Read & validate data
  const indexData = await readJson(INDEX_PATH);
  if (!Array.isArray(indexData)) {
    console.error('index.json is not an array or could not be read');
    return;
  }

  const validItems = [];
  for (const item of indexData) {
    const isValid = await validateIndexDataItem(item);
    if (isValid) {
      validItems.push(item);
    }
  }

  const html = generateIndexHTML(validItems);
  const indexOutputPath = path.join(DIST_DIR, 'index.html');
  // 2. Generate index.html and any needed pages in dist/
  // ...
  await writeFile(indexOutputPath, html, 'utf8');
} 

main().catch((err) => {
  console.error('Build script error:', err);
});