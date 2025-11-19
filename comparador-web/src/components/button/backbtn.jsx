import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import './backbtn.css'
import { Link } from "react-router-dom";


const BackBtn = () => {
    return(
       
            <div className="back-btn">
                <Link to="/">
                    <label htmlFor=""><IoArrowBackOutline size={25}/></label>
                </Link>        
            </div>
       
    )
}

export default BackBtn