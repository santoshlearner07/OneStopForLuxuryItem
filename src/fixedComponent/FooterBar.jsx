import React, { useState } from 'react'
import RateUs from './RateUs'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import "./FooterBar.css"
function FooterBar() {

  const [aboutUs, setAboutUs] = useState(false);
  const [services, setServices] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [termsOfServices, setTermsOfServices] = useState(false);


  return (
    <div>
      <Container>
        <Row style={{ backgroundColor: "grey" }} >
          <Col>
            <h5>Contact Us</h5>
            {/* <p>1234 Main Street, Suite 100<br />City, State, 12345</p> */}
            <p>Phone: (123) 456-7890<br />Email: santoshwalker719@gmail.com</p>
          </Col>
          <Col>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li onClick={() => setAboutUs(true)} style={{ cursor: "pointer" }} >About Us</li>
              <li onClick={() => setServices(true)} style={{ cursor: "pointer" }}>Services</li>
              {/* <li>Blog</li> */}
              {/* <li>FAQs</li> */}
              <li onClick={() => setPrivacyPolicy(true)} style={{ cursor: "pointer" }}>Privacy Policy</li>
              <li onClick={() => setTermsOfServices(true)} style={{ cursor: "pointer" }}>Terms of Service</li>
            </ul>
          </Col>
          <Col>
            <h5>Follow Us</h5>
            {/* <div>
              <a href="https://facebook.com" className="text-light mr-2"><FaFacebook size={24} /></a>
              <a href="https://twitter.com" className="text-light mr-2"><FaTwitter size={24} /></a>
              <a href="https://linkedin.com" className="text-light mr-2"><FaLinkedin size={24} /></a>
              <a href="https://instagram.com" className="text-light"><FaInstagram size={24} /></a>
            </div> */}
            <RateUs />
            <p>&copy; 2024 One Stop. All rights reserved.</p>
          </Col>
        </Row>
        <Modal
          size="sm"
          show={aboutUs}
          onHide={() => setAboutUs(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              About US
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>...</Modal.Body>
        </Modal>
        <Modal
          size="sm"
          show={services}
          onHide={() => setServices(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Services
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>...</Modal.Body>
        </Modal>
        <Modal
          size="sm"
          show={privacyPolicy}
          onHide={() => setPrivacyPolicy(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              privacy Policy
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>...</Modal.Body>
        </Modal>
        <Modal
          size="sm"
          show={termsOfServices}
          onHide={() => setTermsOfServices(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Terms of Services
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>...</Modal.Body>
        </Modal>
      </Container>
    </div>
  )
}

export default FooterBar