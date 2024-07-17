import React, { useState } from "react";
import { GoogleMap, LoadScript, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import "../location/locationModal.scss";

const libraries = ["places"];

const LocationModal = ({ isOpen, onClose, onSelectPlace }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [place, setPlace] = useState(null);

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: "", // replace with actual api key
    libraries,
  });

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const selectedPlace = autocomplete.getPlace();
      setPlace(selectedPlace);
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const handleSelectPlace = () => {
    onSelectPlace(place);
    onClose();
  };

  if (!isLoaded) return <div>Loading...</div>

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input type="text" placeholder="Search for a place" />
            </Autocomplete>
          <button onClick={handleSelectPlace}>Select Place</button>
        </div>
      </div>
    )
  );
};

export default LocationModal;
