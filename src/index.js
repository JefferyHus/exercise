'use strict';

const { getRandomWordSync, getRandomWord } = require('word-maker');
const fs = require('fs');
const path = require('path');
// Log files, append values from the existing functions
const printNumbersAndWordsFile = path.resolve(__dirname, '../print_numbers_and_words.txt');
const asyncPrintNumbersAndWordsFile = path.resolve(__dirname, '../async_print_numbers_and_words.txt');

/**
 * Generator that yields a range of numbers
 * 
 * @param {Integer} from 
 * @param {Integer} to 
 * @return {Array} of numbers
 */
function* range(from, to) {
  for(let i = from; i <= to; i++) {
    yield i;
  }
}

/**
 * Print numbers from 1 to 100 to the file,
 * but for each number also print a random word using the function `getRandomWordSync`.
 */
function printNumbersAndWords() {
  // Create a thenable promise
  let promiseChain = Promise.resolve();
  // Loop thru a range of numbers
  // generate a string format number:randomWord
  [...range(1, 100)].map((value, index) => {
    // Run the promise to generate a random word
    // or throws an error
    promiseChain
    .then(() => {
      try {
        // Init with a random word
        let randomWord = getRandomWordSync({
          withErrors: true
        });
        // Overwrite the randomWord
        if (value % 3 === 0 && value % 5 === 0) {
          randomWord = "FizzBuzz";
        }
        else if(value % 3 === 0) {
          randomWord = "Fizz";
        }
        else if(value % 5 === 0) {
          randomWord = "Buzz";
        }
        // Resolve with random word as value
        return randomWord;
      } catch (error) {
        throw new Error("It shouldn't break anything!");
      }
    })
    .then((word) => {
      // Append the random number:string to a text file
      fs.appendFileSync(printNumbersAndWordsFile, `${value}:${word}\r\n`);
    }, (reason) => {
      fs.appendFileSync(printNumbersAndWordsFile, `${value}:${reason}\r\n`);
    })
  })
}

/**
 * Print numbers from 1 to 100 to the file,
 * but for each number also print asynchronous a random word using the function `getRandomWord`.
 */
function asyncPrintNumbersAndWords() {
  // Create a thenable promise
  let promiseChain = Promise.resolve();
  // Loop thru a range of numbers
  // generate a string format number:randomWord (async mode)
  [...range(1, 100)].map(async (value, index, list) => {
    promiseChain
    .then(async () => {
      try {
        // Init with a random word
        let randomWord = await getRandomWord({
          slow: true
        });
        // Overwrite the randomWord
        if (value % 3 === 0 && value % 5 === 0) {
          randomWord = "FizzBuzz";
        }
        else if(value % 3 === 0) {
          randomWord = "Fizz";
        }
        else if(value % 5 === 0) {
          randomWord = "Buzz";
        }
        // Chaine the promise
        return randomWord;
      } catch (error) {
        throw new Error("It shouldn't break anything!");
      }
    })
    .then((word) => {
      // Append the random number:string to a text file
      fs.appendFile(asyncPrintNumbersAndWordsFile, `${value}:${word}\r\n`, (error) => {
        // An error means either the directory was not found
        // or the process to create the file has failed
        if (error) {
          console.log(error.toString());
        }
      });
    }, (reason) => {
      fs.appendFile(printNumbersAndWordsFile, `${value}:${reason}\r\n`, (error) => {
        // An error means either the directory was not found
        // or the process to create the file has failed
        if (error) {
          console.log(error.toString());
        }
      });
    });
  })
}

function test () {
  asyncPrintNumbersAndWords(); // Using Process.hrtime, this function took less than 1000ms
  printNumbersAndWords();
}

test();