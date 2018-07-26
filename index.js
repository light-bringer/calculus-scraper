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
  'parse_history' :  array_str => {
                        let separator = ',';
                        let arrayOfStrings = array_str.slice(1, -1).split(separator);
                        return arrayOfStrings;
  },
  'gen_url' : (host, path, string)=> {
                  let url = host + path;
                  url = _.replace(url, '%s', string);
                  return url;
  },
  'calculus_get' : url=> {
                      let options = {
                        'url': url,
                        'headers' : {
                          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
                        }
                      };
                      return new Promise((resolve, reject)=> {
                        request.get(options, (err, resp, body)=> {
                          if(err) {
                            reject(err);
                          }
                          else {
                            console.log(body);
                            resolve(body);
                          }
                        });
                      });
  }
}



let Calculus = {
'get_history' :  parent_array => {
                  let requests_array = [];
                  let fn = myfunc.calculus_get(myfunc.gen_url());
                  let actions = parent_array.map(fn);
                  let results = Promise.all(actions);
                  return new Promise((resolve, reject)=> {
                    let value;
                    for(value in parent_request_array) {
                      var history_url = myfunc.gen_url(calculus_host, history, value);
                      myfunc.calculus_get(history_url).
                        then(
                          result=> {
                            requests_array = requests_array.concat(myfunc.parse_history(result));
                          }
                          , err=> {
                            console.log("Calculus problem");
                            reject('Calculus Down!');
                          }
                        );
                    }
                    console.log(requests_array);
                    resolve(requests_array);
                  });
    }
}



//test
Calculus.get_history(parent_request_array).
  then(
    result=> {
      console.log(result);
    }
    , err=> {
      console.log(err);
    });


module.exports.myfunc = myfunc;
module.exports.Calculus = Calculus;
