import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Tooltip, OverlayTrigger, Card } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import BaseApi from '../utils/BaseAPI';
import FilteredProperties from './FilteredProperties';
import FetchPreviousSearches from './FetchPreviousSearches';

function Product(props) {
  const [filters, setFilters] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: '',
  });
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [pastSearch, setPastSearch] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (props.properties.length) {
      applyFilters(filters);
    }
  }, [filters, props.properties]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.email;

      axios.get(`${BaseApi}/getUserSearch?email=${decodedEmail}`)
        .then(res => setPastSearch(res.data.searchData || []))
        .catch(err => console.error('Error fetching user search data:', err));
    }
  }, []);

  const applyFilters = (currentFilters) => {
    let filtered = props.properties || [];

    if (!Array.isArray(filtered)) {
      console.error('Expected an array for properties, got:', filtered);
      return;
    }

    const { address, bedrooms, bathrooms, minPrice, maxPrice } = currentFilters;
    const inputAddress = address?.trim().toLowerCase();

    if (inputAddress) {
      filtered = filtered.filter(property => {
        const propertyAddress = property.displayAddress || '';
        const normalizedPropertyAddress = propertyAddress.trim().toLowerCase();
        return normalizedPropertyAddress.includes(inputAddress);
      });
    }

    if (bedrooms) {
      filtered = filtered.filter(property => property.bedrooms <= Number(bedrooms));
    }

    if (bathrooms) {
      filtered = filtered.filter(property => property.bathrooms <= Number(bathrooms));
    }

    filtered = filtered.filter(property => {
      const propertyPrice = property.price?.amount || 0;
      let priceMatch = true;

      if (minPrice && maxPrice) {
        priceMatch = propertyPrice >= Number(minPrice) && propertyPrice <= Number(maxPrice);
      } else if (minPrice) {
        priceMatch = propertyPrice >= Number(minPrice);
      } else if (maxPrice) {
        priceMatch = propertyPrice <= Number(maxPrice);
      }
      return priceMatch;
    });

    setFilteredProperties(filtered);
  };

  const handleInputChange = (e, filterType) => {
    const value = e.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.email;
      localStorage.setItem('email', decodedEmail);

      if (!filters.address.trim()) {
        alert('Cannot search empty address');
        return;
      }

      const savingSearch = {
        email: decodedEmail,
        searchData: filters.address
      };

      axios.post(`${BaseApi}/saveSearch`, savingSearch)
        .then(res => console.log('Search saved:', res))
        .catch(err => {
          console.error('Error saving search:', err);
        });
    } else {
      console.log("No token found");
    }
  };

  const handleSaveAll = () => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.email;

      const savingData = {
        email: decodedEmail,
        filters: [{
          address: filters.address,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        }]
      };

      axios.post(`${BaseApi}/saveAllUserInputs`, savingData)
        .then(res => console.log('All user inputs saved:', res))
        .catch(err => {
          if (err.response.status === 404) {
            alert('User not found. Please create an account to save your data.');
          } else {
            console.error('Error saving all user inputs:', err);
          }
        });
    } else {
      console.log("No token found");
    }
  };

  const handleFocus = () => {
    setIsFocus(true);
    setShowTooltip(true);

    setTimeout(() => setShowTooltip(false), 5000);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {pastSearch.length > 0 ? (
        <ul>
          {pastSearch.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      ) : (
        <span>No previous searches</span>
      )}
    </Tooltip>
  );

  if (props.loading) {
    return <h1 className='text-center mt-5 mb-5'>Loading...</h1>;
  }

  if (props.errMsg) {
    return <h1 className='text-center mt-5 mb-5'>Error: {props.errMsg}</h1>;
  }

  return (
    <Container>
      <h1>Property</h1>
      {props.properties && (
        <Row>
          <Col sm={3} style={{ backgroundColor: 'black', color: "whitesmoke" }}>
            <Form onSubmit={handleSearch}>
              <Form.Group>
                <Button type="submit" className='mt-2'>Search Address</Button>
                <OverlayTrigger
                  placement="bottom"
                  overlay={renderTooltip}
                  show={showTooltip && isFocus} // Show the tooltip based on state
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={filters.address}
                    onChange={(e) => handleInputChange(e, 'address')}
                    onFocus={handleFocus}
                  />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group>
                <Form.Label>Price Range</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => handleInputChange(e, 'minPrice')}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => handleInputChange(e, 'maxPrice')}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter maximum number of bedrooms"
                  value={filters.bedrooms}
                  onChange={(e) => handleInputChange(e, 'bedrooms')}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter maximum number of bathrooms"
                  value={filters.bathrooms}
                  onChange={(e) => handleInputChange(e, 'bathrooms')}
                />
              </Form.Group>
              <Button onClick={handleSaveAll} className='mt-2'>Save All User Inputs</Button>
              <FetchPreviousSearches />
            </Form>
          </Col>
          <Col>
            <FilteredProperties filteredProperties={filteredProperties} />
          </Col>
        </Row>
      )}
      {!props.properties && <div>No data to display</div>}
    </Container>
  );
}

export default Product;
