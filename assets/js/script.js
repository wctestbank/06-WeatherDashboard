var apiKey = "73b0a0db5702db418082ec6f09e2bf26"

var searchHistory = [];

var callCity = function (city) {
    // format api url call
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;


    // make a request to the url
    fetch(apiUrl).then(function (response) {
        return response.json();
    })
        .then(function (data) {

            console.log(data);

            $("#city-name").text(data.name);

            var search = {
                location: city,
                lon: data.coord.lon,
                lat: data.coord.lat
            };

            searchHistory.push(search);
            callForecast(data.coord.lat, data.coord.lon);
        })
        .catch(function (error) {
            alert("City not found");
        });


};

var callForecast = function (lat, lon) {
    // format api url call
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`;

    fetch(apiUrl).then(function (response) {
        return response.json();
    })
        .then(function (data) {
            console.log(data);
            populateForecast(data);
        })
        .catch(function (error) {
            alert("City not found");
        });

};

var populateForecast = function (data) {

    for (x = 0; x < 6; x++) {
        // Date
        var date = new Date(data.daily[x].dt * 1000).toLocaleDateString("en-US");
        $(`#${x}-date`).text(date);

        // icon
        var iconCode = data.daily[x].weather[0].icon;
        var iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        $(`#${x}-icon`).attr("src", iconUrl);

        // temp
        var temp = data.daily[x].temp.day;
        $(`#${x}-temp`).text(`Temp: ${temp}C`);

        // wind
        var wind = data.daily[x].wind_speed;
        $(`#${x}-wind`).text(`Wind: ${wind}m/s`);

        // humidity
        var humidity = data.daily[x].humidity;
        $(`#${x}-humidity`).text(`Humidity: ${humidity}%`)

        // uv
        var uvi = data.daily[x].uvi;
        $(`#${x}-uv`).text(`UV: ${uvi}`);
    }
};

callCity("toronto");