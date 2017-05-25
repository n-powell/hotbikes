function BikeData(displayCount){
  this.ids = [];
  this.coords = [];
  this.googleLatLngs = [];
  this.displayCount = displayCount;
}

BikeData.prototype.generateHeatmap = function(){
  this.heatmap = new google.maps.visualization.HeatmapLayer({
    map: this.map,
    radius: 20
  });
};

BikeData.prototype.generateMap = function(coords) {
  this.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: coords,
  });
};

BikeData.prototype.getAllIds = function(bikesArray){
  // the scope of the forEach callback function
  // by default is Window. forEach optionally takes a second argument
  // that defines the value of 'this' every time that callback function
  // runs
  bikesArray.forEach(function(bike){this.ids.push(bike.id);}, this);
};

BikeData.prototype.updateHeatmap = function(){
  this.heatmap.setData(this.googleLatLngs);
};

BikeData.prototype.getAllBikesById = function(){
  let HOTBIKESCOPE = this;
  this.ids.forEach(function(id){
      $.get(`https://bikeindex.org:443/api/v3/bikes/${id}`)
      .then(function(response){
        // let coords = {lng: response.bike.stolen_record.longitude,
        // lat: response.bike.stolen_record.latitude}

        HOTBIKESCOPE.googleLatLngs.push(new google.maps.LatLng(response.bike.stolen_record.latitude, response.bike.stolen_record.longitude));
        HOTBIKESCOPE.updateHeatmap();
        HOTBIKESCOPE.displayCount(HOTBIKESCOPE.googleLatLngs.length);
        // HOTBIKESCOPE.coords.push(coords);
      }).fail(function(error){
        console.log(error);
      });
  });
};

BikeData.prototype.getBikes = function(city) {
  const HOTBIKESCOPE = this;
  $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city.replace(" ", "+")}`)
  .then(function(response){
    let coords = {lat: response.results[0].geometry.location.lat, lng: response.results[0].geometry.location.lng};
    HOTBIKESCOPE.map.setCenter(new google.maps.LatLng(coords.lat, coords.lng));
    HOTBIKESCOPE.map.setZoom(11);
    HOTBIKESCOPE.getAllByLocation(`${coords.lat}%2C${coords.lng}`);
  }).fail(function(error)  {
    console.log(error);
  });
};


BikeData.prototype.getAllByLocation = function(location){

  const PAGE = "1";
  const PER_PAGE = "10";
  const LOCATION = location;
  const DISTANCE = "100";
  const HOTBIKESCOPE = this;

  // the scope inside the 'then' method's callback function defaults to the
  // object which 'get' returns. this limits us from accessing the parent scope,
  // and by extension the BikeData object. because of lexical scoping, the callback
  // function of then has access to any variables defined in the parent scope. we
  // define parentScope to the BikeData scope, so our then callback has
  // access to class methods.
  $.get(`https://bikeindex.org:443/api/v3/search?page=${PAGE}&per_page=${PER_PAGE}&location=${LOCATION}&distance=${DISTANCE}&stolenness=proximity`)
  .then(function(response){
    HOTBIKESCOPE.getAllIds(response.bikes);
    HOTBIKESCOPE.getAllBikesById();

  }).fail(function(error){
    console.log(error);
  });
};

exports.BikeData = BikeData;
