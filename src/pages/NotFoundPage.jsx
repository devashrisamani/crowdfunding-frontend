import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Page not found</h2>
      <p>We couldn&apos;t find the page you were looking for.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;

