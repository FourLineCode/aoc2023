const mode = process.argv[2] ?? 'example';
const file = Bun.file(`${mode}.txt`);
const input = await file.text();

const lines = input.split('\n').map((line) => line.trim());
const numbers = lines.map((line) =>
  line
    .split('')
    .map(Number)
    .filter((n) => !isNaN(n))
);

const sum1 = numbers.reduce((acc, nums) => acc + Number(`${nums[0]}${nums[nums.length - 1]}`), 0);
console.log('Part 1:', sum1);

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    for (let k = 0; k < digits.length; k++) {
      if (lines[i].substring(j).startsWith(digits[k])) {
        const newLine = lines[i].split('');
        newLine.splice(j, 0, String(k + 1));
        lines[i] = newLine.join('');
        j++;
      }
    }
  }
}

const replacedNumbers = lines.map((line) =>
  line
    .split('')
    .map(Number)
    .filter((n) => !isNaN(n))
);

const sum2 = replacedNumbers.reduce(
  (acc, nums) => acc + Number(`${nums[0]}${nums[nums.length - 1]}`),
  0
);
console.log('Part 2:', sum2);
