<template>
  <div id="mapContainer" class="basemap">
    <div id="geocoder" class="geocoder"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "App",
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoiYW1pcmFsaS1zYWhyYWVpIiwiYSI6ImNrb3N0M24zajA0NGIydms3eGQzZGFqZG8ifQ.sKOOviewlgyDZVREwMWz1w",
    };
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken;

    async function api() {
      try {
        var response = await fetch("http://127.0.0.1:3000/data");
        var result = await response.json();

        var features = [];
        result.forEach((data) => {
          features.push({
            type: "Feature",
            properties: {
              description: data.description,
              icon: data.icon,
            },
            geometry: {
              type: "Point",
              coordinates: [data.x, data.y],
            },
          });
        });

        var map = new mapboxgl.Map({
          container: "mapContainer",
          style: "mapbox://styles/mapbox/dark-v10",
          center: [51.389, 35.6892],
          zoom: 8,
        });
        map.addControl(new mapboxgl.NavigationControl());

        map.on("load", function () {
          // heatmap addSource
          map.addSource("trees", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: features,
            },
          });
          // heatmap layer
          map.addLayer(
            {
              id: "trees-heat",
              type: "heatmap",
              source: "trees",
              maxzoom: 15,
              paint: {
                // increase weight as diameter breast height increases
                "heatmap-weight": {
                  property: "dbh",
                  type: "exponential",
                  stops: [
                    [1, 0],
                    [62, 1],
                  ],
                },
                // increase intensity as zoom level increases
                "heatmap-intensity": {
                  stops: [
                    [11, 1],
                    [15, 3],
                  ],
                },

                "heatmap-color": [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0,
                  "rgba(0, 0, 255, 0)",
                  0.1,
                  "#a38d44",
                  0.3,
                  "#a26f54",
                  0.5,
                  "#a26f54",
                  0.7,
                  "#a26f54",
                  1,
                  "#a26f54",
                ],
                // increase radius as zoom increases
                "heatmap-radius": 80,
                // decrease opacity to transition into the circle layer
                "heatmap-opacity": {
                  default: 1,
                  stops: [
                    [14, 1],
                    [15, 0],
                  ],
                },
              },
            },
            "waterway-label"
          );
          // icons and popup addSource
          map.addSource("places", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: features,
            },
          });
          // icons and popup layer
          map.addLayer({
            id: "places",
            type: "symbol",
            source: "places",
            layout: {
              "icon-image": "{icon}",
              "icon-allow-overlap": true,
            },
          });
          // popup
          map.on("click", "places", function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
          });
          // search input
          var geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
          });
          document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
        });
      } catch (error) {
        console.log(error);
      }
    }
    api();
  },
};
</script>

<style  >
body {
  margin: 0;
}

.basemap {
  width: 100%;
  height: 100vh;
  float: left;
}

.geocoder {
  position: absolute;
  z-index: 1;
  width: 50%;
  left: 50%;
  margin-left: -25%;
  top: 10px;
}
.mapboxgl-ctrl-geocoder {
  min-width: 100%;
}
#map {
  margin-top: 75px;
}
</style>
