const BikeData = require('./../js/hotbikes.js').BikeData;

var displayCount = function(count){
  $("#coords-count").text(`${count}`);
}

$(document).ready(function() {
  const HOTBIKE = new BikeData(displayCount);
  const COORDS = {lat: 45.5133499, lng: -122.687179};
  HOTBIKE.generateMap(COORDS);
  HOTBIKE.generateHeatmap();

  $("#city-submit").click(function() {
    const CITY = $("#city-input").val();
    HOTBIKE.getAllByLocation(CITY);
  });
});
