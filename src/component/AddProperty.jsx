import React, { useState, useRef } from 'react';
import axios from 'axios';
import BaseApi from '../utils/BaseAPI';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { jwtDecode } from 'jwt-decode';

//google map API library
const libraries = ['places'];
const API_KEY = 'AIzaSyAyy8CB38wO_EDwAG8bO_WuKrO46JrvKt0'
function AddProperty() {
  //initial property state
  const [property, setProperty] = useState({
    bedrooms: 0,
    bathrooms: 0,
    summary: "",
    displayAddress: "",
    latitude: 0.0,
    longitude: 0.0,
    amount: 0.0,
    currencyCode: "£",
    premiumListing: false,phoneNumber: "",
    
  })

  // selected image to upload
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const searchBoxRef = useRef(null);// store the Google Maps SearchBox

  //input change for form fields and update property state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty(prevState => ({ ...prevState, [name]: value }));
  };


  //checkbox change and update state
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProperty(prevState => ({ ...prevState, [name]: checked }));
  };

  //place selection in Google Maps SearchBox

  const handlePlaceChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setProperty(prevState => ({
        ...prevState,
        displayAddress: place.formatted_address || place.name,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      }));
    }
  };

  //previewImages before uploading

  //file selection "images" for upload and generate preview URLs
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };

  // form submission to add property
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const decodedEmail = decoded.email;

    const formData = new FormData();
    formData.append('bedrooms', property.bedrooms);
    formData.append('bathrooms', property.bathrooms);
    formData.append('summary', property.summary);
    formData.append('displayAddress', property.displayAddress);
    formData.append('latitude', property.latitude);
    formData.append('longitude', property.longitude);
    formData.append('amount', property.amount);
    formData.append('currencyCode', property.currencyCode);
    formData.append('premiumListing', property.premiumListing);
    formData.append('email', decodedEmail);
    formData.append('phoneNumber', property.phoneNumber); 

    for (let i = 0; i < selectedImages.length; i++) {
      formData.append('images', selectedImages[i]);
    }

    try {
      await axios.post(`${BaseApi}/properties/useraddproperty`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Property added successfully!');
    } catch (error) {
      toast.error('Error adding property: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <Container style={{ backgroundColor: "white" }}>
      <h2>Add New Property</h2>
      <LoadScript googleMapsApiKey={`${API_KEY}`} libraries={libraries}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Display Address</Form.Label>
                <StandaloneSearchBox
                  onLoad={ref => (searchBoxRef.current = ref)}
                  onPlacesChanged={handlePlaceChanged}
                >
                  <Form.Control
                    type="text"
                    name="displayAddress"
                    value={property.displayAddress}
                    placeholder="Enter location"
                    onChange={(e) => setProperty(prev => ({ ...prev, displayAddress: e.target.value }))}
                    required
                  />
                </StandaloneSearchBox>
              </Form.Group>

              <Form.Group>
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  name="bedrooms"
                  value={property.bedrooms}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  name="bathrooms"
                  value={property.bathrooms}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  name="summary"
                  value={property.summary}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label> {/* Phone Number field */}
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={property.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name="latitude"
                  value={property.latitude}
                  readOnly
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name="longitude"
                  value={property.longitude}
                  readOnly
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Price Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={property.amount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              

              <Form.Group>
                <Form.Label>Currency Code</Form.Label>
                <Form.Control
                  type="text"
                  name="currencyCode"
                  value={property.currencyCode}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Premium Listing"
                  name="premiumListing"
                  checked={property.premiumListing}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Upload Images</Form.Label>
                <Form.Control type="file" multiple onChange={handleFileChange} />
                {previewImages.map((imgSrc, index) => (
                  <img key={index} src={imgSrc} alt="preview" style={{ width: "100px", height: "100px", margin: "10px" }} />
                ))}
              </Form.Group>
            </Col>
            
          </Row>

          <Button type="submit">Add Property</Button>
        </Form>
      </LoadScript>
      <ToastContainer />
    </Container>
  )
}

export default AddProperty;
