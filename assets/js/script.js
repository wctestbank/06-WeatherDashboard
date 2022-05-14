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

            //console.log(data);

            $("#city-name").text(data.name);

            if (data.name) {
                searchHistory.push(data.name);
                saveHistory();
            }

            populateHistory();

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
            //console.log(data);
            populateForecast(data);
        })
        .catch(function (error) {
            alert("Fetch Error");
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

        // assigns class to color code uv conditions
        $(`#${x}-uv`).removeClass();
        switch (true) {
            case (uvi > 6):
                $(`#${x}-uv`).addClass("bg-danger");
                break;
            case (uvi > 3):
                $(`#${x}-uv`).addClass("bg-warning");
                break;
            default:
                $(`#${x}-uv`).addClass("bg-success");
        }
    }
};

// search history button population
var populateHistory = function () {
    $("#search-history").empty();

    // makes a button for each history item
    for (x = 0; x < searchHistory.length; x++) {
        var searchItem = $("<button>")
            .text(searchHistory[x])
            .attr("data-index", x)
            .addClass("col");

        $("#search-history").append(searchItem);
    }

};

// save and load functions
var saveHistory = function () {
    localStorage.setItem("searches", JSON.stringify(searchHistory));
};

var loadHistory = function () {
    searchHistory = JSON.parse(localStorage.getItem("searches"));

    if (!searchHistory) {
        searchHistory = [];
    }
};


loadHistory();
populateHistory();

// event listeners
$("#search-city").click(function () {
    $("#forecast").removeAttr("hidden");
    console.log($("#search-input").val());
    callCity($("#search-input").val());
});

$("#search-history").on("click", "button", function () {
    //console.log($(this).text());
    $("#forecast").removeAttr("hidden");
    callCity($(this).text());
});

