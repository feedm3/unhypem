# [Unhypem](https://unhypem.com)

[![Heroku](http://heroku-badge.herokuapp.com/?app=unhypem&style=flat)](http://unhypem.com)
[![Build Status](https://semaphoreci.com/api/v1/projects/71955a11-54eb-4082-9cd7-7b6730ed659e/534353/shields_badge.svg)](https://semaphoreci.com/feed-me/unhypem)
[![Build Status](https://travis-ci.org/feedm3/unhypem.svg?branch=master)](https://travis-ci.org/feedm3/unhypem)
[![Dependency Status](https://david-dm.org/feedm3/unhypem.svg)](https://david-dm.org/feedm3/unhypem)

Hear the [hypem charts](http://hypem.com/popular) with the waveform from soundcloud to explore great music faster than ever.

## Run

To run your own instance on your local machine follow these steps:

1. Start a mongodb server 
    - 'mongod --dbpath data'
2. If you start unhypem the first time you want to run the tests first. This triggers the crawler and pushes the current
charts into the db.
    - 'npm test'
3. Start unhypem and visit http://localhost:3000/
    - 'npm start'

For further starts you can skip the second step. There is also a starting script for the mongo server in the 
[scripts directory](script). 

Consider using 'npm run start-watch-changes' during development to restart the server every time the server-side code changes.

## Test

1. Start mongodb server 
    - 'mongod --dbpath data'
2. Run the tests
    - 'npm test'
    
Consider using 'npm run test-watch-changes' during development to execute the tests every time to code inside the test directory changes.