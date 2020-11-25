'use strict';

//figure out how states are entered
//clean up code
//neaten up CSS
//look at address again briefly
//think bout shorter coding, and better iteration


const apiKey = 'xwhnDftgxO4RpDZJIWPIH9XItqx0AiAHDNbn4GlF'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function createAddress(parkObj) {
    for (let j = 0; j < parkObj.addresses.length; j++) {
        if (parkObj.addresses[j].type='physical') {         
        let addressObj = parkObj.addresses[j]
        let address = `${addressObj.line1} ${addressObj.line2} ${addressObj.line3} | ${addressObj.city} | ${addressObj.stateCode} | ${addressObj.postalCode}`
        return address
        };         
    };
};

function displayResults(responseJson) {
    $('#results-list').empty();
    // iterate through the items array
    for (let i = 0; i < responseJson.data.length; i++){
        let address = createAddress(responseJson.data[i])
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
            <p>${responseJson.data[i].description}</p>
            <a href='${responseJson.data[i].url}' target="_blank">Website</a>
            <p>${address}</p>
            </li>`
      )};
    //display the results section  
    $('#results').removeClass('hidden');
  };

function getParks(states, maxResults=10) {
  const url = searchURL + '?' + `stateCode=${states}&limit=${maxResults}&api_key=${apiKey}`;
  console.log(url)

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
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const states = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(states, maxResults);
  });
}

$(watchForm);