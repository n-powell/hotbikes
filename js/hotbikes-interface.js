const BikeData = require('./../js/hotbikes.js').BikeData;

var displayCount = function(count){
  $("#coords-count").text(`${count}`);
}

$(document).ready(function() {
  $("#city-submit").click(function() {
    const CITY = $("#city-input").val();
    const HOTBIKE = new BikeData(displayCount);
    HOTBIKE.getAllByLocation(CITY);
  });
});
