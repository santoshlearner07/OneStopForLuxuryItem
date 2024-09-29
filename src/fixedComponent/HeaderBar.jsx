import React, { useEffect, useState } from 'react'
import { Button, Container, Modal, Nav, Navbar, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { BsPersonCircle } from "react-icons/bs";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import BaseApi from '../utils/BaseAPI';

function HeaderBar() {
// State to store user data fetched from the backend
  const [userData, setUserData] = useState();
  // State to control the visibility of the user modal
  const [modalShow, setModalShow] = React.useState(false);
  // State to store the token retrieved from local storage
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate(); //navigate function to redirect users to different routes

  //fetch user details based on the JWT token decoded email
  const fetchUserDetails = () => {
    if (token) {
      // store token and decode it with jwtDecode and take out email
      const decoded = jwtDecode(token)
      const decodedEmail = decoded.email
      axios.get(`${BaseApi}/getUserDetails?email=${decodedEmail}`)
        .then((res) => {
          setUserData(res.data) // store the user details in the state
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  //log the user out by clearing local storage and navigating to the login page
  const userSignOut = () => {
    localStorage.clear(); // Clear token and other stored information
    setToken(null);// Remove the token from state
    navigate('/login')// Redirect to the login page
  }

  useEffect(() => {
    fetchUserDetails();
    setInterval(() => {
      setToken(localStorage.getItem('token'));
    }, 1000);
  }, [token]); // dependency on token, refetches data when token changes

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props} // Pass modal props like 'show' and 'onHide'
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {userData && <> {/* Conditional rendering if userData is available */}
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {userData.firstName} {userData.lastName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{userData.email}</h4>
            <p>
              User Id:-  {userData.userId}<br />
              Home Address:- {userData.address}
            </p>
          </Modal.Body>
          <Modal.Footer style={{ display: 'flex', justifyContent: "space-between" }} >
            <NavLink to={'/ownproperties'}  className={"nav-link"}>
            <Button variant="outline-dark" onClick={props.onHide}>  Your Properties</Button>
            </NavLink>
            <NavLink to={'/addproperty'}  className={"nav-link"}>
            <Button variant="outline-dark" onClick={props.onHide}>  Add Property</Button>
            </NavLink>
            <Button className='mt-2' variant="outline-danger" onClick={() => userSignOut()} >Sign out</Button>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </>}
      </Modal>
    );
  }
  return (
// Main Navbar that displays links to properties, user profile, and login/register options
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        {/* Brand name link that redirects to the properties page */}
        <Navbar.Brand> <NavLink to={'/properties'} className={"nav-link"}> One stop</NavLink> </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to={'/properties'} className={"nav-link"}>Properties</NavLink>
            <NavLink to={'/ownerproperty'} className={"nav-link"}>Owner Properties</NavLink>
            {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
          </Nav>
          <Nav>
            {/* conditional rendering based on whether the user is logged in (token exists) */}
            {token ?
              <span style={{ fontSize: "40px" }} onClick={fetchUserDetails}>
                <Button variant="primary" onClick={() => setModalShow(true)}>
                  <BsPersonCircle />
                </Button>
                <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              </span> :
              <>
                <NavLink to={'/login'} className={"nav-link"} >Login</NavLink>
                <NavLink to={'/register'} className={"nav-link"} >Register</NavLink>
              </>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default HeaderBar