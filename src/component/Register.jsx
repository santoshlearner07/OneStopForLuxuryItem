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
  const passCannotBeEmpty = () => toast.error('Password cannot be empty')
  const minimumLenght = () => toast.error('Password should be of minimum 8 character')
  const userRegisterSuccess = () => toast.success('Successfull')
  const passNotMatch = () => toast.success('Password does not match')

  // const notify = () => toast("Wow so easy!");
  const [userDetail, setUserDetails] = useState({
    fName: "", lName: "", email: "", pass: "", confPass: "", address: "", gender: "", dateOfBirth: ""
  })
  const [isFormValid, setIsFormValid] = useState(false);
  const [show, hide] = useState(true);
  const userRegister = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevData) => ({ ...prevData, [name]: value }))
  }

  useEffect(() => {
    const allFieldsFilled = Object.values(userDetail).every(field => field !== '');
    setIsFormValid(allFieldsFilled);
  }, [userDetail])

  const randomUniqueNumber = () => {
    return Math.floor(Math.random() * 100000) + 1;
  }

  const displayPassword = () => {
    hide(!show)
  }

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

    if (!userDetail.pass) {
      // alert("Password cannot be empty")
      passCannotBeEmpty();
    } else if (userDetail.pass < 8) {
      // alert("Password should be of minimum 8 character")
      minimumLenght();
    } else if (userDetail.pass === userDetail.confPass) {
      axios.post(`${BaseApi}/register`, userData)
        .then((res) => {
          userRegisterSuccess();
        })
        .catch((error) => {
          console.log(error)
          console.log(userData)
        })
      setUserDetails({
        fName: "", lName: "", email: "", pass: "", confPass: "", address: "", gender: "", dateOfBirth: ""
      });
    } else {
      passNotMatch();
    }

  }

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
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter First Name" name='fName' value={userDetail.fName} onChange={userRegister} />
              </Form.Group>

              <Form.Group as={Col} controlid="formGridLName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Last Name" name='lName' value={userDetail.lName} onChange={userRegister} />
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlid="formGridEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name='email' value={userDetail.email} onChange={userRegister} />
            </Form.Group>
            <Row className="mb-3">
              <Col sm={12} lg={"6"} md={"6"} >
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-3" controlid="formBasicPassword">
                  <Form.Control type={show ? 'password' : 'text'} placeholder="Password" name='pass' value={userDetail.pass} onChange={userRegister} />
                  <InputGroup.Text id="basic-addon1">
                    {" "}
                    <div onClick={() => displayPassword()} >
                      {show ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col lg={6} md={"6"}>
                <Form.Group as={Col} controlid="formGridPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm Password" name='confPass' value={userDetail.confPass} onChange={userRegister} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlid="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="Enter your address" name='address' value={userDetail.address} onChange={userRegister} />
            </Form.Group>
            <Row className="mb-3">
              <Form.Label as="legend" column sm={2}>
                Gender
              </Form.Label>
              <Col sm={5}>
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