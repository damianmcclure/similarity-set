# similarity-set
An extension of Set meant for checking similarity of strings. Also offers static functions that can be used seperately from the SimilaritySet.

## Installation
Recommended to install from NPM
`npm install similarity-set`

## Description
I created this to detect monotonous messages to be ignored.. I went with the (string-similarity)[https://www.npmjs.com/package/string-similarity] module at first, but after seeing it was deprecated I decided I probably shouldn't use it.

This is basically a continuation of the `string-similarity` package made by aceakash. Credits go to them for the dice's coefficient handler.

## Documentation
```js
const { SimilaritySet, compareString, compareStrings } = require("similarity-set");

// make a new set
const messages = new SimilaritySet();

// add some data
messages.add("hello how are you");
messages.add("i am doing well thank you");
messages.add("what are you up to today?");
messages.add("nothing much, just chilling");

// check if it has anything similar up to a threshold
messages.hasSimilar("hello, how are you", 0.80); // returns true as the added comma results in 0.88 similarity score with dice's coefficient

// get scores for all elements
messages.getSimilar("hello, how are you"); // returns { ratings: Array, bestMatch: any, bestMatchIndex: number }, same as string-similarity findBestMatch

// Dice's Coefficient: Well-suited for comparing small documents or messages and returns fine-tuned results, however it will take longer to calculate on average
compareString("hello how are you", "hello, how are you", "dice");

// Levenshtein Distance: Well-suited for fuzzy string matching and can be very flexibile and efficient for large strings
compareString("hello how are you", "hello, how are you", "levenshtein");

// Jaccard Index: Well-suited multi-word strings or other sets. Can be useful for comparing sets of tags
compareString("hello how are you", "hello, how are you", "jaccard");

// you can also provide all of these algorithms to compareStrings, SimilaritySet.hasSimilar and SimilaritySet.getSimilar

// some other Quality of Life features, using syntax and functionality from Array
messages.some(message => message.includes("hello")); // returns true because there is atleast one element in the Set that has hello in it
messages.every(message => message.includes("hello")); // returns false because not every element in the Set has hello in it
const filtered = messages.filter(message => message.includes("hello")); // returns a new set with only the first message because it's the only one with hello in it
const reduced = message.reduce((accumulator, message) => {
    accumulator.push(message);
    return accumulator;
}, []); // returns an Array with all elements in it

// stringify the SimilaritySet
console.log(messages.toString()); // returns 'SimilaritySet(size) {"element1", "element2"...}' as a string for printing

// JSONify the SimilaritySet
console.log(messages.toJSON()); // returns an Array of the elements
console.log(JSON.stringify(messages)); // returns the JSONified Array of the elements

// convert JSON to SimilaritySet
const newSet = new SimilaritySet();
newSet.fromJSON(`["one", "two"]`); // returns reference to the set and the set will have 'one' and 'two' in it

// extended functionality forEach
messages.forEach((message) => {
    console.log(message);
    if(message.includes("?")){
        return true; // this is the equivalent to using 'break' in a for loop, no more elements will be iterated after this.
    }
});
```