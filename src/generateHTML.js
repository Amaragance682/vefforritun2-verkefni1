import fs from 'node:fs/promises';
import path from 'node:path';
import { readJson } from './readData.js';

const INDEX_PATH = 'data/index.json';
const OUTPUT_DIR = './dist';


export function generateIndexHTML(data) { 
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="stylesheet" href="styles.css">
      <meta charset="utf-8">
      <title>Quiz Index</title>
      <script src = "main.js"></script>
    </head>
    <body>
      <h1>Quiz Categories</h1>
      <div class="selection">
        <ul>
          ${data.map(category => `
            <li>
              <a href="${category.file.replace('.json', '.html')}">
                ${category.title}
              </a>
            </li>`).join('')}
                
        </ul>
      </div>
    </body>
  </html>
  `;
}

export function generateCategoryHTML(category) {
  const title = category.title;

  const content = category.content;
  if (!content || !content.questions) {
    console.error("No content found for category", title);
    return null;
  }
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">   
    <link rel="stylesheet" href="styles.css">
    <script src = "main.js"></script>

    <title>${title} Questions</title>
  </head>
  <body>
    <h1>${title} Questions</h1>
    <form id="quiz-form">
      ${content.questions.map((question, qIndex) => {
        try {
        return `
        <div class="questionDiv">
          <pre> <p class="questionText">${escapeHTML(question.question)} </p> </pre>
          <ul>
            ${question.answers.map((answer, i) => `
              <li>
                <label>
                  <input 
                    type="radio" 
                    name="question${qIndex}" 
                    value="${i}" 
                    data-is-correct="${answer.correct}" 
                  />
                  ${escapeHTML(answer.answer)}
                </label>
              </li>
            `).join('')}
          </ul>
        </div>
        
        `;
        } catch (error) {
          console.error("Error in question", error);
          return null;
        }
      }).join('')}
      <div>
        <button class="submitButton" id="submitButton" type="button" disabled>Check Answer</button>
      </div>
    </form>
  </body>
</html>
`;
}





async function main() {

  const indexData = await readJson(INDEX_PATH);
  if (!Array.isArray(indexData)) {
    console.error('index.json is not an array. Check the file format.');
    return [];
  }

  const allData = await Promise.all(
    indexData.map(async (item) => {
      const filePath = `./data/${item.file}`;
      const fileData = await readJson(filePath);
      return fileData ? { ...item, content: fileData } : null;
    }),
  );

  const generatedData = await Promise.all(
    allData.map(async (category) => {
      try {
        // Build path + HTML for each category
        if (!category || isNullOneLevel(category.content)) {
          return null;
        }
        const categoryFile = path.join(OUTPUT_DIR, category.file.replace('.json', '.html'));
        const categoryHTML = generateCategoryHTML(category);

        await fs.writeFile(categoryFile, categoryHTML, { flag: 'w+' });
        
        return category;
      } catch (error) {
        console.error("Error in category", category, error);
        return null;
      }
    })
  );
  
  // Now we have an array of category objects + null (for invalid ones)
  const validCategories = generatedData.filter((cat) => cat !== null);
  
  // Generate the index with only valid categories
  const indexContent = generateIndexHTML(validCategories);
  await fs.writeFile(
    path.join(OUTPUT_DIR, "index.html"),
    indexContent,
    { flag: 'w+' }
  );
  
}

export function isNullOneLevel(data) {
  if (!data) {
    return true;
  }
  for (const key in data) {
    if (data[key] === null) {
      return true;
    }
  }
  return false;
}

export function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

if (import.meta.url.endsWith(process.argv[1])) {
  main().catch((error) => {
    console.error('Error in main:', error);
    process.exit(1);
  });
}
