import fs from 'node:fs/promises';
import sharp from 'sharp';
const names = {cashews:'cashew-nuts',melon:'cantaloupe',dragonfruit:'red-dragon-fruit',sweetpotato:'sweet-potato',passionfruit:'passion-fruit',pepper:'black-pepper','cassia-export':'cassia-cinnamon','star-anise-export':'star-anise','green-coffee-export':'green-coffee-beans','desiccated-coconut-export':'desiccated-coconut','dried-fruit-export':'dried-fruit','finished-cashew-export':'processed-foods'};
const sourceFiles=['src/data.js','src/products-extra.js','src/export-catalog.js'];
const texts=await Promise.all(sourceFiles.map(p=>fs.readFile(p,'utf8')));
const images=[...new Set(texts.flatMap(s=>[...s.matchAll(/image: "(\/images\/[^\"]+\.webp)"/g)].map(m=>m[1])))];
if (!images.length || images.every(image => image.includes("/vietnam-"))) { console.log("Product images already optimized; keeping the manifest."); process.exit(0); }
const mapping={};const report=[];
for(const img of images){
 const stem=img.split('/').at(-1).replace('.webp','');
 for(const width of [320,960]){
  const output=`/images/vietnam-${names[stem]||stem}-w${width}-hong-tam-rosic.webp`;
  let quality=84,buffer;
  do{buffer=await sharp('public'+img).resize({width,withoutEnlargement:true}).webp({quality}).toBuffer();quality-=6;}while(buffer.length>=150000&&quality>=24);
  if(buffer.length>=150000) throw new Error(`Image exceeds limit: ${output}`);
  await fs.writeFile('public'+output,buffer);
  report.push({file:output,bytes:buffer.length,width});
  if(width===960) mapping[img]=output;
 }
}
for(let i=0;i<sourceFiles.length;i++){let text=texts[i];for(const [from,to] of Object.entries(mapping)) text=text.replaceAll(from,to);await fs.writeFile(sourceFiles[i],text);}
await fs.mkdir('artifacts/vr4',{recursive:true});await fs.writeFile('scripts/product-image-manifest.json',JSON.stringify(report,null,2));
console.log(`Optimized ${report.length} WebP assets; maximum ${Math.max(...report.map(x=>x.bytes))} bytes`);
