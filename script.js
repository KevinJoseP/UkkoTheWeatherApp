const api_key = "20d948176a4e4dfa9f1115200232010";
const api_url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}`;


const THERMOMETER_LOGO_SRC = './images/thermometer.svg';
const HUMIDITY_LOGO_SRC = './images/humidity-logo.svg';
const UKKO_LOGO_PNG_SRC = './images/ukko_logo.png';
const SEARCH_LOGO_SRC = './images/search.svg';
const REFRESH_LOGO_SRC = './images/refresh.svg';
const CLOCK_LOGO_SRC = './images/clock.svg';
const LOCATION_LOGO_SRC = './images/location.svg';

let cityName = 'goa';
let newCityName = 'goa';

let apiRespData = "";


const refresh = document.getElementById('refresh');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const currCont = document.getElementById('place-cont');
const forecast = document.getElementById('forecast-cont');
const loader = document.getElementById('loader-cont');
const separator = document.getElementById('separator');

function handleResponse(json)
{
   if(json.error)
   {
       displayErrorMessage(json.error.message);
       apiRespData = '';
       newCityName = cityName;
   }
   else
   {
       apiRespData = json;
       cityName = newCityName;
   }
}

function displayErrorMessage(message)
{
    currCont.innerHTML = '';
    forecast.innerHTML = '';
    currCont.innerText = message;

}

async function fetchWeatherData ()
{
    const currUrl = api_url + `&q=${newCityName}&days=3&aqi=no&alerts=no`;
    try
    {
        const resp = await fetch(currUrl, {mode: 'cors'});
        const json = await resp.json();
        handleResponse(json);
    } catch (error)
    {
        console.log(error);
    }

}

function createWeatherData(imgSrc, imgAlt, val, type)
{
    //creating the elements and adding appropriate classes
    const weatherDiv = document.createElement('div');
    const img = document.createElement('img');
    const dataDiv = document.createElement('div');
    

    if (type == 'current')
    {
        weatherDiv.classList.add('curr-weather-data');
        img.classList.add('secondary-icon');
        dataDiv.classList.add('curr-reading');
    }
    else
    {
        weatherDiv.classList.add('forecast-data-cont');
        img.classList.add('ternary-icon');
        dataDiv.classList.add('forecast-data');
    }

    //populating the values
    dataDiv.innerText = val;
    img.src = imgSrc;
    img.alt = imgAlt;

    //making the subtree
    weatherDiv.appendChild(img);
    weatherDiv.appendChild(dataDiv);

    return weatherDiv;
}

function createForecastDayData(data)
{
    // creating all elements 
    const forecastDiv = document.createElement('div');
    const h3elem = document.createElement('h3');
    const imgElem = document.createElement('img');
    const descr = document.createElement('div');
    const weatherData = document.createElement('div');

    //adding classes
    forecastDiv.classList.add('forecast');
    imgElem.classList.add('forecast-weather-icon');
    descr.classList.add('forecast-weather-descr');
    weatherData.classList.add('forecast-weather-data');
    imgElem.alt = '';

    h3elem.innerText = data.date;
    imgElem.src = data.day.condition.icon;
    descr.innerText = data.day.condition.text;

    const tempval = `${data.day.avgtemp_c} \u00B0 C/ ${data.day.avgtemp_f} \u00B0 F`;
    const humdval = data.day.avghumidity;

    weatherData.appendChild(createWeatherData(THERMOMETER_LOGO_SRC, "temperature", tempval, "forecast"));
    weatherData.appendChild(createWeatherData(HUMIDITY_LOGO_SRC, "humidity", humdval, "forecast"));

    forecastDiv.appendChild(h3elem);
    forecastDiv.appendChild(imgElem);
    forecastDiv.appendChild(descr);
    forecastDiv.appendChild(weatherData);

    return forecastDiv;


}

function buildForecastCont()
{
    forecast.innerHTML = '';
    const forecastData = apiRespData.forecast.forecastday;
    for (let day in forecastData)
    {
        forecast.appendChild(createForecastDayData(forecastData[day]));
    }
    return forecast;
}

function buildLocationCont()
{
    const currLocationData = apiRespData.location;
    const groupingDiv = document.createElement('div');
    const cityDiv = document.createElement('div');
    const locationGroupDiv = document.createElement('div');
    const geoGroupingDiv = document.createElement('div');
    const img = document.createElement('img');
    const countryDiv = document.createElement('div');
    const localtimeDiv = document.createElement('div');
    const timeImg = document.createElement('img');
    const localTimeSpan = document.createElement('span');

    groupingDiv.classList.add('main-grouping-div');
    cityDiv.classList.add('City');
    locationGroupDiv.classList.add('location-grouping');
    geoGroupingDiv.classList.add('geo-grouping');
    img.src = LOCATION_LOGO_SRC;
    img.alt = 'geographical Location';
    img.classList.add('icon-images');
    countryDiv.classList.add('country');
    localtimeDiv.classList.add('local-time');
    timeImg.src = CLOCK_LOGO_SRC;
    timeImg.alt = "local time";
    timeImg.classList.add('icon-images');
    
    cityDiv.innerText = currLocationData.name;

    if (currLocationData.region != '')
    {
        countryDiv.innerText = `${currLocationData.region}, ${currLocationData.country}`;
    }
    else
    {
        countryDiv.innerText = `${currLocationData.country}`;
    }
    
    localTimeSpan.innerText = currLocationData.localtime;

    geoGroupingDiv.appendChild(img);
    geoGroupingDiv.appendChild(countryDiv);

    localtimeDiv.appendChild(timeImg);
    localtimeDiv.appendChild(localTimeSpan);

    locationGroupDiv.appendChild(geoGroupingDiv);
    locationGroupDiv.appendChild(localtimeDiv);

    groupingDiv.appendChild(cityDiv);
    groupingDiv.appendChild(locationGroupDiv);
    
    return groupingDiv;
}

function buildCurrWeatherCont()
{
    const currData = apiRespData.current;

    const mainCont = document.createElement('div');
    mainCont.classList.add('current-conditions-cont');

    const weatherCont = document.createElement('div');
    const img = document.createElement('img');
    const status = document.createElement('div');

    weatherCont.classList.add('current-weather-grouping');
    img.classList.add('current-weather-icon');
    img.src = currData.condition.icon;
    img.alt = 'current weather';
    status.classList.add('current-status');

    status.innerText = currData.condition.text;

    weatherCont.appendChild(img);
    weatherCont.appendChild(status);

    const tempval = `${currData.temp_c} \u00B0 C/ ${currData.temp_f} \u00B0 F`;
    const humdval = currData.humidity;

    mainCont.appendChild(weatherCont);
    mainCont.appendChild(createWeatherData(THERMOMETER_LOGO_SRC, 'temperature', tempval, "current"));
    mainCont.appendChild(createWeatherData(HUMIDITY_LOGO_SRC, 'humidity', humdval, "current"));

    return mainCont;



}

function buildCurrCont()
{
    currCont.innerHTML = '';

    currCont.appendChild(buildLocationCont());
    currCont.appendChild(buildCurrWeatherCont());

}

async function init ()
{ 
    await fetchWeatherData();
    if (apiRespData)
    {
        buildCurrCont();
        buildForecastCont();
    }
}

async function repaintWithNewCity()
{
    startLoadingAnimation();
    await fetchWeatherData();
    if (apiRespData)
    {
        buildCurrCont();
        buildForecastCont();
    }
    stopLoadingAnimation();

}

function handleSearch(e)
{
    e.preventDefault();
    newCityName = searchInput.value;
    repaintWithNewCity();
    searchInput.value = '';
    
}

function handlerefresh(e)
{
    startLoadingAnimation();
    init();
    stopLoadingAnimation();
}

function startLoadingAnimation()
{
    refresh.classList.add('none-display');
    currCont.classList.add('none-display');
    separator.classList.add('none-display');
    forecast.classList.add('none-display');
    loader.classList.remove('none-display');
}

function stopLoadingAnimation()
{
    loader.classList.add('none-display');
    refresh.classList.remove('none-display');
    currCont.classList.remove('none-display');
    separator.classList.remove('none-display');
    forecast.classList.remove('none-display');
}

startLoadingAnimation();
init();
stopLoadingAnimation();


searchForm.addEventListener('submit', handleSearch);
refresh.addEventListener('click', handlerefresh);








