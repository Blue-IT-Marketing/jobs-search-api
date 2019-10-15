
const axios = require('axios');
const config = require('config');

// waiting for an api key
const adzuna_app_id = process.env.ADZUNA_APP_ID || config.get("ADZUNA_APP_ID");
const adzuna_key = process.env.ADZUNA_KEY || config.get("ADZUNA_KEY");
const adzuna_base_url = "https://developer.adzuna.com";

/**
 * 
 * @param {*} query_string {
 * app_id  pre set
 * app_key pre set
 * results_per_page pre set 
 * what : space delimited keywords
 * where : geographic center , eg postal code , place names
 * distance : distance from center in kilometres
 * max_days_old : age of the oldest advertisement
 * sort_by : relevance,
 * full_time : '', 1 On 0 off
 * part_time : '', 1 on 0 Off
 * contract : '' , 1 on 0 Off
 * permanent : 1
 * }
 */

 /**
  * 
  * @param {*} query_string  = what , where
  */
const job_search = async (country,pageNum,what,where) => {
  const results = {status: true,payload:[],error:{}}
  const req_url = adzuna_base_url + `/jobs/${country}/search/${pageNum}`;

  const query_data = {
    
    app_id : adzuna_app_id,
    app_key : adzuna_key,
    results_per_page : 20,
    distance : 60,
    what : what,
    where : where,
    max_days_old : 30,
    sort_by : 'relevance'
  };

  axios.get(req_url,{params : query_data}).then(response => {
    if (response.status === 200){
      return response.data;
    }
  }).then(jobs => {
    console.log(jobs);
    results.status = true;
    results.payload = [...jobs];
    results.error = {}
  }).catch(error => {
    console.log(error);
    results.status = false;
    results.payload = [];
    results.error = {...error};
  });
  
  return results;
};


module.exports = {
  search : job_search
};