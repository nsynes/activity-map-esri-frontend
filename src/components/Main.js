import React, { useState } from "react";

import Map from "./Map";
import MenuButton from "./MenuButton";
import Panel from "./Panel";
import TextField from '@material-ui/core/TextField';
import Slider from "./Slider";

function Main() {

  const [distanceSliderLimits, setDistanceSliderLimits] = useState([0,200000]);

  const [menuPanelVisibility, setMenuPanelVisibility] = useState(true);

  const [filterText, setFilterText] = useState('');

  const [zoomTo, setZoomTo] = useState(false);

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
