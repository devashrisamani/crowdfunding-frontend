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
      <div style={{ padding: "1rem" }}>
        <p>Loading fundraiser...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <p style={{ color: "red" }}>
          {error.message || "Error loading fundraiser."}
        </p>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Fundraiser not found.</p>
      </div>
    );
  }

  const isOwner =
    auth?.user && fundraiser.owner && fundraiser.owner === auth.user.id;

  if (!isOwner) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Edit Fundraiser</h2>
        <p>You don&apos;t have permission to edit this fundraiser.</p>
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
        image: form.image,
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
    <div style={{ padding: "1rem" }}>
      <h2>Edit Fundraiser</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div>
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

        <div>
          <label htmlFor="is_open">
            <input
              id="is_open"
              type="checkbox"
              checked={form.is_open}
              onChange={handleChange}
            />
            {"  "}
            Fundraiser is open
          </label>
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditFundraiserPage;
