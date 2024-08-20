import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Form, ListGroup, Overlay, OverlayTrigger, Popover, Row, Tooltip } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';
import BaseApi from '../utils/BaseAPI';
import FilteredProperties from './FilteredProperties';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Product(props) {
  const emptySearch = () => toast.warning("Cannot search empty address");
  const [isFocus, setIsFocus] = useState(false)
  const [filters, setFilters] = useState({
    address: '',
    bedrooms: [],
    lessThan5Bedrooms: false,
    moreThan5Bedrooms: false,
    bathrooms: [],
    lessThan5Bathrooms: false,
    moreThan5Bathrooms: false,
  });

  const [filteredProperties, setFilteredProperties] = useState([]);

  const [pastSearch, setpastSearch] = useState([]);

  useEffect(() => {
    applyFilters();
  }, [props.properties, filters]);

  const applyFilters = () => {
    let filtered = props.properties;

    if (filters.address.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.displayAddress.toLowerCase().includes(filters.address.toLowerCase())
      );
    }

    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter((item) => filters.bedrooms.includes(item.bedrooms));
    }

    if (filters.lessThan5Bedrooms) {
      filtered = filtered.filter((item) => item.bedrooms < 5);
    }

    if (filters.moreThan5Bedrooms) {
      filtered = filtered.filter((item) => item.bedrooms > 5);
    }

    if (filters.bathrooms.length > 0) {
      filtered = filtered.filter((item) => filters.bathrooms.includes(item.bathrooms));
    }

    if (filters.lessThan5Bathrooms) {
      filtered = filtered.filter((item) => item.bathrooms < 5);
    }

    if (filters.moreThan5Bathrooms) {
      filtered = filtered.filter((item) => item.bathrooms > 5);
    }

    if (filtered.length === 0) {
      if (filters.moreThan5Bedrooms && filters.bedrooms.length > 0) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          moreThan5Bedrooms: false,
        }));
      }

      if (filters.moreThan5Bathrooms && filters.bathrooms.length > 0) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          moreThan5Bathrooms: false,
        }));
      }

      if (filters.lessThan5Bedrooms && filters.moreThan5Bedrooms) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          lessThan5Bedrooms: false,
        }));
      }

      if (filters.lessThan5Bathrooms && filters.moreThan5Bathrooms) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          lessThan5Bathrooms: false,
        }));
      }
    }

    setFilteredProperties(filtered);
  };

  const handleAddressChange = (e) => {
    setFilters({ ...filters, address: e.target.value });
  };

  const handleCheckboxChange = (e, filterType, value) => {
    const isChecked = e.target.checked;

    setFilters((prevFilters) => {
      let updatedFilters = { ...prevFilters };

      if (filterType === 'bedrooms') {
        if (isChecked) {
          updatedFilters.bedrooms.push(value);
        } else {
          updatedFilters.bedrooms = prevFilters.bedrooms.filter((val) => val !== value);
        }

        if (updatedFilters.bedrooms.some((val) => val >= 5)) {
          updatedFilters.lessThan5Bedrooms = false;
        } else if (updatedFilters.lessThan5Bedrooms) {
          updatedFilters.bedrooms = updatedFilters.bedrooms.filter((val) => val < 5);
        }

        if (updatedFilters.lessThan5Bedrooms && isChecked && value >= 5) {
          updatedFilters.lessThan5Bedrooms = false;
        }
      } else if (filterType === 'bathrooms') {
        if (isChecked) {
          updatedFilters.bathrooms.push(value);
        } else {
          updatedFilters.bathrooms = prevFilters.bathrooms.filter((val) => val !== value);
        }

        // disable bathroom checkboxes when moreThan5Bedrooms is selected
        if (updatedFilters.moreThan5Bedrooms && (value === 1 || value === 2 || value === 3)) {
          return prevFilters; // Ignore selection of 1, 2, 3 bathrooms if moreThan5Bedrooms is checked
        }

      } else if (filterType === 'lessThan5Bedrooms') {
        updatedFilters.lessThan5Bedrooms = isChecked;
        if (isChecked) {
          updatedFilters.moreThan5Bedrooms = false;
          updatedFilters.bedrooms = updatedFilters.bedrooms.filter((val) => val < 5);
        }
      } else if (filterType === 'moreThan5Bedrooms') {
        updatedFilters.moreThan5Bedrooms = isChecked;
        if (isChecked) {
          updatedFilters.lessThan5Bedrooms = false;
          updatedFilters.bedrooms = updatedFilters.bedrooms.filter((val) => val >= 5);

          // disable bathroom checkboxes when moreThan5Bedrooms is selected
          updatedFilters.bathrooms = updatedFilters.bathrooms.filter((val) => val !== 1 && val !== 2 && val !== 3);
        }
      } else if (filterType === 'lessThan5Bathrooms') {
        updatedFilters.lessThan5Bathrooms = isChecked;
        if (isChecked) {
          updatedFilters.moreThan5Bathrooms = false;
          updatedFilters.bathrooms = updatedFilters.bathrooms.filter((val) => val < 5);
        }
      } else if (filterType === 'moreThan5Bathrooms') {
        updatedFilters.moreThan5Bathrooms = isChecked;
        if (isChecked) {
          updatedFilters.lessThan5Bathrooms = false;
          updatedFilters.bathrooms = updatedFilters.bathrooms.filter((val) => val >= 5);
        }
      }
      return updatedFilters;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      const decodedEmail = decoded.email
      const savingSearch = {
        email: decodedEmail,
        searchData: filters.address
      }
      axios.post(`${BaseApi}/saveSearch`, savingSearch)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          emptySearch();
          console.log(err)
        })
    } else {
      console.log("")
    }
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {
        pastSearch && pastSearch.map((item, index) => {
          return <li key={index}>
            {item}
          </li>
        })
      }
    </Tooltip>
  );

  const handleFocus = () => {
    setIsFocus(true)
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      const decodedEmail = decoded.email
      axios.get(`${BaseApi}/getUserSearch?email=${decodedEmail}`)
        .then((res) => {
          setpastSearch(res.data.searchData
          )
        })
        .catch((err) => {
          console.log(err)
        })

    } else {
      console.log("")
    }
    setTimeout(() => {
      setIsFocus(false)
    }, 3000);
  }

  if (props.loading) {
    return <h1 className='text-center mt-5 mb-5'>Loading...</h1>;
  }

  if (props.errMsg) {
    return <h1 className='text-center mt-5 mb-5' >Error: {props.errMsg}</h1>;
  }

  return (
    <Container>
      <h1>Property</h1>
      {props.properties && (
        <Row>
          <Col sm={3} style={{ backgroundColor: 'aqua' }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Search Address</Form.Label>
                <OverlayTrigger
                  placement="bottom"
                  // delay={{ show: 250, hide: 400 }}
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
              <Button type="submit">Search address</Button>
            </Form>
            <Form style={{ display: 'flex', flexDirection: 'column' }}>
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
