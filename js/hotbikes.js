function BikeData(){
  this.ids = [];
}

BikeData.prototype.getAllIds = function(bikesArray){
  // the scope of the forEach callback function
  // by default is Window. forEach optionally takes a second argument
  // that defines the value of 'this' every time that callback function
  // runs
  bikesArray.forEach(function(bike){
    this.ids.push(bike.id);
  }, this);
}

BikeData.prototype.getAllByLocation = function(location){
  const PAGE = "1";
  const PER_PAGE = "100";
  const LOCATION = location.replace(/,/, "%2C").replace(" ", "%20");
  const DISTANCE = "100";
  let parentScope = this;
  // the scope inside the 'then' method's callback function defaults to the
  // object which 'get' returns. this limits us from accessing the parent scope,
  // and by extension the BikeData object. because of lexical scoping, the callback
  // function of then has access to any variables defined in the parent scope. we
  // define parentScope to the BikeData scope, so our then callback has
  // access to class methods.
  $.get(`https://bikeindex.org:443/api/v3/search?page=${PAGE}&per_page=${PER_PAGE}&location=${LOCATION}&distance=${DISTANCE}&stolenness=proximity`)
  .then(function(response){
    parentScope.getAllIds(response.bikes);
  }).fail(function(error){
    console.log(error);
  });
};

exports.BikeData = BikeData;
