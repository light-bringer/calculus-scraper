'use strict'


const mongodb = require('mongodb')
  , MongoClient = mongodb.MongoClient
  , Server = require('mongodb').Server
  , mongoClient = new MongoClient(new Server('localhost', 27017))
  , _ = require('lodash')
  , request = require('request');

const calculus_host = 'http://calculus.efi.com'
  , history = '/requests/%s/history.json'
  , details = '/api/v10/requests/%s.json';
  



const parent_request_array = ['720699', '948272'];



let myfunc = {
  'parse_string' :  array_str => {
                        let separator = ',';
                        let arrayOfStrings = array_str.slice(1, -1).split(separator);
                        return arrayOfStrings;
  },
  'gen_url' : (host, path, string)=> {
                  let url = host + path;
                  url = _.replace(url, '%s', string);
                  return url;
  }
}


let Calculus = {
  'get_history' : 

}


try {
  let requests_array = [];
  _.forEach(parent_request_array, (value)=> {
    let history_url;
    history_url = myfunc.gen_url(calculus_host, history, value);
    console.log(history_url);
    request.
      get(history_url, (error, response, body)=> {
        let request_ids = myfunc.parse_string(body);
        console.log(request_ids);
        requests_array = requests_array.concat(request_ids);
        console.log(requests_array);
      });
    console.log(requests_array);
  });
  mongoClient.connect((err, client) => {
    let db = client.db("calculus");
    client.close();
    if(err) {
      throw err;
    }
  });
}
catch (err){
  console.error(err);
}


module.exports = myfunc;
