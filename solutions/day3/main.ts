const mode = process.argv[2] ?? 'example';
const file = Bun.file(`${mode}.txt`);
const input = await file.text();

const lines = input.split('\n').map((line) => line.trim());

let sum1 = 0;
const gears: { [key: string]: number[] } = {};
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let digitIndices = [];
  let nextToSymbol = false;
  let nextToStar = false;
  let starIndex: [number, number] = [-1, -1];

  const isValidIndex = (x: number, y: number) =>
    Math.max(Math.min(x, line.length - 1), 0) === x &&
    Math.max(Math.min(y, line.length - 1), 0) === y;

  for (let j = 0; j < line.length; j++) {
    if (line[j] === '.' || isNaN(+line[j])) {
      const num = +digitIndices.reduce((acc, index) => acc + line[index], '');
      if (digitIndices.length > 0) {
        if (nextToSymbol) sum1 += num;
        digitIndices = [];
        nextToSymbol = false;
      }
      if (nextToStar && digitIndices.length > 0) {
        const key = `${starIndex[0]},${starIndex[1]}`;
        if (!(key in gears)) gears[key] = [];
        gears[key].push(num);
        nextToStar = false;
        starIndex = [-1, -1];
      }
      continue;
    }
    digitIndices.push(j);
    const dims = [
      [1, 0],
      [1, 1],
      [1, -1],
      [0, 1],
      [0, -1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];
    for (const [dx, dy] of dims) {
      if (isValidIndex(j + dx, i + dy)) {
        const cell = lines[i + dy][j + dx];
        if (cell !== '.' && isNaN(+cell)) nextToSymbol = true;
        if (cell === '*') {
          nextToStar = true;
          starIndex = [i + dy, j + dx];
        }
      }
    }
  }
  if (digitIndices.length > 0 && nextToSymbol)
    sum1 += +digitIndices.reduce((acc, index) => acc + line[index], '');
  if (nextToStar && digitIndices.length > 0) {
    const key = `${starIndex[0]},${starIndex[1]}`;
    if (!(key in gears)) gears[key] = [];
    gears[key].push(+digitIndices.reduce((acc, index) => acc + line[index], ''));
  }
}

const sum2 = Object.entries(gears).reduce((acc, [key, values]) => {
  if (values.length === 2) return acc + values[0] * values[1];
  return acc;
}, 0);

console.log('Part 1:', sum1);
console.log('Part 2:', sum2);
