import React, { useEffect, useState } from 'react'
import BaseApi from '../utils/BaseAPI';
import axios from 'axios';

function FeedBack() {


    const [displayReview, setDisplayReview] = useState('');


    useEffect(() => {
        axios.get(`${BaseApi}/submitfeedback`)
          .then((res) => {
            console.log(res.data)
            setDisplayReview(res.data);
          }).catch((error) => {
            console.log(error)
          })
      }, [displayReview])

  return (
    <>
    <h1>Customer Feedback</h1>
          <ul>

            {displayReview && displayReview.map((item, index) => {
              return (
                <li style={{ backgroundColor: "white" }} ><h3>{item.review}</h3></li>
              )
            })}
          </ul>
    </>
  )
}

export default FeedBack