import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import BaseApi from '../utils/BaseAPI';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import FeedBack from './FeedBack';
import RegisterAdvantage from './RegisterAdvantage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  // Toast notification functions
  const passCannotBeEmpty = () => toast.error('Password cannot be empty')
  const minimumLenght = () => toast.error('Password should be of minimum 8 character')
  const userRegisterSuccess = () => toast.success('Successfull')
  const passNotMatch = () => toast.success('Password does not match')
  const PASSWORDPATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // regEx (Regular expression) pattern


  // State to hold user details
  const [userDetail, setUserDetails] = useState({
    fName: "", lName: "", email: "", pass: "", confPass: "", address: "", gender: "", dateOfBirth: ""
  })
  const [errors, setErrors] = useState({
    password: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [show, setShow] = useState(true); // toggle pasword visibility
  
  // user input and validate password
  const userRegister = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevData) => ({ ...prevData, [name]: value }));
  
    if (name === 'pass') {
      validatePassword(value); // Validate password if the 'pass' field is updated
    }
  }

 //useEffect to check if all form fields are filled
  useEffect(() => {
    const allFieldsFilled = Object.values(userDetail).every(field => field !== '');
    setIsFormValid(allFieldsFilled);
  }, [userDetail])

  // validate password based on defined criteria
  const validatePassword = (pass) => {
    if (!PASSWORDPATTERN.test(pass)) {
      setErrors({ password: 'Password must be at least 8 characters, include a letter, a number, and a special character.' });
      setIsFormValid(false);
    } else {
      // Clear the error if the password is valid
      setErrors({ password: '' });
      setIsFormValid(true);
    }
  }
  // Generate a random unique user ID
  const randomUniqueNumber = () => {
    return Math.floor(Math.random() * 100000) + 1;
  }

  // Toggle password visibility
  const displayPassword = () => {
    setShow(!show); // Toggle the 'show' state
  }

  const validatePasswordMatch = () => {
    if (userDetail.pass !== userDetail.confPass) {
      passNotMatch(); // Trigger notification or handle validation for password mismatch
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }

  // handle user registration logic
  const userRegistered = () => {
    const UID = randomUniqueNumber()

    const userData = {
      userId: UID,
      firstName: userDetail.fName,
      lastName: userDetail.lName,
      email: userDetail.email,
      password: userDetail.pass,
      // confirmPassword: userDetail.confPass,
      address: userDetail.address,
      gender: userDetail.gender,
      date: userDetail.dateOfBirth
    }
    // validatePasswordMatch();
     // password validation before sending data
    if (!userDetail.pass) {
      // alert("Password cannot be empty")
      passCannotBeEmpty();
    } else if (userDetail.pass < 8) {
      // alert("Password should be of minimum 8 character")
      minimumLenght();
    } else if (userDetail.pass === userDetail.confPass) {
      axios.post(`${BaseApi}/register`, userData)
        .then((res) => {
          userRegisterSuccess(); // Notify user on successful registration
        })
        .catch((error) => {
          console.log(error)
          console.log(userData) // Log error and user data for debugging
        })
        // reset form fields after submission
      setUserDetails({
        fName: "", lName: "", email: "", pass: "", confPass: "", address: "", gender: "", dateOfBirth: ""
      });
    } else {
      passNotMatch(); // notify user if passwords do not match
    }
  }

  // handle form submission
  const handleSubmitUser = (e) => {
    e.preventDefault();
    userRegistered();
  }

  return (
    <Container >
      <Row>
        <Col lg={"3"} >
          <RegisterAdvantage />
        </Col>
        <Col lg={"6"}>
          <Form>
            <Row className="mb-3 mt-3">
              <Form.Group as={Col} controlid="formGridFName">
                {/* <Form.Label>First Name</Form.Label> */}
                <Form.Control type="text" placeholder="Enter First Name" name='fName' value={userDetail.fName} onChange={userRegister} />
              </Form.Group>

              <Form.Group as={Col} controlid="formGridLName">
                {/* <Form.Label>Last Name</Form.Label> */}
                <Form.Control type="text" placeholder="Enter Last Name" name='lName' value={userDetail.lName} onChange={userRegister} />
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlid="formGridEmail" className="mb-3">
              {/* <Form.Label>Email</Form.Label> */}
              <Form.Control type="email" placeholder="Enter email" name='email' value={userDetail.email} onChange={userRegister} />
            </Form.Group>
            <Row className="mb-3">
              <Col sm={12} lg={"6"} md={"6"} >
                {/* <Form.Label>Password</Form.Label> */}
                <InputGroup className="mb-3" controlid="formBasicPassword">
                  <Form.Control type={show ? 'password' : 'text'} placeholder="Password" name='pass' value={userDetail.pass} onChange={userRegister} isInvalid={!!errors.password} />
                  <InputGroup.Text id="basic-addon1">
                    {" "}
                    <div onClick={() => displayPassword()} >
                      {show ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
              <Col lg={6} md={"6"}>
                <Form.Group as={Col} controlid="formGridPassword">
                  {/* <Form.Label>Confirm Password</Form.Label> */}
                  <Form.Control type="password" placeholder="Confirm Password" name='confPass' value={userDetail.confPass} onChange={userRegister} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlid="formGridAddress1">
              {/* <Form.Label>Address</Form.Label> */}
              <Form.Control placeholder="Enter your address" name='address' value={userDetail.address} onChange={userRegister} />
            </Form.Group>
            <Row className="mb-3">
              <Col sm={5} style={{backgroundColor:"lightblue"}} >
              <Form.Label as="legend" column sm={2}>
                Gender
              </Form.Label>
                <Form.Check
                  type="radio"
                  label="Male"
                  name="gender"
                  id="formHorizontalRadios1"
                  value="Male"
                  checked={userDetail.gender === "Male"}
                  onChange={userRegister}
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  name="gender"
                  id="formHorizontalRadios2"
                  value="Female"
                  checked={userDetail.gender === "Female"}
                  onChange={userRegister}
                />
                <Form.Check
                  type="radio"
                  label="other"
                  name="gender"
                  id="formHorizontalRadios3"
                  value="Other"
                  checked={userDetail.gender === "Other"}
                  onChange={userRegister}
                />
              </Col>
              <Col>
                <Form.Control type="date" name='dateOfBirth' id='dateOfBirth' label='dateOfBirth' value={userDetail.dateOfBirth} onChange={userRegister} />
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="mb-3" onClick={handleSubmitUser} disabled={!isFormValid}>
              Register
            </Button>
          </Form>
        </Col>
        <Col lg={"3"} >
          <FeedBack />
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  )
}

export default Register