const mode = process.argv[2] ?? 'example';
const file = Bun.file(`${mode}.txt`);
const input = await file.text();

const lines = input.split('\n').map((line) => line.trim());
const games = lines.map((line) => {
  const parts = line.split(': ');
  const id = +parts[0].replace('Game ', '');
  const steps: any = parts[1].split('; ').reduce((acc, step) => {
    const s = step.split(', ').map((x) => x.split(' '));
    const obj: { [key: string]: number } = {};
    s.forEach((x) => (obj[x[1]] = +x[0]));
    acc.push(obj);
    return acc;
  }, [] as { [key: string]: number }[]);

  return { id, steps };
});

let sum = 0;
const MAX: { [key: string]: number } = { red: 12, green: 13, blue: 14 };
outer: for (const game of games) {
  for (const step of game.steps) {
    for (const color of Object.keys(MAX)) {
      if (color in step && step[color] > MAX[color]) {
        continue outer;
      }
    }
  }
  sum += game.id;
}
console.log('Part 1:', sum);

let sum2 = 0;
for (const game of games) {
  const needed: { [key: string]: number } = { red: 0, blue: 0, green: 0 };
  for (const step of game.steps) {
    for (const color of Object.keys(needed)) {
      if (color in step && step[color] > needed[color]) {
        needed[color] = step[color];
      }
    }
  }
  sum2 += Object.values(needed)
    .filter((n) => n !== 0)
    .reduce((a, n) => a * n, 1);
}
console.log('Part 2:', sum2);
