/*
 * Wunderground Station Forwarder v1.1.6
 * Fill in the API Keys (and which other services you'd like to update) below, and run the "Schedule" function once. You're all set!
 * You can see updates in the "☰ ▶ Executions" section on the left. If you make any changes to the API Keys or enabled services, run "Schedule" again.
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
const hasWeatherCloudPro = false;
const updateOpenWeatherMap = true;
const openWeatherMapStationID = 'xxxxxxxxxxxxxxxx';
const openWeatherMapAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// Do not edit below

let version = 'v1.1.6';

function Schedule() {
  ScriptApp.getProjectTriggers().forEach(trigger => ScriptApp.deleteTrigger(trigger));
  refreshConditions_();
  ScriptApp.newTrigger('refreshConditions_').timeBased().everyMinutes(1).create();
  if (updateWindy) ScriptApp.newTrigger('updateWindy_').timeBased().everyMinutes(5).create();
  if (updatePWSWeather) ScriptApp.newTrigger('updatePWSWeather_').timeBased().everyMinutes(5).create();
  if (updateWeathercloud) ScriptApp.newTrigger('updateWeathercloud_').timeBased().everyMinutes(hasWeatherCloudPro ? 1 : 10).create();
  if (updateOpenWeatherMap) ScriptApp.newTrigger('updateOpenWeatherMap_').timeBased().everyMinutes(1).create();
  console.log('Scheduled! Check Executions ☰▶ tab for status.');
  checkGithubReleaseVersion_();
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
// https://gitlab.com/acuparse/acuparse/-/blob/dev/src/fcn/cron/uploaders/pwsweather.php
// https://github.com/OurColonial/WeatherLink-to-PWSweather
function updatePWSWeather_() {
  
  let station = JSON.parse(CacheService.getScriptCache().get('weatherstation'));
  
  let request = 'https://pwsupdate.pwsweather.com/api/v1/submitwx';
  request += '?ID=' + pwsWeatherStationID;
  request += '&PASSWORD=' + pwsWeatherPassword;
  request += '&dateutc=' + Utilities.formatDate(new Date(station.obsTimeUtc), 'UTC', 'yyyy-MM-dd HH:mm:ss');
  request += '&tempf=' + station.imperial.temp;
  if (station.imperial.windSpeed != null) request += '&windspeedmph=' + station.imperial.windSpeed;
  if (station.imperial.windGust != null) request += '&windgustmph=' + station.imperial.windGust;
  if (station.winddir != null) request += '&winddir=' + station.winddir;
  if (station.imperial.pressure != null) request += '&baromin=' + station.imperial.pressure;
  if (station.imperial.dewpt != null) request += '&dewptf=' + station.imperial.dewpt;
  if (station.humidity != null) request += '&humidity=' + station.humidity;
  if (station.solarRadiation != null) request += '&solarradiation=' + station.solarRadiation;
  if (station.uv != null) request += '&UV=' + station.uv;
  if (station.imperial.precipRate != null) request += '&rainin=' + station.imperial.precipRate;
  if (station.imperial.precipTotal != null) request += '&dailyrainin=' + station.imperial.precipTotal;
  request += '&softwaretype=appsscriptwundergroundforwarder&action=updateraw';
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  return response;
  
}

// official api docs are private 🙄
// https://gitlab.com/acuparse/acuparse/-/blob/dev/src/fcn/cron/uploaders/weathercloud.php
function updateWeathercloud_() {
  
  let station = JSON.parse(CacheService.getScriptCache().get('weatherstation'));
  
  let request = 'http://api.weathercloud.net/v01/set';
  request += '?wid=' + weathercloudID;
  request += '&key=' + weathercloudAPIKey;
  request += '&date=' + Utilities.formatDate(new Date(station.obsTimeUtc), 'UTC', 'yyyyMMdd');
  request += '&time=' + Utilities.formatDate(new Date(station.obsTimeUtc), 'UTC', 'HHmm');
  request += '&temp=' + (new Number(station.imperial.temp).fToC() * 10).toFixedNumber(0);
  if (station.imperial.windSpeed != null) request += '&wspd=' + (new Number(station.imperial.windSpeed).mphToMPS() * 10).toFixedNumber(0);
  if (station.winddir != null) request += '&wdir=' + station.winddir;
  if (station.imperial.pressure != null) request += '&bar=' + (new Number(station.imperial.pressure).inhgTohPa() * 10).toFixedNumber(0);
  if (station.humidity != null) request += '&hum=' + station.humidity.toFixedNumber(0);
  if (station.imperial.precipRate != null) request += '&rainrate=' + (new Number(station.imperial.precipRate).inTomm() * 10).toFixedNumber(0);
  if (station.uv != null) request += '&uvi=' + (station.uv * 10);
  request += '&software=appsscriptwundergroundforwarder';
  
  let response = UrlFetchApp.fetch(request).getContentText();

  if (response != 200) throw response;
  
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

function checkGithubReleaseVersion_() {
  let latestRelease;
  try {
    latestRelease = fetchJSON_('https://api.github.com/repos/leoherzog/WundergroundStationForwarder/releases/latest');
  }
  catch(e) {
    console.warn('Problem attempting to check for newer Github version');
    return;
  }
  switch (compareSemver_(version, latestRelease.tag_name)) {
    case 0:
      // console.info('Script is up-to-date');
      break;
    case -1:
      console.warn('New version of this script is available! Download at https://github.com/leoherzog/WundergroundStationForwarder/releases');
      break;
    case 1:
      console.error('Local script version (' + version + ') is newer than current release on Github?');
      break;
  }
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
        throw 'Problem fetching ' + url;
      }
    }
  }
  
  return json;
  
}

// https://github.com/substack/semver-compare
function compareSemver_(a, b) {
  var pa = a.split('.');
  var pb = b.split('.');
  for (var i = 0; i < 3; i++) {
    var na = Number(pa[i]);
    var nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
};

Number.prototype.fToC = function() { return (this - 32) * (5 / 9); }
Number.prototype.mphToMPS = function() { return this * 0.44704; }
Number.prototype.inhgTohPa = function() { return this * 33.863886666667; }
Number.prototype.inTomm = function() { return this * 25.4; }
Number.prototype.toFixedNumber = function(digits) { return +this.toFixed(digits); }
