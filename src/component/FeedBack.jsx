import React, { useEffect, useState } from 'react'
import BaseApi from '../utils/BaseAPI';
import axios from 'axios';

function FeedBack() {

  // state to store the feedback fetched from the API
  const [displayReview, setDisplayReview] = useState('');

  // useEffect hook to fetch feedback data when the component mounts
  useEffect(() => {
    axios.get(`${BaseApi}/getAllFeedback`) //GET request to fetch all feedback
      .then((res) => {
        setDisplayReview(res.data.reverse()); // reverse the feedback array to display the latest reviews first
      }).catch((error) => {
        console.log(error)
      })
  }, [displayReview]) // dependency array ensures the effect is triggered when 'displayReview' changes

  return (
    <>
      <h1>Customer Feedback</h1>
      <ul style={{ overflowY: "scroll", height: "50vh", backgroundColor: "grey", opacity: "0.9" }} >
        {displayReview && displayReview.map((item, index) => {
          return (
            <li key={index}><h5 style={{ color: "white" }} >{item.review}</h5></li>
          )
        })}
      </ul>
    </>
  )
}

export default FeedBack