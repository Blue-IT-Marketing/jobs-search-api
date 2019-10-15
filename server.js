const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const config = require('config');
const PORT = process.env.PORT || 3030;
const redis = require("redis");
const cache_config = { redis: process.env.REDIS_URL || config.get("REDIS_URL") };
const cache = require("express-redis-cache")({
  client: redis.createClient(cache_config.redis)
});

const jobs_api = require('./jobs-api');

cache.on("connected", () => {
  // ....
  console.log("cache connected");
});
cache.on("disconnected", () => {
  // ....
  console.log("cache disconneted");
});

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// adding cors
app.use(cors());


app.get(
  "/search/:searchTerm",
  (req, res, next) => {
    //middle ware to define cache name
    //set chache name
    res.express_redis_cache_name = "search-" + req.params.searchTerm;
    next();
  },
  cache.route({ expire: 36000 }),
  (req, res) => {
    const searchTerm = req.params.searchTerm;    
    const country = 'za';
    const  pageNum = 1;

    const what = 'website development';
    const where = 'gauteng';
    jobs_api.search(country,pageNum,what,where).then(response => {
        console.log(response);
    });
  }
);


// listening for requests
app.listen(PORT).on("listening", () => {
  console.log(`Jobs API Running on  ${PORT} `);
});


























