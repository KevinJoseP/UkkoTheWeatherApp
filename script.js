const api_key = "20d948176a4e4dfa9f1115200232010";
const api_url = `http://api.weatherapi.com/v1/current.json?key=${api_key}`;

function handleResponse(json)
{
   if(json.error)
   {
       console.log(json.error.message);
   }
   else
   {
       console.log(json.current.condition.text);
   }
}

async function fetchWeatherData (cityName)
{
    const currUrl = api_url + `&q=${cityName}&aqi=yes`;
    const resp = await fetch(currUrl, {mode: 'cors'});
    const json = await resp.json();
    console.log(json);
    handleResponse(json);

}



