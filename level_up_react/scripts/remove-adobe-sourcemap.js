const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'node_modules', '@adobe');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (stat.isFile() && full.endsWith('.mjs')) {
      try {
        let content = fs.readFileSync(full, 'utf8');
        const original = content;
        // remove sourceMappingURL comments that point to non-existing .ts files
        content = content.replace(/\/\/# sourceMappingURL=.*\\n?/g, '');
        if (content !== original) {
          fs.writeFileSync(full, content, 'utf8');
          console.log('Patched sourcemap comments in', full);
        }
      } catch (err) {
        // ignore
      }
    }
  }
}

walk(targetDir);
console.log('remove-adobe-sourcemap finished');
