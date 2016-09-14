const helpers = require('../api_helpers/general');
// queryString is part of https://www.npmjs.com/package/request
const qs = require('querystring');

// given a placename, returns all news articles with that entity in the title
// and body
const getByPlace = (place) => {
  console.log('getByPlace sherlock.js query builder input: ', place);
  // Base Alchemy News API endpoint
  let qUrl = 'https://gateway-a.watsonplatform.net/calls/data/GetNews';
  // Configure all of the individual queries for querying the endpoint
  // See the alchemy news api for what options are available
  const API_KEY = null;
  let queries = {
    outputMode: 'json',
    start: 'now-1d',
    end: 'now',
    count: 5,
    return: 'enriched.url.title,enriched.url.text,'
      + 'enriched.url.url,enriched.url.entities,'
      + 'enriched.url.publicationDate.date',
    apikey: API_KEY
  };
  // Turn all of the queries into a query string
  queries = qs.stringify(queries);
  // Append the queries to the base url
  qUrl = `${qUrl}?${queries}`;
  // Append the entity search to the base url.
  qUrl += `&q.enriched.url.entities.entity=|text=${place},type=city|`;
  // return a promise from the helpers geturl function
  return helpers.getUrl(qUrl).then(d => {
    const resp = JSON.parse(d);
    if (resp.status !== 'OK') {
      console.log('Status is, ', resp);
      console.log('Bad response from watson for query, ', place);
    }
    console.log('return helpers.getUrl resp.result: ', resp);
    return resp.result;
  });
};

exports.getByPlace = getByPlace;
