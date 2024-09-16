/*
 * Station Forwarder
 * Fill in the API Keys (and which other services you'd like to update) below, and "▷ Run" the Schedule function. You're all set!
 * You can see updates in the "☰▶ Executions" section on the left. If you make any changes to the API Keys or enabled services, run Schedule again.
 */


// Getting data

const datasource = 'weatherflow'; // 'ibm' (wunderground), 'acurite' (myacurite), 'davis' (weatherlink), 'weatherflow' (tempestwx), 'ambient' (ambient weather), 'aprs' (aprs.fi), or 'custom' (custom webhook in rtl_433 format)

const ibmAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const ibmStationId = 'KXXXXXXXXXX';
// or
const acuriteUsername = 'xxxxxx@example.com';
const acuritePassword = 'xxxxxxxxxxxxxxxxxx';
const acuriteHubName = 'xxxxxxxxxxxxxxxx';
const acuriteStationName = 'xxxxxxxxxxxxxxxx';
// or
const davisApiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const davisApiSecret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const davisStationName = 'xxxxxxxxxxxxxxxx';
// or
const weatherflowPUT = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const weatherflowStationId = 'xxxxx';
// or
const ambientWeatherStationName = 'xxxxxx';
const ambientWeatherApiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
// or
const aprsStationID = 'xxxxxx';
const aprsApiKey = 'xxxxxx.xxxxxxxxxxxxxxxx';
// or
const customStationLat = 'xx.xxxxxx';
const customStationLon = 'xx.xxxxxx';

// Sending data

const updateWunderground = false;
const wundergroundStationId = 'KXXXXXXXXXX';
const wundergroundStationKey = 'xxxxxxxx';
///
const updateWindy = false;
const windyAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const windyStationId = '0';
///
const updatePWSWeather = false;
const pwsWeatherAPIKey = 'XXXXXXXXXXX';
const pwsWeatherStationID = 'XXXXXXXXXXX';
///
const updateWeatherCloud = false;
const weathercloudAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const weathercloudID = 'xxxxxxxxxxxxxxxx';
const hasWeatherCloudPro = false;
///
const updateOpenWeatherMap = false;
const openWeatherMapAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const openWeatherMapStationID = 'xxxxxxxxxxxxxxxx';
///
const updateWindGuru = false;
const windGuruStationUID = 'xxxxxxxxxx';
const windGuruStationPassword = 'xxxxxxxxxxxxxxxx';
///
const updateCWOP = false;
const cwopStationIDOrHamCallsign = 'CW0001';
const cwopValidationCode = null;



/*
  ____          _   _       _     _____    _ _ _     ____       _               
 |  _ \  ___   | \ | | ___ | |_  | ____|__| (_) |_  | __ )  ___| | _____      __
 | | | |/ _ \  |  \| |/ _ \| __| |  _| / _` | | __| |  _ \ / _ \ |/ _ \ \ /\ / /
 | |_| | (_) | | |\  | (_) | |_  | |__| (_| | | |_  | |_) |  __/ | (_) \ V  V / 
 |____/ \___/  |_| \_|\___/ \__| |_____\__,_|_|\__| |____/ \___|_|\___/ \_/\_/  

*/

let version = 'v2.7.1';

function Schedule() {
  ScriptApp.getProjectTriggers().forEach(trigger => ScriptApp.deleteTrigger(trigger));
  switch (datasource) {
    case 'ibm':
      refreshFromIBM_();
      ScriptApp.newTrigger('refreshFromIBM_').timeBased().everyMinutes(1).create();
      break;
    case 'acurite':
      refreshFromAcurite_();
      ScriptApp.newTrigger('refreshFromAcurite_').timeBased().everyMinutes(1).create();
      break;
    case 'davis':
      refreshFromDavis_();
      ScriptApp.newTrigger('refreshFromDavis_').timeBased().everyMinutes(1).create();
      break;
    case 'weatherflow':
      refreshFromWeatherflow_();
      ScriptApp.newTrigger('refreshFromWeatherflow_').timeBased().everyMinutes(1).create();
      break;
    case 'ambient':
      refreshFromAmbientWeather_();
      ScriptApp.newTrigger('refreshFromAmbientWeather_').timeBased().everyMinutes(1).create();
      break;
    case 'aprs':
      refreshFromAPRSFI_();
      ScriptApp.newTrigger('refreshFromAPRSFI_').timeBased().everyMinutes(1).create();
      break;
    case 'custom':
      console.warn('You have chosen a custom datasource! Please publish this Apps Script project as a web app');
    default:
      throw 'Invalid datasource';
  }
  if (updateWunderground) ScriptApp.newTrigger('updateWunderground_').timeBased().everyMinutes(1).create();
  if (updateWindy) ScriptApp.newTrigger('updateWindy_').timeBased().everyMinutes(5).create();
  if (updatePWSWeather) ScriptApp.newTrigger('updatePWSWeather_').timeBased().everyMinutes(5).create();
  if (updateWeatherCloud) ScriptApp.newTrigger('updateWeatherCloud_').timeBased().everyMinutes(hasWeatherCloudPro ? 1 : 10).create();
  if (updateOpenWeatherMap) ScriptApp.newTrigger('updateOpenWeatherMap_').timeBased().everyMinutes(1).create();
  if (updateWindGuru) ScriptApp.newTrigger('updateWindGuru_').timeBased().everyMinutes(1).create();
  if (updateCWOP) ScriptApp.newTrigger('updateCWOP_').timeBased().everyMinutes(5).create();
  console.log('Scheduled! Check Executions ☰▶ tab for status.');
  checkGithubReleaseVersion_();
}

/*
  ____               _                    
 |  _ \ ___  ___ ___(_)_   _____ _ __ ___ 
 | |_) / _ \/ __/ _ \ \ \ / / _ \ '__/ __|
 |  _ <  __/ (_|  __/ |\ V /  __/ |  \__ \
 |_| \_\___|\___\___|_| \_/ \___|_|  |___/

*/

// https://www.wunderground.com/member/api-keys
function refreshFromIBM_() {

  let ibmConditions = fetchJSON_('https://api.weather.com/v2/pws/observations/current?stationId=' + ibmStationId + '&format=json&units=e&numericPrecision=decimal&apiKey=' + ibmAPIKey);
  if (!ibmConditions) return false; // still no luck? give up

  // console.log(JSON.stringify(ibmConditions));

  ibmConditions = ibmConditions['observations'][0];

  let conditions = {};
  conditions.time = new Date(ibmConditions.obsTimeUtc).getTime();
  conditions.latitude = ibmConditions.lat.toString();
  conditions.longitude = ibmConditions.lon.toString();
  if (ibmConditions.imperial.temp != null) conditions.temp = {
    "f": Number(ibmConditions.imperial.temp).toFixedNumber(2),
    "c": Number(ibmConditions.imperial.temp).fToC().toFixedNumber(2)
  };
  if (ibmConditions.imperial.dewpt != null) conditions.dewpoint = {
    "f": Number(ibmConditions.imperial.dewpt).toFixedNumber(2),
    "c": Number(ibmConditions.imperial.dewpt).fToC().toFixedNumber(2)
  };
  if (ibmConditions.imperial.windSpeed != null) conditions.windSpeed = {
    "mph": Number(ibmConditions.imperial.windSpeed).toFixedNumber(2),
    "mps": Number(ibmConditions.imperial.windSpeed).mphToMPS().toFixedNumber(2),
    "kph": Number(ibmConditions.imperial.windSpeed).mphToKPH().toFixedNumber(2),
    "knots": Number(ibmConditions.imperial.windSpeed).mphToKnots().toFixedNumber(2)
  };
  if (ibmConditions.imperial.windGust != null) conditions.windGust = {
    "mph": Number(ibmConditions.imperial.windGust).toFixedNumber(2),
    "mps": Number(ibmConditions.imperial.windGust).mphToMPS().toFixedNumber(2),
    "kph": Number(ibmConditions.imperial.windGust).mphToKPH().toFixedNumber(2),
    "knots": Number(ibmConditions.imperial.windGust).mphToKnots().toFixedNumber(2)
  };
  if (ibmConditions.winddir != null) conditions.winddir = ibmConditions.winddir;
  if (ibmConditions.imperial.windChill != null) conditions.windChill = {
    "f": Number(ibmConditions.imperial.windChill).toFixedNumber(2),
    "c": Number(ibmConditions.imperial.windChill).fToC().toFixedNumber(2)
  };
  if (ibmConditions.imperial.heatIndex != null) conditions.heatIndex = {
    "f": Number(ibmConditions.imperial.heatIndex).toFixedNumber(2),
    "c": Number(ibmConditions.imperial.heatIndex).fToC().toFixedNumber(2)
  };
  if (ibmConditions.imperial.pressure != null) conditions.pressure = {
    "inHg": Number(ibmConditions.imperial.pressure).toFixedNumber(3),
    "hPa": Number(ibmConditions.imperial.pressure).inHgTohPa().toFixedNumber(0)
  };
  if (ibmConditions.humidity != null) conditions.humidity = Number(ibmConditions.humidity).toFixedNumber(0);
  if (ibmConditions.uv != null) conditions.uv = ibmConditions.uv;
  if (ibmConditions.solarRadiation != null) conditions.solarRadiation = ibmConditions.solarRadiation;
  if (ibmConditions.imperial.precipRate != null) conditions.precipRate = {
    "in": Number(ibmConditions.imperial.precipRate).toFixedNumber(3),
    "mm": Number(ibmConditions.imperial.precipRate).inTomm().toFixedNumber(2)
  };
  if (ibmConditions.imperial.precipTotal != null) conditions.precipSinceMidnight = {
    "in": Number(ibmConditions.imperial.precipTotal).toFixedNumber(3),
    "mm": Number(ibmConditions.imperial.precipTotal).inTomm().toFixedNumber(2)
  };

  let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
  if (calculatedHourlyPrecipAccum != null) conditions.precipLastHour = {
    "in": Number(calculatedHourlyPrecipAccum).toFixedNumber(3),
    "mm": Number(calculatedHourlyPrecipAccum).inTomm().toFixedNumber(2)
  };
  
  console.log(JSON.stringify(conditions));
  
  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);
  
  return JSON.stringify(conditions);

}

// https://community.smartthings.com/t/my-very-quick-and-dirty-integration-with-myacurite-smart-hub-st-webcore/97749
function refreshFromAcurite_() {

  let accountId = CacheService.getScriptCache().get('myAcuriteAccountId');
  let token = CacheService.getScriptCache().get('myAcuriteToken');
  
  // pretending-ish to be a browser
  let headers = {
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "https://www.myacurite.com/",
    "Accept-Language": "en-us",
    "Accept": "application/json",
    "Referer": "https://www.myacurite.com/",
    "DNT": "1"
  };

  if (!token) { // get a new one every 6 hours when the cache expires

    const credentials = {
      "remember": true,
      "email": acuriteUsername,
      "password": acuritePassword
    };

    token = UrlFetchApp.fetch('https://marapi.myacurite.com/users/login', {
      "headers": headers,
      "method": "post",
      "payload": JSON.stringify(credentials)
    }).getContentText();
    token = JSON.parse(token);

    // console.log(JSON.stringify(token));

    accountId = token['user']['account_users'][0]['account_id'].toString();
    token = token['token_id'];

    CacheService.getScriptCache().put('myAcuriteAccountId', accountId, 21600);
    CacheService.getScriptCache().put('myAcuriteToken', token, 21600);

    Utilities.sleep(5000);

  }

  headers['x-one-vue-token'] = token;
  
  let hubs;
  try {
    hubs = UrlFetchApp.fetch('https://marapi.myacurite.com/accounts/' + accountId + '/dashboard/hubs/', {"headers": headers}).getContentText();
    hubs = JSON.parse(hubs);
  }
  catch(e) {

    const credentials = {
      "remember": true,
      "email": acuriteUsername,
      "password": acuritePassword
    };

    let token = UrlFetchApp.fetch('https://marapi.myacurite.com/users/login', {
      "headers": headers,
      "method": "post",
      "payload": JSON.stringify(credentials)
    }).getContentText();
    token = JSON.parse(token);

    accountId = token['user']['account_users'][0]['account_id'].toString();
    token = token['token_id'];

    CacheService.getScriptCache().put('myAcuriteAccountId', accountId, 21600);
    CacheService.getScriptCache().put('myAcuriteToken', token, 21600);

    Utilities.sleep(5000);

    hubs = UrlFetchApp.fetch('https://marapi.myacurite.com/accounts/' + accountId + '/dashboard/hubs/', {"headers": headers}).getContentText();
    hubs = JSON.parse(hubs);

  }

  // console.log(JSON.stringify(hubs));

  let hubId = hubs.account_hubs.find(hub => hub.name === acuriteHubName).id.toString();

  let sensors = UrlFetchApp.fetch('https://marapi.myacurite.com/accounts/' + accountId + '/dashboard/hubs/' + hubId, {"headers": headers}).getContentText();
  sensors = JSON.parse(sensors);

  // console.log(JSON.stringify(sensors));

  let acuriteConditions = sensors.devices.find(device => device.name === acuriteStationName);

  // console.log(JSON.stringify(acuriteConditions));

  let conditions = {};
  conditions.time = new Date(acuriteConditions.last_check_in_at).getTime();
  conditions.latitude = sensors.latitude.toString();
  conditions.longitude = sensors.longitude.toString();
  let temp = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Temperature');
  if (temp != null) conditions.temp = {
    "f": temp.chart_unit === 'F' ? Number(temp.last_reading_value).toFixedNumber(2) : Number(temp.last_reading_value).cToF().toFixedNumber(2),
    "c": temp.chart_unit === 'C' ? Number(temp.last_reading_value).toFixedNumber(2) : Number(temp.last_reading_value).fToC().toFixedNumber(2)
  };
  let dewpoint = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Dew Point');
  if (dewpoint != null) conditions.dewpoint = {
    "f": dewpoint.chart_unit === 'F' ? Number(dewpoint.last_reading_value).toFixedNumber(2) : Number(dewpoint.last_reading_value).cToF().toFixedNumber(2),
    "c": dewpoint.chart_unit === 'C' ? Number(dewpoint.last_reading_value).toFixedNumber(2) : Number(dewpoint.last_reading_value).fToC().toFixedNumber(2)
  };
  let windspeed = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'WindSpeedAvg');
  if (windspeed != null) conditions.windSpeed = {
    "mph": windspeed.chart_unit === 'mph' ? Number(windspeed.last_reading_value).toFixedNumber(2) : Number(windspeed.last_reading_value).kphToMPH().toFixedNumber(2),
    "mps": windspeed.chart_unit === 'mph' ? Number(windspeed.last_reading_value).mphToMPS().toFixedNumber(2) : Number(windspeed.last_reading_value).kphToMPS().toFixedNumber(2),
    "kph": windspeed.chart_unit === 'mph' ? Number(windspeed.last_reading_value).mphToKPH().toFixedNumber(2) : Number(windspeed.last_reading_value).toFixedNumber(2),
    "knots": windspeed.chart_unit === 'mph' ? Number(windspeed.last_reading_value).mphToKnots().toFixedNumber(2) : Number(windspeed.last_reading_value).kphToKnots().toFixedNumber(2)
  };
  let windgust = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Wind Speed');
  if (windgust != null) conditions.windGust = {
    "mph": windgust.chart_unit === 'mph' ? Number(windgust.last_reading_value).toFixedNumber(2) : Number(windgust.last_reading_value).kphToMPH().toFixedNumber(2),
    "mps": windgust.chart_unit === 'mph' ? Number(windgust.last_reading_value).kphToMPS().toFixedNumber(2) : Number(windgust.last_reading_value).kphToMPS().toFixedNumber(2),
    "kph": windgust.chart_unit === 'mph' ? Number(windgust.last_reading_value).mphToKPH().toFixedNumber(2) : Number(windgust.last_reading_value).toFixedNumber(2),
    "knots": windspeed.chart_unit === 'mph' ? Number(windgust.last_reading_value).mphToKnots().toFixedNumber(2) : Number(windgust.last_reading_value).kphToKnots().toFixedNumber(2)
  };
  let winddir = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Wind Direction');
  if (winddir != null) conditions.winddir = Number(winddir.last_reading_value);
  let pressure = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Barometric Pressure');
  if (pressure != null) conditions.pressure = {
    "inHg": pressure.chart_unit === 'inHg' ? Number(pressure.last_reading_value).toFixedNumber(3) : Number(pressure.last_reading_value).hPaToinHg().toFixedNumber(3),
    "hPa": pressure.chart_unit === 'hPa' ? Number(pressure.last_reading_value).toFixedNumber(0) : Number(pressure.last_reading_value).inHgTohPa().toFixedNumber(0)
  };
  let humidity = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Humidity');
  if (humidity != null) conditions.humidity = Number(humidity.last_reading_value).toFixedNumber(0);
  if (temp != null && windspeed != null) conditions.windChill = {
    "f": conditions.temp.f.windChillF(conditions.windSpeed.mph).toFixedNumber(2),
    "c": conditions.temp.c.windChillC(conditions.windSpeed.kph).toFixedNumber(2)
  };
  if (temp != null && humidity != null) conditions.heatIndex = {
    "f": conditions.temp.f.heatIndex(conditions.humidity, 'F').toFixedNumber(2),
    "c": conditions.temp.c.heatIndex(conditions.humidity, 'C').toFixedNumber(2)
  };
  let uv = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'UV'); // TODO: Unable to test, may be wrong sensor code
  if (uv != null) conditions.uv = uv.last_reading_value;
  let lightIntensity = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Light Intensity'); // TODO: Unable to test, may be wrong sensor code
  if (lightIntensity != null) conditions.solarRadiation = lightIntensity.last_reading_value;
  let rain = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Rainfall');
  if (rain != null) conditions.precipRate = {
    "in": rain.chart_unit === 'in' ? Number(rain.last_reading_value).toFixedNumber(3) : Number(rain.last_reading_value).mmToIn().toFixedNumber(3),
    "mm": rain.chart_unit === 'mm' ? Number(rain.last_reading_value).toFixedNumber(2) : Number(rain.last_reading_value).inTomm().toFixedNumber(2)
  };
  
  let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
  if (calculatedHourlyPrecipAccum != null) conditions.precipLastHour = {
    "in": Number(calculatedHourlyPrecipAccum).toFixedNumber(3),
    "mm": Number(calculatedHourlyPrecipAccum).inTomm().toFixedNumber(2)
  };

  console.log(JSON.stringify(conditions));
  
  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);
  
  return JSON.stringify(conditions);

}

// https://weatherlink.github.io/v2-api/api-reference
function refreshFromDavis_() {
  
  let now = Math.round(new Date().getTime() / 1000);

  let signature = Utilities.computeHmacSha256Signature('api-key' + davisApiKey + 't' + now, davisApiSecret).map(function(chr){return (chr+256).toString(16).slice(-2)}).join(''); // sha256 to hex

  let davisStationInfo = fetchJSON_('https://api.weatherlink.com/v2/stations/?api-key=' + davisApiKey + '&api-signature=' + signature + '&t=' + now);
  if (!davisStationInfo) return false; // still no luck? give up
    
  // console.log(JSON.stringify(davisStationInfo));

  let station = davisStationInfo.stations.find(station => station.station_name === davisStationName);
  let stationId = station.station_id;
  
  signature = Utilities.computeHmacSha256Signature('api-key' + davisApiKey + 'station-id' + stationId + 't' + now, davisApiSecret).map(function(chr){return (chr+256).toString(16).slice(-2)}).join('');

  let davisConditions = fetchJSON_('https://api.weatherlink.com/v2/current/' + stationId + '?api-key=' + davisApiKey + '&api-signature=' + signature + '&t=' + now);
  if (!davisConditions) return false; // still no luck? give up

  // console.log(JSON.stringify(davisConditions));

  let conditions = {};
  conditions.time = davisConditions.sensors[0].data[0].ts * 1000;
  conditions.latitude = station.latitude.toString();
  conditions.longitude = station.longitude.toString();
  if (davisConditions.sensors[0].data[0].temp != null) conditions.temp = {
    "f": Number(davisConditions.sensors[0].data[0].temp_out).toFixedNumber(2),
    "c": Number(davisConditions.sensors[0].data[0].temp_out).fToC().toFixedNumber(2)
  };
  if (davisConditions.sensors[0].data[0].dew_point != null) conditions.dewpoint = {
    "f": Number(davisConditions.sensors[0].data[0].dew_point).toFixedNumber(2),
    "c": Number(davisConditions.sensors[0].data[0].dew_point).fToC().toFixedNumber(2)
  };
  if (davisConditions.sensors[0].data[0].wind_speed != null) conditions.windSpeed = {
    "mph": Number(davisConditions.sensors[0].data[0].wind_speed).toFixedNumber(2),
    "mps": Number(davisConditions.sensors[0].data[0].wind_speed).mphToMPS().toFixedNumber(2),
    "kph": Number(davisConditions.sensors[0].data[0].wind_speed).mphToKPH().toFixedNumber(2),
    "knots": Number(davisConditions.sensors[0].data[0].wind_speed).mphToKnots().toFixedNumber(2)
  };
  if (davisConditions.sensors[0].data[0].wind_gust_10_min != null) conditions.windGust = {
    "mph": Number(davisConditions.sensors[0].data[0].wind_gust_10_min).toFixedNumber(2),
    "mps": Number(davisConditions.sensors[0].data[0].wind_gust_10_min).mphToMPS().toFixedNumber(2),
    "kph": Number(davisConditions.sensors[0].data[0].wind_gust_10_min).mphToKPH().toFixedNumber(2),
    "knots": Number(davisConditions.sensors[0].data[0].wind_gust_10_min).mphToKnots().toFixedNumber(2)
  };
  if (davisConditions.sensors[0].data[0].wind_dir != null) conditions.winddir = davisConditions.sensors[0].data[0].wind_dir;
  if (davisConditions.sensors[0].data[0].bar != null) conditions.pressure = {
    "inHg": Number(davisConditions.sensors[0].data[0].bar).toFixedNumber(3),
    "hPa": Number(davisConditions.sensors[0].data[0].bar).inHgTohPa().toFixedNumber(0)
  };
  if (davisConditions.sensors[0].data[0].hum_out != null) conditions.humidity = Number(davisConditions.sensors[0].data[0].hum_out).toFixedNumber(0);
  if (davisConditions.sensors[0].data[0].wind_chill != null) {
    conditions.windChill = {
      "f": Number(davisConditions.sensors[0].data[0].wind_chill).toFixedNumber(2),
      "c": Number(davisConditions.sensors[0].data[0].wind_chill).fToC().toFixedNumber(2)
    };
  } else if (conditions.temp != null && conditions.windSpeed != null) {
    conditions.windChill = {
      "f": conditions.temp.f.windChillF(conditions.windSpeed.mph).toFixedNumber(2),
      "c": conditions.temp.c.windChillC(conditions.windSpeed.kph).toFixedNumber(2)
    };
  };
  if (davisConditions.sensors[0].data[0].heat_index != null) {
    conditions.heatIndex = {
      "f": Number(davisConditions.sensors[0].data[0].heat_index).toFixedNumber(2),
      "c": Number(davisConditions.sensors[0].data[0].heat_index).fToC().toFixedNumber(2)
    };
  } else if (conditions.temp != null && conditions.humidity != null) {
    conditions.heatIndex = {
      "f": conditions.temp.heatIndex(conditions.humidity, 'F').toFixedNumber(2),
      "c": conditions.temp.heatIndex(conditions.humidity, 'C').toFixedNumber(2)
    };
  };
  if (davisConditions.sensors[0].data[0].uv != null) conditions.uv = davisConditions.sensors[0].data[0].uv;
  if (davisConditions.sensors[0].data[0].solar_rad != null) conditions.solarRadiation = davisConditions.sensors[0].data[0].solar_rad;
  if (davisConditions.sensors[0].data[0].rain_storm_in != null) conditions.precipRate = {
    "in": Number(davisConditions.sensors[0].data[0].rain_storm_in).toFixedNumber(3),
    "mm": Number(davisConditions.sensors[0].data[0].rain_storm_mm).toFixedNumber(2)
  };
  if (davisConditions.sensors[0].data[0].rain_day_in != null) conditions.precipSinceMidnight = {
    "in": Number(davisConditions.sensors[0].data[0].rainfall_daily_in).toFixedNumber(3),
    "mm": Number(davisConditions.sensors[0].data[0].rainfall_daily_mm).toFixedNumber(2)
  };
  if (davisConditions.sensors[0].data[0].rain_day_in != null) conditions.precipLast24Hours = {
    "in": Number(davisConditions.sensors[0].data[0].rainfall_last_24_hr_in).toFixedNumber(3),
    "mm": Number(davisConditions.sensors[0].data[0].rainfall_last_24_hr_mm).toFixedNumber(2)
  };
  if (davisConditions.sensors[0].data[0].rain_day_in != null) conditions.precipLastHour = {
    "in": Number(davisConditions.sensors[0].data[0].rainfall_last_60_min_in).toFixedNumber(3),
    "mm": Number(davisConditions.sensors[0].data[0].rainfall_last_60_min_mm).toFixedNumber(2)
  };
  
  console.log(JSON.stringify(conditions));
  
  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);
  
  return JSON.stringify(conditions);

}

// https://weatherflow.github.io/Tempest/api/
// https://apidocs.tempestwx.com/reference/derived-metrics
function refreshFromWeatherflow_() {

  let weatherflowConditions = fetchJSON_('https://swd.weatherflow.com/swd/rest/observations/station/' + weatherflowStationId + '?token=' + weatherflowPUT);
  if (!weatherflowConditions || !weatherflowConditions?.obs || !weatherflowConditions?.obs.length) return false; // still no luck? give up
  // console.log(JSON.stringify(weatherflowConditions));

  let conditions = {};
  conditions.time = weatherflowConditions.obs[0].timestamp * 1000;
  conditions.latitude = weatherflowConditions.latitude.toString();
  conditions.longitude = weatherflowConditions.longitude.toString();
  if (weatherflowConditions.obs[0].air_temperature != null) conditions.temp = {
    "f": Number(weatherflowConditions.obs[0].air_temperature).cToF().toFixedNumber(2),
    "c": Number(weatherflowConditions.obs[0].air_temperature).toFixedNumber(2)
  };
  if (weatherflowConditions.obs[0].dew_point != null) conditions.dewpoint = {
    "f": Number(weatherflowConditions.obs[0].dew_point).cToF().toFixedNumber(2),
    "c": Number(weatherflowConditions.obs[0].dew_point).toFixedNumber(2)
  };
  if (weatherflowConditions.obs[0].wind_avg != null) conditions.windSpeed = {
    "mph": Number(weatherflowConditions.obs[0].wind_avg).mpsToMPH().toFixedNumber(2),
    "mps": Number(weatherflowConditions.obs[0].wind_avg).toFixedNumber(2),
    "kph": Number(weatherflowConditions.obs[0].wind_avg).mpsToKPH().toFixedNumber(2),
    "knots": Number(weatherflowConditions.obs[0].wind_avg).mpsToKnots().toFixedNumber(2)
  };
  if (weatherflowConditions.obs[0].wind_gust != null) conditions.windGust = {
    "mph": Number(weatherflowConditions.obs[0].wind_gust).mpsToMPH().toFixedNumber(2),
    "mps": Number(weatherflowConditions.obs[0].wind_gust).toFixedNumber(2),
    "kph": Number(weatherflowConditions.obs[0].wind_gust).mpsToKPH().toFixedNumber(2),
    "knots": Number(weatherflowConditions.obs[0].wind_gust).mpsToKnots().toFixedNumber(2)
  };
  if (weatherflowConditions.obs[0].wind_direction != null) conditions.winddir = weatherflowConditions.obs[0].wind_direction;
  if (weatherflowConditions.obs[0].sea_level_pressure != null) conditions.pressure = {
    "inHg": Number(weatherflowConditions.obs[0].sea_level_pressure).hPaToinHg().toFixedNumber(3),
    "hPa": Number(weatherflowConditions.obs[0].sea_level_pressure).toFixedNumber(0)
  };
  if (weatherflowConditions.obs[0].relative_humidity != null) conditions.humidity = Number(weatherflowConditions.obs[0].relative_humidity).toFixedNumber(0);
  if (weatherflowConditions.obs[0].wind_chill != null) {
    conditions.windChill = {
      "f": Number(weatherflowConditions.obs[0].wind_chill).cToF().toFixedNumber(2),
      "c": Number(weatherflowConditions.obs[0].wind_chill).toFixedNumber(2)
    };
  } else if (conditions.temp != null && conditions.windSpeed != null) {
    conditions.windChill = {
      "f": conditions.temp.f.windChillF(conditions.windSpeed).toFixedNumber(2),
      "c": conditions.temp.c.windChillC(conditions.windSpeed).toFixedNumber(2)
    };
  };
  if (weatherflowConditions.obs[0].heat_index != null) {
    conditions.heatIndex = {
      "f": Number(weatherflowConditions.obs[0].heat_index).cToF().toFixedNumber(2),
      "c": Number(weatherflowConditions.obs[0].heat_index).toFixedNumber(2)
    };
  } else if (conditions.temp != null && conditions.humidity != null) {
    conditions.heatIndex = {
      "f": conditions.temp.f.heatIndex(conditions.humidity, 'F').toFixedNumber(2),
      "c": conditions.temp.c.heatIndex(conditions.humidity, 'C').toFixedNumber(2)
    };
  };
  if (weatherflowConditions.obs[0].uv != null) conditions.uv = weatherflowConditions.obs[0].uv;
  if (weatherflowConditions.obs[0].solar_radiation != null) conditions.solarRadiation = weatherflowConditions.obs[0].solar_radiation;
  if (weatherflowConditions.obs[0].precip != null) conditions.precipRate = {
    "in": Number(weatherflowConditions.obs[0].precip * 60).mmToIn().toFixedNumber(3),
    "mm": Number(weatherflowConditions.obs[0].precip * 60).toFixedNumber(2)
  };
  if (weatherflowConditions.obs[0].precip_accum_local_day != null) conditions.precipSinceMidnight = {
    "in": Number(weatherflowConditions.obs[0].precip_accum_local_day).mmToIn().toFixedNumber(3),
    "mm": Number(weatherflowConditions.obs[0].precip_accum_local_day).toFixedNumber(2)
  };
  if (weatherflowConditions.obs[0].precip_accum_last_1hr != null) conditions.precipLastHour = {
    "in": Number(weatherflowConditions.obs[0].precip_accum_last_1hr).mmToIn().toFixedNumber(3),
    "mm": Number(weatherflowConditions.obs[0].precip_accum_last_1hr).toFixedNumber(2)
  };
  
  console.log(JSON.stringify(conditions));
  
  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);
  
  return JSON.stringify(conditions);

}

// https://ambientweather.docs.apiary.io/
// https://github.com/ambient-weather/api-docs/wiki/Device-Data-Specs
function refreshFromAmbientWeather_() {

  let ambientWeatherDevices = fetchJSON_('https://rt.ambientweather.net/v1/devices?applicationKey=' + Utilities.newBlob(Utilities.base64Decode('NDNiYzQwMDgxOTc0NDVhNTk3NDg0ZjBiNjgwMjMxYTRiM2UwOTliNzc0NjY0MDlmYTgwN2Q3ZjQzN2YyYmViYg==')).getDataAsString() + '&apiKey=' + ambientWeatherApiKey);
  if (!ambientWeatherDevices || !ambientWeatherDevices.length) return false; // still no luck? give up
  // console.log(JSON.stringify(ambientWeatherDevices));

  let station = ambientWeatherDevices.find(x => x.info.name === ambientWeatherStationName);
  if (!station) throw 'Unable to find station named "' + ambientWeatherStationName + '" in your Ambient Weather account. Only ' + ambientWeatherDevices.map(x => x.info.name).join() + '.';

  let conditions = {};
  conditions.time = station.lastData.dateutc;
  conditions.latitude = station.info.coords.coords.lat.toString();
  conditions.longitude = station.info.coords.coords.lon.toString();
  if (station.lastData.tempf != null) conditions.temp = {
    "f": Number(station.lastData.tempf).toFixedNumber(2),
    "c": Number(station.lastData.tempf).fToC().toFixedNumber(2)
  };
  if (station.lastData.dewPoint != null) conditions.dewpoint = {
    "f": Number(station.lastData.dewPoint).toFixedNumber(2),
    "c": Number(station.lastData.dewPoint).fToC().toFixedNumber(2)
  };
  if (station.lastData.windspeedmph != null) conditions.windSpeed = {
    "mph": Number(station.lastData.windspeedmph).toFixedNumber(2),
    "mps": Number(station.lastData.windspeedmph).mphToMPS().toFixedNumber(2),
    "kph": Number(station.lastData.windspeedmph).mphToKPH().toFixedNumber(2),
    "knots": Number(station.lastData.windspeedmph).mphToKnots().toFixedNumber(2)
  };
  if (station.lastData.windgustmph != null) conditions.windGust = {
    "mph": Number(station.lastData.windgustmph).toFixedNumber(2),
    "mps": Number(station.lastData.windgustmph).mphToMPS().toFixedNumber(2),
    "kph": Number(station.lastData.windgustmph).mphToKPH().toFixedNumber(2),
    "knots": Number(station.lastData.windgustmph).mphToKnots().toFixedNumber(2)
  };
  if (station.lastData.winddir != null) conditions.winddir = station.lastData.winddir;
  if (station.lastData.baromabsin != null) conditions.pressure = {
    "inHg": Number(station.lastData.baromabsin).toFixedNumber(3),
    "hPa": Number(station.lastData.baromabsin).inHgTohPa().toFixedNumber(0)
  };
  if (station.lastData.humidity != null) conditions.humidity = Number(station.lastData.humidity).toFixedNumber(0);
  if (conditions.temp != null && conditions.windSpeed != null) conditions.windChill = {
    "f": conditions.temp.f.windChillF(conditions.windSpeed.mph).toFixedNumber(2),
    "c": conditions.temp.c.windChillC(conditions.windSpeed.kph).toFixedNumber(2)
  };
  if (conditions.temp != null && conditions.humidity != null) conditions.heatIndex = {
    "f": conditions.temp.f.heatIndex(conditions.humidity, 'F').toFixedNumber(2),
    "c": conditions.temp.c.heatIndex(conditions.humidity, 'C').toFixedNumber(2)
  };
  if (station.lastData.uv != null) conditions.uv = station.lastData.uv;
  if (station.lastData.solarradiation != null) conditions.solarRadiation = station.lastData.solarradiation;
  if (station.lastData.hourlyrainin != null) conditions.precipRate = {
    "in": Number(station.lastData.hourlyrainin).toFixedNumber(3),
    "mm": Number(station.lastData.hourlyrainin).inTomm().toFixedNumber(2)
  };
  if (station.lastData.dailyrainin != null) conditions.precipSinceMidnight = {
    "in": Number(station.lastData.dailyrainin).toFixedNumber(3),
    "mm": Number(station.lastData.dailyrainin).inTomm().toFixedNumber(2)
  };
  if (station.lastData['24hourrainin'] != null) conditions.precipLast24Hours = {
    "in": Number(station.lastData['24hourrainin']).toFixedNumber(3),
    "mm": Number(station.lastData['24hourrainin']).inTomm().toFixedNumber(2)
  };
  
  let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
  if (calculatedHourlyPrecipAccum != null) conditions.precipLastHour = {
    "in": Number(calculatedHourlyPrecipAccum).toFixedNumber(3),
    "mm": Number(calculatedHourlyPrecipAccum).inTomm().toFixedNumber(2)
  };
  
  console.log(JSON.stringify(conditions));
  
  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);
  
  return JSON.stringify(conditions);

}

// https://aprs.fi/page/api
function refreshFromAPRSFI() {

  let aprsStations = fetchJSON_('https://api.aprs.fi/api/get?name=' + aprsStationID + '&what=wx&format=json&apikey=' + aprsApiKey);
  if (!aprsStations || !aprsStations?.entries || !aprsStations?.entries.length) return false; // still no luck? give up
  let aprsConditions = aprsStations.entries.find(station => station.name.toLowerCase() === aprsStationID);
  if (!aprsConditions) return false;
  console.log(JSON.stringify(aprsConditions));

  let aprsloc = CacheService.getScriptCache().get('aprsloc');
  if (!aprsloc) {
    aprsloc = fetchJSON_('https://api.aprs.fi/api/get?name=' + aprsStationID + '&what=loc&format=json&apikey=' + aprsApiKey);
    aprsloc = aprsloc.entries.find(station => station.name.toLowerCase() === aprsStationID);
    aprsloc = aprsloc.lat + ',' + aprsloc.lng;
    CacheService.getScriptCache().put('aprsloc', aprsloc, 21600); // 6h maximum, weather stations don't move much
  }

  let conditions = {};
  conditions.time = aprsConditions.time * 1000;
  conditions.latitude = aprsloc.split(',')[0];
  conditions.longitude = aprsloc.split(',')[1];
  if (aprsConditions.temp != null) conditions.temp = {
    "f": Number(aprsConditions.temp).cToF().toFixedNumber(2),
    "c": Number(aprsConditions.temp).toFixedNumber(2)
  };
  if (aprsConditions.wind_speed != null) conditions.windSpeed = {
    "mph": Number(aprsConditions.wind_speed).mpsToMPH().toFixedNumber(2),
    "mps": Number(aprsConditions.wind_speed).toFixedNumber(2),
    "kph": Number(aprsConditions.wind_speed).mpsToKPH().toFixedNumber(2),
    "knots": Number(aprsConditions.wind_speed).mpsToKnots().toFixedNumber(2)
  };
  if (aprsConditions.wind_gust != null) conditions.windGust = {
    "mph": Number(aprsConditions.wind_gust).mpsToMPH().toFixedNumber(2),
    "mps": Number(aprsConditions.wind_gust).toFixedNumber(2),
    "kph": Number(aprsConditions.wind_gust).mpsToKPH().toFixedNumber(2),
    "knots": Number(aprsConditions.wind_gust).mpsToKnots().toFixedNumber(2)
  };
  if (aprsConditions.wind_direction != null) conditions.winddir = aprsConditions.wind_direction;
  if (aprsConditions.pressure != null) conditions.pressure = {
    "inHg": Number(aprsConditions.pressure).hPaToinHg().toFixedNumber(3),
    "hPa": Number(aprsConditions.pressure).toFixedNumber(0)
  };
  if (aprsConditions.humidity != null) conditions.humidity = Number(aprsConditions.humidity).toFixedNumber(0);
  if (conditions.temp != null && conditions.windSpeed != null) conditions.windChill = {
    "f": conditions.temp.f.windChillF(conditions.windSpeed.mph).toFixedNumber(2),
    "c": conditions.temp.c.windChillC(conditions.windSpeed.kph).toFixedNumber(2)
  };
  if (conditions.temp != null && conditions.humidity != null) conditions.heatIndex = {
    "f": conditions.temp.f.heatIndex(conditions.humidity, 'F').toFixedNumber(2),
    "c": conditions.temp.c.heatIndex(conditions.humidity, 'C').toFixedNumber(2)
  };
  if (aprsConditions.luminosity != null) conditions.solarRadiation = Number(aprsConditions.luminosity).toFixedNumber(0);
  if (aprsConditions.rain_1h != null) conditions.precipRate = {
    "in": Number(aprsConditions.rain_1h).mmToIn().toFixedNumber(3),
    "mm": Number(aprsConditions.rain_1h).toFixedNumber(2)
  };
  if (aprsConditions.rain_mn != null) conditions.precipSinceMidnight = {
    "in": Number(aprsConditions.rain_mn).mmToIn().toFixedNumber(3),
    "mm": Number(aprsConditions.rain_mn).toFixedNumber(2)
  };
  if (aprsConditions.rain_24h != null) conditions.precipLast24Hours = {
    "in": Number(aprsConditions.rain_24h).mmToIn().toFixedNumber(3),
    "mm": Number(aprsConditions.rain_24h).toFixedNumber(2)
  };
  
  let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
  if (calculatedHourlyPrecipAccum != null) conditions.precipLastHour = {
    "in": Number(calculatedHourlyPrecipAccum).toFixedNumber(3),
    "mm": Number(calculatedHourlyPrecipAccum).inTomm().toFixedNumber(2)
  };
  
  console.log(JSON.stringify(conditions));
  
  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);
  
  return JSON.stringify(conditions);

}

// https://www.triq.org/rtl_433/DATA_FORMAT.html
// https://developers.google.com/apps-script/guides/web#request_parameters
function doPost(request) {

  let receivedJSON;
  try {
    receivedJSON = JSON.parse(request?.postData?.contents);
  }
  catch(e) {
    console.error('Problem with the received payload: ' + e.message + '\n\n' + request?.postData?.contents);
  }
  if (!receivedJSON) return false;
  console.log(JSON.stringify(receivedJSON));

  let conditions = {};
  conditions.time = new Date(receivedJSON.time).getTime();
  conditions.latitude = customStationLat.toString();
  conditions.longitude = customStationLong.toString();
  if (receivedJSON.temperature_F != null) conditions.temp = {
    "f": Number(receivedJSON.temperature_F).toFixedNumber(2),
    "c": Number(receivedJSON.temperature_F).fToC().toFixedNumber(2)
  };
  if (receivedJSON.temperature_C != null) conditions.temp = {
    "f": Number(receivedJSON.temperature_C).cToF().toFixedNumber(2),
    "c": Number(receivedJSON.temperature_C).toFixedNumber(2)
  };
  if (receivedJSON.wind_avg_m_s != null) conditions.windSpeed = {
    "mph": Number(receivedJSON.wind_avg_m_s).mpsToMPH().toFixedNumber(2),
    "mps": Number(receivedJSON.wind_avg_m_s).toFixedNumber(2),
    "kph": Number(receivedJSON.wind_avg_m_s).mpsToKPH().toFixedNumber(2),
    "knots": Number(receivedJSON.wind_avg_m_s).mpsToKnots().toFixedNumber(2)
  };
  if (receivedJSON.wind_avg_km_h != null) conditions.windSpeed = {
    "mph": Number(receivedJSON.wind_avg_km_h).kphToMPH().toFixedNumber(2),
    "mps": Number(receivedJSON.wind_avg_km_h).kphToMPS().toFixedNumber(2),
    "kph": Number(receivedJSON.wind_avg_km_h).toFixedNumber(2),
    "knots": Number(receivedJSON.wind_avg_km_h).kphToKnots().toFixedNumber(2)
  };
  if (receivedJSON.wind_avg_mi_h != null) conditions.windSpeed = {
    "mph": Number(receivedJSON.wind_avg_mi_h).toFixedNumber(2),
    "mps": Number(receivedJSON.wind_avg_mi_h).mphToMPS().toFixedNumber(2),
    "kph": Number(receivedJSON.wind_avg_mi_h).mphToKPH.toFixedNumber(2),
    "knots": Number(receivedJSON.wind_avg_mi_h).mphToKnots().toFixedNumber(2)
  };
  if (receivedJSON.wind_max_m_s != null) conditions.windGust = {
    "mph": Number(receivedJSON.wind_max_m_s).mpsToMPH().toFixedNumber(2),
    "mps": Number(receivedJSON.wind_max_m_s).toFixedNumber(2),
    "kph": Number(receivedJSON.wind_max_m_s).mpsToKPH().toFixedNumber(2),
    "knots": Number(receivedJSON.wind_max_m_s).mpsToKnots().toFixedNumber(2)
  };
  if (receivedJSON.wind_max_km_h != null) conditions.windGust = {
    "mph": Number(receivedJSON.wind_max_km_h).kphToMPH().toFixedNumber(2),
    "mps": Number(receivedJSON.wind_max_km_h).kphToMPS().toFixedNumber(2),
    "kph": Number(receivedJSON.wind_max_km_h).toFixedNumber(2),
    "knots": Number(receivedJSON.wind_max_km_h).kphToKnots().toFixedNumber(2)
  };
  if (receivedJSON.wind_max_mi_h != null) conditions.windGust = {
    "mph": Number(receivedJSON.wind_max_mi_h).toFixedNumber(2),
    "mps": Number(receivedJSON.wind_max_mi_h).mphToMPS().toFixedNumber(2),
    "kph": Number(receivedJSON.wind_max_mi_h).mphToKPH.toFixedNumber(2),
    "knots": Number(receivedJSON.wind_max_mi_h).mphToKnots().toFixedNumber(2)
  };
  if (receivedJSON.wind_dir_deg != null) conditions.winddir = receivedJSON.wind_dir_deg;
  if (receivedJSON.pressure_hPa != null) conditions.pressure = {
    "inHg": Number(receivedJSON.pressure_hPa).hPaToinHg().toFixedNumber(3),
    "hPa": Number(receivedJSON.pressure_hPa).toFixedNumber(0)
  };
  if (receivedJSON.pressure_psi != null) conditions.pressure = {
    "inHg": Number(receivedJSON.pressure_psi).hPaToinHg().toFixedNumber(3),
    "hPa": Number(receivedJSON.pressure_psi).toFixedNumber(0)
  };
  if (receivedJSON.humidity != null) conditions.humidity = Number(receivedJSON.humidity).toFixedNumber(0);
  if (conditions.temp != null && conditions.windSpeed != null) conditions.windChill = {
    "f": conditions.temp.f.windChillF(conditions.windSpeed).toFixedNumber(2),
    "c": conditions.temp.c.windChillC(conditions.windSpeed).toFixedNumber(2)
  }
  if (conditions.temp != null && conditions.humidity != null) conditions.heatIndex = {
    "f": conditions.temp.f.heatIndex(conditions.humidity, 'F').toFixedNumber(2),
    "c": conditions.temp.c.heatIndex(conditions.humidity, 'C').toFixedNumber(2)
  };
  if (receivedJSON.uv != null) conditions.uv = receivedJSON.uv;
  if (receivedJSON.light_lux != null) conditions.solarRadiation = receivedJSON.light_lux;
  if (receivedJSON.rain_rate_mm_h != null) conditions.precipRate = {
    "in": Number(receivedJSON.rain_rate_mm_h).mmToIn().toFixedNumber(3),
    "mm": Number(receivedJSON.rain_rate_mm_h).toFixedNumber(2)
  };
  
  console.log(JSON.stringify(conditions));
  
  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);
  
  return JSON.stringify(conditions);

}

/*
  ____                 _               
 / ___|  ___ _ __   __| | ___ _ __ ___ 
 \___ \ / _ \ '_ \ / _` |/ _ \ '__/ __|
  ___) |  __/ | | | (_| |  __/ |  \__ \
 |____/ \___|_| |_|\__,_|\___|_|  |___/

*/

// https://support.weather.com/s/article/PWS-Upload-Protocol
function updateWunderground_() {

  let conditions = JSON.parse(CacheService.getScriptCache().get('conditions'));
  
  let request = 'https://rtupdate.wunderground.com/weatherstation/updateweatherstation.php';
  request += '?ID=' + wundergroundStationId;
  request += '&PASSWORD=' + wundergroundStationKey;
  request += '&dateutc=' + encodeURIComponent(Utilities.formatDate(new Date(conditions.time), 'UTC', 'yyyy-MM-dd HH:mm:ss'));
  if (conditions.temp != null) request += '&tempf=' + conditions.temp.f;
  if (conditions.dewpoint != null) request += '&dewptf=' + conditions.dewpoint.f;
  if (conditions.windSpeed != null) request += '&windspeedmph=' + conditions.windSpeed.mph;
  if (conditions.windGust != null) request += '&windgustmph=' + conditions.windGust.mph;
  if (conditions.winddir != null) request += '&winddir=' + conditions.winddir;
  if (conditions.pressure != null) request += '&baromin=' + conditions.pressure.inHg;
  if (conditions.humidity != null) request += '&humidity=' + conditions.humidity;
  if (conditions.uv != null) request += '&uv=' + conditions.uv;
  if (conditions.solarRadiation != null) request += '&solarradiation=' + conditions.solarRadiation;
  if (conditions.precipRate != null) request += '&rainin=' + conditions.precipRate.in;
  if (conditions.precipSinceMidnight != null) request += '&dailyrainin=' + conditions.precipSinceMidnight.in;
  request += '&softwaretype=appsscriptforwarder' + version + '&action=updateraw&realtime=1&rtfreq=60';

  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  return response;

}

// https://community.windy.com/topic/8168/report-your-weather-station-data-to-windy
function updateWindy_() {
  
  let conditions = JSON.parse(CacheService.getScriptCache().get('conditions'));
  
  let request = 'https://stations.windy.com/pws/update/' + windyAPIKey;
  request += '?stationId=' + windyStationId;
  request += '&time=' + new Date(conditions.time).toISOString();
  if (conditions.temp != null) request += '&tempf=' + conditions.temp.f;
  if (conditions.dewpoint != null) request += '&dewptf=' + conditions.dewpoint.f;
  if (conditions.windSpeed != null) request += '&windspeedmph=' + conditions.windSpeed.mph;
  if (conditions.windGust != null) request += '&windgustmph=' + conditions.windGust.mph;
  if (conditions.winddir != null) request += '&winddir=' + conditions.winddir;
  if (conditions.pressure != null) request += '&baromin=' + conditions.pressure.inHg;
  if (conditions.humidity != null) request += '&humidity=' + conditions.humidity;
  if (conditions.precipLastHour != null) request += '&rainin=' + conditions.precipLastHour.in;
  if (conditions.uv != null) request += '&uv=' + conditions.uv;
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  return response;
  
}

// no official api docs 🙄
// https://gitlab.com/acuparse/acuparse/-/blob/dev/src/fcn/cron/uploaders/pwsweather.php
// https://github.com/OurColonial/WeatherLink-to-PWSweather
function updatePWSWeather_() {

  let conditions = JSON.parse(CacheService.getScriptCache().get('conditions'));
  
  let request = 'https://pwsupdate.pwsweather.com/api/v1/submitwx';
  request += '?ID=' + pwsWeatherStationID;
  request += '&PASSWORD=' + pwsWeatherAPIKey;
  request += '&dateutc=' + Utilities.formatDate(new Date(conditions.time), 'UTC', "yyyy-MM-dd'+'HH:mm:ss");
  if (conditions.temp != null) request += '&tempf=' + conditions.temp.f;
  if (conditions.dewpoint != null) request += '&dewptf=' + conditions.dewpoint.f;
  if (conditions.windSpeed != null) request += '&windspeedmph=' + conditions.windSpeed.mph;
  if (conditions.windGust != null) request += '&windgustmph=' + conditions.windGust.mph;
  if (conditions.winddir != null) request += '&winddir=' + conditions.winddir;
  if (conditions.pressure != null) request += '&baromin=' + conditions.pressure.inHg;
  if (conditions.humidity != null) request += '&humidity=' + conditions.humidity;
  if (conditions.uv != null) request += '&uv=' + conditions.uv;
  if (conditions.solarRadiation != null) request += '&solarradiation=' + conditions.solarRadiation;
  if (conditions.precipRate != null) request += '&rainin=' + conditions.precipRate.in;
  if (conditions.precipSinceMidnight != null) request += '&dailyrainin=' + conditions.precipSinceMidnight.in;
  request += '&softwaretype=appsscriptforwarder&action=updateraw';
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  return response;
  
}

// official api docs are private 🙄
// https://gitlab.com/acuparse/acuparse/-/blob/dev/src/fcn/cron/uploaders/weathercloud.php
function updateWeatherCloud_() {
  
  let conditions = JSON.parse(CacheService.getScriptCache().get('conditions'));
  
  let request = 'http://api.weathercloud.net/v01/set';
  request += '?wid=' + weathercloudID;
  request += '&key=' + weathercloudAPIKey;
  request += '&date=' + Utilities.formatDate(new Date(conditions.time), 'UTC', 'yyyyMMdd');
  request += '&time=' + Utilities.formatDate(new Date(conditions.time), 'UTC', 'HHmm');
  if (conditions.temp != null) request += '&temp=' + (conditions.temp.c * 10);
  if (conditions.dewpoint != null) request += '&dew=' + (conditions.dewpoint.c * 10);
  if (conditions.windSpeed != null) request += '&wspd=' + (conditions.windSpeed.mps * 10).toFixedNumber(0);
  if (conditions.windGust != null) request += '&wspdhi=' + (conditions.windGust.mps * 10).toFixedNumber(0);
  if (conditions.winddir != null) request += '&wdir=' + conditions.winddir;
  if (conditions.windChill != null) request += '&chill=' + (conditions.windChill.c * 10);
  if (conditions.heatIndex != null) request += '&heat=' + (conditions.heatIndex.c * 10);
  if (conditions.pressure != null) request += '&bar=' + (conditions.pressure.hPa * 10).toFixedNumber(0);
  if (conditions.humidity != null) request += '&hum=' + conditions.humidity;
  if (conditions.uv != null) request += '&uvi=' + (conditions.uv * 10);
  if (conditions.solarRadiation != null) request += '&solarrad=' + (conditions.solarRadiation * 10).toFixedNumber(0);
  if (conditions.precipRate != null) request += '&rainrate=' + (conditions.precipRate.mm * 10).toFixedNumber(0);
  if (conditions.precipSinceMidnight != null) request += '&rain=' + (conditions.precipSinceMidnight.mm * 10).toFixedNumber(0);
  request += '&software=appsscriptforwarder' + version;
  
  let response = UrlFetchApp.fetch(request).getContentText();

  if (response != 200) throw response;
  
  console.log(response);
  
  return response;
  
}

// https://openweathermap.org/stations
function updateOpenWeatherMap_() {
  
  let conditions = JSON.parse(CacheService.getScriptCache().get('conditions'));
  
  const stationsDetails = JSON.parse(UrlFetchApp.fetch('https://api.openweathermap.org/data/3.0/stations?APPID=' + openWeatherMapAPIKey).getContentText());
  const internalStationID = stationsDetails.find(station => station['external_id'] == openWeatherMapStationID)['id'];
  
  let measurements = {"station_id": internalStationID};
  measurements['dt'] = (conditions.time / 1000).toFixedNumber(0);
  if (conditions.temp) measurements['temperature'] = conditions.temp.c;
  if (conditions.dewpoint != null) measurements['dew_point'] = conditions.dewpoint.c;
  if (conditions.windSpeed != null) measurements['wind_speed'] = conditions.windSpeed.mps;
  if (conditions.windGust != null) measurements['wind_gust'] = conditions.windGust.mps;
  if (conditions.winddir != null) measurements['wind_deg'] = conditions.winddir;
  if (conditions.pressure != null) measurements['pressure'] = conditions.pressure.hPa;
  if (conditions.humidity != null) measurements['humidity'] = conditions.humidity;
  if (conditions.precipLastHour != null) measurements['rain_1h'] = conditions.precipLastHour.mm;
  if (conditions.precipLast24Hours != null) measurements['rain_24h'] = conditions.precipLast24Hours.mm;
  
  measurements = [measurements];
  
  let options = {
    "headers": {"Content-Type": "application/json"},
    "contentType": "application/json",
    "type": "post",
    "payload": JSON.stringify(measurements)
  };
  
  let response = UrlFetchApp.fetch('http://api.openweathermap.org/data/3.0/measurements?APPID=' + openWeatherMapAPIKey, options).getContentText();
  
  console.log(response);
  
  return response;
  
}

function createNewOWMStation_() {
  
  let stationDetails = {
    "external_id": openWeatherMapStationID,
    "name": "Human Friendly Name of Your Station",
    "latitude": 40.6892368,
    "longitude": -74.0444219,
    "altitude": 305
  };

  let options = {
    "headers": {"Content-Type": "application/json"},
    "contentType": "application/json",
    "type": "post",
    "payload": JSON.stringify(stationDetails)
  };

  let response = UrlFetchApp.fetch('http://api.openweathermap.org/data/3.0/stations?APPID=' + openWeatherMapAPIKey, options);

  if (response.getResponseCode() === 201) {
    console.log('Successfully added ' + stationDetails.external_id + ' (' + stationDetails.name + ')! Details:');
    console.log(response.getContentText());
  } else {
    console.log('Problem adding your station. Response code: ' + response.getResponseCode());
    console.log(response.getContentText());
  };

}

// https://stations.windguru.cz/upload_api.php
function updateWindGuru_() {
  
  let conditions = JSON.parse(CacheService.getScriptCache().get('conditions'));
  
  let request = 'http://www.windguru.cz/upload/api.php';
  request += '?uid=' + windGuruStationUID;
  let salt = new Date(conditions.time).getTime();
  request += '&salt=' + salt;
  let hash = md5_(salt + windGuruStationUID + windGuruStationPassword);
  request += '&hash=' + hash;
  request += '&interval=60';
  if (conditions.temp != null) request += '&temperature=' + conditions.temp.c;
  if (conditions.windSpeed != null) request += '&wind_avg=' + conditions.windSpeed.knots;
  if (conditions.windGust != null) request += '&wind_max=' + conditions.windGust.knots;
  if (conditions.winddir != null) request += '&wind_direction=' + conditions.winddir;
  if (conditions.pressure != null) request += '&mslp=' + conditions.pressure.hPa;
  if (conditions.humidity != null) request += '&rh=' + conditions.humidity;
  if (conditions.precipLastHour != null) request += '&precip=' + conditions.precipLastHour.mm;
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  return response;
  
}

// Apps Script has no ability to open a TCP socket directly,
// so we're using https://cwop.rest/ as an intermediary
function updateCWOP_() {
  
  let conditions = JSON.parse(CacheService.getScriptCache().get('conditions'));

  if (conditions.temp == null || conditions.windSpeed == null || conditions.windGust == null || conditions.winddir == null) {
    throw 'CWOP requires temp, wind direction, wind speed, and wind gust. Please ensure your station has those sensors. For more information, visit: http://wxqa.com/faq.html';
  };

  if (CacheService.getScriptCache().get('lastCwopTime') === conditions.time) {
    console.error('Already sent packet for this time: ' + conditions.time);
    return;
  };
  
  let request = 'https://send.cwop.rest/';
  request += '?id=' + cwopStationIDOrHamCallsign;
  if (cwopValidationCode) request += '&validation=' + cwopValidationCode;
  request += '&lat=' + conditions.latitude;
  request += '&long=' + conditions.longitude;
  request += '&time=' + conditions.time;
  request += '&tempf=' + conditions.temp.f;
  request += '&windspeedmph=' + conditions.windSpeed.mph;
  request += '&windgustmph=' + conditions.windGust.mph;
  request += '&winddir=' + conditions.winddir;
  if (conditions.pressure != null) request += '&baromin=' + conditions.pressure.hPa;
  if (conditions.humidity != null) request += '&humidity=' + conditions.humidity;
  if (conditions.solarRadiation != null) request += '&solarradiation=' + conditions.solarRadiation;
  if (conditions.precipRate != null) request += '&rainin=' + conditions.precipRate.in;
  if (conditions.precipSinceMidnight != null) request += '&dailyrainin=' + conditions.precipSinceMidnight.in;
  if (conditions.precipLast24Hours != null) request += '&last24hrrainin=' + conditions.precipLast24Hours.in;
  request += '&software=appsscriptforwarder' + version;

  console.log(request);
  
  let response = UrlFetchApp.fetch(request).getContentText();
  
  console.log(response);
  
  CacheService.getScriptCache().put('lastCwopTime', conditions.time, 21600); // 6 hours
  
  return response;
  
}

function getCalculatedHourlyPrecipAccum_(currentPrecipRate) {

  const ONE_HOUR_MS = 3600000; // 1 hour in milliseconds
  
  let precipHistory = JSON.parse(CacheService.getScriptCache().get('hourlyPrecipHistory') || '[]');
  const currentTime = new Date().getTime();
  
  // add the new reading and remove old entries
  precipHistory.push({ "rate": currentPrecipRate, "timestamp": currentTime });
  precipHistory = precipHistory.filter(entry => entry.timestamp >= currentTime - ONE_HOUR_MS);
  
  // save the updated history back to cache
  CacheService.getScriptCache().put('hourlyPrecipHistory', JSON.stringify(precipHistory), 21600); // 6 hours cache
  
  // calculate the accumulation if we have sufficient data
  if (precipHistory.length > 1 && currentTime - precipHistory[0].timestamp >= ONE_HOUR_MS * 0.95) { // are there two or more readings spanning almost an hour?
    const totalPrecip = precipHistory.reduce((acc, entry, index, array) => {
      if (index === 0) return acc; // skip the first entry
      const prevEntry = array[index - 1];
      const timeFraction = (entry.timestamp - prevEntry.timestamp) / ONE_HOUR_MS; // how much of one hour does the last entry to this entry represent
      return acc + prevEntry.rate * timeFraction; // add that much of the rain rate during that fraction of the hour to the total
    }, 0);
    
    return totalPrecip;
  }
  
  return null; // not enough data spanning an hour yet

}

// https://gist.github.com/rcknr/ad7d4623b0a2d90415323f96e634cdee
function md5_(input) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input)
    .reduce((output, byte) => output + (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0'), '');
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
  if (version.charAt(0) === 'v') version = version.substring(1);
  latestRelease.tag_name.trim().charAt(0).toLowerCase() === 'v' ? latestRelease = latestRelease.tag_name.substring(1) : latestRelease = latestRelease.tag_name;
  switch (compareSemver_(version, latestRelease)) {
    case 0:
      // console.info('Script is up-to-date');
      break;
    case -1:
      console.warn('New version of this script is available! Download at https://github.com/leoherzog/WundergroundStationForwarder/releases');
      break;
    case 1:
      console.error('Local script version (' + version + ') is newer than current release on Github?');
      break;
  };
}

function fetchJSON_(url, headers) {
  
  if (!headers) {
    headers = {};
  };
  
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
}

Number.prototype.fToC = function() { return (this - 32) * (5 / 9); }
Number.prototype.cToF = function() { return (9 / 5) * this + 32; }
Number.prototype.mphToMPS = function() { return this * 0.44704; }
Number.prototype.mphToKPH = function() { return this * 1.609344; }
Number.prototype.mpsToMPH = function() { return this * 2.23694; }
Number.prototype.mpsToKPH = function() { return this * 3.6; }
Number.prototype.kphToMPS = function() { return this * 0.27778; }
Number.prototype.kphToMPH = function() { return this * 0.62137; }
Number.prototype.mphToKnots = function() { return this * 0.868976; }
Number.prototype.mpsToKnots = function() { return this * 1.943844; }
Number.prototype.kphToKnots = function() { return this * 0.539957; }
Number.prototype.inHgTohPa = function() { return this * 33.86389; }
Number.prototype.hPaToinHg = function() { return this * 0.02953; }
Number.prototype.inTomm = function() { return this * 25.4; }
Number.prototype.mmToIn = function() { return this * 0.03937; }
// https://www.weather.gov/media/epz/wxcalc/windChill.pdf
Number.prototype.windChillF = function(windSpeedMPH) {
  if (this > 50 || windSpeedMPH < 3) return this;
  return 35.74 + 0.6215 * this - 35.75 * Math.pow(windSpeedMPH, 0.16) + 0.4275 * this * Math.pow(windSpeedMPH, 0.16);
}
Number.prototype.windChillC = function(windSpeedKPH) {
  if (this > 10 || windSpeedKPH < 4.8) return this;
  return 13.12 + 0.6215 * this - 11.37 * Math.pow(windSpeedKPH, 0.16) + 0.3965 * this * Math.pow(windSpeedKPH, 0.16);
}
// https://www.weather.gov/media/epz/wxcalc/heatIndex.pdf
Number.prototype.heatIndex = function(humidity, units='F') {
  let T = units === 'F' ? this : this.cToF();
  let H = humidity;
  let heatIndexF = -42.379 + 2.04901523 * T + 10.14333127 * H - 0.22475541 * T * H - 6.83783 * Math.pow(10, -3) * Math.pow(T, 2) - 5.481717 * Math.pow(10, -2) * Math.pow(H, 2) + 1.22874 * Math.pow(10, -3) * Math.pow(T, 2) * H   + 8.5282 * Math.pow(10, -4) * T * Math.pow(H, 2) - 1.99 * Math.pow(10, -6) * Math.pow(T, 2) * Math.pow(H, 2);
  return units === 'F' ? heatIndexF : heatIndexF.fToC();
}
Number.prototype.toFixedNumber = function(digits) { return +this.toFixed(digits); }