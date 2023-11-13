var google;
let map;
let marker;
let geocoder;

// See https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple#maps_geocoding_simple-javascript
function initMap() {
  // Create the Google Map using out element and options defined below
  // Get the HTML DOM element that will contain your map 
  // We are using a div with id="map" seen below in the <body>
  map = new google.maps.Map(document.getElementById("map"), {
    // Set mapOptions
    zoom: 7,
    center: { lat: 40.69847032728747, lng: -73.9514422416687 },
    mapTypeControl: false,
    // How you would like to style the map. 
    scrollwheel: false,
    styles: [
        {
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        }
    ]
  });

  const address = '228 Park Ave S, New York, NY 10003';
  geocoder.geocode( { 'address': address});
}

function geocode(request) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

window.initMap = initMap;