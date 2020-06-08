# Wunderground Station Forwarder

This code is built to be hosted on the free [Google Apps Script](https://developers.google.com/apps-script) platform. It takes in weather station data from [the new Wunderground API](https://www.wunderground.com/member/api-keys) and periodically sends it on to [Windy](https://windy.com/), [PWSWeather](https://pwsweather.com/), [Weathercloud](https://weathercloud.com/), and/or [OpenWeatherMap](https://openweathermap.org/).

## Setup

1. Create a new [Google Apps Script](https://script.google.com/) project and give it a name
2. Copy the code from [`code.gs`](https://raw.githubusercontent.com/leoherzog/WundergroundStationForwarder/master/code.gs) in this repository to your new file
3. Replace the variables in the first few lines of the code
    - Retrieve your [Wunderground API key](https://www.wunderground.com/member/api-keys) and copy it to Line 7
    - Type in [your Wunderground Station ID](https://www.wunderground.com/member/devices) in Line 8
    - If you would like to send data to Windy,
      - Set Line 9 to `true`
      - Set Line 10 to [your Windy API Key](https://stations.windy.com/stations)
      - Set Line 11 to [your Windy Station ID](https://stations.windy.com/stations) (likely "`0`")
    - If you would like to send data to PWSWeather,
      - Set Line 12 to `true`
      - Set Line 13 to [your PWSWeather Station ID](https://www.pwsweather.com/stationlist.php)
      - Set Line 14 to your password that you use to log into PWSWeather
    - If you would like to send data to Weathercloud,
      - Set Line 15 to `true`
      - Set Line 16 to [your Weathercloud ID](https://app.weathercloud.net/devices)
      - Set Line 17 to [your Weathercloud API Key](https://app.weathercloud.net/devices)
    - If you would like to send data to OpenWeatherMap,
      - Set Line 18 to `true`
      - Set Line 19 to [your OpenWeatherMap station's `external_id`](https://openweathermap.org/stations#create_station)
      - Set Line 20 to [your OpenWeatherMap API Key](https://home.openweathermap.org/api_keys)
4. Run the "Schedule" function with **Run** → **Run function** → **Schedule**. You're done!

You can see it running in the Executions menu by going to **View** → **Executions**. If you ever make changes to the API keys or enabled services, just run the **Schedule** function again.

Unfortunately, it looks like the new Wunderground API keys have started expiring 6 months after being generated, so you may need to replace the key on Line 7 if that happens.

## License

Feel free to take a look at the source and adapt as you please. This source is licensed as follows:

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)

Wunderground Station Forwarder is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

<a href="https://www.buymeacoffee.com/leoherzog" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 38px !important;width: 160px !important;" ></a>
