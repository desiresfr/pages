const typewriter = document.querySelector('.typewriter');
const phrase = 'Play smarter. Have fun.';
let typeIndex = 0;

function writeTitle() {
  if (typeIndex > phrase.length) return;
  typewriter.textContent = phrase.slice(0, typeIndex);
  typeIndex += 1;
  window.setTimeout(writeTitle, typeIndex === phrase.length + 1 ? 1200 : 75);
}

writeTitle();