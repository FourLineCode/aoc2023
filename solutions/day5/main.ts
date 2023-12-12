const mode = process.argv[2] ?? 'example';
const file = Bun.file(`${mode}.txt`);
const input = await file.text();

const lines = input.split('\n').map((line) => line.trim());
const seeds = lines[0].split(': ')[1].split(' ').map(Number);

const maps = input
  .replace(/.+\n/, '\n')
  .split(/\n\n.+map:\n/)
  .slice(1)
  .map((map) => map.split('\n').map((s) => s.split(' ').map(Number)));

function getSeedLocation(seed: number) {
  let current = seed;
  let found = false;
  for (let i = 0; i < maps.length; i++) {
    for (let j = 0; j < maps[i].length; j++) {
      const map = maps[i][j];
      if (current >= map[1] && current <= map[1] + map[2]) {
        current += map[0] - map[1];
        found = true;
        break;
      }
    }
  }
  return current;
}

for (let k = 0; k < 2; k++) {
  let lowestLocation = Number.POSITIVE_INFINITY;

  if (k === 0) {
    for (const seed of seeds) {
      const location = getSeedLocation(seed);
      if (location < lowestLocation) lowestLocation = location;
    }
  } else {
    for (let i = 0; i < seeds.length; i += 2) {
      for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
        const location = getSeedLocation(j);
        if (location < lowestLocation) lowestLocation = location;
      }
    }
  }

  console.log(`Part ${k + 1}:`, lowestLocation);
}
