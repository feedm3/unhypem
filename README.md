# Unhypem

[![Heroku](http://heroku-badge.herokuapp.com/?app=unhypem&style=flat)](http://unhypem.com)
[![Build Status](https://semaphoreci.com/api/v1/projects/71955a11-54eb-4082-9cd7-7b6730ed659e/534353/shields_badge.svg)](https://semaphoreci.com/feed-me/unhypem)
[![Build Status](https://travis-ci.org/feedm3/unhypem.svg?branch=master)](https://travis-ci.org/feedm3/unhypem)
[![Dependency Status](https://david-dm.org/feedm3/unhypem.svg)](https://david-dm.org/feedm3/unhypem)

Unhypem is a site to explore the current charts on [hypem](http://hypem.com/popular).

## Run

- start mongodb server 
    - 'mongod --dbpath data'
- if you start unhypem the first time, you want to run the tests to trigger the crawling for the current charts
    - 'npm test'
- start unhypem 
    - 'npm start'
- visit http://localhost:3000/

## Test

- start mongodb server 
    - 'mongod --dbpath data'
- run the tests
    - 'npm test'