import React from "react";
import ProfilePic from "../Assets/kegeberewArma.png";
import { AiFillStar } from "react-icons/ai";
import "./About.css";
import Footer from "./Footer";

const About = () => {
  return (
    <div>
      <div className="work-section-top">
        <h1 className="primary-heading">Kegeberew Technology Solutions</h1>
        <p className="primary-text">
          Kegeberew Technology Solutions (KTS) is to revolutionize the
          technological landscape in Ethiopia, Africa, and around the globe. We
          strive to provide innovative software, AI, and IT solutions that
          empower businesses and individuals to thrive in the digital era.
        </p>
      </div>
      <div className="cards">
        <div className="adress">
          <h3>Call Us 9858</h3>
          <h3>Kegeberew.com</h3>
          <h3>Adiss Abeba</h3>
        </div>
        <div className="adress">
          <h3>3000 + Employee</h3>
        </div>
        <div className="adress">
          <h3>Departments 30 +</h3>
        </div>
      </div>
      <div className="testimonial-section-bottom">
        <div className="image-logo">
          <img src={ProfilePic} alt="profile picture" />
        </div>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <div className="org-and-location">
          <h1>Purpose Black Ethiopa</h1>
          <h2>Adiss Ababa, Ethiopia</h2>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
