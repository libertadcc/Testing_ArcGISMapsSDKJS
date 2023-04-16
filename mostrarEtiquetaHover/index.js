//https://github.com/esrinederland/CoolMaps/blob/master/PopupOnHover/popuponhover.html
require([
  "esri/core/reactiveUtils",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer"
], function(
  reactiveUtils,
  Map,
  MapView,
  FeatureLayer,
  GraphicsLayer
) {

  var map = new Map({
    basemap: "gray-vector"
  });

  var view = new MapView({
    container: "mapDiv",
    map: map,
    center: [-3, 40],
    zoom: 6
  });

  var layer = new FeatureLayer({
    url: "https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Prov/FeatureServer/0",
    outFields: ["*"],
    renderer: {
      type: 'simple',
      symbol: {
        type: "simple-fill",
        style: "none",
        //outline: { color: [237, 33, 33, 1] }, // línea roja
        outline: { style: "none", color: [255, 255, 255, 0] }, // transparente
        color: [247, 247, 247, 0.06]
      }
    }
  });

  // hovered area feature will be added to this layer
  const graphicsLayer = new GraphicsLayer();

  map.addMany([layer, graphicsLayer]);      

  view.ui.add(document.getElementById("sidepanel"), "top-right");
  function highlightFeature(lview, mappoint) {

    //create a query to get the area feature
    const query = {
      geometry: mappoint,
      returnGeometry: true,
      outFields: ["NAMEUNIT"]
    };
    
    //query the layerview (that holds all the data on the client)
    lview.queryFeatures(query).then((response)=>{
        graphicsLayer.graphics.removeAll();
        if(response.features.length > 0) {                
          var feature = response.features[0];
          feature.symbol = {
            type: "text", 
            color: "white",
            haloColor: "black",
            haloSize: "1px",
            text: feature.attributes.NAMEUNIT,
            font: { size: 15 },
            backgroundColor: "#4C4C4C",
            borderLineSize: "0px"
          }
          
          
          // Contorno de la provincia
           var borde = {
              geometry: feature.geometry,
              symbol: {
                type: "simple-fill",
                color: null,
                outline: { color: [237, 33, 33, 1] }, // línea roja
              }
          }
           
          graphicsLayer.graphics.addMany([borde, feature])
        }
    });
  }

  //when the view is completely loaded
  view.when(function() {
    view.whenLayerView(layer).then(function(lview) {
      reactiveUtils
        .whenOnce(() => !lview.updating)
        .then(view.on("pointer-move", function(evt) {
          highlightFeature(lview,view.toMap(evt));
        }));           
    });
  });
});