import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getCurrentUser from "../api/get-current-user.js";
import getMyFundraisers from "../api/get-my-fundraisers.js";
import getMyPledges from "../api/get-my-pledges.js";
import useAuth from "../hooks/use-auth.js";

function ProfilePage() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myFundraisers, setMyFundraisers] = useState([]);
  const [myPledges, setMyPledges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth?.token) return;

    getCurrentUser(auth.token)
      .then((data) => {
        setProfile(data);
        return Promise.all([
          getMyFundraisers(auth.token).catch(() => []),
          getMyPledges(auth.token).catch(() => []),
        ]);
      })
      .then(([fundraisers, pledges]) => {
        setMyFundraisers(Array.isArray(fundraisers) ? fundraisers : []);
        setMyPledges(Array.isArray(pledges) ? pledges : []);
      })
      .catch((err) => {
        setError(err.message ?? "Error loading profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [auth?.token]);

  if (!auth?.token) {
    return (
      <div className="page page--narrow">
        <div className="card">
          <p>You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page page--narrow">
        <div className="card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page--narrow">
        <div className="card">
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--narrow">
      <div className="card profile-header">
        <div className="page-header">
          <h2>Your profile</h2>
          <p className="text-muted">
            Manage the account you use to create and support fundraisers.
          </p>
        </div>
        <dl className="profile-details">
          <div className="profile-detail-row">
            <dt>Username</dt>
            <dd>{profile?.username ?? "—"}</dd>
          </div>
          <div className="profile-detail-row">
            <dt>Email</dt>
            <dd>{profile?.email ?? "—"}</dd>
          </div>
          <div className="profile-detail-row">
            <dt>User ID</dt>
            <dd>{profile?.id ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="card">
        <h3 className="profile-section-title">My fundraisers</h3>
        {myFundraisers.length > 0 ? (
          <ul className="profile-list">
            {myFundraisers.map((fr) => (
              <li key={fr.id}>
                <Link to={`/fundraiser/${fr.id}`}>{fr.title || `Fundraiser #${fr.id}`}</Link>
                {fr.goal != null && (
                  <span className="text-muted"> — Goal: ${fr.goal}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">You haven’t created any fundraisers yet.</p>
        )}
        <p style={{ marginTop: "0.5rem" }}>
          <Link to="/create" className="button-primary" style={{ textDecoration: "none", display: "inline-block" }}>
            Start a fundraiser
          </Link>
        </p>
      </div>

      <div className="card">
        <h3 className="profile-section-title">My pledges</h3>
        {myPledges.length > 0 ? (
          <ul className="profile-list">
            {myPledges.map((p) => (
              <li key={p.id}>
                <strong>${p.amount}</strong>
                {p.fundraiser != null && (
                  <>
                    {" "}
                    on{" "}
                    <Link to={`/fundraiser/${typeof p.fundraiser === "object" ? p.fundraiser.id : p.fundraiser}`}>
                      {typeof p.fundraiser === "object" && p.fundraiser.title
                        ? p.fundraiser.title
                        : `Fundraiser #${typeof p.fundraiser === "object" ? p.fundraiser.id : p.fundraiser}`}
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">You haven’t made any pledges yet.</p>
        )}
        <p style={{ marginTop: "0.5rem" }}>
          <Link to="/">Browse fundraisers</Link>
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
