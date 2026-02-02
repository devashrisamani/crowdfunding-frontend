import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function HomePage() {
  const { fundraisers } = useFundraisers();
  console.log(fundraisers);
  return (
    <div className="home-page">
      <h1 className="page-title">Fundraisers</h1>
      <div id="fundraiser-list">
        {fundraisers.map((fundraiserData, key) => {
          return <FundraiserCard key={key} fundraiserData={fundraiserData} />;
        })}
      </div>
    </div>
  );
}

export default HomePage;
