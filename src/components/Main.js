import React, { useState, useEffect } from "react";

import Map from "./Map";
import MenuButton from "./MenuButton";
import Panel from "./Panel";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from "./Slider";
import useQueryString from "../utils/useQueryString";


function Main() {

  const [filterText, setFilterText] = useQueryString("s");

  const [distanceSliderLimits, setDistanceSliderLimits] = useState([0,200000]);

  const [menuPanelVisibility, setMenuPanelVisibility] = useState(true);

  const [zoomTo, setZoomTo] = useState(false);

  const [basemap, setBasemap] = useQueryString("basemap", "hybrid");

  useEffect(() => {
    if ( filterText ) {
      setZoomTo(true)
    }
  // eslint-disable-next-line 
  }, [])

  function handleMenuButtonClick() {
    setMenuPanelVisibility(!menuPanelVisibility);
  }

  function handleDistanceSliderChange(min, max) {
    setDistanceSliderLimits([min, max])
  }

  function handleBasemapChange(event) {
    setBasemap(event.target.value)
  }

  const basemapOptions = ["topo","streets","satellite","hybrid","national-geographic","osm"]
  const basemapMenuItems = basemapOptions.map(bm => <MenuItem value={bm} key={bm}>{bm}</MenuItem>)

  return (
    <div className="App">
      <MenuButton
        onClick={handleMenuButtonClick} />
        <Panel
          visible={menuPanelVisibility} >
          {menuPanelVisibility &&
            <div>
              <br></br>
              <b>Basemap</b>:&nbsp;&nbsp;&nbsp;
              <Select value={basemap} onChange={handleBasemapChange}>
                {basemapMenuItems}
              </Select>
              <br></br>
              <br></br>
              <TextField
                placeholder='keywords'
                name="name-filter"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)} />
              <br></br>
              <br></br>
              <br></br>
              <Slider
                distanceSliderLimits={distanceSliderLimits}
                handleDistanceSliderChange={handleDistanceSliderChange} />
              <br></br>
              <br></br>
              <button onClick={() => setZoomTo(true)}>Zoom to</button>
            </div>
          }
        </Panel>
        <Map
          filterText={filterText}
          distanceSliderLimits={distanceSliderLimits}
          zoomTo={zoomTo}
          setZoomTo={setZoomTo}
          basemap={basemap}
          handleDistanceSliderChange={handleDistanceSliderChange} />
    </div>
  );
}

export default Main;
