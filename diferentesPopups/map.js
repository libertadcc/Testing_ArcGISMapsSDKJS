require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], (Map, MapView, FeatureLayer) => {
        
  const measureThisAction = {
   title: "Measure Length",
   id: "measure-this",
   image: "https://developers.arcgis.com/javascript/latest/sample-code/popup-actions/live/Measure_Distance16.png"
 };
 
 const ccaa = new FeatureLayer({
   url: "https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/CCAA_wgs1984_wm/FeatureServer/0",
   renderer: {
     type: "simple",
     symbol: {
       type: "simple-fill",
       color: [ 0, 0,255, 0.3]
     }
   },
   outFields: ['NAMEUNIT'],
   popupTemplate: {
     title: "{NAMEUNIT}",
     actions: [measureThisAction]
   }
 });
 
 function showAlert() {
   alert('ey');
 };
 
 const provincias = new FeatureLayer({
   url: "https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Prov/FeatureServer/0",
   renderer: {
     type: "simple",
     symbol: {
      type: "simple-fill",
       outline: { 
         style: "short-dash-dot", 
         width: 1.75, 
         color: [236, 73, 73, 1] 
       },
       color: [255, 255, 255, 0.25]
     }
   },
   outFields: ['NAMEUNIT'],
   popupTemplate: {
     title: "{NAMEUNIT}",
     content: `<i class="fa fa-cloud"></i>`
   }
 });
 

 
 const comisarias = new FeatureLayer({
   url: "https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/comisarias_espa%c3%b1a/FeatureServer/0",
   renderer: {
     type: "simple",
     symbol: {
       type: "simple-marker",
       color: '#800080'
     }
   },
   outFields: ['nombre', 'direccion'],
   popupTemplate: {
     title: '{nombre}',
     content: [{
       // type fields crea un cuadro
       type: "fields",
       fieldInfos: [{
         fieldName: "direccion",
         label: 'Dirección comisaría'
       }]
     }]
   }
 })
 
 
 const map = new Map({
   basemap: "topo-vector",
   layers: [ccaa, provincias, comisarias]
 });

 const view = new MapView({
   container: "viewDiv",
   map: map,
   zoom: 7,
   center: [-3, 40] // longitude, latitude
 });
 
 
  view.popup.on("trigger-action", (event) => {
   // Execute the showAlert() function if the measure-this action is clicked
   if (event.action.id === "measure-this") {
     showAlert();
   }
 });
});