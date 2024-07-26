import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import BaseApi from '../utils/BaseAPI';

function RateUs() {
    const [feedback, setFeeback] = useState({
        email: "", review: ""
    })
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFeeback((prevData) => ({ ...prevData, [name]: value }))
    }

    const submitFeedback = () => {

        const userFeedback = {
            email: feedback.email,
            review: feedback.review
        };

        axios.post(`${BaseApi}/submitfeedback`, userFeedback)
            .then((res) => {
                alert('Thank you for your feedback!');
                setFeeback({ email: "", review: "" });
                handleClose();
            })
            .catch((err) => {
                console.error('Error:', err.response ? err.response.data : err.message);
                alert('Failed to submit feedback. Please try again.');
            });
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Rate Us
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate Us</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlid="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                name="email"
                                value={feedback.email}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlid="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Give us a feedback</Form.Label>
                            <Form.Control as="textarea" rows={3} name='review' value={feedback.review} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submitFeedback}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RateUs