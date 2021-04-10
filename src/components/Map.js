import React, { useEffect, useState, useRef } from "react";
import { loadEsriModules } from "../utils/loader";

export default function Map({ filterText, zoomTo, setZoomTo, distanceSliderLimits, basemap, handleDistanceSliderChange }) {
  const mapRef = useRef();
  const [view, setView] = useState(null);

  useEffect(() => {
    loadEsriModules(["esri/Map", "esri/views/MapView", "esri/views/SceneView", "esri/layers/GeoJSONLayer"])
    .then(([Map, MapView, SceneView, GeoJSONLayer]) => {
        if (!mapRef) {
          // component or app was likely destroyed
          return;
        }
        
        const map = new Map({
          basemap: basemap,
          ground: "world-elevation"
        });

        const view = new SceneView({
          container: mapRef.current,
          map: map,
          camera: {
              position: [-1,50, 200000],
              heading: 0,
              tilt: 30
            }
        });

        const geoJSONLayer = new GeoJSONLayer({
          url: "https://activity-mapping.s3.eu-west-2.amazonaws.com/nick.json",
          title: "Activities",
            fields: [
              { "name": "name", "type": "string" },
              { "name": "type", "type": "string" },
              { "name": "distance", "type": "double" },
              { "name": "timestamp", "type": "date" }
            ],
            outFields: ["*"],
            popupTemplate: {
              title: "Activity Details",
              content: [{//"<b>Activity</b>: {type}<br/><b>Name</b>: {name}<br/><b>Distance</b>: {distance}<br/>"
                type: "fields",
                fieldInfos: [{
                  fieldName: "timestamp",
                  label: "Date",
                  format: {
                    dateFormat: 'long-date'
                  }
                }, {
                  fieldName: "name",
                  label: "Activity Name",
                }, {
                  fieldName: "type",
                  label: "Activity Type",
                }, {
                  fieldName: "expression/distance",
                  format: {
                    digitSeparator: true,
                    places: 1
                  }
                }]
              }],
              expressionInfos: [{
                name: "distance",
                title: "Distance (km)",
                expression: "$feature.distance/1000"
              }]
            },
            renderer: {
              type: "unique-value",
              field: "type",
              defaultSymbol: {
                type: "simple-line",
                color: "#000000",
                width: 2,
                style: "solid"
              },
              defaultLabel: "Other activity",
              uniqueValueInfos: [
                {
                  value: "Hike",
                  symbol: {
                    type: "simple-line",
                    color: "#ff0000",
                    width: 2,
                    style: "solid"
                  },
                  label: "Hike"
                },
                {
                  value: "Ride",
                  symbol: {
                    type: "simple-line",
                    color: "#ffa500",
                    width: 2,
                    style: "solid"
                  },
                  label: "Ride"
                },
                {
                  value: "Run",
                  symbol: {
                    type: "simple-line",
                    color: "#0000ff",
                    width: 2,
                    style: "solid"
                  },
                  label: "Run"
                }
              ]
            }
        });

        map.add(geoJSONLayer);

        geoJSONLayer.on("edits", function(event) {
          console.log('edits')
        })

        view.ui.move('zoom', 'top-right');
        view.ui.move('navigation-toggle', 'top-right');
        view.ui.move('compass', 'top-right');

        view.when(() => {
          //view.extent = geoJSONLayer.fullExtent;
          setView(view);
        });

        view.whenLayerView(geoJSONLayer).then(function (layerview) {
          handleDistanceSliderChange(0,200000);
        });

        view.on("click", function (evt) {  
          // Search for symbols on click's position
          view.hitTest(evt.screenPoint)
            .then(function(response){
              // Retrieve the first symbol
              var graphic = response.results && response.results[0] && response.results[0].graphic ? response.results[0].graphic : null;
              if (graphic) {
                // We now have access to its attributes
                console.log(graphic.attributes);
              }
            });
        }); 

      }
    );

    return () => {
      setView(null);
    };
  // eslint-disable-next-line 
  }, []);

  
  useEffect(() => {
    if ( view && view.map ) {
      view.map.basemap = basemap
    }
    
  // eslint-disable-next-line 
  }, [basemap, view])

  useEffect(() => {
    if ( zoomTo && view && view.map && view.map.layers && view.map.layers.items[0]) {
      view.map.layers.items[0].queryExtent().then(function(results) {
        view.goTo(results.extent, {speedFactor: 100});
      })
      setZoomTo(false)
    }
  // eslint-disable-next-line 
  }, [zoomTo, view])

  useEffect(() => {
    if ( view && view.map && view.map.layers && view.map.layers.items[0]) {
      var sqlExpression;
      if ( filterText ) {
        sqlExpression = 
        `distance >= ${distanceSliderLimits[0]} AND
        distance <= ${distanceSliderLimits[1]} AND
        LOWER(name) LIKE '%${[...filterText.toLowerCase()].join('%')}%'`
      } else {
        sqlExpression = 
        `distance >= ${distanceSliderLimits[0]} AND
        distance <= ${distanceSliderLimits[1]}`
      }
      view.map.layers.items[0].definitionExpression = sqlExpression
    }
  }, [distanceSliderLimits, filterText, view])

  return <div className="map" ref={mapRef} />;
}
