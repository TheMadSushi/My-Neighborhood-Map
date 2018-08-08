
//Map style from snazzy maps
var styles = [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
                "color": "#000000"
            },
            {
                "lightness": 13
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 1.4
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#08304b"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
                "color": "#0c4152"
            },
            {
                "lightness": 5
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#0b434f"
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#0b3d51"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "color": "#146474"
        }]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "color": "#021019"
        }]
    }
];

var map;
var largeInfoWindow;
var markers = [];
var places = [{
        locations: [{
                name: 'Metropolitan Museum of Art',
                location: {
                    lat: 40.77972902126812,
                    lng: -73.96341562271118
                }
            },
            {
                name: 'Times Square',
                location: {
                    lat: 40.75749442223194,
                    lng: -73.98568022741497
                }
            },
            {
                name: 'Metropolitan Opera',
                location: {
                    lat: 40.77230806632745,
                    lng: -73.98287954280876
                }
            }
        ],
        type: 'Fun'
    },
    {
        locations: [{
                name: "Smalls Jazz Club",
                location: {
                    lat: 40.734358,
                    lng: -74.002789
                }
            },
            {
                name: "Blue Note",
                location: {
                    lat: 40.73091629339441,
                    lng: -74.00061843452929
                }
            },
            {
                name: "Village Vanguard",
                location: {
                    lat: 40.73595334338886,
                    lng: -74.00151582931665
                }
            }
        ],
        type: 'Jazz Clubs'
    },
    {
        locations: [{
                name: 'Central Park',
                location: {
                    lat: 40.78408342593807,
                    lng: -73.96485328674316
                }
            },
            {
                name: 'Bryant Park',
                location: {
                    lat: 40.753895,
                    lng: -73.983773
                }
            },
            {
                name: 'Madison Square Park',
                location: {
                    lat: 40.74226204193276,
                    lng: -73.98800611495972
                }
            }
        ],
        type: 'Parks'
    }
];

// takes an array of one or more objects (locations & type are keys) and
// returns an array of locations only.
function createLocationsArray(locationObjArray) {
    var locationsList = [];
    locationObjArray.forEach(function(element) {
        $.each(element, function (key, value) {
            if (key === 'locations') {
                value.forEach(function(locObj) {
                    locationsList.push(locObj);
                });
            }
        });
    }, this);
    return locationsList;
}

// Creates markers, InfoWindows.
function populateMarkers(locations) {
  for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
  }
  markers = [];

    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of
    // markers.
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].name;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        // Create an onclick event to open an infoWindow at each marker
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfoWindow);
            bounceMarker(this);
        });

        // Populate markers array
        markers.push(marker);
        bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked.
function populateInfoWindow(marker, infowindow) {

    //To make sure that infoWindow is not already open.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;

        // Callback functions provided for ajax call.
        getFourSquareInfo(infowindow);

        infowindow.open(map, marker);

        // To clear the marker property.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
}

// Gets info from the Foursquare API by sending lat/long coordinates.
function getFourSquareInfo(infowindow) {

    $.ajax({
        url: "https://api.foursquare.com/v2/venues/search",
        data: {
            ll: infowindow.marker.getPosition().lat()+ "," +
          		infowindow.marker.getPosition().lng(),
            client_id: "3B1UPMUXRGQZ0MM33VBBRGZXANKZCBDDWNKB0SMSSP4KD5Y5",
            client_secret: "VO4X3VI2GAPUOOTRE52UFWXA0Q3NUAK5SUNCSKKGOBATYHB2",
            v: '20180423'
        },
        dataType: "json",
        success: function(data) {
            var venue = data.response.venues[0];
            var venueObject = {
                name: venue.name,
                contactInfo: venue.contact,
                foursquareUrl: "https://foursquare.com/v/" + venue.id.toString()
            };
            if (data.hasOwnProperty('response') === true && venue.hasOwnProperty('contact') === true) {
              //Generate content if data is successfully fetched
              var targetKeys = ["formattedPhone", "twitter", "instagram", "facebookUsername"];
              var keyUrls = {formattedPhone: "", twitter: "https://twitter.com/", instagram: "https://instagram.com/",
                  facebookUsername: "https://facebook.com/"};
              var result = '<div style="color:black"><b>' + venueObject.name + '</b></div><br>';

              $.each(venueObject.contactInfo, function(key, value) {
                  if (targetKeys.indexOf(key) > -1) {
                      if (key == "formattedPhone") {
                          result += '<div style="color:green"><b>' +
                              key + '</b>:&nbsp;' +
                              keyUrls[key].toString() +
                              value.toString() + '</div>';
                      } else {
                          result += '<div style="color:black"><b>' +
                              key + ':&nbsp;<a style="color:blue" target="_blank" href="' +
                              keyUrls[key].toString() + value.toString() + '">' +
                              value.toString() + '</a></div>';
                      }
                  }
              });

              result += '<br><a target="_blank" style="color:blue" href="' +
                  venueObject.foursquareUrl + '">Click here for more at FourSquare</a>';
              var replacedResult = result.replace("formattedPhone", "Phone");
              var finalresult = replacedResult.replace("facebookUsername", "Facebook");
              infowindow.setContent(finalresult);
            } else {
              //Display message if no information found
              infowindow.setContent('<div style="color:black">No information found for'+
                      infowindow.marker.getTitle() + 'in Foursquare. :(');

            }
        },
        error: function (xhr) {
            //Error message
            infowindow.setContent('<div style="color:black">Foursquare could not be reached. Please try again later :(');
        }
    });
}

//Animation for the marker when clicked
function bounceMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function() {marker.setAnimation(null);},1500);
}

// Initialize map.
function initMap() {
    try {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {
              lat: 40.78408342593807,
              lng: -73.96485328674316
          },
            zoom: 10,
            styles: styles
        });
        largeInfoWindow = new google.maps.InfoWindow();
        populateMarkers(createLocationsArray(places));

    } catch (error) {
        window.alert("Google Maps could not be reached. Please try again later.");
        console.log("Error on initMap: " + error.toString());
    }
}
