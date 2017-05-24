const BikeData = require('./../js/hotbikes.js').BikeData;

$(document).ready(function() {
  $("#city-submit").click(function() {
    const CITY = $("#city-input").val();
    const bikes = new BikeData();
    bikes.getAllByLocation(CITY);
  });
});
