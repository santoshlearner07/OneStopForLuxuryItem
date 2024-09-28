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
        <Row style={{
          backgroundColor: '#343a40',
          color: "white",
          textAlign: 'center',
          padding: "10px 0",
        }} >
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

            <RateUs />
            <p>&copy; 2024 One Stop. All rights reserved.</p>
          </Col>
        </Row>
        <Modal
          size="lg"
          show={aboutUs}
          onHide={() => setAboutUs(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              About US
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h2>About Us</h2>
              <p>
                Welcome to One Stop For Luxury Items, your number one source for all things real estate. We are dedicated
                to giving you the very best experience, with a focus on dependability, customer service, and uniqueness.
              </p>
              <p>
                Founded in 2024 by Santosh N, One Stop has come a long way from its beginnings.
                When Santosh first started out, their passion for helping people find the right home drove them
                to quit their day job and gave them the impetus to turn hard work and inspiration into a booming
                online platform. We now serve customers all over United Kingdom, and are thrilled to be a part of
                the real estate industry.
              </p>
              <p>
                We hope you enjoy using our platform as much as we enjoy offering it to you. If you have any questions
                or comments, please don't hesitate to contact us.
              </p>
              <p>
                Sincerely,<br />
                One Stop For Luxury Items
              </p>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          show={services}
          onHide={() => setServices(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Services
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h2>Our Services</h2>
              <p>At One Stop, we provide a range of services to make your real estate journey smoother:</p>
              <ul>
                <li><strong>Property Listings:</strong> Browse through hundreds of residential and commercial listings that suit your needs.</li>
                <li><strong>Advanced Property Search:</strong> Filter properties by location, price, number of bedrooms, and other criteria to find exactly what you're looking for.</li>
                <li><strong>Property Valuation:</strong> Get accurate estimates for the property value, helping you make informed decisions.</li>
                <li><strong>Distance Calculation:</strong> Use our distance feature to compare properties based on proximity to your current location.</li>
                <li><strong>Google Maps Integration:</strong> View properties on the map and get directions directly through Google Maps.</li>
              </ul>
              <p>
                We aim to make your property search as seamless as possible by combining technology with great customer service.
              </p>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          show={privacyPolicy}
          onHide={() => setPrivacyPolicy(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              privacy Policy
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h2>Privacy Policy</h2>
              <p>At One Stop, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This policy outlines how we collect, use, and protect your information.</p>
              <h3>Information We Collect</h3>
              <p>We may collect personal information such as your name, email address, phone number, and other relevant details when you:</p>
              <ul>
                <li>Create an account on our platform</li>
                <li>List a property</li>
                <li>Contact us for support</li>
              </ul>
              <h3>How We Use Your Information</h3>
              <p>We use your personal information to:</p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Communicate with you regarding your account or inquiries</li>
                <li>Process transactions and manage your account</li>
              </ul>
              <h3>Protection of Information</h3>
              <p>We implement a variety of security measures to protect your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
              <p>For any questions or concerns regarding your privacy, feel free to Contact us.</p>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          show={termsOfServices}
          onHide={() => setTermsOfServices(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Terms of Services
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h2>Terms of Service</h2>
              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing and using our platform, you agree to comply with and be bound by the following terms and conditions.
                If you do not agree to these terms, you should not use the platform.
              </p>
              <h3>2. User Responsibilities</h3>
              <p>
                As a user, you agree to use our platform only for lawful purposes. You are responsible for all content you
                upload or post, and you must not engage in any behavior that could harm other users or the platform itself.
              </p>
              <h3>3. Property Listings</h3>
              <p>
                Property listings are provided by third-party agents and individuals. One Stop is not responsible
                for the accuracy of the listings. Users should independently verify all property details before making any decisions.
              </p>
              <h3>4. Limitation of Liability</h3>
              <p>
                One Stop shall not be liable for any damages that may arise from your use of the platform, including
                but not limited to errors or omissions in the content.
              </p>
              <h3>5. Changes to Terms</h3>
              <p>
                We reserve the right to change or modify these terms at any time. You are encouraged to review the terms regularly
                to stay informed about any updates.
              </p>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  )
}

export default FooterBar