/*
 * Station Forwarder
 * Fill in the API Keys (and which other services you'd like to update) below, and "▷ Run" the Schedule function. You're all set!
 * You can see updates in the "☰▶ Executions" section on the left. If you make any changes to the API Keys or enabled services, run Schedule again.
 */


// Getting data

const datasource = 'weatherflow'; // 'ibm' (wunderground), 'acurite' (myacurite), 'davis' (weatherlink), 'weatherflow' (tempestwx), 'ambient' (ambient weather), 'ecowitt', 'aprs' (aprs.fi), or 'custom' (custom webhook in rtl_433 format)

const ibmAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const ibmStationID = 'KXXXXXXXXXX';
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
const ecowittAPIKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const ecowittApplicationKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const ecowittMacAddress = 'XX:XX:XX:XX:XX:XX';
// or
const aprsStationID = 'xxxxxx';
const aprsApiKey = 'xxxxxx.xxxxxxxxxxxxxxxx';
// or
const customStationLat = 'xx.xxxxxx';
const customStationLon = 'xx.xxxxxx';

// Sending data

const updateWunderground = false;
const wundergroundStationID = 'KXXXXXXXXXX';
const wundergroundStationKey = 'xxxxxxxx';
///
const updateWindy = false;
const windyAPIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const windyStationID = '0';
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
const updateWOW = false;
const wowSiteID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const wowAuthKey = 'xxxxxx';
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

let version = 'v2.10.1';

function Schedule() {
  if (updateWunderground && datasource === 'ibm' && ibmStationID === wundergroundStationID) throw 'Error: You are currently set to pull data from Wunderground and also send data to Wunderground. Please disable one or the other to avoid duplicate data.';
  if (updateCWOP && datasource === 'aprs' && aprsStationID === cwopStationIDOrHamCallsign) throw 'Error: You are currently set to pull data from APRS.FI (CWOP) and also send data to CWOP. Please disable one or the other to avoid duplicate data.';
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
    case 'ecowitt':
      refreshFromEcowitt_();
      ScriptApp.newTrigger('refreshFromEcowitt_').timeBased().everyMinutes(1).create();
      break;
    case 'aprs':
      refreshFromAPRSFI_();
      ScriptApp.newTrigger('refreshFromAPRSFI_').timeBased().everyMinutes(1).create();
      break;
    case 'custom':
      console.warn('You have chosen a custom datasource! Please publish this Apps Script project as a web app');
      break;
    default:
      throw 'Invalid datasource';
  }
  if (updateWunderground) ScriptApp.newTrigger('updateWunderground_').timeBased().everyMinutes(1).create();
  if (updateWindy) ScriptApp.newTrigger('updateWindy_').timeBased().everyMinutes(5).create();
  if (updatePWSWeather) ScriptApp.newTrigger('updatePWSWeather_').timeBased().everyMinutes(5).create();
  if (updateWeatherCloud) ScriptApp.newTrigger('updateWeatherCloud_').timeBased().everyMinutes(hasWeatherCloudPro ? 1 : 10).create();
  if (updateOpenWeatherMap) ScriptApp.newTrigger('updateOpenWeatherMap_').timeBased().everyMinutes(1).create();
  if (updateWindGuru) ScriptApp.newTrigger('updateWindGuru_').timeBased().everyMinutes(1).create();
  if (updateWOW) ScriptApp.newTrigger('updateWOW_').timeBased().everyMinutes(5).create();
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

  let ibmConditions = fetchJSON_('https://api.weather.com/v2/pws/observations/current?stationId=' + ibmStationID + '&format=json&units=e&numericPrecision=decimal&apiKey=' + ibmAPIKey);
  if (!ibmConditions) return false; // still no luck? give up

  // console.log(JSON.stringify(ibmConditions));

  ibmConditions = ibmConditions['observations'][0];

  let conditions = {};
  conditions.time = new Date(ibmConditions.obsTimeUtc).getTime();
  conditions.latitude = ibmConditions.lat.toString();
  conditions.longitude = ibmConditions.lon.toString();
  if (ibmConditions.imperial.temp != null) conditions.temp = {
    "f": convert.toFixed(ibmConditions.imperial.temp, 2),
    "c": convert.toFixed(convert.fToC(ibmConditions.imperial.temp), 2)
  };
  if (ibmConditions.imperial.dewpt != null) conditions.dewpoint = {
    "f": convert.toFixed(ibmConditions.imperial.dewpt, 2),
    "c": convert.toFixed(convert.fToC(ibmConditions.imperial.dewpt), 2)
  };
  if (ibmConditions.imperial.windSpeed != null) conditions.windSpeed = {
    "mph": convert.toFixed(ibmConditions.imperial.windSpeed, 2),
    "mps": convert.toFixed(convert.mphToMPS(ibmConditions.imperial.windSpeed), 2),
    "kph": convert.toFixed(convert.mphToKPH(ibmConditions.imperial.windSpeed), 2),
    "knots": convert.toFixed(convert.mphToKnots(ibmConditions.imperial.windSpeed), 2)
  };
  if (ibmConditions.imperial.windGust != null) conditions.windGust = {
    "mph": convert.toFixed(ibmConditions.imperial.windGust, 2),
    "mps": convert.toFixed(convert.mphToMPS(ibmConditions.imperial.windGust), 2),
    "kph": convert.toFixed(convert.mphToKPH(ibmConditions.imperial.windGust), 2),
    "knots": convert.toFixed(convert.mphToKnots(ibmConditions.imperial.windGust), 2)
  };
  if (ibmConditions.winddir != null) conditions.winddir = ibmConditions.winddir;
  if (ibmConditions.imperial.windChill != null) conditions.windChill = {
    "f": convert.toFixed(ibmConditions.imperial.windChill, 2),
    "c": convert.toFixed(convert.fToC(ibmConditions.imperial.windChill), 2)
  };
  if (ibmConditions.imperial.heatIndex != null) conditions.heatIndex = {
    "f": convert.toFixed(ibmConditions.imperial.heatIndex, 2),
    "c": convert.toFixed(convert.fToC(ibmConditions.imperial.heatIndex), 2)
  };
  if (ibmConditions.imperial.pressure != null) conditions.pressure = {
    "inHg": convert.toFixed(ibmConditions.imperial.pressure, 3),
    "hPa": convert.toFixed(convert.inHgTohPa(ibmConditions.imperial.pressure), 1)
  };
  if (ibmConditions.humidity != null) conditions.humidity = convert.toFixed(ibmConditions.humidity, 0);
  if (ibmConditions.uv != null) conditions.uv = ibmConditions.uv;
  if (ibmConditions.solarRadiation != null) conditions.solarRadiation = ibmConditions.solarRadiation;
  if (ibmConditions.imperial.precipRate != null) conditions.precipRate = {
    "in": convert.toFixed(ibmConditions.imperial.precipRate, 3),
    "mm": convert.toFixed(convert.inTomm(ibmConditions.imperial.precipRate), 2)
  };
  if (ibmConditions.imperial.precipTotal != null) conditions.precipSinceMidnight = {
    "in": convert.toFixed(ibmConditions.imperial.precipTotal, 3),
    "mm": convert.toFixed(convert.inTomm(ibmConditions.imperial.precipTotal), 2)
  };

  let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
  if (calculatedHourlyPrecipAccum != null) conditions.precipLastHour = {
    "in": convert.toFixed(calculatedHourlyPrecipAccum, 3),
    "mm": convert.toFixed(convert.inTomm(calculatedHourlyPrecipAccum), 2)
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
    "f": temp.chart_unit === 'F' ? convert.toFixed(temp.last_reading_value, 2) : convert.toFixed(convert.cToF(temp.last_reading_value), 2),
    "c": temp.chart_unit === 'C' ? convert.toFixed(temp.last_reading_value, 2) : convert.toFixed(convert.fToC(temp.last_reading_value), 2)
  };
  let dewpoint = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Dew Point');
  if (dewpoint != null) conditions.dewpoint = {
    "f": dewpoint.chart_unit === 'F' ? convert.toFixed(dewpoint.last_reading_value, 2) : convert.toFixed(convert.cToF(dewpoint.last_reading_value), 2),
    "c": dewpoint.chart_unit === 'C' ? convert.toFixed(dewpoint.last_reading_value, 2) : convert.toFixed(convert.fToC(dewpoint.last_reading_value), 2)
  };
  let windspeed = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'WindSpeedAvg');
  if (windspeed != null) conditions.windSpeed = {
    "mph": windspeed.chart_unit === 'mph' ? convert.toFixed(windspeed.last_reading_value, 2) : convert.toFixed(convert.kphToMPH(windspeed.last_reading_value), 2),
    "mps": windspeed.chart_unit === 'mph' ? convert.toFixed(convert.mphToMPS(windspeed.last_reading_value), 2) : convert.toFixed(convert.kphToMPS(windspeed.last_reading_value), 2),
    "kph": windspeed.chart_unit === 'mph' ? convert.toFixed(convert.mphToKPH(windspeed.last_reading_value), 2) : convert.toFixed(windspeed.last_reading_value, 2),
    "knots": windspeed.chart_unit === 'mph' ? convert.toFixed(convert.mphToKnots(windspeed.last_reading_value), 2) : convert.toFixed(convert.kphToKnots(windspeed.last_reading_value), 2)
  };
  let windgust = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Wind Speed');
  if (windgust != null) conditions.windGust = {
    "mph": windgust.chart_unit === 'mph' ? convert.toFixed(windgust.last_reading_value, 2) : convert.toFixed(convert.kphToMPH(windgust.last_reading_value), 2),
    "mps": windgust.chart_unit === 'mph' ? convert.toFixed(convert.mphToMPS(windgust.last_reading_value), 2) : convert.toFixed(convert.kphToMPS(windgust.last_reading_value), 2),
    "kph": windgust.chart_unit === 'mph' ? convert.toFixed(convert.mphToKPH(windgust.last_reading_value), 2) : convert.toFixed(windgust.last_reading_value, 2),
    "knots": windgust.chart_unit === 'mph' ? convert.toFixed(convert.mphToKnots(windgust.last_reading_value), 2) : convert.toFixed(convert.kphToKnots(windgust.last_reading_value), 2)
  };
  let winddir = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Wind Direction');
  if (winddir != null) conditions.winddir = Number(winddir.last_reading_value);
  let pressure = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Barometric Pressure');
  if (pressure != null) conditions.pressure = {
    "inHg": pressure.chart_unit === 'inHg' ? convert.toFixed(pressure.last_reading_value, 3) : convert.toFixed(convert.hPaToinHg(pressure.last_reading_value), 3),
    "hPa": pressure.chart_unit === 'hPa' ? convert.toFixed(pressure.last_reading_value, 1) : convert.toFixed(convert.inHgTohPa(pressure.last_reading_value), 1)
  };
  let humidity = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Humidity');
  if (humidity != null) conditions.humidity = convert.toFixed(humidity.last_reading_value, 0);
  if (temp != null && windspeed != null) conditions.windChill = {
    "f": convert.toFixed(convert.windChill(conditions.temp.f, conditions.windSpeed.mph, 'F'), 2),
    "c": convert.toFixed(convert.windChill(conditions.temp.c, conditions.windSpeed.kph, 'C'), 2)
  };
  if (temp != null && humidity != null) conditions.heatIndex = {
    "f": convert.toFixed(convert.heatIndex(conditions.temp.f, conditions.humidity, 'F'), 2),
    "c": convert.toFixed(convert.heatIndex(conditions.temp.c, conditions.humidity, 'C'), 2)
  };
  let uv = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'UVIndex');
  if (uv != null) conditions.uv = uv.last_reading_value;
  let lightIntensity = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'LightIntensity');
  if (lightIntensity != null) conditions.solarRadiation = convert.toFixed(convert.luxToWm2(lightIntensity.last_reading_value), 1);

  let rain = acuriteConditions.sensors.find(sensor => sensor.sensor_code === 'Rainfall');
  if (rain != null) {

    // current accumulation since midnight is provided by the api
    conditions.precipSinceMidnight = {
      "in": rain.chart_unit === 'in' ? convert.toFixed(rain.last_reading_value, 3) : convert.toFixed(convert.mmToIn(rain.last_reading_value), 3),
      "mm": rain.chart_unit === 'mm' ? convert.toFixed(rain.last_reading_value, 2) : convert.toFixed(convert.inTomm(rain.last_reading_value), 2)
    };

    // but the rate is not
    conditions.precipRate = {
      "in": 0,
      "mm": 0
    };

    // calculate rate from most recent accumulation difference
    let lastRainReading = CacheService.getScriptCache().get('lastAcuriteRainReading');
    let lastRainTime = CacheService.getScriptCache().get('lastAcuriteRainTime');

    if (lastRainReading && lastRainTime) {
      let timeDiff = (conditions.time - Number(lastRainTime)) / (60 * 60 * 1000); // Convert to hours
      let accumDiff = conditions.precipSinceMidnight.in - Number(lastRainReading);

      if (timeDiff > 0 && timeDiff < 0.1 && accumDiff >= 0) { // maximum six minutes since last check and accumulation has increased
        conditions.precipRate = {
          "in": convert.toFixed(accumDiff / timeDiff, 3),
          "mm": convert.toFixed(convert.inTomm(accumDiff / timeDiff), 2)
        };
      }
    }

    // cache current reading for next rate calculation
    CacheService.getScriptCache().put('lastAcuriteRainReading', conditions.precipSinceMidnight.in.toString(), 21600);
    CacheService.getScriptCache().put('lastAcuriteRainTime', conditions.time.toString(), 21600);

    // calculate rolling hourly precipitation accumulation
    let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
    if (calculatedHourlyPrecipAccum != null) conditions.precipLastHour = {
      "in": convert.toFixed(calculatedHourlyPrecipAccum, 3),
      "mm": convert.toFixed(convert.inTomm(calculatedHourlyPrecipAccum), 2)
    };

  }

  console.log(JSON.stringify(conditions));

  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);

  return JSON.stringify(conditions);

}

// https://weatherlink.github.io/v2-api/sensor-catalog
function getDavisSensors_(forceRefresh = false) {

  let cached = CacheService.getScriptCache().get('davisSensorCatalog');
  if (cached && !forceRefresh) {
    let compressedBytes = Utilities.base64Decode(cached);
    let compressedBlob = Utilities.newBlob(compressedBytes, 'application/x-gzip');
    let decompressedBlob = Utilities.ungzip(compressedBlob);
    return JSON.parse(decompressedBlob.getDataAsString());
  }

  const catalog = fetchJSON_('https://api.weatherlink.com/v2/sensor-catalog?api-key=' + davisApiKey, {"X-Api-Secret": davisApiSecret});
  if (!catalog || !catalog.sensor_types) throw new Error('Sensor catalog fetch failed');

  const map = {};
  catalog.sensor_types.forEach(st => {
    const {sensor_type: stNum, category} = st;

    // each sensor either has data_structures[] OR a single data_structure
    const structures = st.data_structures ??
                       [{data_structure_type: null, data_structure: st.data_structure}];

    structures.forEach(ds => {
      const dsType  = ds?.data_structure_type ?? null;
      const fields  = ds?.data_structure;

      if (!fields) {   // guard against null / undefined
        console.warn(`sensor_type ${stNum} dsType ${dsType} has no data_structure`);
        return;
      }

      Object.entries(fields).forEach(([field, meta]) => {
        if (!map[field]) {
          map[field] = {
            units: meta.units,
            type : meta.type,
            sensorTypes: [stNum],
            dataStructureTypes: dsType ? [dsType] : [],
            categories: [category]
          };
        } else {
          const m = map[field];
          if (!m.sensorTypes.includes(stNum)) m.sensorTypes.push(stNum);
          if (dsType && !m.dataStructureTypes.includes(dsType)) m.dataStructureTypes.push(dsType);
          if (category && !m.categories.includes(category)) m.categories.push(category);
        }
      });
    });
  });

  let blob = Utilities.newBlob(JSON.stringify(map));
  let compressedBlob = Utilities.gzip(blob);
  let compressed = Utilities.base64Encode(compressedBlob.getBytes());

  CacheService.getScriptCache().put('davisSensorCatalog', compressed, 21600);

  return map;

}

// https://weatherlink.github.io/v2-api/api-reference
function refreshFromDavis_() {

  let davisStationInfo = fetchJSON_('https://api.weatherlink.com/v2/stations/?api-key=' + davisApiKey, {"x-api-secret": davisApiSecret});
  if (!davisStationInfo) return false; // still no luck? give up

  let station = davisStationInfo.stations.find(station => station.station_name === davisStationName);
  if (!station) {
    console.error('Station "' + davisStationName + '" not found');
    return false;
  }

  // console.log(JSON.stringify(station));

  let stationId = station.station_id;

  let davisConditions = fetchJSON_('https://api.weatherlink.com/v2/current/' + stationId + '?api-key=' + davisApiKey, {"x-api-secret": davisApiSecret});
  if (!davisConditions) return false; // still no luck? give up

  console.log(JSON.stringify(davisConditions));

  const sensorCatalog = getDavisSensors_();

  function aliasFor(root) {
    return Object.keys(sensorCatalog).filter(k => k === root || k.startsWith(root + '_'));
  }

  function findValue(fieldNames) {
    const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
    for (const sensor of davisConditions.sensors || []) {
      if (!sensor.data) continue;
      for (const dataPoint of sensor.data) {
        for (const name of names) {
          if (dataPoint[name] != null) {
            return dataPoint[name];
          }
        }
      }
    }
    return null;
  }

  let conditions = {};
  conditions.time = (findValue('ts') || Math.round(new Date().getTime() / 1000)) * 1000;
  conditions.latitude = station.latitude.toString();
  conditions.longitude = station.longitude.toString();

  let temp = findValue(aliasFor('temp_out')) || findValue('temp');
  if (temp != null) {
    conditions.temp = {
      "f": convert.toFixed(temp, 2),
      "c": convert.toFixed(convert.fToC(temp), 2)
    };
  }

  let dewpoint = findValue('dew_point');
  if (dewpoint != null) {
    conditions.dewpoint = {
      "f": convert.toFixed(dewpoint, 2),
      "c": convert.toFixed(convert.fToC(dewpoint), 2)
    };
  }

  let windspeed = findValue(aliasFor('wind_speed'));
  if (windspeed != null) {
    conditions.windSpeed = {
      "mph": convert.toFixed(windspeed, 2),
      "mps": convert.toFixed(convert.mphToMPS(windspeed), 2),
      "kph": convert.toFixed(convert.mphToKPH(windspeed), 2),
      "knots": convert.toFixed(convert.mphToKnots(windspeed), 2)
    };
  }

  let windgust = findValue('wind_gust_10_min') || findValue('wind_gust') || findValue('wind_speed_hi');
  if (windgust != null) {
    conditions.windGust = {
      "mph": convert.toFixed(windgust, 2),
      "mps": convert.toFixed(convert.mphToMPS(windgust), 2),
      "kph": convert.toFixed(convert.mphToKPH(windgust), 2),
      "knots": convert.toFixed(convert.mphToKnots(windgust), 2)
    };
  }

  let winddir = findValue('wind_dir') || findValue('wind_dir_last');
  if (winddir != null) {
    conditions.winddir = Number(winddir);
  }

  let pressure = findValue('bar_sea_level') || findValue('bar_absolute') || findValue(aliasFor('bar'));
  if (pressure != null) {
    conditions.pressure = {
      "inHg": convert.toFixed(pressure, 3),
      "hPa": convert.toFixed(convert.inHgTohPa(pressure), 1)
    };
  }

  let humidity = findValue('hum_out') || findValue('hum');
  if (humidity != null) {
    conditions.humidity = convert.toFixed(humidity, 0);
  }

  let windchill = findValue('wind_chill');
  if (windchill != null) {
    conditions.windChill = {
      "f": convert.toFixed(windchill, 2),
      "c": convert.toFixed(convert.fToC(windchill), 2)
    };
  } else if (conditions.temp != null && conditions.windSpeed != null) {
    conditions.windChill = {
      "f": convert.toFixed(convert.windChill(conditions.temp.f, conditions.windSpeed.mph, 'F'), 2),
      "c": convert.toFixed(convert.windChill(conditions.temp.c, conditions.windSpeed.kph, 'C'), 2)
    };
  }

  let heatindex = findValue('heat_index');
  if (heatindex != null) {
    conditions.heatIndex = {
      "f": convert.toFixed(heatindex, 2),
      "c": convert.toFixed(convert.fToC(heatindex), 2)
    };
  } else if (conditions.temp != null && conditions.humidity != null) {
    conditions.heatIndex = {
      "f": convert.toFixed(convert.heatIndex(conditions.temp.f, conditions.humidity, 'F'), 2),
      "c": convert.toFixed(convert.heatIndex(conditions.temp.c, conditions.humidity, 'C'), 2)
    };
  }

  let uv = findValue('uv') || findValue('uv_index');
  if (uv != null) conditions.uv = uv;

  let solarradiation = findValue('solar_rad') || findValue('solar_radiation');
  if (solarradiation != null) conditions.solarRadiation = solarradiation;

  let rateIn = findValue('rain_rate_in') || findValue('rain_storm_in');
  let rateMm = findValue('rain_rate_mm') || findValue('rain_storm_mm');
  if (rateIn != null && rateMm != null) {
    conditions.precipRate = {
      "in": convert.toFixed(rateIn, 3),
      "mm": convert.toFixed(rateMm, 2)
    };
  }

  let dailyIn = findValue('rainfall_daily_in') || findValue('rain_day_in');
  let dailyMm = findValue('rainfall_daily_mm') || findValue('rain_day_mm');
  if (dailyIn != null && dailyMm != null) {
    conditions.precipSinceMidnight = {
      "in": convert.toFixed(dailyIn, 3),
      "mm": convert.toFixed(dailyMm, 2)
    };
  }

  let last24In = findValue('rainfall_last_24_hr_in');
  let last24Mm = findValue('rainfall_last_24_hr_mm');
  if (last24In != null && last24Mm != null) {
    conditions.precipLast24Hours = {
      "in": convert.toFixed(last24In, 3),
      "mm": convert.toFixed(last24Mm, 2)
    };
  }

  let hourIn = findValue('rainfall_last_60_min_in');
  let hourMm = findValue('rainfall_last_60_min_mm');
  if (hourIn != null && hourMm != null) {
    conditions.precipLastHour = {
      "in": convert.toFixed(hourIn, 3),
      "mm": convert.toFixed(hourMm, 2)
    };
  }
  if (rateIn != null && conditions.precipRate.in) { // Davis may not provide rate, so calculate it from the last hour accumulation
    let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(Number(conditions.precipRate.in));
    if (calculatedHourlyPrecipAccum != null) conditions.precipLastHour = {
      "in": convert.toFixed(calculatedHourlyPrecipAccum, 3),
      "mm": convert.toFixed(convert.inTomm(calculatedHourlyPrecipAccum), 2)
    };
  }

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
    "f": convert.toFixed(convert.cToF(weatherflowConditions.obs[0].air_temperature), 2),
    "c": convert.toFixed(weatherflowConditions.obs[0].air_temperature, 2)
  };
  if (weatherflowConditions.obs[0].dew_point != null) conditions.dewpoint = {
    "f": convert.toFixed(convert.cToF(weatherflowConditions.obs[0].dew_point), 2),
    "c": convert.toFixed(weatherflowConditions.obs[0].dew_point, 2)
  };
  if (weatherflowConditions.obs[0].wind_avg != null) conditions.windSpeed = {
    "mph": convert.toFixed(convert.mpsToMPH(weatherflowConditions.obs[0].wind_avg), 2),
    "mps": convert.toFixed(weatherflowConditions.obs[0].wind_avg, 2),
    "kph": convert.toFixed(convert.mpsToKPH(weatherflowConditions.obs[0].wind_avg), 2),
    "knots": convert.toFixed(convert.mpsToKnots(weatherflowConditions.obs[0].wind_avg), 2)
  };
  if (weatherflowConditions.obs[0].wind_gust != null) conditions.windGust = {
    "mph": convert.toFixed(convert.mpsToMPH(weatherflowConditions.obs[0].wind_gust), 2),
    "mps": convert.toFixed(weatherflowConditions.obs[0].wind_gust, 2),
    "kph": convert.toFixed(convert.mpsToKPH(weatherflowConditions.obs[0].wind_gust), 2),
    "knots": convert.toFixed(convert.mpsToKnots(weatherflowConditions.obs[0].wind_gust), 2)
  };
  if (weatherflowConditions.obs[0].wind_direction != null) conditions.winddir = weatherflowConditions.obs[0].wind_direction;
  if (weatherflowConditions.obs[0].sea_level_pressure != null) conditions.pressure = {
    "inHg": convert.toFixed(convert.hPaToinHg(weatherflowConditions.obs[0].sea_level_pressure), 3),
    "hPa": convert.toFixed(weatherflowConditions.obs[0].sea_level_pressure, 1)
  };
  if (weatherflowConditions.obs[0].relative_humidity != null) conditions.humidity = convert.toFixed(weatherflowConditions.obs[0].relative_humidity, 0);
  if (weatherflowConditions.obs[0].wind_chill != null) {
    conditions.windChill = {
      "f": convert.toFixed(convert.cToF(weatherflowConditions.obs[0].wind_chill), 2),
      "c": convert.toFixed(weatherflowConditions.obs[0].wind_chill, 2)
    };
  } else if (conditions.temp != null && conditions.windSpeed != null) {
    conditions.windChill = {
      "f": convert.toFixed(convert.windChill(conditions.temp.f, conditions.windSpeed.mph, 'F'), 2),
      "c": convert.toFixed(convert.windChill(conditions.temp.c, conditions.windSpeed.kph, 'C'), 2)
    };
  };
  if (weatherflowConditions.obs[0].heat_index != null) {
    conditions.heatIndex = {
      "f": convert.toFixed(convert.cToF(weatherflowConditions.obs[0].heat_index), 2),
      "c": convert.toFixed(weatherflowConditions.obs[0].heat_index, 2)
    };
  } else if (conditions.temp != null && conditions.humidity != null) {
    conditions.heatIndex = {
      "f": convert.toFixed(convert.heatIndex(conditions.temp.f, conditions.humidity, 'F'), 2),
      "c": convert.toFixed(convert.heatIndex(conditions.temp.c, conditions.humidity, 'C'), 2)
    };
  };
  if (weatherflowConditions.obs[0].uv != null) conditions.uv = weatherflowConditions.obs[0].uv;
  if (weatherflowConditions.obs[0].solar_radiation != null) conditions.solarRadiation = weatherflowConditions.obs[0].solar_radiation;
  if (weatherflowConditions.obs[0].precip != null) conditions.precipRate = {
    "in": convert.toFixed(convert.mmToIn(weatherflowConditions.obs[0].precip * 60), 3),
    "mm": convert.toFixed(weatherflowConditions.obs[0].precip * 60, 2)
  };
  if (weatherflowConditions.obs[0].precip_accum_local_day != null) conditions.precipSinceMidnight = {
    "in": convert.toFixed(convert.mmToIn(weatherflowConditions.obs[0].precip_accum_local_day), 3),
    "mm": convert.toFixed(weatherflowConditions.obs[0].precip_accum_local_day, 2)
  };
  if (weatherflowConditions.obs[0].precip_accum_last_1hr != null) conditions.precipLastHour = {
    "in": convert.toFixed(convert.mmToIn(weatherflowConditions.obs[0].precip_accum_last_1hr), 3),
    "mm": convert.toFixed(weatherflowConditions.obs[0].precip_accum_last_1hr, 2)
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
    "f": convert.toFixed(station.lastData.tempf, 2),
    "c": convert.toFixed(convert.fToC(station.lastData.tempf), 2)
  };
  if (station.lastData.dewPoint != null) conditions.dewpoint = {
    "f": convert.toFixed(station.lastData.dewPoint, 2),
    "c": convert.toFixed(convert.fToC(station.lastData.dewPoint), 2)
  };
  if (station.lastData.windspeedmph != null) conditions.windSpeed = {
    "mph": convert.toFixed(station.lastData.windspeedmph, 2),
    "mps": convert.toFixed(convert.mphToMPS(station.lastData.windspeedmph), 2),
    "kph": convert.toFixed(convert.mphToKPH(station.lastData.windspeedmph), 2),
    "knots": convert.toFixed(convert.mphToKnots(station.lastData.windspeedmph), 2)
  };
  if (station.lastData.windgustmph != null) conditions.windGust = {
    "mph": convert.toFixed(station.lastData.windgustmph, 2),
    "mps": convert.toFixed(convert.mphToMPS(station.lastData.windgustmph), 2),
    "kph": convert.toFixed(convert.mphToKPH(station.lastData.windgustmph), 2),
    "knots": convert.toFixed(convert.mphToKnots(station.lastData.windgustmph), 2)
  };
  if (station.lastData.winddir != null) conditions.winddir = station.lastData.winddir;
  if (station.lastData.baromabsin != null) conditions.pressure = {
    "inHg": convert.toFixed(station.lastData.baromabsin, 3),
    "hPa": convert.toFixed(convert.inHgTohPa(station.lastData.baromabsin), 0)
  };
  if (station.lastData.humidity != null) conditions.humidity = convert.toFixed(station.lastData.humidity, 0);
  if (conditions.temp != null && conditions.windSpeed != null) conditions.windChill = {
    "f": convert.toFixed(convert.windChill(conditions.temp.f, conditions.windSpeed.mph, 'F'), 2),
    "c": convert.toFixed(convert.windChill(conditions.temp.c, conditions.windSpeed.kph, 'C'), 2)
  };
  if (conditions.temp != null && conditions.humidity != null) conditions.heatIndex = {
    "f": convert.toFixed(convert.heatIndex(conditions.temp.f, conditions.humidity, 'F'), 2),
    "c": convert.toFixed(convert.heatIndex(conditions.temp.c, conditions.humidity, 'C'), 2)
  };
  if (station.lastData.uv != null) conditions.uv = station.lastData.uv;
  if (station.lastData.solarradiation != null) conditions.solarRadiation = station.lastData.solarradiation;
  // Note: Ambient Weather documentation states hourlyrainin is "Hourly Rain Rate, in/hr" (a rate),
  // but the field name suggests it might be accumulated rain. Currently treating as rate per docs.
  // If precipitation values seem incorrect, this interpretation may need to be revisited.
  if (station.lastData.hourlyrainin != null) conditions.precipRate = {
    "in": convert.toFixed(station.lastData.hourlyrainin, 3),
    "mm": convert.toFixed(convert.inTomm(station.lastData.hourlyrainin), 2)
  };
  if (station.lastData.dailyrainin != null) conditions.precipSinceMidnight = {
    "in": convert.toFixed(station.lastData.dailyrainin, 3),
    "mm": convert.toFixed(convert.inTomm(station.lastData.dailyrainin), 2)
  };
  if (station.lastData['24hourrainin'] != null) conditions.precipLast24Hours = {
    "in": convert.toFixed(station.lastData['24hourrainin'], 3),
    "mm": convert.toFixed(convert.inTomm(station.lastData['24hourrainin']), 2)
  };

  let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
  if (calculatedHourlyPrecipAccum != null) conditions.precipLastHour = {
    "in": convert.toFixed(calculatedHourlyPrecipAccum, 3),
    "mm": convert.toFixed(convert.inTomm(calculatedHourlyPrecipAccum), 2)
  };

  console.log(JSON.stringify(conditions));

  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);

  return JSON.stringify(conditions);

}

// doc.ecowitt.net
function refreshFromEcowitt_() {

  let ecowittConditions = fetchJSON_('https://api.ecowitt.net/api/v3/device/info?application_key=' + ecowittApplicationKey + '&api_key=' + ecowittAPIKey + '&mac=' + ecowittMacAddress + '&call_back=all&temp_unitid=2&pressure_unitid=4&wind_speed_unitid=9&rainfall_unitid=13&solar_irradiance_unitid=16');
  if (!ecowittConditions || ecowittConditions.code !== 0) return false; // still no luck? give up
  // console.log(JSON.stringify(ecowittConditions));

  let conditions = {};
  conditions.time = new Date(Number(ecowittConditions.time) * 1000).getTime();
  conditions.latitude = ecowittConditions.data.latitude.toString();
  conditions.longitude = ecowittConditions.data.longitude.toString();

  if (ecowittConditions.data?.last_update?.outdoor) {
    if (ecowittConditions.data?.last_update?.outdoor?.temperature?.value) {
      conditions.temp = {
        "f": convert.toFixed(ecowittConditions.data.last_update.outdoor.temperature.value, 2),
        "c": convert.toFixed(convert.fToC(ecowittConditions.data.last_update.outdoor.temperature.value), 2)
      };
    }
    if (ecowittConditions.data?.last_update?.outdoor?.dew_point?.value) {
      conditions.dewpoint = {
        "f": convert.toFixed(ecowittConditions.data.last_update.outdoor.dew_point.value, 2),
        "c": convert.toFixed(convert.fToC(ecowittConditions.data.last_update.outdoor.dew_point.value), 2)
      };
    }
    if (ecowittConditions.data?.last_update?.outdoor?.humidity?.value) {
      conditions.humidity = convert.toFixed(ecowittConditions.data.last_update.outdoor.humidity.value, 0);
    }
  }
  if (ecowittConditions.data?.last_update?.wind) {
    if (ecowittConditions.data?.last_update?.wind?.wind_speed?.value) {
      conditions.windSpeed = {
        "mph": convert.toFixed(ecowittConditions.data.last_update.wind.wind_speed.value, 2),
        "mps": convert.toFixed(convert.mphToMPS(ecowittConditions.data.last_update.wind.wind_speed.value), 2),
        "kph": convert.toFixed(convert.mphToKPH(ecowittConditions.data.last_update.wind.wind_speed.value), 2),
        "knots": convert.toFixed(convert.mphToKnots(ecowittConditions.data.last_update.wind.wind_speed.value), 2)
      };
    }
    if (ecowittConditions.data?.last_update?.wind?.wind_gust?.value) {
      conditions.windGust = {
        "mph": convert.toFixed(ecowittConditions.data.last_update.wind.wind_gust.value, 2),
        "mps": convert.toFixed(convert.mphToMPS(ecowittConditions.data.last_update.wind.wind_gust.value), 2),
        "kph": convert.toFixed(convert.mphToKPH(ecowittConditions.data.last_update.wind.wind_gust.value), 2),
        "knots": convert.toFixed(convert.mphToKnots(ecowittConditions.data.last_update.wind.wind_gust.value), 2)
      };
    }
    if (ecowittConditions.data?.last_update?.wind?.wind_direction?.value) {
      conditions.winddir = Number(ecowittConditions.data.last_update.wind.wind_direction.value);
    }
  }
  if (ecowittConditions.data?.last_update?.pressure?.relative) {
    conditions.pressure = {
      "inHg": convert.toFixed(ecowittConditions.data.last_update.pressure.relative.value, 3),
      "hPa": convert.toFixed(convert.inHgTohPa(ecowittConditions.data.last_update.pressure.relative.value), 1)
    };
  }
  if (ecowittConditions.data?.last_update?.solar_and_uvi) {
    if (ecowittConditions.data?.last_update?.solar_and_uvi?.solar?.value) {
      conditions.solarRadiation = Number(ecowittConditions.data.last_update.solar_and_uvi.solar.value);
    }
    if (ecowittConditions.data?.last_update?.solar_and_uvi?.uvi?.value) {
      conditions.uv = Number(ecowittConditions.data.last_update.solar_and_uvi.uvi.value);
    }
  }
  if (ecowittConditions.data?.last_update?.rainfall?.rain_rate?.value) {
    conditions.precipRate = {
      "in": convert.toFixed(ecowittConditions.data.last_update.rainfall.rain_rate.value, 3),
      "mm": convert.toFixed(convert.inTomm(ecowittConditions.data.last_update.rainfall.rain_rate.value), 2)
    };
  }
  if (ecowittConditions.data?.last_update?.rainfall?.daily?.value) {
    conditions.precipSinceMidnight = {
      "in": convert.toFixed(ecowittConditions.data.last_update.rainfall.daily.value, 3),
      "mm": convert.toFixed(convert.inTomm(ecowittConditions.data.last_update.rainfall.daily.value), 2)
    };
  }
  if (ecowittConditions.data?.last_update?.rainfall?.hourly?.value) {
    conditions.precipLastHour = {
      "in": convert.toFixed(ecowittConditions.data.last_update.rainfall.hourly.value, 3),
      "mm": convert.toFixed(convert.inTomm(ecowittConditions.data.last_update.rainfall.hourly.value), 2)
    };
  }
  // if Ecowitt doesn't provide hourly accumulation but does provide rate, calculate it
  if (!conditions.precipLastHour && conditions.precipRate) {
    let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
    if (calculatedHourlyPrecipAccum != null) {
      conditions.precipLastHour = {
        "in": convert.toFixed(calculatedHourlyPrecipAccum, 3),
        "mm": convert.toFixed(convert.inTomm(calculatedHourlyPrecipAccum), 2)
      };
    }
  }
  if (conditions.temp && conditions.windSpeed) {
    conditions.windChill = {
      "f": convert.toFixed(convert.windChill(conditions.temp.f, conditions.windSpeed.mph, 'F'), 2),
      "c": convert.toFixed(convert.windChill(conditions.temp.c, conditions.windSpeed.kph, 'C'), 2)
    };
  }
  if (conditions.temp && conditions.humidity) {
    conditions.heatIndex = {
      "f": convert.toFixed(convert.heatIndex(conditions.temp.f, conditions.humidity, 'F'), 2),
      "c": convert.toFixed(convert.heatIndex(conditions.temp.c, conditions.humidity, 'C'), 2)
    };
  }

  console.log(JSON.stringify(conditions));

  CacheService.getScriptCache().put('conditions', JSON.stringify(conditions), 21600);

  return JSON.stringify(conditions);

}

// https://aprs.fi/page/api
function refreshFromAPRSFI_() {

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
    "f": convert.toFixed(convert.cToF(aprsConditions.temp), 2),
    "c": convert.toFixed(aprsConditions.temp, 2)
  };
  if (aprsConditions.wind_speed != null) conditions.windSpeed = {
    "mph": convert.toFixed(convert.mpsToMPH(aprsConditions.wind_speed), 2),
    "mps": convert.toFixed(aprsConditions.wind_speed, 2),
    "kph": convert.toFixed(convert.mpsToKPH(aprsConditions.wind_speed), 2),
    "knots": convert.toFixed(convert.mpsToKnots(aprsConditions.wind_speed), 2)
  };
  if (aprsConditions.wind_gust != null) conditions.windGust = {
    "mph": convert.toFixed(convert.mpsToMPH(aprsConditions.wind_gust), 2),
    "mps": convert.toFixed(aprsConditions.wind_gust, 2),
    "kph": convert.toFixed(convert.mpsToKPH(aprsConditions.wind_gust), 2),
    "knots": convert.toFixed(convert.mpsToKnots(aprsConditions.wind_gust), 2)
  };
  if (aprsConditions.wind_direction != null) conditions.winddir = aprsConditions.wind_direction;
  if (aprsConditions.pressure != null) conditions.pressure = {
    "inHg": convert.toFixed(convert.hPaToinHg(aprsConditions.pressure), 3),
    "hPa": convert.toFixed(aprsConditions.pressure, 1)
  };
  if (aprsConditions.humidity != null) conditions.humidity = convert.toFixed(aprsConditions.humidity, 0);
  if (conditions.temp != null && conditions.windSpeed != null) conditions.windChill = {
    "f": convert.toFixed(convert.windChill(conditions.temp.f, conditions.windSpeed.mph, 'F'), 2),
    "c": convert.toFixed(convert.windChill(conditions.temp.c, conditions.windSpeed.kph, 'C'), 2)
  };
  if (conditions.temp != null && conditions.humidity != null) conditions.heatIndex = {
    "f": convert.toFixed(convert.heatIndex(conditions.temp.f, conditions.humidity, 'F'), 2),
    "c": convert.toFixed(convert.heatIndex(conditions.temp.c, conditions.humidity, 'C'), 2)
  };
  if (aprsConditions.luminosity != null) conditions.solarRadiation = convert.toFixed(aprsConditions.luminosity, 0);
  // APRS provides rain_1h as accumulated rainfall over the past hour (not a rate)
  if (aprsConditions.rain_1h != null) conditions.precipLastHour = {
    "in": convert.toFixed(convert.mmToIn(aprsConditions.rain_1h), 3),
    "mm": convert.toFixed(aprsConditions.rain_1h, 2)
  };
  if (aprsConditions.rain_mn != null) conditions.precipSinceMidnight = {
    "in": convert.toFixed(convert.mmToIn(aprsConditions.rain_mn), 3),
    "mm": convert.toFixed(aprsConditions.rain_mn, 2)
  };
  if (aprsConditions.rain_24h != null) conditions.precipLast24Hours = {
    "in": convert.toFixed(convert.mmToIn(aprsConditions.rain_24h), 3),
    "mm": convert.toFixed(aprsConditions.rain_24h, 2)
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
  conditions.longitude = customStationLon.toString();
  if (receivedJSON.temperature_F != null) conditions.temp = {
    "f": convert.toFixed(receivedJSON.temperature_F, 2),
    "c": convert.toFixed(convert.fToC(receivedJSON.temperature_F), 2)
  };
  if (receivedJSON.temperature_C != null) conditions.temp = {
    "f": convert.toFixed(convert.cToF(receivedJSON.temperature_C), 2),
    "c": convert.toFixed(receivedJSON.temperature_C, 2)
  };
  if (receivedJSON.wind_avg_m_s != null) conditions.windSpeed = {
    "mph": convert.toFixed(convert.mpsToMPH(receivedJSON.wind_avg_m_s), 2),
    "mps": convert.toFixed(receivedJSON.wind_avg_m_s, 2),
    "kph": convert.toFixed(convert.mpsToKPH(receivedJSON.wind_avg_m_s), 2),
    "knots": convert.toFixed(convert.mpsToKnots(receivedJSON.wind_avg_m_s), 2)
  };
  if (receivedJSON.wind_avg_km_h != null) conditions.windSpeed = {
    "mph": convert.toFixed(convert.kphToMPH(receivedJSON.wind_avg_km_h), 2),
    "mps": convert.toFixed(convert.kphToMPS(receivedJSON.wind_avg_km_h), 2),
    "kph": convert.toFixed(receivedJSON.wind_avg_km_h, 2),
    "knots": convert.toFixed(convert.kphToKnots(receivedJSON.wind_avg_km_h), 2)
  };
  if (receivedJSON.wind_avg_mi_h != null) conditions.windSpeed = {
    "mph": convert.toFixed(receivedJSON.wind_avg_mi_h, 2),
    "mps": convert.toFixed(convert.mphToMPS(receivedJSON.wind_avg_mi_h), 2),
    "kph": convert.toFixed(convert.mphToKPH(receivedJSON.wind_avg_mi_h), 2),
    "knots": convert.toFixed(convert.mphToKnots(receivedJSON.wind_avg_mi_h), 2)
  };
  if (receivedJSON.wind_max_m_s != null) conditions.windGust = {
    "mph": convert.toFixed(convert.mpsToMPH(receivedJSON.wind_max_m_s), 2),
    "mps": convert.toFixed(receivedJSON.wind_max_m_s, 2),
    "kph": convert.toFixed(convert.mpsToKPH(receivedJSON.wind_max_m_s), 2),
    "knots": convert.toFixed(convert.mpsToKnots(receivedJSON.wind_max_m_s), 2)
  };
  if (receivedJSON.wind_max_km_h != null) conditions.windGust = {
    "mph": convert.toFixed(convert.kphToMPH(receivedJSON.wind_max_km_h), 2),
    "mps": convert.toFixed(convert.kphToMPS(receivedJSON.wind_max_km_h), 2),
    "kph": convert.toFixed(receivedJSON.wind_max_km_h, 2),
    "knots": convert.toFixed(convert.kphToKnots(receivedJSON.wind_max_km_h), 2)
  };
  if (receivedJSON.wind_max_mi_h != null) conditions.windGust = {
    "mph": convert.toFixed(receivedJSON.wind_max_mi_h, 2),
    "mps": convert.toFixed(convert.mphToMPS(receivedJSON.wind_max_mi_h), 2),
    "kph": convert.toFixed(convert.mphToKPH(receivedJSON.wind_max_mi_h), 2),
    "knots": convert.toFixed(convert.mphToKnots(receivedJSON.wind_max_mi_h), 2)
  };
  if (receivedJSON.wind_dir_deg != null) conditions.winddir = receivedJSON.wind_dir_deg;
  if (receivedJSON.pressure_hPa != null) conditions.pressure = {
    "inHg": convert.toFixed(convert.hPaToinHg(receivedJSON.pressure_hPa), 3),
    "hPa": convert.toFixed(receivedJSON.pressure_hPa, 1)
  };
  if (receivedJSON.pressure_psi != null) conditions.pressure = {
    "inHg": convert.toFixed(convert.hPaToinHg(receivedJSON.pressure_psi), 3),
    "hPa": convert.toFixed(receivedJSON.pressure_psi, 0)
  };
  if (receivedJSON.humidity != null) conditions.humidity = convert.toFixed(receivedJSON.humidity, 0);
  if (conditions.temp != null && conditions.windSpeed != null) conditions.windChill = {
    "f": convert.toFixed(convert.windChill(conditions.temp.f, conditions.windSpeed.mph, 'F'), 2),
    "c": convert.toFixed(convert.windChill(conditions.temp.c, conditions.windSpeed.kph, 'C'), 2)
  }
  if (conditions.temp != null && conditions.humidity != null) conditions.heatIndex = {
    "f": convert.toFixed(convert.heatIndex(conditions.temp.f, conditions.humidity, 'F'), 2),
    "c": convert.toFixed(convert.heatIndex(conditions.temp.c, conditions.humidity, 'C'), 2)
  };
  if (receivedJSON.uv != null) conditions.uv = receivedJSON.uv;
  if (receivedJSON.light_lux != null) conditions.solarRadiation = receivedJSON.light_lux;
  if (receivedJSON.rain_rate_mm_h != null) conditions.precipRate = {
    "in": convert.toFixed(convert.mmToIn(receivedJSON.rain_rate_mm_h), 3),
    "mm": convert.toFixed(receivedJSON.rain_rate_mm_h, 2)
  };
  // Calculate hourly accumulation from rate if not provided
  if (!conditions.precipLastHour && conditions.precipRate) {
    let calculatedHourlyPrecipAccum = getCalculatedHourlyPrecipAccum_(conditions.precipRate.in);
    if (calculatedHourlyPrecipAccum != null) {
      conditions.precipLastHour = {
        "in": convert.toFixed(calculatedHourlyPrecipAccum, 3),
        "mm": convert.toFixed(convert.inTomm(calculatedHourlyPrecipAccum), 2)
      };
    }
  }

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
  request += '?ID=' + wundergroundStationID;
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
  if (conditions.precipLastHour != null) request += '&rainin=' + conditions.precipLastHour.in;
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
  request += '?stationId=' + windyStationID;
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
  if (conditions.precipLastHour != null) request += '&rainin=' + conditions.precipLastHour.in;
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
  if (conditions.windSpeed != null) request += '&wspd=' + convert.toFixed(conditions.windSpeed.mps * 10, 0);
  if (conditions.windGust != null) request += '&wspdhi=' + convert.toFixed(conditions.windGust.mps * 10, 0);
  if (conditions.winddir != null) request += '&wdir=' + conditions.winddir;
  if (conditions.windChill != null) request += '&chill=' + (conditions.windChill.c * 10);
  if (conditions.heatIndex != null) request += '&heat=' + (conditions.heatIndex.c * 10);
  if (conditions.pressure != null) request += '&bar=' + convert.toFixed(conditions.pressure.hPa * 10, 0);
  if (conditions.humidity != null) request += '&hum=' + conditions.humidity;
  if (conditions.uv != null) request += '&uvi=' + (conditions.uv * 10);
  if (conditions.solarRadiation != null) request += '&solarrad=' + convert.toFixed(conditions.solarRadiation * 10, 0);
  if (conditions.precipRate != null) request += '&rainrate=' + convert.toFixed(conditions.precipRate.mm * 10, 0);
  if (conditions.precipSinceMidnight != null) request += '&rain=' + convert.toFixed(conditions.precipSinceMidnight.mm * 10, 0);
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
  if (!internalStationID) throw 'Station ' + openWeatherMapStationID + ' not found in this OpenWeatherMap account';

  let measurements = {"station_id": internalStationID};
  measurements['dt'] = convert.toFixed(conditions.time / 1000, 0);
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
  request += '&unixtime=' + convert.toFixed(conditions.time / 1000, 0);
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

// https://wow.metoffice.gov.uk/support/dataformats#automatic
function updateWOW_() {

  let conditions = JSON.parse(CacheService.getScriptCache().get('conditions'));

  let request = 'http://wow.metoffice.gov.uk/automaticreading?';
  request += 'siteid=' + wowSiteID;
  request += '&siteAuthenticationKey=' + wowAuthKey;
  request += '&dateutc=' + encodeURIComponent(Utilities.formatDate(new Date(conditions.time), 'UTC', 'yyyy-MM-dd HH:mm:ss'));
  if (conditions.temp != null) request += '&tempf=' + conditions.temp.f;
  if (conditions.dewpoint != null) request += '&dewptf=' + conditions.dewpoint.f;
  if (conditions.windSpeed != null) request += '&windspeedmph=' + conditions.windSpeed.mph;
  if (conditions.windGust != null) request += '&windgustmph=' + conditions.windGust.mph;
  if (conditions.winddir != null) request += '&winddir=' + conditions.winddir;
  if (conditions.pressure != null) request += '&baromin=' + conditions.pressure.inHg;
  if (conditions.humidity != null) request += '&humidity=' + conditions.humidity;
  if (conditions.precipLastHour != null) request += '&rainin=' + conditions.precipLastHour.in;
  if (conditions.precipSinceMidnight != null) request += '&dailyrainin=' + conditions.precipSinceMidnight.in;
  request += '&softwaretype=appsscriptforwarder' + version;

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
  if (conditions.precipLastHour != null) request += '&rainin=' + conditions.precipLastHour.in;
  if (conditions.precipSinceMidnight != null) request += '&dailyrainin=' + conditions.precipSinceMidnight.in;
  if (conditions.precipLast24Hours != null) request += '&last24hrrainin=' + conditions.precipLast24Hours.in;
  request += '&software=appsscriptforwarder' + version;

  console.log(request);

  let response = UrlFetchApp.fetch(request).getContentText();

  console.log(response);

  CacheService.getScriptCache().put('lastCwopTime', conditions.time, 21600); // 6 hours

  return response;

}

/**
 * Calculates hourly precipitation accumulation from precipitation rate data
 *
 * IMPORTANT: This function expects precipitation RATE as input (inches per hour),
 * not accumulated values. It integrates the rate over time to calculate total
 * accumulation over the past rolling hour.
 *
 * Field definitions:
 * - precipRate: Instantaneous precipitation rate (inches/hour or mm/hour)
 * - precipLastHour: Total accumulated precipitation in the last 60 minutes
 * - precipSinceMidnight: Total accumulated precipitation since midnight local time
 *
 * @param {number} currentPrecipRate - Precipitation rate in inches per hour
 * @returns {number|null} - Accumulated precipitation in inches over the past hour, or null if insufficient data
 */
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
    .reduce((output, byte) => output + (byte & 255).toString(16).padStart(2, '0'), '');
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

function fetchJSON_(url, headers = {}) {

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

const convert = {
  // temperature
  fToC: (f) => (f - 32) * (5 / 9),
  cToF: (c) => (9 / 5) * c + 32,
  // speed
  mphToMPS: (mph) => mph * 0.44704,
  mphToKPH: (mph) => mph * 1.609344,
  mphToKnots: (mph) => mph * 0.868976,
  mpsToMPH: (mps) => mps * 2.23694,
  mpsToKPH: (mps) => mps * 3.6,
  mpsToKnots: (mps) => mps * 1.943844,
  kphToMPS: (kph) => kph * 0.27778,
  kphToMPH: (kph) => kph * 0.62137,
  kphToKnots: (kph) => kph * 0.539957,
  knotsToMPH: (knots) => knots * 1.15078,
  knotsToMPS: (knots) => knots * 0.514444,
  knotsToKPH: (knots) => knots * 1.852,
  // pressure
  inHgTohPa: (inHg) => inHg * 33.86389,
  hPaToinHg: (hPa) => hPa * 0.02953,
  // precipitation
  inTomm: (inches) => inches * 25.4,
  mmToIn: (mm) => mm * 0.03937,
  // light
  luxToWm2: (lux) => lux / 126.7,
  wm2ToLux: (wm2) => wm2 * 126.7,
  // derived calculations
  // https://www.weather.gov/media/epz/wxcalc/windChill.pdf
  windChill: (temp, windSpeed, units = 'F') => {
    let T = units === 'F' ? temp : convert.cToF(temp);
    let W = units === 'F' ? windSpeed : convert.kphToMPH(windSpeed);
    if (T > 50 || W < 3) return units === 'F' ? T : temp;
    let windChillF = 35.74 + 0.6215 * T - 35.75 * Math.pow(W, 0.16) + 0.4275 * T * Math.pow(W, 0.16);
    return units === 'F' ? windChillF : convert.fToC(windChillF);
  },
  // https://www.weather.gov/media/epz/wxcalc/heatIndex.pdf
  heatIndex: (temp, humidity, units = 'F') => {
    let T = units === 'F' ? temp : convert.cToF(temp);
    if (T < 80) return units === 'F' ? T : temp;
    let H = humidity;
    let heatIndexF = -42.379 + 2.04901523 * T + 10.14333127 * H - 0.22475541 * T * H
      - 6.83783e-3 * Math.pow(T, 2) - 5.481717e-2 * Math.pow(H, 2)
      + 1.22874e-3 * Math.pow(T, 2) * H + 8.5282e-4 * T * Math.pow(H, 2)
      - 1.99e-6 * Math.pow(T, 2) * Math.pow(H, 2);
    return units === 'F' ? heatIndexF : convert.fToC(heatIndexF);
  },
  toFixed: (num, digits) => +Number(num).toFixed(digits)
};
