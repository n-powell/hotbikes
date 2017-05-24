function Bikes(){}

Bikes.prototype.getAllByLocation = function(location){
  const PAGE = "1";
  const PER_PAGE = "100";
  const LOCATION = location.replace(/,/, "%2C").replace(" ", "%20");
  const DISTANCE = "100";

  $.get(`https://bikeindex.org:443/api/v3/search?page=${PAGE}&per_page=${PER_PAGE}&location=${LOCATION}&distance=${DISTANCE}&stolenness=proximity`).then(function(response){
    console.log(response);
  }).fail(function(error){
    console.log(error);
  })
};

exports.BikeData = Bikes;
