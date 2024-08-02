const oneLinerJoke = require('one-liner-joke');
// let chalk = require('chalk');

let joke = oneLinerJoke.getRandomJoke();
console.log(joke);

let jokeTag = oneLinerJoke.getRandomJokeWithTag("flirty", {
    'exclude_tags': ['marriage', 'racist']
});

console.log(jokeTag);

// let exJoke = oneLinerJoke.getAllJokesWithTag('stupid');

// console.log(exJoke);


