import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaTelegram } from "react-icons/fa";

import "./Socialicons.css";

const Socialicons = () => {
  return (
    <div className="socialicons">
      <a
        href="https://kegeberew.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook className="social-icon" size={30} /> {/* Set size to 30 */}
      </a>
      <a
        href="https://kegeberew.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram className="social-icon" size={30} /> {/* Set size to 30 */}
      </a>
      <a
        href="https://kegeberew.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter className="social-icon" size={30} /> {/* Set size to 30 */}
      </a>
      <a
        href="https://kegeberew.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTelegram className="social-icon" size={30} /> {/* Set size to 30 */}
      </a>
    </div>
  );
};

export default Socialicons;
