# [Unhypem](https://unhypem.com)

[![Heroku](http://heroku-badge.herokuapp.com/?app=unhypem&style=flat)](http://unhypem.com)
[![Build Status](https://semaphoreci.com/api/v1/projects/71955a11-54eb-4082-9cd7-7b6730ed659e/534353/shields_badge.svg)](https://semaphoreci.com/feed-me/unhypem)
[![Build Status](https://travis-ci.org/feedm3/unhypem.svg?branch=master)](https://travis-ci.org/feedm3/unhypem)
[![Dependency Status](https://david-dm.org/feedm3/unhypem.svg)](https://david-dm.org/feedm3/unhypem)

Hear the [hypem charts](http://hypem.com/popular) with the waveform from soundcloud to explore great music faster than ever.

## Run

To run your own instance on your local machine follow these steps:

1. Start a postgres server with an `unhypem` database

2. Create a new `.env` file and copy all variables from the
[`example.env`](example.env) into it. Replace or create all values to their
corresponding keys.

    
3. If you start unhypem the first time you want to run the tests first. This triggers the crawler and pushes the current
charts into the db.

```npm test```

4. Build the frontend

```npm run build-front```

5. Start unhypem server and visit _http://localhost:3000/_

```npm start```

For further starts you can skip the third step.

Consider using `npm run start-watch` during backend development and `npm run start-front`
during development for instant reloading.

## Development and testing

During backend development you can use the `npm run start-watch` command to restart
the server with every code change. Use `npm run start-front` during frontend
development for live reloading on code changes.

To test you code make sure postgres is running with an `unhypem database`.

You can then run all tests with

```
npm test
```

Consider using the following the execute the tests on file changes

```
npm run test-watch
```