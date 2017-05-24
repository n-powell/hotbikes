const BikeData = require('./../js/hotbikes.js').BikeData;

$(document).ready(function() {
  $("#city-submit").click(function() {
    const CITY = $("#city-input").val();
    const HOTBIKE = new BikeData();
    HOTBIKE.getAllByLocation(CITY);
  });
});
