import React, { useEffect, useState } from 'react'
import { Button, Container, Nav, Navbar, OverlayTrigger, Popover } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { BsPersonCircle } from "react-icons/bs";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import BaseApi from '../utils/BaseAPI';

function HeaderBar() {
  const [userData, setUserData] = useState();
  const [token, setToken] = useState(localStorage.getItem('token'))

  const fetchUserDetails = () => {
    if (token) {
      const decoded = jwtDecode(token)
      const decodedEmail = decoded.email
      axios.get(`${BaseApi}/getUserDetails?email=${decodedEmail}`)
        .then((res) => {
          setUserData(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const userSignOut = () => {
    localStorage.clear();
    setToken(null);
  }

  useEffect(() => {
    fetchUserDetails();
    setInterval(() => {
      setToken(localStorage.getItem('token'));
    }, 1000);
  }, [token]);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Profile</Popover.Header>
      {userData && <Popover.Body>
        <h3>{userData.firstName} {userData.lastName}</h3>
        {userData.email}<br />
        User Id:-  {userData.userId}<br />
        {userData.address}<br />
        <Button className='mt-2' variant="outline-danger" onClick={() => userSignOut()} >Sign out</Button>
      </Popover.Body>}
    </Popover>
  );

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand> <NavLink to={'/properties'} className={"nav-link"}> One stop for luxury item </NavLink> </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to={'/properties'} className={"nav-link"}>Properties</NavLink>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
          <Nav>
            {token ?
              <span style={{ fontSize: "40px" }} onClick={fetchUserDetails}>
                <OverlayTrigger trigger="click" placement="left" overlay={popover}>
                  <Button>
                    <BsPersonCircle />
                  </Button>
                </OverlayTrigger>
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