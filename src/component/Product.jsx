import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import BaseApi from '../utils/BaseAPI';
import FilteredProperties from './FilteredProperties';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Product(props) {
  const emptySearch = () => toast.warning("Cannot search empty address");

  const [isFocus, setIsFocus] = useState(false);
  const [filters, setFilters] = useState({
    address: '',
    bedrooms: [],
    lessThan5Bedrooms: false,
    moreThan5Bedrooms: false,
    bathrooms: [],
    lessThan5Bathrooms: false,
    moreThan5Bathrooms: false,
    minPrice: '',
    maxPrice: '',
  });
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [pastSearch, setPastSearch] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.email;
      localStorage.setItem('email', decodedEmail);

      axios.get(`${BaseApi}/getUserPreferences?email=${decodedEmail}`)
        .then(res => {
          const userFilters = res.data.filters;
          setFilters(userFilters);
          applyFilters(userFilters);
        })
        .catch(err => console.error('Error fetching user preferences:', err));
    }
  }, [props.properties]);

  useEffect(() => {
    applyFilters(filters); // Apply filters whenever the filters state changes
  }, [filters, props.properties]);

  const applyFilters = (currentFilters) => {
    let filtered = props.properties;

    if (!Array.isArray(filtered)) {
      console.error('Expected an array for properties, got:', filtered);
      return;
    }

    const {
      address, bedrooms, lessThan5Bedrooms, moreThan5Bedrooms,
      bathrooms, lessThan5Bathrooms, moreThan5Bathrooms,
      minPrice, maxPrice
    } = currentFilters;

    const inputAddress = address?.trim().toLowerCase();
    if (inputAddress) {
      console.log(inputAddress)
      filtered = filtered.filter(property => {
        const propertyAddress = property.displayAddress || '';
        const normalizedPropertyAddress = propertyAddress.trim().toLowerCase();
        return normalizedPropertyAddress.includes(inputAddress);
      });
    }
    // console.log(filtered)
    filtered = filtered.filter(property => {
      let bedroomMatch = true;

      if (lessThan5Bedrooms) {
        bedroomMatch = property.bedrooms < 5;
      } else if (moreThan5Bedrooms) {
        bedroomMatch = property.bedrooms >= 5;
      } else if (bedrooms.length > 0) {
        bedroomMatch = bedrooms.includes(property.bedrooms);
      }

      return bedroomMatch;
    });

    filtered = filtered.filter(property => {
      let bathroomMatch = true;

      if (lessThan5Bathrooms) {
        bathroomMatch = property.bathrooms < 5;
      } else if (moreThan5Bathrooms) {
        bathroomMatch = property.bathrooms >= 5;
      } else if (bathrooms.length > 0) {
        bathroomMatch = bathrooms.includes(property.bathrooms);
      }

      return bathroomMatch;
    });

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

  const handleAddressChange = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      address: e.target.value
    }));
  };

  const handleCheckboxChange = (e, filterType, value) => {
    const isChecked = e.target.checked;

    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };

      if (filterType === 'bedrooms') {
        if (isChecked) {
          updatedFilters.bedrooms = [...updatedFilters.bedrooms, value];
        } else {
          updatedFilters.bedrooms = updatedFilters.bedrooms.filter(val => val !== value);
        }
      } else if (filterType === 'bathrooms') {
        if (isChecked) {
          updatedFilters.bathrooms = [...updatedFilters.bathrooms, value];
        } else {
          updatedFilters.bathrooms = updatedFilters.bathrooms.filter(val => val !== value);
        }
      } else if (filterType === 'lessThan5Bedrooms') {
        updatedFilters.lessThan5Bedrooms = isChecked;
        if (isChecked) {
          updatedFilters.moreThan5Bedrooms = false;
          updatedFilters.bedrooms = updatedFilters.bedrooms.filter(val => val < 5);
        }
      } else if (filterType === 'moreThan5Bedrooms') {
        updatedFilters.moreThan5Bedrooms = isChecked;
        if (isChecked) {
          updatedFilters.lessThan5Bedrooms = false;
          updatedFilters.bedrooms = updatedFilters.bedrooms.filter(val => val >= 5);
        }
      } else if (filterType === 'lessThan5Bathrooms') {
        updatedFilters.lessThan5Bathrooms = isChecked;
        if (isChecked) {
          updatedFilters.moreThan5Bathrooms = false;
          updatedFilters.bathrooms = updatedFilters.bathrooms.filter(val => val < 5);
        }
      } else if (filterType === 'moreThan5Bathrooms') {
        updatedFilters.moreThan5Bathrooms = isChecked;
        if (isChecked) {
          updatedFilters.lessThan5Bathrooms = false;
          updatedFilters.bathrooms = updatedFilters.bathrooms.filter(val => val >= 5);
        }
      }

      saveFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.email;
      localStorage.setItem('email', decodedEmail);

      if (!filters.address.trim()) {
        emptySearch();
        return;
      }

      const savingSearch = {
        email: decodedEmail,
        searchData: filters.address
      };
      axios.post(`${BaseApi}/saveSearch`, savingSearch)
        .then(res => console.log(res))
        .catch(err => {
          emptySearch();
          console.error('Error saving search:', err);
        });
    } else {
      console.log("No token found");
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {pastSearch && pastSearch.map((item, index) => <li key={index}>{item}</li>)}
    </Tooltip>
  );

  const handleFocus = () => {
    setIsFocus(true);
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.email;

      axios.get(`${BaseApi}/getUserSearch?email=${decodedEmail}`)
        .then(res => setPastSearch(res.data.searchData))
        .catch(err => console.error('Error fetching user search data:', err));
    }

    setTimeout(() => setIsFocus(false), 3000);
  };

  const increasePrice = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      minPrice: (parseInt(prevFilters.minPrice) || 0) + 5000
    }));
  };

  const saveFilters = (filters) => {
    const email = localStorage.getItem('email');
    axios.post(`${BaseApi}/savePreferences`, { email, filters })
      .then(res => console.log('Filters saved:', res.data))
      .catch(err => console.error('Error saving filters:', err));
  };

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
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Search Address</Form.Label>
                <OverlayTrigger
                  placement="bottom"
                  overlay={renderTooltip}
                  trigger="click"
                  show={isFocus}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={filters.address}
                    onChange={handleAddressChange}
                    onFocus={handleFocus}
                  />
                </OverlayTrigger>
              </Form.Group>
              <Button type="submit" className='mt-2'>Search Address</Button>
            </Form>
            <Form.Group>
              <Form.Label>Price Range</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </Col>
                <Button onClick={increasePrice} className='mt-2'>Increase</Button>
              </Row>
            </Form.Group>
            <Form>
              <Form.Group>
                <Form.Label>Bedrooms</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="1"
                  value={1}
                  checked={filters.bedrooms.includes(1)}
                  onChange={(e) => handleCheckboxChange(e, 'bedrooms', 1)}
                />
                <Form.Check
                  type="checkbox"
                  label="2"
                  value={2}
                  checked={filters.bedrooms.includes(2)}
                  onChange={(e) => handleCheckboxChange(e, 'bedrooms', 2)}
                />
                <Form.Check
                  type="checkbox"
                  label="3"
                  value={3}
                  checked={filters.bedrooms.includes(3)}
                  onChange={(e) => handleCheckboxChange(e, 'bedrooms', 3)}
                />
                <Form.Check
                  type="checkbox"
                  label="Less than 5 Bedrooms"
                  checked={filters.lessThan5Bedrooms}
                  onChange={(e) => handleCheckboxChange(e, 'lessThan5Bedrooms')}
                />
                <Form.Check
                  type="checkbox"
                  label="More than 5 Bedrooms"
                  checked={filters.moreThan5Bedrooms}
                  onChange={(e) => handleCheckboxChange(e, 'moreThan5Bedrooms')}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bathrooms</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="1"
                  value={1}
                  checked={filters.bathrooms.includes(1)}
                  onChange={(e) => handleCheckboxChange(e, 'bathrooms', 1)}
                />
                <Form.Check
                  type="checkbox"
                  label="2"
                  value={2}
                  checked={filters.bathrooms.includes(2)}
                  onChange={(e) => handleCheckboxChange(e, 'bathrooms', 2)}
                />
                <Form.Check
                  type="checkbox"
                  label="3"
                  value={3}
                  checked={filters.bathrooms.includes(3)}
                  onChange={(e) => handleCheckboxChange(e, 'bathrooms', 3)}
                />
                <Form.Check
                  type="checkbox"
                  label="Less than 5 Bathrooms"
                  checked={filters.lessThan5Bathrooms}
                  onChange={(e) => handleCheckboxChange(e, 'lessThan5Bathrooms')}
                />
                <Form.Check
                  type="checkbox"
                  label="More than 5 Bathrooms"
                  checked={filters.moreThan5Bathrooms}
                  onChange={(e) => handleCheckboxChange(e, 'moreThan5Bathrooms')}
                />
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <FilteredProperties filteredProperties={filteredProperties} />
          </Col>
        </Row>
      )}
      {!props.properties && <div>No data to display</div>}
      <ToastContainer />
    </Container>
  );
}

export default Product;
