function BikeData(displayCount){
  this.ids = [];
  this.googleLatLngs = [];
  this.displayCount = displayCount;
  this.staticMax = 10000;
}

BikeData.prototype.generateHeatmap = function(){
  this.heatmap = new google.maps.visualization.HeatmapLayer({
    map: this.map,
    radius: 20
  });
};

BikeData.prototype.generateMap = function(coords) {
  this.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: coords,
  });
};

BikeData.prototype.getAllIds = function(bikesArray){
  return bikesArray.map(function(bike){return bike.id});
};

BikeData.prototype.updateHeatmap = function(){
  this.heatmap.setData(this.googleLatLngs);
};

BikeData.prototype.getBikes = function(city) {
  const HOTBIKESCOPE = this;
  $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city.replace(" ", "+")}`)
  .then(function(response){
    let coords = {
      lat: response.results[0].geometry.location.lat,
      lng: response.results[0].geometry.location.lng
    };
    HOTBIKESCOPE.locationCoords = `${coords.lat}%2C${coords.lng}`;
    HOTBIKESCOPE.map.setCenter(new google.maps.LatLng(coords.lat, coords.lng));
    HOTBIKESCOPE.map.setZoom(11);
    HOTBIKESCOPE.getCount();
  }).fail(function(error)  {
    console.log(error);
  });
};

BikeData.prototype.getCount = function() {
  const HOTBIKESCOPE = this;
  let coords = this.locationCoords;
  $.get(`https://bikeindex.org:443/api/v3/search/count?location=${coords}&distance=20&stolenness=proximity`)
  .then(function(response){
    let totalBikes = (response.proximity > HOTBIKESCOPE.staticMax) ? HOTBIKESCOPE.staticMax : response.proximity;
    HOTBIKESCOPE.getChunk(1, totalBikes);
  }).fail(function(error){
    console.log(error);
  });
};

BikeData.prototype.getChunk = function(currentPage, totalBikes) {
  const HOTBIKESCOPE = this;
  const LOCATION = this.locationCoords;
  const DISTANCE = "20";
  const PER_PAGE = "100";
  if(this.ids.length < totalBikes) {
    $.get(`https://bikeindex.org:443/api/v3/search?page=${currentPage}&per_page=${PER_PAGE}&location=${LOCATION}&distance=${DISTANCE}&stolenness=proximity`)
    .then(function(response){
      let ids = HOTBIKESCOPE.getAllIds(response.bikes);
      HOTBIKESCOPE.ids = HOTBIKESCOPE.ids.concat(ids);
      HOTBIKESCOPE.getChunk(currentPage+1, totalBikes);
    }).fail(function(error){
      console.log(error.responseText);
      console.log("trying again in 10 seconds");
      window.setTimeout(HOTBIKESCOPE.restartChunks, 10000, currentPage, totalBikes, HOTBIKESCOPE);
    });
  } else {
    this.getBike(1);
  }
}

BikeData.prototype.restartChunks = function(page, total, context) {
  console.log(`trying again from page ${page}`);
  context.getChunk(page, total);
}

BikeData.prototype.getBike = function(index){
  const HOTBIKESCOPE = this;
  if(index < this.ids.length){
    let id = this.ids[index];
    $.get(`https://bikeindex.org:443/api/v3/bikes/${id}`)
    .then(function(response){
      console.log(index);
      HOTBIKESCOPE.googleLatLngs.push(new google.maps.LatLng(response.bike.stolen_record.latitude, response.bike.stolen_record.longitude));
      HOTBIKESCOPE.updateHeatmap();
      HOTBIKESCOPE.displayCount(`${index+1}/${HOTBIKESCOPE.staticMax}`)
      HOTBIKESCOPE.getBike(index+1);
    }).fail(function(error){
      console.log(error.responseText);
      console.log("trying again in 10 seconds");
      window.setTimeout(HOTBIKESCOPE.restartBikes, 10000, index, HOTBIKESCOPE);
    });
  }
};

BikeData.prototype.restartBikes = function(index, context) {
  console.log(`trying again from index ${index}`);
  context.getBike(index);
}



exports.BikeData = BikeData;
