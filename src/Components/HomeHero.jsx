import React from "react";
import { Link } from "react-router-dom";

const HomeHero = () => {
  return (
    <div className="home-hero">
      <div className="signup-btn">

      </div>
      <div className="home-hero-content">
        <h1 className="hero-heading">Bark Collective</h1>
        <div className="hero-subtext">
          <p>
            Welcome to The Bark Collective, where loving dogs are waiting for
            their forever homes. Adopt, foster, or support rescue efforts and
            make a difference in a pup's life today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
