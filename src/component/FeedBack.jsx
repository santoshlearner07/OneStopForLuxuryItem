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
      <ul style={{ overflowY: "scroll", height: "50vh" }} >
        {displayReview && displayReview.map((item, index) => {
          return (
            <li style={{ backgroundColor: "white" }} key={index}><h3>{item.review}</h3></li>
          )
        })}
      </ul>
    </>
  )
}

export default FeedBack