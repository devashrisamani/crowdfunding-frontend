import { Link } from "react-router-dom";
import "./FundraiserCard.css";

function FundraiserCard(props) {
  const { fundraiserData } = props;
  const fundraiserLink = `/fundraiser/${fundraiserData.id}`;

  return (
    <div className="fundraiser-card">
      <Link to={fundraiserLink}>
        <img
          src={fundraiserData.image || "/placeholder.jpg"}
          alt={fundraiserData.title}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
        />
        <h3>{fundraiserData.title}</h3>
      </Link>
    </div>
  );
}

export default FundraiserCard;
