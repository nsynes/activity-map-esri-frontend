import React, { useState, useEffect } from "react";

import Map from "./Map";
import MenuButton from "./MenuButton";
import Panel from "./Panel";
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import Slider from "./Slider";
import useQueryString from "../utils/useQueryString";


function Main() {

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const allActivityTypes = ['Ride','Hike','Walk','Run','Swim']

  const [filterText, setFilterText] = useQueryString("s");

  const [distanceSliderLimits, setDistanceSliderLimits] = useState([0,200000]);

  const [menuPanelVisibility, setMenuPanelVisibility] = useState(true);

  const [zoomTo, setZoomTo] = useState(false);

  const [basemap, setBasemap] = useQueryString("basemap", "hybrid");

  var [activityTypes, setActivityType] = useQueryString('types', ['Ride','Hike','Walk','Run','Swim']);

  if (typeof(activityTypes) === 'string') activityTypes = [activityTypes]

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

  function handleActivityTypeChange(event) {
      setActivityType(event.target.value);
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
              <InputLabel id="demo-mutiple-name-label">Basemap</InputLabel>
              <Select value={basemap} onChange={handleBasemapChange}>
                {basemapMenuItems}
              </Select>
              <br></br>
              <br></br>
              <InputLabel id="demo-mutiple-name-label">Search terms</InputLabel>
              <TextField
                placeholder='keywords'
                name="name-filter"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)} />
              <br></br>
              <br></br>
              <InputLabel id="demo-mutiple-name-label">Activity type</InputLabel>
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                value={activityTypes}
                onChange={handleActivityTypeChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <div className="">
                    {selected.map((value) => (
                      <Chip key={value} label={value} className="" />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {allActivityTypes.map((type) => (
                  <MenuItem key={type} value={type} style={{}}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              <br></br>
              <br></br>
              <br></br>
              <InputLabel id="demo-mutiple-name-label">Activity distance</InputLabel>
              <br />
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
          activityTypes={activityTypes}
          zoomTo={zoomTo}
          setZoomTo={setZoomTo}
          basemap={basemap}
          handleDistanceSliderChange={handleDistanceSliderChange} />
    </div>
  );
}

export default Main;
