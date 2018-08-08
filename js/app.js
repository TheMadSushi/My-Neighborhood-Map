// ViewModel that displays lists of places and markers
var ViewModel = function() {
    var self = this;
    this.placeDisplayed = ko.observableArray(createLocationsArray(places));
    this.typeSelected = ko.observable();
    this.placeSelected = ko.observable();

    this.typeSelected.subscribe(function() {
      var locationsList = [];
        self.placeDisplayed.removeAll();
        var typeArray = [];
        if (self.typeSelected() === undefined) {
            locationsList = createLocationsArray(places);
            self.placeDisplayed(locationsList);
            populateMarkers(self.placeDisplayed());
        }

        if (self.typeSelected()) {
            typeArray.push(self.typeSelected());
            self.placeDisplayed(createLocationsArray(typeArray));
            populateMarkers(self.placeDisplayed());
        }
    });

    this.markerInfo = function(location) {
        var getMarker = function(locationString) {
            var foundMarker;
            markers.forEach(function(marker) {
                if (marker.getTitle() == locationString) {
                    foundMarker = marker;
                }
            }, this);
            return foundMarker;
        }
        marker = getMarker(location.name);
        populateInfoWindow(marker, largeInfoWindow);
        bounceMarker(marker);
    };
};


function navigation_open() {
    document.getElementById("myNav").style.display = "block";
}

function navigation_close() {
    document.getElementById("myNav").style.display = "none";
}

function showErrorMessage() {
    window.alert("There was a problem with Google Maps. Please close this page from your browser and try again later");
}

// Initializes ViewModel or displays error message
try {
    ko.applyBindings(new ViewModel());
} catch (error) {
    window.alert("There is a problem initializing the application. Please try again later.");
}
