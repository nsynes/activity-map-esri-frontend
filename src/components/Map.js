import React, { useEffect, useState, useRef } from "react";
import { loadEsriModules } from "../utils/loader";

export default function Map({ filterText, zoomTo, setZoomTo, distanceSliderLimits, handleDistanceSliderChange }) {
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
          basemap: "satellite",
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
              { "name": "distance", "type": "double" }
            ],
            renderer: {
              type: "unique-value",
              field: "type",
              defaultSymbol: {
                type: "simple-line",
                color: "#000000",
                width: 3,
                style: "solid"
              },
              defaultLabel: "Other activity",
              uniqueValueInfos: [
                {
                  value: "Hike",
                  symbol: {
                    type: "simple-line",
                    color: "#ff0000",
                    width: 3,
                    style: "solid"
                  },
                  label: "Hike"
                },
                {
                  value: "Ride",
                  symbol: {
                    type: "simple-line",
                    color: "#ffa500",
                    width: 3,
                    style: "solid"
                  },
                  label: "Ride"
                },
                {
                  value: "Run",
                  symbol: {
                    type: "simple-line",
                    color: "#0000ff",
                    width: 3,
                    style: "solid"
                  },
                  label: "Run"
                }
              ]
            }
        });

        map.add(geoJSONLayer);


        view.ui.move('zoom', 'top-right');
        view.ui.move('navigation-toggle', 'top-right');
        view.ui.move('compass', 'top-right');

        view.when(() => {
          setView(view);
        });

        view.whenLayerView(geoJSONLayer).then(function (layerview) {
          handleDistanceSliderChange(0,200000)  
          //geoJSONLayer.definitionExpression = `LOWER(name) LIKE '%h%a%d%r%i%a%n%s%' AND LOWER(name) LIKE '%w%a%l%l%'` 
        });
      }
    );

    return () => {
      setView(null);
    };
  }, []);

  useEffect(() => {
    if ( zoomTo && view && view.map && view.map.layers && view.map.layers.items[0]) {
      view.map.layers.items[0].queryExtent().then(function(results) {
        view.goTo(results.extent);
      })
    }
    setZoomTo(false)
  }, [zoomTo, view])

  useEffect(() => {
    if ( view && view.map && view.map.layers && view.map.layers.items[0]) {
      const sqlExpression = 
        `distance >= ${distanceSliderLimits[0]} AND
        distance <= ${distanceSliderLimits[1]} AND
        LOWER(name) LIKE '%${[...filterText].join('%')}%'`
      view.map.layers.items[0].definitionExpression = sqlExpression
    }
  }, [distanceSliderLimits, filterText, view])

  return <div className="map" ref={mapRef} />;
}
