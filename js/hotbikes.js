function BikeData(displayCount){
  this.ids = [];
  this.coords = [];
  this.googleLatLngs = [];
  this.displayCount = displayCount;
  this.map;
  this.heatmap;
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
}

BikeData.prototype.getAllBikesById = function(){
  let HotBikeScope = this;
  this.ids.forEach(function(id){
      $.get(`https://bikeindex.org:443/api/v3/bikes/${id}`)
      .then(function(response){
        // let coords = {lng: response.bike.stolen_record.longitude,
        // lat: response.bike.stolen_record.latitude}
        // new google.maps.Marker({
        //   map: HotBikeScope.map,
        //   position: coords
        // });
        HotBikeScope.googleLatLngs.push(new google.maps.LatLng(response.bike.stolen_record.latitude, response.bike.stolen_record.longitude));
        HotBikeScope.updateHeatmap();
        HotBikeScope.displayCount(HotBikeScope.googleLatLngs.length);
        // HotBikeScope.coords.push(coords);
      }).fail(function(error){
        console.log(error);
      });
  });
};


BikeData.prototype.getAllByLocation = function(location){
  const PAGE = "1";
  const PER_PAGE = "100";
  const LOCATION = location.replace(/,/, "%2C").replace(" ", "%20");
  const DISTANCE = "100";
  let HotBikeScope = this;
  // the scope inside the 'then' method's callback function defaults to the
  // object which 'get' returns. this limits us from accessing the parent scope,
  // and by extension the BikeData object. because of lexical scoping, the callback
  // function of then has access to any variables defined in the parent scope. we
  // define parentScope to the BikeData scope, so our then callback has
  // access to class methods.
  $.get(`https://bikeindex.org:443/api/v3/search?page=${PAGE}&per_page=${PER_PAGE}&location=${LOCATION}&distance=${DISTANCE}&stolenness=proximity`)
  .then(function(response){
    HotBikeScope.getAllIds(response.bikes);
    HotBikeScope.getAllBikesById();

  }).fail(function(error){
    console.log(error);
  });
};

exports.BikeData = BikeData;
