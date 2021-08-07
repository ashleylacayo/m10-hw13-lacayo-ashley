/******** CHANGES:  ********/
/*** 1. Changed all var to const ***/
/*** 2. Lines 13-27: Convert a promise-based function (a function call with .then) to instead use async/await. ***/
/*** 3. Line 13: Convert a function declaration into an arrow function.
/*** 4. Lines 42-44: Convert a string concatenation to instead use template literals and string interpolation. ***/
/*** 5. Lines 64-74: Convert some object-related code to use ES6 destructuring.***/

// capture references to important DOM elements
const weatherContainer = document.getElementById('weather');
const formEl = document.querySelector('form');
const inputEl = document.querySelector('input');

// #2 & #3 //
formEl.onsubmit = async (e) => {
  // prevent the page from refreshing
  e.preventDefault();

  // capture user's input from form field
  const userInput = inputEl.value.trim()
  // abort API call if user entered no value
  if (!userInput) return
  // call the API and then update the page
  try {
  const weatherInfo = await getWeather(userInput)
  displayWeatherInfo(weatherInfo) 
  } catch (err) {
    displayLocNotFound()
  }

  // reset form field to a blank state
  inputEl.value = ""
}

// calls the OpenWeather API and returns an object of weather info
function getWeather(query) {
  // default search to USA
  if (!query.includes(",")) query += ',us'
  // return the fetch call which returns a promise
  // allows us to call .then on this function
  
  // #4 //
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=6efff70fe1477748e31c17d1c504635f`
  )
    .then(function(res) {
      return res.json()
    })
    .then(function(data) {
      // location not found, throw error/reject promise
      if (data.cod === "404") throw new Error('location not found')
      // create weather icon URL
      const iconUrl = 'https://openweathermap.org/img/wn/' +
        data.weather[0].icon +
        '@2x.png'
      const description = data.weather[0].description
      const actualTemp = data.main.temp
      const feelsLikeTemp = data.main.feels_like
      const place = data.name + ", " + data.sys.country
      // create JS date object from Unix timestamp
      const updatedAt = new Date(data.dt * 1000)
      // this object is used by displayWeatherInfo to update the HTML
      
      // #5 //
      return {
        coords: data.coord.lat + ',' + data.coord.lon,
        description,
        iconUrl,
        actualTemp,
        feelsLikeTemp,
        place,
        updatedAt,
      }
    })
}

// show error message when location isn't found
function displayLocNotFound() {
  // clears any previous weather info
  weatherContainer.innerHTML = "";
  // create h2, add error msg, and add to page
  const errMsg = document.createElement('h2')
  errMsg.textContent = "Location not found"
  weatherContainer.appendChild(errMsg)
}

// updates HTML to display weather info
function displayWeatherInfo(weatherObj) {
  // clears any previous weather info
  weatherContainer.innerHTML = "";

  // inserts a linebreak <br> to weather section tag
  function addBreak() {
    weatherContainer.appendChild(
      document.createElement('br')
    )
  }

  // weather location element
  var placeName = document.createElement('h2')
  placeName.textContent = weatherObj.place
  weatherContainer.appendChild(placeName)

  // map link element based on lat/long
  var whereLink = document.createElement('a')
  whereLink.textContent = "Click to view map"
  whereLink.href = "https://www.google.com/maps/search/?api=1&query=" + weatherObj.coords
  whereLink.target = "__BLANK"
  weatherContainer.appendChild(whereLink)

  // weather icon img
  const icon = document.createElement('img')
  icon.src = weatherObj.iconUrl
  weatherContainer.appendChild(icon)

  // weather description
  const description = document.createElement('p')
  description.textContent = weatherObj.description
  description.style.textTransform = 'capitalize'
  weatherContainer.appendChild(description)

  addBreak()

  // current temperature
  const temp = document.createElement('p')
  temp.textContent = "Current: " +
    weatherObj.actualTemp +
    "° F"
  weatherContainer.appendChild(temp)

  // "feels like" temperature
  const feelsLikeTemp = document.createElement('p')
  feelsLikeTemp.textContent = "Feels like: " +
    weatherObj.feelsLikeTemp +
    "° F"
  weatherContainer.appendChild(feelsLikeTemp)

  addBreak()

  // time weather was last updated
  const updatedAt = document.createElement('p')
  updatedAt.textContent = "Last updated: " +
    weatherObj.updatedAt.toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    )
  weatherContainer.appendChild(updatedAt)
}