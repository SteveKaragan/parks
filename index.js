'use strict';
// api key from site, search URL is endpoint
const apiKey = 'xwhnDftgxO4RpDZJIWPIH9XItqx0AiAHDNbn4GlF'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

//this is for the stretch goal.  I used physical address.
function createAddress(parkObj) {
  for (let j = 0; j < parkObj.addresses.length; j++) {
    if (parkObj.addresses[j].type='physical') {         
    let addressObj = parkObj.addresses[j]
    let address = `${addressObj.line1} ${addressObj.line2} ${addressObj.line3} | 
    ${addressObj.city} | ${addressObj.stateCode} | ${addressObj.postalCode}`
    return address
    };         
  };
};
//empty out previous searches & diplay current results
function displayResults(responseJson) {
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    let address = createAddress(responseJson.data[i])
    let park = responseJson.data[i]
    $('#results-list').append(
      `<li><h3>${park.fullName}</h3>
      <p>${park.description}</p>
      <a href='${park.url}' target="_blank">Website</a>
      <p>${address}</p>
      </li>`
    )};
  $('#results').removeClass('hidden');
};

//utilize encodeURIComponent to create query section of URL
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
  }

//add parameters to URL, fetch data, error handling
function getParks(states, maxResults=10) {
  const params = {
    stateCode: states,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
 


  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
        displayResults(responseJson)
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
};
//event listener to know when search initiated, executes search
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const states = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(states, maxResults);
  });
};

$(watchForm);


