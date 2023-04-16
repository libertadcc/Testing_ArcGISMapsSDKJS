require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/views/MapView",
  "esri/core/watchUtils",
  "esri/core/reactiveUtils",
], function (Map, FeatureLayer, MapView, watchUtils, reactiveUtils) {
  const renderer = {
    type: "simple",
    field: "applicant_id",
    symbol: {
      type: "simple-marker",
      color: "#9be5aa",
      size: 10,
      outline: {
        color: "white",
      },
    },
  };

  const hospitales = new FeatureLayer({
    url: "https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Hospitales/FeatureServer/0",
    renderer,
  });

  const map = new Map({
    basemap: "gray-vector",
    layers: [hospitales],
  });

  const view = new MapView({
    container: "viewDiv",
    center: [-3, 40],
    zoom: 6,
    map: map,
  });

  function changeMouseCursor(response) {
    if (response.results.length > 0) {
      document.getElementById("viewDiv").style.cursor = "pointer";
    } else {
      document.getElementById("viewDiv").style.cursor = "default";
    }
  }

  function getNewGraphics(response) {
    view.graphics.removeAll();
    if (response.results.length > 0) {
      var graphic = response.results[0].graphic;
      graphic.symbol = {
        type: "simple-marker",
        color: "#9be5aa",
        size: 15,
        outline: {
          color: "white",
        },
      }
      view.graphics.add(graphic);
    }
  }

  view.when(function () {
    view.whenLayerView(hospitales).then(function (lview) {
      reactiveUtils.when(
        () => !lview.updating,
        () => {
          view.on("pointer-move", (evt) => {
            var screenPoint = {
              x: evt.x,
              y: evt.y,
            };

            view.hitTest(screenPoint)
              .then(function (response) {
              changeMouseCursor(response);
              getNewGraphics(response);
            });
          });
        },
        {
          once: true,
        }
      );
    });
  });
});