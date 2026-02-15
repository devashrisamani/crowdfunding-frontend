import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import "./LandingPage.css";

// Welcome/landing page at /welcome
function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero: full-width image + overlay text and main CTA. Navbar comes from Layout. */}
      <section className="landing-hero full-bleed">
        <img
          src={heroImage}
          alt="Nature and sustainability"
          className="landing-hero-image"
        />
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">Fund what matters</h1>
          <p className="landing-hero-tagline">
            Support sustainability projects and help communities create lasting
            environmental impact.
          </p>
          <div className="landing-hero-actions">
            <Link to="/" className="landing-btn landing-btn-primary">
              Browse fundraisers
            </Link>
            <Link to="/create" className="landing-btn landing-btn-secondary">
              Start a fundraiser
            </Link>
          </div>
        </div>
      </section>

      {/* Main content: cards in a container */}
      <main className="landing-main">
        <section className="landing-section">
          <h2 className="landing-section-title">About us</h2>
          <div className="landing-cards">
            <div className="landing-card">
              <p>
                Leaf a Mark connects eco-conscious people with community-driven
                sustainability initiatives—from tree planting to ocean cleanups.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <h2 className="landing-section-title">Inspiration</h2>
          <div className="landing-cards">
            <div className="landing-card landing-card-quote">
              <blockquote>
                &ldquo;The greatest threat to our planet is the belief that
                someone else will save it.&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <h2 className="landing-section-title">Ready to make an impact?</h2>
          <div className="landing-cards">
            <div className="landing-card landing-card-cta">
              <p>Donate to a cause or start your own fundraiser today.</p>
              <div className="landing-cta-buttons">
                <Link to="/" className="landing-btn landing-btn-primary">
                  Browse fundraisers
                </Link>
                <Link
                  to="/create"
                  className="landing-btn landing-btn-secondary"
                >
                  Start a fundraiser
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
