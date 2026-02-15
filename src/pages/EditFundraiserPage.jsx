import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";
import useFundraiser from "../hooks/use-fundraiser.js";
import putFundraiser from "../api/put-fundraiser.js";

function EditFundraiserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { fundraiser, isLoading, error } = useFundraiser(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    goal: "",
    is_open: true,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (fundraiser) {
      setForm({
        title: fundraiser.title || "",
        description: fundraiser.description || "",
        image: fundraiser.image || "",
        goal: fundraiser.goal != null ? String(fundraiser.goal) : "",
        is_open: Boolean(fundraiser.is_open),
      });
    }
  }, [fundraiser]);

  if (isLoading) {
    return (
      <div className="page page--narrow">
        <div className="card">
          <p>Loading fundraiser...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page--narrow">
        <div className="card">
          <p className="text-error">
            {error.message || "Error loading fundraiser."}
          </p>
        </div>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="page page--narrow">
        <div className="card">
          <p>Fundraiser not found.</p>
        </div>
      </div>
    );
  }

  const isOwner =
    auth?.user && fundraiser.owner && fundraiser.owner === auth.user.id;

  if (!isOwner) {
    return (
      <div className="page page--narrow">
        <div className="card">
          <h2>Edit Fundraiser</h2>
          <p>You don&apos;t have permission to edit this fundraiser.</p>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { id: fieldId, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [fieldId]: type === "checkbox" ? checked : value,
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
      const updated = await putFundraiser(auth.token, fundraiser.id, {
        title: form.title,
        description: form.description,
        image: form.image.trim(),
        goal: goalNumber,
        is_open: form.is_open,
      });

      if (updated?.id) {
        navigate(`/fundraiser/${updated.id}`);
      } else {
        navigate(`/fundraiser/${fundraiser.id}`);
      }
    } catch (err) {
      setErrorMessage(err.message || "Error updating fundraiser.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page--narrow">
      <div className="card">
        <div className="page-header">
          <h2>Edit fundraiser</h2>
          <p className="text-muted">
            Update the details of your campaign. Changes will be visible
            immediately.
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
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFundraiserPage;
