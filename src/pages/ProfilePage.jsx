import { useEffect, useState } from "react";
import getCurrentUser from "../api/get-current-user.js";
import useAuth from "../hooks/use-auth.js";

function ProfilePage() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth?.token) return;

    getCurrentUser(auth.token)
      .then((data) => {
        setProfile(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Error loading profile");
        setIsLoading(false);
      });
  }, [auth?.token]);

  if (!auth?.token) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>You need to be logged in to view your profile.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Profile</h2>
      <ul>
        <li>
          <strong>Username:</strong> {profile?.username ?? "—"}
        </li>
        <li>
          <strong>Email:</strong> {profile?.email ?? "—"}
        </li>
        <li>
          <strong>ID:</strong> {profile?.id ?? "—"}
        </li>
      </ul>
    </div>
  );
}

export default ProfilePage;
