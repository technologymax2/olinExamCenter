import React from "react";
import ProfilePic from "../Assets/kegeberewArma.png";
import {AiFillStar} from "react-icons/ai";
import "./About.css";
import Footer from "./Footer";

const Abouthome = () => {
  return <div>
            <div className="work-section-top">
                
                <h1 className="primary-heading">Kegeberew Technology Solutions</h1>
                <p className="primary-text">
                Kegeberew Technology Solutions (KTS) is to revolutionize the technological landscape in Ethiopia, Africa, and around the globe. We strive to provide innovative software, AI, and IT solutions that empower businesses and individuals to thrive in the digital era.
                </p>
            </div>
            <div className="cards">
            <div className="adress">
                <a>
                <h2>Call Us 9858</h2>
                <h2>Kegeberew.com</h2>
                <h2>Adiss Abeba</h2>
                </a>
            </div>
            <div className="adress">
                <a>
                <h1>3000 + Employee</h1>
                </a>
            </div>
            <div className="adress">
                <a>
                <h1>Departments 30 +</h1>
                </a>
            </div>
            </div>
            <div className="testimonial-section-bottom">
                <img src={ProfilePic} alt="profile picture" />
                
                <div className="testimonials-stars-container">
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                </div>
                <div className="org-and-location">
                <h1>Purpose Black Ethiopa</h1>
                <h2>Adiss Ababa,Ethiopia</h2>
                </div>
            </div>
            
  </div>
};

export default Abouthome;