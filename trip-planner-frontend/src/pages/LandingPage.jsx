import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🗺️",
      title: "Plan Your Journey",
      description: "Create detailed itineraries for your trips with ease",
    },
    {
      icon: "🎯",
      title: "Organize Activities",
      description:
        "Track destinations, attractions, and activities all in one place",
    },
    {
      icon: "📅",
      title: "Smart Scheduling",
      description: "Manage dates, timings, and budgets effortlessly",
    },
    {
      icon: "💾",
      title: "Save & Share",
      description: "Keep your trips organized and share them with friends",
    },
  ];

  return (
    <div className="landing-page">
      <nav className="landing-navbar">
        <div className="landing-nav-container">
          <div className="landing-logo">✈️ Trip Planner</div>
          <button
            className="landing-nav-button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>Your Perfect Travel Companion</h1>
          <p>Plan, organize, and remember every moment of your adventures</p>
          <div className="landing-hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const featuresSection = document.getElementById("features");
                featuresSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="landing-features">
        <h2>Why Choose Trip Planner?</h2>
        <div className="landing-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="landing-feature-card">
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta-content">
          <h2>Ready to Start Planning?</h2>
          <p>
            Join thousands of travelers who use Trip Planner to create memorable
            journeys
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Start Your Adventure Today
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 Trip Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}
