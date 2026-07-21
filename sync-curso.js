// Copia curso.json -> el bloque `const CURSO = {...}` embebido en practica.html.
// Uso: node sync-curso.js
// (practica.html no puede usar fetch('curso.json') porque no funciona sobre file://,
// así que los datos van embebidos; este script evita copiar/pegar a mano.)
const fs = require('fs');
const path = require('path');

const cursoPath = path.join(__dirname, 'curso.json');
const practicaPath = path.join(__dirname, 'practica.html');

const curso = JSON.parse(fs.readFileSync(cursoPath, 'utf8'));
const payload = { modulos: curso.modulos };
const block = '/* CURSO:START */\nconst CURSO = ' + JSON.stringify(payload, null, 2) + ';\n/* CURSO:END */';

const html = fs.readFileSync(practicaPath, 'utf8');
const re = /\/\* CURSO:START \*\/[\s\S]*?\/\* CURSO:END \*\//;
if (!re.test(html)) {
  console.error('No se encontraron los marcadores CURSO:START / CURSO:END en practica.html');
  process.exit(1);
}
fs.writeFileSync(practicaPath, html.replace(re, block));
console.log('practica.html actualizado con ' + curso.modulos.length + ' módulos desde curso.json');
