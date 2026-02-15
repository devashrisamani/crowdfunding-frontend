import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useFundraiser from "../hooks/use-fundraiser";
import useAuth from "../hooks/use-auth.js";
import postPledge from "../api/post-pledge.js";
import deleteFundraiser from "../api/delete-fundraiser.js";
import putPledge from "../api/put-pledge.js";

function FundraiserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth } = useAuth();
  const { fundraiser, isLoading, error, refetch } = useFundraiser(id);
  const [pledge, setPledge] = useState({
    amount: "",
    comment: "",
    anonymous: false,
  });
  const [pledgeError, setPledgeError] = useState("");
  const [isSubmittingPledge, setIsSubmittingPledge] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPledgeId, setEditingPledgeId] = useState(null);
  const [editPledgeData, setEditPledgeData] = useState({
    comment: "",
    anonymous: false,
  });
  const [editError, setEditError] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  if (isLoading) {
    return <p>Loading fundraiser...</p>;
  }

  if (error) {
    return (
      <p style={{ color: "red" }}>
        {error.message || "Error loading fundraiser."}
      </p>
    );
  }

  if (!fundraiser) {
    return <p>Fundraiser not found.</p>;
  }

  const totalPledged =
    fundraiser.pledges?.reduce(
      (sum, pledge) => sum + (pledge.amount || 0),
      0,
    ) || 0;

  const goal = Number(fundraiser.goal) || 0;
  const rawProgress = goal > 0 ? (totalPledged / goal) * 100 : 0;
  // Bar width: at least 1% when there's any amount, so the bar is visible
  const progress =
    goal > 0 && totalPledged > 0 ? Math.max(1, Math.min(100, rawProgress)) : 0;
  // Display: rounded whole number so it does not show long decimals (e.g. 1% not 1.111...%)
  const progressPercent = Math.round(rawProgress);

  const isOwner =
    auth?.user && fundraiser.owner && fundraiser.owner === auth.user.id;

  // Viewer is allowed to pledge only if logged in, not the owner, and fundraiser is open
  const canPledge = auth?.token && !isOwner && fundraiser.is_open;

  const handlePledgeChange = (event) => {
    const { id, value, type, checked } = event.target;
    setPledge((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    setPledgeError("");
  };

  const handlePledgeSubmit = async (event) => {
    event.preventDefault();

    if (!auth?.token) {
      setPledgeError("Please log in to make a pledge.");
      return;
    }

    const amountNumber = Number(pledge.amount);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      setPledgeError("Amount must be a positive number.");
      return;
    }

    setIsSubmittingPledge(true);

    try {
      await postPledge(auth.token, {
        fundraiserId: fundraiser.id,
        amount: amountNumber,
        comment: pledge.comment || "",
        anonymous: pledge.anonymous,
      });

      // Clear form and refresh fundraiser data to show the new pledge
      setPledge({
        amount: "",
        comment: "",
        anonymous: false,
      });
      await refetch();
    } catch (err) {
      setPledgeError(err.message || "Error creating pledge.");
    } finally {
      setIsSubmittingPledge(false);
    }
  };

  const handleDelete = async () => {
    if (!auth?.token) {
      setDeleteError("Please log in to delete this fundraiser.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this fundraiser?",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteFundraiser(auth.token, fundraiser.id);
      navigate("/");
    } catch (err) {
      setDeleteError(err.message || "Error deleting fundraiser.");
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditingPledge = (pledgeToEdit) => {
    setEditingPledgeId(pledgeToEdit.id);
    setEditPledgeData({
      comment: pledgeToEdit.comment || "",
      anonymous: Boolean(pledgeToEdit.anonymous),
    });
    setEditError("");
  };

  const handleEditPledgeChange = (event) => {
    const { id: fieldId, value, type, checked } = event.target;
    setEditPledgeData((prev) => ({
      ...prev,
      [fieldId]: type === "checkbox" ? checked : value,
    }));
    setEditError("");
  };

  const handleEditPledgeSubmit = async (event, pledgeId) => {
    event.preventDefault();

    if (!auth?.token) {
      setEditError("Please log in to edit your pledge.");
      return;
    }

    setIsSavingEdit(true);

    try {
      await putPledge(auth.token, pledgeId, {
        comment: editPledgeData.comment || "",
        anonymous: editPledgeData.anonymous,
      });

      setEditingPledgeId(null);
      await refetch();
    } catch (err) {
      setEditError(err.message || "Error updating pledge.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
      {/* Image: use placeholder if missing or if the URL fails to load */}
      <div style={{ marginBottom: "1rem" }}>
        <img
          src={fundraiser.image || "/placeholder.jpg"}
          alt={fundraiser.title}
          style={{ maxWidth: "100%", borderRadius: "8px" }}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
        />
      </div>

      <h2>{fundraiser.title}</h2>

      {/* Description */}
      {fundraiser.description && (
        <p style={{ marginTop: "0.5rem" }}>{fundraiser.description}</p>
      )}

      {/* Goal + progress */}
      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <p>
          <strong>Goal:</strong> ${goal}
        </p>
        <p>
          <strong>Raised so far:</strong> ${totalPledged}
        </p>

        <div
          style={{
            backgroundColor: "#eee",
            borderRadius: "999px",
            overflow: "hidden",
            height: "12px",
            maxWidth: "300px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#2e7d32",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <p style={{ marginTop: "0.25rem" }}>{progressPercent}% funded</p>

        <p>
          <strong>Status:</strong> {fundraiser.is_open ? "Open" : "Closed"}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {fundraiser.date_created
            ? new Date(fundraiser.date_created).toLocaleString()
            : "Unknown"}
        </p>
      </div>

      {/* Owner actions */}
      {isOwner && (
        <div style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate(`/fundraiser/${fundraiser.id}/edit`)}
            style={{ marginRight: "0.5rem" }}
          >
            Edit fundraiser
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ marginRight: "0.5rem" }}
          >
            {isDeleting ? "Deleting..." : "Delete fundraiser"}
          </button>
          {deleteError && <p className="text-error">{deleteError}</p>}
        </div>
      )}

      {/* Pledges */}
          <h3>Pledges</h3>
      {fundraiser.pledges && fundraiser.pledges.length > 0 ? (
        <ul>
          {fundraiser.pledges.map((pledge, index) => {
            // Use username when available, otherwise fall back to supporter id
            const displaySupporter =
              pledge.supporter_username || pledge.supporter;
            const supporterName = pledge.anonymous
              ? "Anonymous"
              : displaySupporter;
            const isSupporterOwner =
              auth?.user && pledge.supporter === auth.user.id;
            return (
              <li key={pledge.id || index} style={{ marginBottom: "0.5rem" }}>
                <strong>${pledge.amount}</strong> from {supporterName}
                {pledge.comment && (
                  <div style={{ fontStyle: "italic" }}>
                    Comment: {pledge.comment}
                  </div>
                )}
                {isSupporterOwner && (
                  <div style={{ marginTop: "0.25rem" }}>
                    {editingPledgeId === pledge.id ? (
                      <form
                        onSubmit={(event) =>
                          handleEditPledgeSubmit(event, pledge.id)
                        }
                      >
                        <div>
                          <label htmlFor="comment">Edit comment</label>
                          <textarea
                            id="comment"
                            value={editPledgeData.comment}
                            onChange={handleEditPledgeChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="anonymous">
                            <input
                              id="anonymous"
                              type="checkbox"
                              checked={editPledgeData.anonymous}
                              onChange={handleEditPledgeChange}
                            />
                            {"  "}
                            Make this pledge anonymous
                          </label>
                        </div>
                        {editError && (
                          <p className="text-error">{editError}</p>
                        )}
                        <button
                          className="button-secondary"
                          type="submit"
                          disabled={isSavingEdit}
                        >
                          {isSavingEdit ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="button-secondary"
                          onClick={() => setEditingPledgeId(null)}
                          style={{ marginLeft: "0.5rem" }}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditingPledge(pledge)}
                      >
                        Edit my pledge
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No pledges yet.</p>
      )}

      {/* Pledge form (only when allowed) */}
      {canPledge ? (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Make a pledge</h3>
          <form className="form" onSubmit={handlePledgeSubmit}>
            <div className="form-field">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={pledge.amount}
                onChange={handlePledgeChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="comment">Comment (optional)</label>
              <textarea
                id="comment"
                value={pledge.comment}
                onChange={handlePledgeChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="anonymous" className="field-inline">
                <input
                  id="anonymous"
                  type="checkbox"
                  checked={pledge.anonymous}
                  onChange={handlePledgeChange}
                />
                <span>Make this pledge anonymous</span>
              </label>
            </div>

            {pledgeError && <p className="text-error">{pledgeError}</p>}

            <div className="form-actions">
              <button
                className="button-primary"
                type="submit"
                disabled={isSubmittingPledge}
              >
                {isSubmittingPledge ? "Submitting pledge..." : "Submit pledge"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p style={{ marginTop: "1rem" }}>
          {auth?.token
            ? "You can't pledge to your own fundraiser or this fundraiser is closed."
            : "Please log in to make a pledge."}
        </p>
      )}
      </div>
    </div>
  );
}

export default FundraiserPage;
