const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const config = require('config');
const PORT = process.env.PORT || 3030;
const redis = require("redis");
const cache_config = { redis: process.env.REDIS_URL || config.get("REDIS_URL") };
const cache = require("express-redis-cache")({client: redis.createClient(cache_config.redis)});

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
// 0716847685
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// adding cors
app.use(cors());

app.get("/",(reg,res)=>{
  res.status(200).send('Welcome to jobs api');
});

app.get(
  "/search/:what/:where",
  (req, res, next) => {

    //middle ware to define cache name
    //set chache name
    res.express_redis_cache_name = "search-" + req.params.what + "-" + req.params.where;
    next();
  },
  cache.route({ expire: 36000 }),
  (req, res) => {
    
    const  country = 'ZA';
    const  pageNum = 1;

    const what = req.params.what;
    const where = req.params.where;

    jobs_api.search(country,pageNum,what,where).then(response => {
        
        res.status(200).json(response);
    });
  }
);


// listening for requests
app.listen(PORT).on("listening", () => {
  console.log(`Jobs API Running on  ${PORT} `);
});


























