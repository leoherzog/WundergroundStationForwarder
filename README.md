# Wunderground Station Forwarder

This code is built to be hosted on the free [Google Apps Script](https://developers.google.com/apps-script) platform. It takes in weather station data from:

- [Wunderground](https://wunderground.com/member/api-keys),
- [MyAcurite](https://myacurite.com/),
- [Davis WeatherLink](https://weatherlink.com/), or
- [WeatherFlow Tempest](https://tempestwx.com/)

and periodically sends it on to

- [Wunderground](https://wunderground.com/pws/overview),
- [Windy](https://stations.windy.com/),
- [PWSWeather](https://pwsweather.com/),
- [WeatherCloud](https://weathercloud.com/), and/or
- [OpenWeatherMap](https://openweathermap.org/stations).

## Setup

1. Create a new [Google Apps Script](https://script.google.com/) project and give it a name
2. Copy the code from [`code.gs`](https://github.com/leoherzog/WundergroundStationForwarder/releases/latest/download/code.gs) from [the latest release](https://github.com/leoherzog/WundergroundStationForwarder/releases/latest) in this repository to your new file
3. Configure the script for you

  - Choose your datasource:

    <details>
      <summary>Wunderground</summary>

      Uses the [IBM Wunderground](https://wunderground.com/member/api-keys) API.

      <small>Note: Unfortunately, it looks like the new Wunderground API keys have started expiring 6 months after being generated, so you may need to replace the key if that happens.</small>
      - Set the `datasource` to `ibm` on line 10
      - Set your `ibmAPIKey` on line 12
      - Set your `ibmStationId` on line 13
    </details>
    <details>
      <summary>MyAcurite</summary>
      
      Experimental. Uses the undocumented [MyAcurite](https://myacurite.com/) private API.
      - Set the `datasource` to `acurite` on Line 10
      - Set your `acuriteUsername` on Line 15
      - Set your `acuritePassword` on line 16
      - Set your `acuriteHubName` on line 17
      - Set your `acuriteStationName` on line 18
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
      - Set your `weatherflowSationId` on Line 25
    </details>

  - and choose one or more your forwarding destinations:

    <details>
      <summary>Wunderground</summary>

      Send to [Wunderground](https://support.weather.com/s/article/PWS-Upload-Protocol).

      - Set `updateWunderground` to `true` on Line 29
      - Set your `wundergroundAPIKey` on Line 30
      - Set your `wundergroundStationId` on line 31
    </details>
    <details>
      <summary>Windy</summary>

      Send to [Windy.com](https://community.windy.com/topic/8168/report-your-weather-station-data-to-windy).

      - Set `updateWindy` to `true` on Line 33
      - Set your `windyAPIKey` on Line 34
      - Set your `windyStationId` on line 35. It's likely `0`, `1`, `2`, etc.
    </details>
    <details>
      <summary>PWSWeather</summary>

      Send to [PWSWeather](https://dashboard.pwsweather.com/).

      - Set `updatePWSWeather` to `true` on Line 37
      - Set your `pwsWeatherAPIKey` from your station's admin page on line 38
      - Set your `pwsWeatherStationID` on Line 39
    </details>
    <details>
      <summary>WeatherCloud</summary>

      Send to [WeatherCloud](https://app.weathercloud.net/). Retrieve your station's ID and API Key by going to [your Devices](https://app.weathercloud.net/devices), then clicking Settings → 🔌 Link on your station.

      - Set `updateWeatherCloud` to `true` on Line 41
      - Set your `weathercloudStationId` on line 42
      - Set your `weathercloudAPIKey` on Line 43
      - Set whether or not you have a WeatherCloud Pro or Premium account with `hasWeatherCloudPro` as `true` or `false` on line 44
    </details>
    <details>
      <summary>OpenWeatherMap</summary>

      Send to [OpenWeatherMap](https://openweathermap.org/stations).

      - Set `updateOpenWeatherMap` to `true` on Line 46
      - Set `openWeatherMapAPIKey` to your [API Key](https://home.openweathermap.org/api_keys) on Line 47
      - Set your `openWeatherMapStationId` on line 48 to [your OpenWeatherMap station's `external_id`](https://openweathermap.org/stations#create_station)
    </details>

4. Run the "Schedule" function with the `▷ Run` button in the toolbar. You're done! You can see it periodically running in the `☰▶` Executions tab on the left sidebar.

If you ever make changes to the API keys or enabled services, just run the **Schedule** function again.

## How to Update

1. Copy the code from [`code.gs`](https://github.com/leoherzog/WundergroundStationForwarder/releases/latest/download/code.gs) from [the latest release](https://github.com/leoherzog/WundergroundStationForwarder/releases/latest) in this repository to your `Code.gs` file and `💾 Save`.
2. Make sure your API Keys and settings on lines 10 through 48 are correct.
3. Run the "Schedule" function again with the `▷ Run` button in the toolbar.

## License

Feel free to take a look at the source and adapt as you please. This source is licensed as follows:

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)

Wunderground Station Forwarder is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

<a href="https://www.buymeacoffee.com/leoherzog" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 38px !important;width: 160px !important;" ></a>
