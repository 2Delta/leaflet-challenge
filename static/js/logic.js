// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + "Time: " + new Date(feature.properties.time) +
            "</p><p>" + "Magnitude: " + (feature.properties.mag));
    }

    function markerSize(magnitude) {
        console.log(magnitude)
        return magnitude * 10000;
    }

    function markerColor(magnitude) {
        if (magnitude > 5) {
            return "#ff0000"
        }
        else if (magnitude > 4) {
            return "#ff9f00"
        }
        else if (magnitude > 3) {
            return "#ffff00"
        }
        else if (magnitude > 2) {
            return "#00ff00"
        }
        else if (magnitude > 1) {
            return "#00ffff"
        }
        else {
            return "#0000ff"
        }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (earthquakeData, latlng) {
            return L.circle(latlng, {
                radius: markerSize(earthquakeData.properties.mag),
                color: markerColor(earthquakeData.properties.mag)
            });
        },
        onEachFeature: onEachFeature
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

  function createMap(earthquakes) {
    
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    /*Legend specific*/
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += '<i style="background: #ff0000"></i><span>>5</span><br>';
        div.innerHTML += '<i style="background: #ff9f00"></i><span>>4</span><br>';
        div.innerHTML += '<i style="background: #ffff00"></i><span>>3</span><br>';
        div.innerHTML += '<i style="background: #00ff00"></i><span>>2</span><br>';
        div.innerHTML += '<i style="background: #00ffff"></i><span>>1</span><br>';
        div.innerHTML += '<i style="background: #0000ff"></i><span><1</span><br>'

        return div;
    };

    legend.addTo(myMap);
};
  