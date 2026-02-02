import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-hero full-bleed">
        <img
          src={heroImage}
          alt="Nature and sustainability"
          className="landing-hero-image"
        />

        <div className="landing-hero-content">
          <h1>Leaf a Mark</h1>
          <p>
            Support sustainability projects and help communities create lasting
            environmental impact.
          </p>

          <div className="landing-hero-actions">
            <Link to="/">Browse fundraisers</Link>
            <Link to="/create">Start a fundraiser</Link>
          </div>
        </div>
      </header>

      <section>
        <h2>About us</h2>
        <p>
          Leaf a Mark connects eco-conscious people with community-driven
          sustainability initiatives—from tree planting to ocean cleanups.
        </p>
      </section>

      <section>
        <h2>Inspiration</h2>
        <blockquote>
          “The greatest threat to our planet is the belief that someone else
          will save it.”
        </blockquote>
      </section>

      <section>
        <h2>Ready to make an impact?</h2>
        <p>Donate to a cause or start your own fundraiser today.</p>
        <div>
          <Link to="/create">Start a fundraiser</Link>{" "}
          <a href="#" target="_blank" rel="noreferrer">
            Donate
          </a>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
