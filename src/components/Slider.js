import React, { useEffect, useRef } from "react";
import { loadEsriModules } from "../utils/loader";

export default function Slider({ handleDistanceSliderChange }) {
    const sliderRef = useRef()

    useEffect(() => {
        // Use esri-loader to load the ArcGIS JS API Web map:
        loadEsriModules(["esri/widgets/Slider"])
        .then(([Slider]) => {

            const labelDistance = function(value, type) {
                return `${(value/1000).toFixed(1)} km`;
            }
    
            const distanceSlider = new Slider({
                container: sliderRef.current,
                min: 0,
                max: 200000,
                draggableSegmentsEnabled: false,
                visibleElements: {
                    labels: true,
                    rangeLabels: false
                },
                inputFormatFunction: labelDistance,
                labelFormatFunction: labelDistance
            });
            distanceSlider.values = [0,200000]
        
            distanceSlider.on(['thumb-change', 'thumb-drag'], () =>  {
                handleDistanceSliderChange(distanceSlider.values[0], distanceSlider.values[1]);
            });

        })
    // eslint-disable-next-line 
    }, [])

    return (
        <div>
            <br></br>
            <div style={{width: '400px'}} id='distance-slider' ref={sliderRef} />
            <br></br>
        </div>
    );
}
