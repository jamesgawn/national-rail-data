# national-rail-data

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![CircleCI](https://circleci.com/gh/jamesgawn/national-rail-data.svg?style=svg)](https://circleci.com/gh/jamesgawn/national-rail-data)

## Introduction

A promise based implementation to access the national rail's data soap based APIs.

### Installation

```
npm install national-rail-data
```

### Usage

In order to use this library you will first need to obtain a [National Rail Data Portal](http://opendata.nationalrail.co.uk) account. The credentials are used to initialise this library:

```javascript
const RailData = require('national-rail-data')
let railData = RailData('username', 'password')
``` 

You can then use library to retrieve the station information as follows:

```javascript
let stations = await railData.getStations()
```