#!/usr/bin/env node
const program = require('commander');
const json = require('../package.json');
const axios = require('axios');
const color = require('colors-cli');
const module = require('../key');

program.version(json.version);

program.command('showlist').action(()=>{
    let searchVal = takeString();
    const options = {
        method: 'GET',
        url: 'https://shazam.p.rapidapi.com/search',
        params: {term: `${searchVal}`, locale: 'en-US', offset: '0', limit: '5'},
        headers: {
          'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
          'X-RapidAPI-Key': `${module.key}`
        }
      };
      
      axios.request(options).then(function (response) {
          let data = response.data;
          let tracks = data.tracks;
          let hits = tracks.hits;
          let obj = new Object();
          console.log(color.cyan_bt(`Here are the top-5 tracks of ${searchVal}: `));
          hits.forEach(element => {
              obj[element.track.title] = element.track.subtitle;
          });
          console.table(obj);
      }).catch(function (error) {
          console.log(color.red_bt("some error occured or you have exhausted the request quota!"));
      });
})

// function to take a string from the argv 
function takeString(){
    let searchVal = "";
    for(let i = 3; i< process.argv.length; i++){
        searchVal += process.argv[i] + " ";
    }
    return searchVal;
}
program.parse(process.argv);