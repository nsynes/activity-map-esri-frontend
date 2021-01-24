import React, { useState, useEffect } from "react";

import Map from "./Map";
import MenuButton from "./MenuButton";
import Panel from "./Panel";
import TextField from '@material-ui/core/TextField';
import Slider from "./Slider";
import useQueryString from "../utils/useQueryString";


function Main() {

  const [filterText, setFilterText] = useQueryString("s");

  const [distanceSliderLimits, setDistanceSliderLimits] = useState([0,200000]);

  const [menuPanelVisibility, setMenuPanelVisibility] = useState(true);

  const [zoomTo, setZoomTo] = useState(false);

  useEffect(() => {
    if ( filterText ) {
      setZoomTo(true)
    }
  }, [])

  function handleMenuButtonClick() {
    setMenuPanelVisibility(!menuPanelVisibility);
  }

  function handleDistanceSliderChange(min, max) {
    setDistanceSliderLimits([min, max])
  }

  return (
    <div className="App">
      <MenuButton
        onClick={handleMenuButtonClick} />
        <Panel
          visible={menuPanelVisibility} >
          <br></br>
          <div style={{fontWeight: 'bold'}}>Activity filtering</div>
          <br></br>
          <TextField
            placeholder='keywords'
            name="name-filter"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)} />
          <br></br>
          <br></br>
          <button onClick={() => setZoomTo(true)}>Zoom to</button>
          {false && <Slider
            distanceSliderLimits={distanceSliderLimits}
            handleDistanceSliderChange={handleDistanceSliderChange} />}
        </Panel>
        <Map
          filterText={filterText}
          distanceSliderLimits={distanceSliderLimits}
          zoomTo={zoomTo}
          setZoomTo={setZoomTo}
          handleDistanceSliderChange={handleDistanceSliderChange} />
    </div>
  );
}

export default Main;
