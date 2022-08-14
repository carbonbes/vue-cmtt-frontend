export default function wordDeclension(number, words) {
  let value = number % 100;
  let num = value % 10;
  if (value > 10 && value < 20) return words[2];
  else if (num > 1 && num < 5) return words[1];
  else if (num === 1) return words[0];
  else return words[2];
}
