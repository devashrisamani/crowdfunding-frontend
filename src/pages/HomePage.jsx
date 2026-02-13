import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function HomePage() {
  const { fundraisers, isLoading, error } = useFundraisers();

  if (isLoading) {
    return (
      <div className="home-page">
        <h1 className="page-title">Fundraisers</h1>
        <p>Loading fundraisers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <h1 className="page-title">Fundraisers</h1>
        <p style={{ color: "red" }}>
          {error.message || "Something went wrong loading fundraisers."}
        </p>
      </div>
    );
  }

  if (!fundraisers.length) {
    return (
      <div className="home-page">
        <h1 className="page-title">Fundraisers</h1>
        <p>No fundraisers yet.</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1 className="page-title">Fundraisers</h1>
      <div id="fundraiser-list">
        {fundraisers.map((fundraiserData) => {
          return (
            <FundraiserCard
              key={fundraiserData.id}
              fundraiserData={fundraiserData}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
