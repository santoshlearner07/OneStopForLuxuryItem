import React, { useEffect, useState } from 'react'
import BaseApi from '../utils/BaseAPI';
import axios from 'axios';

function FeedBack() {

  const [displayReview, setDisplayReview] = useState('');

  useEffect(() => {
    axios.get(`${BaseApi}/getAllFeedback`)
      .then((res) => {
        setDisplayReview(res.data.reverse());
      }).catch((error) => {
        console.log(error)
      })
  }, [displayReview])

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