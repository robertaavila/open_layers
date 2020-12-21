window.onload = init;

function init() {
    const map = new ol.Map({
        view: new ol.View({
            center: [-5381166.791276408, -1187118.4053971656],
            zoom: 4,
            maxZoom: 10,
            minZoom: 4, 
            rotation: 0    
        }),
        target: 'js-map'
    })
    //map.on('click', function(e){
    //    console.log(e.coordinate);
    //})

    //base maps
    const openstreetmapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: false,
        title: 'OSMStandard'
    })

    const openStreetMapHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: true,
        title: 'OSMHumanitarian'
    })

    const stamenTerrain = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
            attributions: 'Map tiles by Stamen Design'
        }),
        visible: false,
        title: 'StamenTerrain'
    })
    //Layer Group
    const baseLayerGroup = new ol.layer.Group ({
        layers: [
            openstreetmapStandard,
            openStreetMapHumanitarian,
            stamenTerrain
        ]
    })
    map.addLayer(baseLayerGroup);

    //Layer Switcher Logic
    const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');
    for (let baseLayerElement of baseLayerElements) {
        baseLayerElement.addEventListener('change', function(){
            let baseLayerElementValue = this.value;
            baseLayerGroup.getLayers().forEach(function(element, index, array) {
                let baseLayerTitle = (element.get('title'));
                element.setVisible(baseLayerTitle === baseLayerElementValue);
                //console.log("baseLayerTitle " + baseLayerTitle + "BaseLayerElementValue " + baseLayerElementValue);
            });
        })
    }

    //Vector layers

    const fillStyle = new ol.style.Fill({
        color: [84,118, 255, 1]
    }) 

    const strokeStyle = new ol.style.Stroke({
        color: [46, 45, 45, 1],
        width: 1.2
    }) 

    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 7,
        stroke: strokeStyle
    })

    const BrasilGeoJson = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/vector_data/brasil_vectors.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'brasil_vectors',
        style: new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle,
            image: circleStyle
        })
    })
    map.addLayer(BrasilGeoJson);

    //Vector Feature Popup Logic

    const overlayContainerElement = document.querySelector('.overlay-container');
    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
    })
    map.addOverlay(overlayLayer);
    let overlayFeatureName = document.getElementById('feature-name');
    let overlayFeatureAdditionalInfo = document.getElementById('feature-additional-info');

    map.on('click', function(e){
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            let clickedCoordinate = e.coordinate;
            let clickedFeatureName = feature.get('name');
            let clickedFeaturedAditionalInfo = feature.get('additionalinfo');
            console.log(clickedFeatureName, clickedFeaturedAditionalInfo);
            overlayLayer.setPosition(clickedCoordinate);
            overlayFeatureName.innerHTML = clickedFeatureName;
            overlayFeatureAdditionalInfo = clickedFeaturedAditionalInfo;
        })
    })

}