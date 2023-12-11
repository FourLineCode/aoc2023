const mode = process.argv[2] ?? 'example';
const file = Bun.file(`${mode}.txt`);
const input = await file.text();

const lines = input.split('\n').map((line) => line.trim());
const cards = lines.map((line, index) => [
  [index + 1],
  ...line
    .replace(/Card \d+: /, '')
    .split(' | ')
    .map((part) =>
      part
        .split(' ')
        .filter((s) => s != '')
        .map((n) => +n.trim())
    ),
]);

let sum1 = 0;
const copies: { [key: string]: number } = {};
for (const [[card], winning, hand] of cards) {
  copies[card] = copies[card] ? copies[card] + 1 : 1;
  let match = 0;
  for (const num of hand) if (winning.includes(num)) match++;
  if (match > 0) sum1 += Math.pow(2, match - 1);
  for (let j = 0; j < match; j++) {
    const key = card + j + 1;
    copies[key] = key in copies ? copies[key] + copies[card] : copies[card];
  }
}
const sum2 = Object.values(copies).reduce((acc, val) => acc + val, 0);

console.log('Part 1:', sum1);
console.log('Part 2:', sum2);
