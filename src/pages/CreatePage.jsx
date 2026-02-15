import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";
import postFundraiser from "../api/post-fundraiser.js";

function CreatePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Form state: one object for all fields so I can update with handleChange
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    goal: "",
    is_open: true,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!auth?.token) {
    return (
      <div className="page page--narrow">
        <div className="card">
          <p>You need to be logged in to create a fundraiser.</p>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const missingFields = [];
    if (!form.title.trim()) missingFields.push("title");
    if (!form.description.trim()) missingFields.push("description");
    if (!form.image.trim()) missingFields.push("image URL");
    if (!form.goal) missingFields.push("goal");

    if (missingFields.length > 0) {
      setErrorMessage(
        `Please fill in the following field(s): ${missingFields.join(", ")}.`,
      );
      return;
    }

    const goalNumber = Number(form.goal);
    if (Number.isNaN(goalNumber) || goalNumber <= 0) {
      setErrorMessage("Goal must be a positive number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newFundraiser = await postFundraiser(auth.token, {
        title: form.title,
        description: form.description,
        image: form.image.trim(),
        goal: goalNumber,
        is_open: form.is_open,
      });

      if (newFundraiser?.id) {
        navigate(`/fundraiser/${newFundraiser.id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(err.message || "Error creating fundraiser.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page--narrow">
      <div className="card">
        <div className="page-header">
          <h2>Create a new fundraiser</h2>
          <p className="text-muted">
            Share your story, set a goal, and invite others to support your
            project.
          </p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="goal">Goal amount</label>
            <input
              id="goal"
              type="number"
              min="1"
              step="1"
              value={form.goal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="is_open" className="field-inline">
              <input
                id="is_open"
                type="checkbox"
                checked={form.is_open}
                onChange={handleChange}
              />
              <span>Fundraiser is open</span>
            </label>
          </div>

          {errorMessage && <p className="text-error">{errorMessage}</p>}

          <div className="form-actions">
            <button className="button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create fundraiser"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;


