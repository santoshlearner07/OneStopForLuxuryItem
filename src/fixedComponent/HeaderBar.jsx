import React, { useEffect, useState } from 'react'
import { Button, Container, Modal, Nav, Navbar, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { BsPersonCircle } from "react-icons/bs";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import BaseApi from '../utils/BaseAPI';

function HeaderBar() {
  const [userData, setUserData] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate();
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
    navigate('/login')
  }

  useEffect(() => {
    fetchUserDetails();
    setInterval(() => {
      setToken(localStorage.getItem('token'));
    }, 1000);
  }, [token]);

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {userData && <>
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

    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand> <NavLink to={'/properties'} className={"nav-link"}> One stop</NavLink> </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to={'/properties'} className={"nav-link"}>Properties</NavLink>
            {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
          </Nav>
          <Nav>
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