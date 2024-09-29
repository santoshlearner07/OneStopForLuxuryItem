import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import BaseApi from '../utils/BaseAPI';
import FilteredProperties from './FilteredProperties';
// import FetchPreviousSearches from './FetchPreviousSearches';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchPreviousSearches from './FetchPreviousSearches';

function Product(props) {
  // All initial states
  const [filters, setFilters] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: '',
  });
  const [priorities, setPriorities] = useState({
    bedroomsPriority: '',
    bathroomsPriority: '',
    pricePriority: '',
  });
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [pastSearch, setPastSearch] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
 // Toast notifications for user feedback
  const userLogin = () => toast.warning("Please login to save your searches");
  const allSearchSaved = () => toast.success("Search Saved");

  // useEffect to apply filters when properties or filters change
  useEffect(() => {
    if (props.properties.length) {
      applyFilters(filters, priorities);
    }
  }, [filters, priorities, props.properties]);

  // useEffect to fetch past searches for the user when the component mounts
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

   // function to apply filters to the properties
  const applyFilters = (currentFilters, currentPriorities) => {
    let filtered = props.properties || [];
  
    if (!Array.isArray(filtered)) {
      console.error('Expected an array for properties, got:', filtered);
      return;
    }
  
    const { bedrooms, bathrooms, minPrice, maxPrice } = currentFilters;
    const { bedroomsPriority, bathroomsPriority, pricePriority } = currentPriorities;
  
    // Create a list of filter criteria sorted by priority (descending)
    const sortedFilters = [
      { filter: 'bedrooms', priority: Number(bedroomsPriority), value: bedrooms },
      { filter: 'bathrooms', priority: Number(bathroomsPriority), value: bathrooms },
      { filter: 'price', priority: Number(pricePriority), min: minPrice, max: maxPrice }
    ].filter(item => item.priority > 0) 
      .sort((a, b) => b.priority - a.priority); 
  
    let results = filtered;
  
    // appply filters based on the user's criteria
    for (const { filter, value, min, max } of sortedFilters) {
      if (filter === 'bedrooms' && value) {
        const bedroomsValue = Number(value);
        if (results.length > 0) {
          // Filter properties based on exact match or less than criteria
          results = results.filter(property => {
            const propertyBedrooms = property.bedrooms || 0;
            return propertyBedrooms === bedroomsValue;
          });
        }
        if (results.length === 0) break; // If no exact match, stop further filtering
      }
  
      if (filter === 'bathrooms' && value) {
        const bathroomsValue = Number(value);
        results = results.filter(property => property.bathrooms <= bathroomsValue);
        if (results.length === 0) break; // If no match, stop further filtering
      }
  
      if (filter === 'price') {
        results = results.filter(property => {
          const propertyPrice = property.price?.amount || 0;
          let priceMatch = true;
  
          // check if the property price falls within the specified range
          if (min && max) {
            priceMatch = propertyPrice >= Number(min) && propertyPrice <= Number(max);
          } else if (min) {
            priceMatch = propertyPrice >= Number(min);
          } else if (max) {
            priceMatch = propertyPrice <= Number(max);
          }
          return priceMatch;
        });
        if (results.length === 0) break; // If no match, stop further filtering
      }
    }
  
    // Sorting the results based on the priorities
    results.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
  
      // scores adding based on the property meeting the user's filter criteria
      if (bedroomsPriority > 0 && a.bedrooms === Number(filters.bedrooms)) {
        scoreA += Number(bedroomsPriority);
      }
      if (bedroomsPriority > 0 && b.bedrooms === Number(filters.bedrooms)) {
        scoreB += Number(bedroomsPriority);
      }
  
      if (bathroomsPriority > 0 && a.bathrooms <= Number(filters.bathrooms)) {
        scoreA += Number(bathroomsPriority);
      }
      if (bathroomsPriority > 0 && b.bathrooms <= Number(filters.bathrooms)) {
        scoreB += Number(bathroomsPriority);
      }
  
      if (pricePriority > 0) {
        const priceA = a.price?.amount || 0;
        const priceB = b.price?.amount || 0;
        if (priceA >= Number(filters.minPrice) && priceA <= Number(filters.maxPrice)) {
          scoreA += Number(pricePriority);
        }
        if (priceB >= Number(filters.minPrice) && priceB <= Number(filters.maxPrice)) {
          scoreB += Number(pricePriority);
        }
      }
  
      return scoreB - scoreA; // higher score displays first
    });
  
    // update state with the filtered results
    setFilteredProperties(results);
    console.log("Final filtered and sorted properties:", results);
  };  

  // handle input changes in the filter fields
  const handleInputChange = (e, filterType) => {
    const value = e.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // handle changes in the priority fields
  const handlePriorityChange = (e, priorityType) => {
    const value = e.target.value;
    setPriorities(prevPriorities => ({
      ...prevPriorities,
      [priorityType]: value
    }));
  };

  // handle form submission to save search data
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

      // data for saving the search
      const savingSearch = {
        email: decodedEmail,
        searchData: filters.address
      };

      axios.post(`${BaseApi}/saveSearch`, savingSearch)
        .then((res) => {
          console.log('Search saved:', res);
          allSearchSaved();
        })
        .catch(err => {
          console.error('Error saving search:', err);
        });
    } else {
      userLogin();
    }
  };

  // handle save all filter inputs for the user
  const handleSaveAll = () => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.email;

      // data for all user input
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

      axios.post(`${BaseApi}/saveAllUserInputs`, savingData) // post request for saving all user input
        .then((res) => {
          console.log('All user inputs saved:', res);
          allSearchSaved();
        })
        .catch(err => {
          if (err.response.status === 404) {
            alert('User not found. Please create an account to save your data.');
          } else {
            console.error('Error saving all user inputs:', err);
          }
        });
    } else {
      userLogin();
    }
  };

  // handle focus on the address input for displaying tooltip
  const handleFocus = () => {
    setIsFocus(true);
    setShowTooltip(true);

    setTimeout(() => setShowTooltip(false), 5000);
  };

  // handle selection of prev search item
  const handleSelectSearch = (item) => {
    setFilters({
      address: item.address || '',
      bedrooms: item.bedrooms.join(', ') || '',
      bathrooms: item.bathrooms.join(', ') || '',
      minPrice: item.minPrice || '',
      maxPrice: item.maxPrice || ''
    });
  };

  // increase maxPrice by 10%
  const handleIncreaseMaxPrice = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      maxPrice: prevFilters.maxPrice ? (Number(prevFilters.maxPrice) * 1.1).toFixed(2) : ''
    }));
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {pastSearch.length > 0 ? (
        <ul>
          {pastSearch.slice(0, 5).map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      ) : (
        <span>No previous searches</span>
      )}
    </Tooltip>
  );

  return (
    <Container fluid>
      <Row>
        <Col sm={4}>
         {/* User input form for filters and priorities */}
          <Form onSubmit={handleSearch}>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <OverlayTrigger
                placement="right"
                show={isFocus && showTooltip}
                overlay={renderTooltip}
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
              <Form.Label>Bedrooms</Form.Label>
              <Form.Control
                type="number"
                placeholder="Max number of bedrooms"
                value={filters.bedrooms}
                onChange={(e) => handleInputChange(e, 'bedrooms')}
              />
              <Form.Label>Priority</Form.Label>
              <Form.Control
                type="number"
                placeholder="Priority"
                value={priorities.bedroomsPriority}
                onChange={(e) => handlePriorityChange(e, 'bedroomsPriority')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Bathrooms</Form.Label>
              <Form.Control
                type="number"
                placeholder="Max number of bathrooms"
                value={filters.bathrooms}
                onChange={(e) => handleInputChange(e, 'bathrooms')}
              />
              <Form.Label>Priority</Form.Label>
              <Form.Control
                type="number"
                placeholder="Priority"
                value={priorities.bathroomsPriority}
                onChange={(e) => handlePriorityChange(e, 'bathroomsPriority')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
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
              <Button variant="outline-secondary" onClick={handleIncreaseMaxPrice}>
                Increase Max Price by 10%
              </Button>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                type="number"
                placeholder="Priority"
                value={priorities.pricePriority}
                onChange={(e) => handlePriorityChange(e, 'pricePriority')}
              />
            </Form.Group>
            <Button type="submit" variant="primary">Save Search Address</Button>
            <Button variant="outline-primary" onClick={handleSaveAll}>Save All Filters</Button>
          </Form>
          <FetchPreviousSearches
            pastSearch={pastSearch}
            onSelectSearch={handleSelectSearch}
          />
        </Col>
        <Col sm={8}>
          <FilteredProperties
            filteredProperties={filteredProperties}
            setFilteredProperties={setFilteredProperties}
          />
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}

export default Product;
