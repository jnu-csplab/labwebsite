import { readFile, mkdir, writeFile, cp, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateData } from './core.mjs';
import { renderSite, renderAdmin } from './render.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const names = ['site','professor','research','publications','people'];
const data = Object.fromEntries(await Promise.all(names.map(async name => [name, JSON.parse(await readFile(path.join(root,'content',name+'.json'),'utf8'))])));
validateData(data);
// Clear only this project's resolved build folder, so removed media cannot linger.
if (path.dirname(path.resolve(out)) !== path.resolve(root) || path.basename(out) !== 'dist') throw new Error('Invalid build output path');
await rm(out,{recursive:true,force:true});
await mkdir(path.join(out,'admin'),{recursive:true});
await cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
// Publish only media formats that are intended for the public website.
async function copyMedia(dir, target) {
  await mkdir(target,{recursive:true});
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    if (entry.name.startsWith('.')) continue;
    const from = path.join(dir,entry.name), to = path.join(target,entry.name);
    if (entry.isDirectory()) await copyMedia(from,to);
    else if (entry.isFile() && /\.(png|jpe?g|webp|pdf)$/i.test(entry.name)) await cp(from,to);
  }
}
await copyMedia(path.join(root,'media'),path.join(out,'media'));
await writeFile(path.join(out,'index.html'),renderSite(data));
await writeFile(path.join(out,'admin','index.html'),renderAdmin(data.site));
await writeFile(path.join(out,'.nojekyll'),'');
console.log(`Built ${out} (${data.research.length} research topics, ${data.publications.length} publications, ${data.people.length} people)`);
