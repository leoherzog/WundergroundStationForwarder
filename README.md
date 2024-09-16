# Station Forwarder

This code is built to be hosted on the free [Google Apps Script](https://developers.google.com/apps-script) platform. It takes in weather station data from:

- [IBM Wunderground](https://wunderground.com/member/api-keys),
- [MyAcurite](https://myacurite.com/),
- [Davis WeatherLink](https://weatherlink.com/),
- [WeatherFlow Tempest](https://tempestwx.com/),
- [Ambient Weather](https://ambientweather.net/),
- [aprs.fi (CWOP)](https://aprs.fi/), or
- a custom data source in [RTL_433 JSON format](https://www.triq.org/rtl_433/DATA_FORMAT.html),

and periodically sends it on to

- [IBM Wunderground](https://wunderground.com/pws/overview),
- [Windy.com](https://stations.windy.com/),
- [Aeris PWSWeather](https://pwsweather.com/),
- [WeatherCloud](https://weathercloud.com/),
- [OpenWeatherMap](https://openweathermap.org/stations),
- [WindGuru](https://www.windguru.cz/map/station/),
- [MET (UK) WOW](https://wow.metoffice.gov.uk/) and/or
- [NOAA CWOP](https://madis.ncep.noaa.gov/madis_cwop.shtml).

## Setup

1. Create a new [Google Apps Script](https://script.google.com/) project and give it a name
2. Overwrite the default `Code.gs` file with [`code.gs`](https://github.com/leoherzog/WundergroundStationForwarder/blob/latest/code.gs) from the latest release in this repository
3. Configure the script for you:

- Choose your datasource:

  <details>
    <summary>IBM Wunderground</summary>

  Uses the [IBM Wunderground](https://wunderground.com/member/api-keys) API.

  <small>Note: Unfortunately, it looks like the new Wunderground API keys have started expiring 6 months after being generated, so you may need to replace the key if that happens.</small>

  - Set the `datasource` to `ibm` on line 10
  - Set your `ibmAPIKey` on line 12
  - Set your `ibmStationID` on line 13
  </details>
  <details>
    <summary>MyAcurite</summary>

  Experimental. Uses the undocumented [MyAcurite](https://myacurite.com/) private API.

  - Set the `datasource` to `acurite` on Line 10
  - Set your `acuriteUsername` on Line 15
  - Set your `acuritePassword` on line 16
  - Set your `acuriteHubName` (the user-set name on the internet-connected receiver) on line 17
  - Set your `acuriteStationName` (the user-set name of the outdoor sensor/station) on line 18
  </details>
  <details>
    <summary>Davis Weatherlink</summary>

  Uses the [Davis Weatherlink](https://weatherlink.com/account) API v2.

  - Set the `datasource` to `davis` on line 10
  - Set your `davisApiKey` on line 20
  - Set your `davisApiSecret` on line 21
  - Set your `davisStationName` on line 22
  </details>
  <details>
    <summary>Weatherflow Tempest</summary>

  Uses a [Weatherflow Tempest Personal Use Token](https://tempestwx.com/settings/tokens).

  - Set the `datasource` to `weatherflow` on Line 10
  - Set your `weatherflowPUT` on line 24
  - Set your `weatherflowSationID` on Line 25
  </details>
  <details>
    <summary>Ambient Weather</summary>

  Uses the [Ambient Weather](https://ambientweather.net/account) API.

  - Set the `datasource` to `ambient` on Line 10
  - Set your `ambientWeatherStationName` on line 27
  - Set your `ambientWeatherApiKey` on Line 28
  </details>
  <details>
    <summary>aprs.fi (CWOP)</summary>

  Uses the [aprs.fi API](https://aprs.fi/page/api) to fetch APRS packet data from a CWOP station.

  - Set the `datasource` to `aprs` on Line 10
  - Set your `aprsStationID` on line 30
  - Set your `aprsApiKey` on Line 31 from [your aprs.fi account](https://aprs.fi/account/)
  </details>
  <details>
    <summary>Custom Data Source</summary>

  Send weather station readings from any system in [RTL_433 JSON format](https://www.triq.org/rtl_433/DATA_FORMAT.html).

  - Set the `datasource` to `custom` on Line 10
  - Set your station's latitude and longitude on lines 33 and 34 in decimal degrees
  - Click `Deploy ▼` → New deployment → '⚙' → Web app, and change 'Who has access' to 'Anyone' and press 'Deploy'
  - Begin HTTP POSTing JSON data to the `https://script.google.com/macros/...` URL provided in the confirmation dialog
  </details>

- and choose one or more forwarding destinations:

  <details>
    <summary>IBM Wunderground</summary>

  To send to [Wunderground](https://support.weather.com/s/article/PWS-Upload-Protocol):

  - Set `updateWunderground` to `true` on Line 38
  - Set your `wundergroundAPIKey` on Line 39
  - Set your `wundergroundStationID` on line 40
  </details>
  <details>
    <summary>Windy.com</summary>

  To send to [Windy.com](https://community.windy.com/topic/8168/report-your-weather-station-data-to-windy):

  - Set `updateWindy` to `true` on Line 42
  - Set your `windyAPIKey` on Line 43
  - Set your `windyStationID` on line 44. It's likely `0`, `1`, `2`, etc.
  </details>
  <details>
    <summary>Aeris PWSWeather</summary>

  To send to [PWSWeather](https://dashboard.pwsweather.com/):

  - Set `updatePWSWeather` to `true` on Line 46
  - Set your `pwsWeatherAPIKey` from your station's profile page on line 47
  - Set your `pwsWeatherStationID` on Line 48
  </details>
  <details>
    <summary>WeatherCloud</summary>

  To send to [WeatherCloud](https://app.weathercloud.net/):

  Retrieve your station's ID and API Key by going to [your Devices](https://app.weathercloud.net/devices), then clicking Settings → 🔌 Link on your station.

  - Set `updateWeatherCloud` to `true` on Line 50
  - Set your `weathercloudAPIKey` on Line 51
  - Set your `weathercloudID` on Line 52
  - Set whether or not you have a WeatherCloud Pro or Premium account with `hasWeatherCloudPro` as `true` or `false` on line 53
  </details>
  <details>
    <summary>OpenWeatherMap</summary>

  Creation of a new OpenWeatherMap station must be done by API, not on the OpenWeatherMap website. More information is available in [the OpenWeatherMap Station API documentation](https://openweathermap.org/stations#create_station). The basic concept for what must be done is available in the `createNewOWMStation_()` function. Remove the `_` character from the name of that function to make it selectable from the `▷ Run` button in the toolbar. If you do so, make sure you note your new station's ID and other details in the log (available in the Executions tab in the sidebar after running!), then:

  - Set `updateOpenWeatherMap` to `true` on Line 55
  - Set `openWeatherMapAPIKey` to your [API Key](https://home.openweathermap.org/api_keys) on Line 56
  - Set your `openWeatherMapStationId` to [your OpenWeatherMap station's `external_id`](https://openweathermap.org/stations#create_station) on line 57
  </details>
  <details>
    <summary>WindGuru</summary>

  Send to [WindGuru](https://www.windguru.cz/map/station/):

  Start by [registering a new "Other / Upload API" station](https://stations.windguru.cz/register.php?id_type=16), then:

  - Set `updateWindGuru` to `true` on Line 59
  - Set `windGuruStationUID` to your chosen [station UID](https://stations.windguru.cz/) on Line 60
  - Set your `windGuruStationPassword` to your chosen [station API password](https://stations.windguru.cz/) (note, not your _account's_ password) on line 61
  </details>
  <details>
    <summary>Met (UK) WOW</summary>

  Send to [The Met Office's Weather Observations Website](https://wow.metoffice.gov.uk/):

  Start by [registering a new Site](https://wow.metoffice.gov.uk/sites/create). During registration, one of the fields in your Site's options is "Authentication Key". Choose any 6-Digit number. Then:

  - Set `updateWOW` to `true` on Line 63
  - Set `wowSiteID` to the generated [Site ID](https://wow.metoffice.gov.uk/sites) on Line 64
  - Set `wowAuthKey` to your chosen [6-Digit Authentication Key](https://wow.metoffice.gov.uk/sites) that you chose when creating or editing the Site on line 65
  </details>
  <details>
    <summary>NOAA Citizen Weather Observer Program (CWOP)</summary>

  Send to [CWOP](https://madis.ncep.noaa.gov/madis_cwop.shtml). Start by [registering for a new station](https://madis.ncep.noaa.gov/madis_cwop.shtml), then when you receive your email:

  - Set `updateCWOP` to `true` on Line 67
  - Set `cwopStationIDOrHamCallsign` to your assigned CWOP station ID that you received via email on Line 68
  - If you are using your ham radio callsign as your station ID and you have received a validation code from NOAA CWOP support, set `cwopValidationCode` to your validation code on Line 69
  </details>

4. Run the "Schedule" function (not the "doPost" function) by selecting "Schedule" in the dropdown and pressing the `▷ Run` button in the toolbar. You're done! You can see it periodically running in the `☰▶` Executions tab on the left sidebar. This code is executed on Google's servers and does not require a computer to remain on.

If you ever make changes to the API keys or enabled services, just run the **Schedule** function again.

## How to Update

1. Copy the code from [`code.gs`](https://github.com/leoherzog/WundergroundStationForwarder/blob/latest/code.gs) in this release over your `Code.gs` file.
2. Make sure your API Keys and settings at the top of the file are correct and `💾 Save`.
3. Run the `Schedule` function again with the `▷ Run` button in the toolbar.

## License

Feel free to take a look at the source and adapt as you please. This source is licensed as follows:

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)

Station Forwarder is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

<a href="https://herzog.tech/$" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://herzog.tech/signature/mug-tea-saucer-solid-light.svg.png">
    <source media="(prefers-color-scheme: light)" srcset="https://herzog.tech/signature/mug-tea-saucer-solid.svg.png">
    <img src="https://herzog.tech/signature/mug-tea-saucer-solid.svg.png" alt="Buy Me A Tea" width="32px">
  </picture>
  Found this helpful? Buy me a tea!
</a>
