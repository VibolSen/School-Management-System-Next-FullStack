
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const projectRoot = process.cwd();

async function convertTsxToJsx() {
  const tsxFiles = await glob('**/*.tsx', { cwd: projectRoot, ignore: 'node_modules/**' });

  for (const file of tsxFiles) {
    const filePath = path.join(projectRoot, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove type imports
    content = content.replace(/import type {.*} from '.*';\n/g, '');

    // Remove interfaces
    content = content.replace(/interface \w+ {[^}]*}\n/g, '');

    // Remove type annotations from functions
    content = content.replace(/: React\.FC<\w+>/g, '');
    content = content.replace(/: \w+\[\]/g, '');
    content = content.replace(/: \w+/g, '');
    content = content.replace(/<\w+>/g, '');


    const newFilePath = filePath.replace(/\.tsx$/, '.jsx');
    fs.writeFileSync(newFilePath, content);
    fs.unlinkSync(filePath);

    console.log(`Converted ${file} to ${path.basename(newFilePath)}`);
  }
}

convertTsxToJsx().catch(console.error);
