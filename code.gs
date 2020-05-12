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

// Do not edit below

function Schedule() {
  let triggers = ScriptApp.getProjectTriggers();
  for (let trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  refreshConditions_();
  ScriptApp.newTrigger('refreshConditions_').timeBased().everyMinutes(1).create();
  if (updateWindy) ScriptApp.newTrigger('updateWindy_').timeBased().everyMinutes(5).create();
  if (updatePWSWeather) ScriptApp.newTrigger('updatePWSWeather_').timeBased().everyMinutes(5).create();
  if (updateWeathercloud) ScriptApp.newTrigger('updateWeathercloud_').timeBased().everyMinutes(10).create();
}

// https://www.wunderground.com/member/api-keys
function refreshConditions_() {
  
  // I know, I know. Fahrenheit? Miles per Hour? It's not my favorite either. But, the units are smaller, so it's more precise.
  let conditionsJSON = fetchJSON_('https://api.weather.com/v2/pws/observations/current?stationId=' + ibmStationId + '&format=json&units=e&numericPrecision=decimal&apiKey=' + ibmAPIKey);
  if (!conditionsJSON) { // still no luck? give up
    return false;
  }
  conditionsJSON = conditionsJSON['observations'][0];
  
//  console.log(JSON.stringify(conditionsJSON));
  
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
  if (station.imperial.windSpeed) request += '&windspeedmph=' + station.imperial.windSpeed;
  if (station.imperial.windGust) request += '&windgustmph=' + station.imperial.windGust;
  if (station.winddir) request += '&winddir=' + station.winddir;
  if (station.imperial.pressure) request += '&baromin=' + station.imperial.pressure;
  if (station.imperial.dewpt) request += '&dewptf=' + station.imperial.dewpt;
  if (station.humidity) request += '&humidity=' + station.humidity;
  if (station.uv) request += '&uv=' + station.uv;
  
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
  if (station.imperial.windSpeed) request += '&windspeedmph=' + station.imperial.windSpeed;
  if (station.winddir) request += '&winddir=' + station.winddir;
  if (station.imperial.pressure) request += '&baromin=' + station.imperial.pressure;
  if (station.imperial.dewpt) request += '&dewptf=' + station.imperial.dewpt;
  if (station.humidity) request += '&humidity=' + station.humidity;
  if (station.uv) request += '&uv=' + station.uv;
  
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
  request += '&temp=' + (new Number(station.imperial.temp).fToC() * 10).toFixed(0);
  if (station.imperial.windSpeed) request += '&wspd=' + (new Number(station.imperial.windSpeed).mphToMPS() * 10).toFixed(0);
  if (station.winddir) request += '&wdir=' + station.winddir;
  if (station.imperial.pressure) request += '&baromin=' + (new Number(station.imperial.pressure).inhgTohPa() * 10).toFixed(0);
  if (station.humidity) request += '&hum=' + station.humidity;
  if (station.imperial.precipRate) request += '&rainrate=' + (new Number(station.imperial.precipRate).inTomm() * 10).toFixed(0);
  if (station.uv) request += '&uvi=' + (station.uv * 10);
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
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