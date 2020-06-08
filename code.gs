/*
 * Wunderground Station Forwarder v1.0
 * Fill in the API Keys (and which other services you'd like to update) below, and run the "Schedule" function once. You're all set!
 * If you make any changes to the API Keys or enabled services, run "Schedule" again.
 */

const ibmAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const ibmStationId = 'KXXXXXXXXXX';
const updateWindy = true;
const windyAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const windyStationId = '0';
const updatePWSWeather = true;
const pwsWeatherStationID = 'XXXXXXXXXXX';
const pwsWeatherPassword = 'XXXXXXXXXXX';
const updateWeathercloud = true;
const weathercloudID = 'xxxxxxxxxxxxxxxx';
const weathercloudAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const updateOpenWeatherMap = true;
const openWeatherMapStationID = 'xxxxxxxxxxxxxxxx';
const openWeatherMapAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// Do not edit below

function Schedule() {
  let triggers = ScriptApp.getProjectTriggers().forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  refreshConditions_();
  ScriptApp.newTrigger('refreshConditions_').timeBased().everyMinutes(1).create();
  if (updateWindy) ScriptApp.newTrigger('updateWindy_').timeBased().everyMinutes(5).create();
  if (updatePWSWeather) ScriptApp.newTrigger('updatePWSWeather_').timeBased().everyMinutes(5).create();
  if (updateWeathercloud) ScriptApp.newTrigger('updateWeathercloud_').timeBased().everyMinutes(10).create();
  if (updateOpenWeatherMap) ScriptApp.newTrigger('updateOpenWeatherMap_').timeBased().everyMinutes(1).create();
}

// https://www.wunderground.com/member/api-keys
function refreshConditions_() {
  
  // I know, I know. Fahrenheit? Miles per Hour? It's not my favorite either. But, the units are smaller, so it's more precise.
  let conditionsJSON = fetchJSON_('https://api.weather.com/v2/pws/observations/current?stationId=' + ibmStationId + '&format=json&units=e&numericPrecision=decimal&apiKey=' + ibmAPIKey);
  if (!conditionsJSON) { // still no luck? give up
    return false;
  }
  conditionsJSON = conditionsJSON['observations'][0];
  
  console.log(JSON.stringify(conditionsJSON));
  
  CacheService.getScriptCache().put('weatherstation', JSON.stringify(conditionsJSON));
  
  return JSON.stringify(conditionsJSON);
  
}

// https://community.windy.com/topic/8168/report-your-weather-station-data-to-windy
function updateWindy_() {
  
  let station = JSON.parse(CacheService.getScriptCache().get('weatherstation'));
  
  let request = 'https://stations.windy.com/pws/update/' + windyAPIKey;
  request += '?stationId=' + windyStationId;
  request += '&time=' + new Date(station.obsTimeUtc).toISOString();
  request += '&tempf=' + station.imperial.temp;
  if (station.imperial.windSpeed != null) request += '&windspeedmph=' + station.imperial.windSpeed;
  if (station.imperial.windGust != null) request += '&windgustmph=' + station.imperial.windGust;
  if (station.winddir != null) request += '&winddir=' + station.winddir;
  if (station.imperial.pressure != null) request += '&baromin=' + station.imperial.pressure;
  if (station.imperial.dewpt != null) request += '&dewptf=' + station.imperial.dewpt;
  if (station.humidity != null) request += '&humidity=' + station.humidity.toFixedNumber(0);
  if (station.uv != null) request += '&uv=' + station.uv;
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  return response;
  
}

// no official api docs 🙄
// https://gitlab.com/acuparse/acuparse/-/blob/dev/cron/cron.php#L130
function updatePWSWeather_() {
  
  let station = JSON.parse(CacheService.getScriptCache().get('weatherstation'));
  
  let request = 'http://www.pwsweather.com/pwsupdate/pwsupdate.php';
  request += '?ID=' + pwsWeatherStationID;
  request += '&PASSWORD=' + pwsWeatherPassword;
  request += '&dateutc=' + Utilities.formatDate(new Date(station.obsTimeUtc), 'UTC', 'yyyy-MM-dd hh:mm:ss');
  request += '&tempf=' + station.imperial.temp;
  if (station.imperial.windSpeed != null) request += '&windspeedmph=' + station.imperial.windSpeed;
  if (station.winddir != null) request += '&winddir=' + station.winddir;
  if (station.imperial.pressure != null) request += '&baromin=' + station.imperial.pressure;
  if (station.imperial.dewpt != null) request += '&dewptf=' + station.imperial.dewpt;
  if (station.humidity != null) request += '&humidity=' + station.humidity;
  if (station.uv != null) request += '&uv=' + station.uv;
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  return response;
  
}

// official api docs are private 🙄
// https://gitlab.com/acuparse/acuparse/-/blob/dev/cron/cron.php#L212
function updateWeathercloud_() {
  
  let station = JSON.parse(CacheService.getScriptCache().get('weatherstation'));
  
  let request = 'http://api.weathercloud.net/v01/set';
  request += '?wid=' + weathercloudID;
  request += '&key=' + weathercloudAPIKey;
  request += '&temp=' + (new Number(station.imperial.temp).fToC() * 10).toFixedNumber(0);
  if (station.imperial.windSpeed != null) request += '&wspd=' + (new Number(station.imperial.windSpeed).mphToMPS() * 10).toFixedNumber(0);
  if (station.winddir != null) request += '&wdir=' + station.winddir;
  if (station.imperial.pressure != null) request += '&baromin=' + (new Number(station.imperial.pressure).inhgTohPa() * 10).toFixedNumber(0);
  if (station.humidity != null) request += '&hum=' + station.humidity.toFixedNumber(0);
  if (station.imperial.precipRate != null) request += '&rainrate=' + (new Number(station.imperial.precipRate).inTomm() * 10).toFixedNumber(0);
  if (station.uv != null) request += '&uvi=' + (station.uv * 10);
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  return response;
  
}

// https://openweathermap.org/stations
function updateOpenWeatherMap_() {
  
  let station = JSON.parse(CacheService.getScriptCache().get('weatherstation'));
  
  const stationsDetails = JSON.parse(UrlFetchApp.fetch('https://api.openweathermap.org/data/3.0/stations?APPID=' + openWeatherMapAPIKey).getContentText());
  const internalStationID = stationsDetails.find(station => station['external_id'] == openWeatherMapStationID)['id'];
  
  let measurements = {"station_id": internalStationID};
  measurements['dt'] = (new Date(station.obsTimeUtc).getTime() / 1000).toFixedNumber(0);
  measurements['temperature'] = new Number(station.imperial.temp).fToC().toFixedNumber(1);
  if (station.imperial.windSpeed != null) measurements['wind_speed'] = new Number(station.imperial.windSpeed).mphToMPS().toFixedNumber(0);
  if (station.imperial.windGust != null) measurements['wind_gust'] = new Number(station.imperial.windGust).mphToMPS().toFixedNumber(0);
  if (station.winddir != null) measurements['wind_deg'] = station.winddir;
  if (station.imperial.pressure != null) measurements['pressure'] = new Number(station.imperial.pressure).inhgTohPa().toFixedNumber(0);
  if (station.imperial.dewpt != null) measurements['dew_point'] = new Number(station.imperial.dewpt).fToC().toFixedNumber(1);
  if (station.humidity != null) measurements['humidity'] = station.humidity.toFixedNumber(0);
  
  measurements = [measurements];
  
  let options = {
    "headers": {"Content-Type": "application/json"},
    "contentType": "application/json",
    "type": "post",
    "payload": JSON.stringify(measurements)
  }
  
  let response = UrlFetchApp.fetch('http://api.openweathermap.org/data/3.0/measurements?APPID=' + openWeatherMapAPIKey, options).getContentText();
  
  console.log(response);
  
  return response;
  
}

function fetchJSON_(url, headers) {
  
  if (!headers) {
    headers = {};
  }
  
  let json;
  try {
    json = UrlFetchApp.fetch(url, {"headers": headers}).getContentText();
    json = JSON.parse(json);
  }
  catch(err) { // sometimes the api times out. try again if so
    try {
      Utilities.sleep(15000);
      json = UrlFetchApp.fetch(url, {"headers": headers}).getContentText();
      json = JSON.parse(json);
    }
    catch(err) { // twice
      try {
        Utilities.sleep(15000);
        json = UrlFetchApp.fetch(url, {"headers": headers}).getContentText();
        json = JSON.parse(json);
      }
      catch(e) { // still no luck? give up
        throw "Problem fetching " + url;
      }
    }
  }
  
  return json;
  
}

Number.prototype.fToC = function() { return (this - 32) * (5 / 9); }
Number.prototype.mphToMPS = function() { return this * 0.44704; }
Number.prototype.inhgTohPa = function() { return this * 33.863886666667; }
Number.prototype.inTohmm = function() { return this * 25.4; }
Number.prototype.toFixedNumber = function(digits) { return +this.toFixed(digits); }
