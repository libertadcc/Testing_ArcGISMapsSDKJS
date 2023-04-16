require([
  "esri/Map",
  "esri/views/MapView",

  "esri/layers/FeatureLayer"

], function(Map, MapView, FeatureLayer) {

const map = new Map({
  basemap: "dark-gray-vector"
});

const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-3,40],
  zoom: 6
});

const gasolineras = new FeatureLayer({
  url: "https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Gasolineras_Pro/FeatureServer/0",
  outFields: ['*']
});

map.add(gasolineras);

// Aplicar efecto con un where
document.getElementById('btn').addEventListener('click', search);

function search(){
  applyFeatureEffect(gasolineras);
};
  
  function applyFeatureEffect(layer){
    var provincia = document.getElementById('inputProv').value.toUpperCase();
        layer.featureEffect = {
          filter: {
            where: "Provincia = '"+ provincia + "'"
          },
          excludedEffect: "grayscale(100%) opacity(30%)"
        };
      }
});