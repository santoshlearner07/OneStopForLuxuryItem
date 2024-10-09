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
  const [loading, setLoading] = useState(true);
 // Toast notifications for user feedback
  const userLogin = () => toast.warning("Please login to save your searches");
  const allSearchSaved = () => toast.success("Search Saved");

  // useEffect to apply filters when properties or filters change
  useEffect(() => {
    if (props.properties.length) {
      setLoading(true);
      applyFilters(filters, priorities);
      setLoading(false);
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

  const applyFilters = (currentFilters, currentPriorities, currentListingType) => {
    let filtered = props.properties || [];
    const { address, bedrooms, bathrooms, minPrice, maxPrice } = currentFilters;
    const { bedroomsPriority, bathroomsPriority, pricePriority } = currentPriorities;

    // Address filter (if provided)
    if (address) {
        filtered = filtered.filter(property =>
            property.displayAddress?.toLowerCase().includes(address.toLowerCase())
        );
    }

    const priorityLevels = ['1', '2', '3'];
    let matchedProperties = [];

    // Apply filters based on priorities
    for (const priority of priorityLevels) {
        let tempFiltered = [...filtered];

        // Check bedrooms based on current priority
        if (bedrooms && bedroomsPriority === priority) {
            tempFiltered = tempFiltered.filter(property => property.bedrooms === Number(bedrooms));
        }

        // Check bathrooms based on current priority
        if (bathrooms && bathroomsPriority === priority) {
            tempFiltered = tempFiltered.filter(property => property.bathrooms === Number(bathrooms));
        }

        // Check price based on current priority
        if (pricePriority === priority) {
            tempFiltered = tempFiltered.filter(property => {
                const price = property.price?.amount;
                const min = Number(minPrice) || 0;
                const max = Number(maxPrice) || Infinity;
                return price !== undefined && price >= min && price <= max;
            });
        }

        // Apply listing type filter (General or Premium)
        if (currentListingType) {
            tempFiltered = tempFiltered.filter(property =>
                currentListingType === 'premium' ? property.premiumListing : !property.premiumListing
            );
        }

        // If there are any matches, set them as the matched properties
        if (tempFiltered.length > 0) {
            matchedProperties = tempFiltered;
            break; // Exit the loop when we find properties for a priority
        }
    }

    // If no properties were matched, fallback to showing all filtered properties
    setFilteredProperties(matchedProperties.length > 0 ? matchedProperties : filtered);
};

  // Handle input changes
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
      {loading?(
        <p>Loading Properties...</p>
      ):(
        
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
            <Button variant="warning" onClick={handleSaveAll}>Save All Filters</Button>
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
      
    )}
      <ToastContainer />
    </Container>
  );
}

export default Product;
