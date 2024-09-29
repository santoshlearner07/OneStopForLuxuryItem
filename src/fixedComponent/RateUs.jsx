import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import BaseApi from '../utils/BaseAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RateUs() {
    // toast notification for feedback
    const thankYouFeedback = () => toast.info("Thank you for your feedback!");
    const cannotSubmit = () => toast.info("Failed to submit feedback. Please try again.");

    //store feedback data: user's email and review
    const [feedback, setFeeback] = useState({
        email: "", review: ""
    })
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false); //close the modal
    const handleShow = () => setShow(true);// open the modal

    //input changes for the feedback form, updating the state with the user's email and review
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFeeback((prevData) => ({ ...prevData, [name]: value }))
    }

    //submit feedback to the backend API
    const submitFeedback = () => {

        const userFeedback = {
            email: feedback.email,
            review: feedback.review
        };

        axios.post(`${BaseApi}/submitfeedback`, userFeedback) // POST request to submit feedback
            .then((res) => {
                // alert('Thank you for your feedback!');
                thankYouFeedback();
                setFeeback({ email: "", review: "" });
                handleClose();
            })
            .catch((err) => {
                console.error('Error:', err.response ? err.response.data : err.message);
                // alert('Failed to submit feedback. Please try again.');
                cannotSubmit();
            });
    }

    return (
        <>
            {/* Button to trigger the feedback modal */}
            <Button variant="primary" onClick={handleShow}>
                Rate Us
            </Button>

            {/* Modal to display the feedback form */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate Us</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Input field for user's email */}
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
                        {/* Text area for user's review */}
                        <Form.Group
                            className="mb-3"
                            controlid="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Give us a feedback</Form.Label>
                            <Form.Control as="textarea" rows={3} name='review' value={feedback.review} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                {/* Modal footer with submit and close buttons */}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* Button to submit the feedback */}
                    <Button variant="primary" onClick={submitFeedback}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Toast container to display notifications */}
            <ToastContainer />
        </>
    )
}

export default RateUs