const fs = require('fs');
const path = require('path');

class Dictionary {
  #words;
  #enabled;

  constructor(wordlistPath) {
    this.#words = new Set();
    this.#enabled = false;

    const targetPath = wordlistPath || process.env.SCRABBLE_WORDLIST || path.join(__dirname, 'wordlist.txt');
    if (fs.existsSync(targetPath)) {
      this.loadFromFile(targetPath);
    }
  }

  loadFromFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const words = new Set();

    raw.split(/\r?\n/).forEach((line) => {
      const word = line.trim().toLowerCase();
      if (word && /^[a-z]+$/.test(word)) {
        words.add(word);
      }
    });

    this.#words = words;
    this.#enabled = words.size > 0;
  }

  loadWords(wordList) {
    const words = new Set();
    for (const w of wordList) {
      const word = String(w).trim().toLowerCase();
      if (word && /^[a-z]+$/.test(word)) {
        words.add(word);
      }
    }
    this.#words = words;
    this.#enabled = words.size > 0;
  }

  isEnabled() {
    return this.#enabled;
  }

  isValidWord(word) {
    if (!this.#enabled) {
      return true;
    }
    return this.#words.has(String(word).toLowerCase());
  }
}

module.exports = Dictionary;
