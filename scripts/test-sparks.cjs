const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const compile=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,file);
require.extensions['.ts']=compile;require.extensions['.tsx']=compile;
const {sparkCollections}=require('../src/data/sparkCollections.ts');
const {sandboxSparkCatalog,sparkAppearance,sparkTiers}=require('../src/data/streakSparks.ts');
const {translate,loadTranslations}=require('../src/lib/i18n.ts');
loadTranslations().then(()=>{
const themes=['Garden','Hearth','Coast','Trailblazers','Arcade','Workshop','Studio','Mythic','Starforge','Singularity','Unknown'];
const names=new Set(),geometry=new Set();
for(const [index,theme] of themes.entries()){
 const {drawings}=require('../src/components/sparks/'+theme+'Sparks.tsx');
 assert.equal(drawings.length,index===10?1:20,theme+' artwork count');
 assert.equal(sparkCollections[index].names.length,drawings.length,theme+' names');
 for(const [n,Art] of drawings.entries()){
  const name=sparkCollections[index].names[n];assert.ok(!names.has(name),'Reused Spark name: '+name);names.add(name);
  const svg=renderToStaticMarkup(React.createElement(Art));
  const shape=svg.slice(svg.indexOf('>')+1,svg.lastIndexOf('</svg>')).replace(/\s+class="[^"]*"/g,'');
  assert.ok(shape.length>20,name+' missing geometry');assert.ok(!geometry.has(shape),'Reused base artwork: '+name);geometry.add(shape);
  for(const language of ['en','de','ru','kk']){const label=translate(language,name);assert.ok(label&&!label.includes('undefined'),name+' '+language);if(language!=='en'&&!['Supernova','Magnetar','Mixtape'].includes(name))assert.ok(label!==name,'Missing translation: '+language+' '+name);}
 }
}
const catalog=sandboxSparkCatalog();assert.equal(catalog.length,201);assert.equal(new Set(catalog.map(item=>item.id)).size,201);
assert.deepEqual(sparkTiers.map(tier=>tier.xp),[0,400,1200,2500,4500,7500,12000,18000,27000,40000,70000]);
for(const item of catalog){const appearance=sparkAppearance(item.id);assert.equal(appearance.tier,item.tier);assert.equal(sparkCollections[item.tier-1].names[appearance.motif],item.title);assert.equal(item.required_xp,sparkTiers[item.tier-1].xp);}
console.log('Spark checks passed: 201 distinct names and base drawings, themed collections, stable ownership IDs and four languages.');
}).catch((cause)=>{console.error(cause);process.exitCode=1;});
