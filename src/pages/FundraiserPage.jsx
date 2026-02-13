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

  const goal = fundraiser.goal || 0;
  const progress =
    goal > 0 ? Math.min(100, Math.round((totalPledged / goal) * 100)) : 0;

  const isOwner =
    auth?.user && fundraiser.owner && fundraiser.owner === auth.user.id;

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
    <div style={{ padding: "1rem" }}>
      {/* Image + title */}
      {fundraiser.image && (
        <div style={{ marginBottom: "1rem" }}>
          <img
            src={fundraiser.image}
            alt={fundraiser.title}
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      )}

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

        <p style={{ marginTop: "0.25rem" }}>{progress}% funded</p>

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
            onClick={() => navigate(`/fundraiser/${fundraiser.id}/edit`)}
            style={{ marginRight: "0.5rem" }}
          >
            Edit fundraiser
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ marginRight: "0.5rem" }}
          >
            {isDeleting ? "Deleting..." : "Delete fundraiser"}
          </button>
          {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
        </div>
      )}

      {/* Pledges */}
      <h3>Pledges</h3>
      {fundraiser.pledges && fundraiser.pledges.length > 0 ? (
        <ul>
          {fundraiser.pledges.map((pledge, index) => {
            // If your backend supports anonymous + comment
            const supporterName = pledge.anonymous
              ? "Anonymous"
              : pledge.supporter;
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
                          <p style={{ color: "red" }}>{editError}</p>
                        )}
                        <button type="submit" disabled={isSavingEdit}>
                          {isSavingEdit ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
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

      {/* Pledge form (only when logged in) */}
      {auth?.token ? (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Make a pledge</h3>
          <form onSubmit={handlePledgeSubmit}>
            <div>
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
            <div>
              <label htmlFor="comment">Comment (optional)</label>
              <textarea
                id="comment"
                value={pledge.comment}
                onChange={handlePledgeChange}
              />
            </div>
            <div>
              <label htmlFor="anonymous">
                <input
                  id="anonymous"
                  type="checkbox"
                  checked={pledge.anonymous}
                  onChange={handlePledgeChange}
                />
                {"  "}
                Make this pledge anonymous
              </label>
            </div>

            {pledgeError && <p style={{ color: "red" }}>{pledgeError}</p>}

            <button type="submit" disabled={isSubmittingPledge}>
              {isSubmittingPledge ? "Submitting pledge..." : "Submit pledge"}
            </button>
          </form>
        </div>
      ) : (
        <p style={{ marginTop: "1rem" }}>
          Please log in to make a pledge.
        </p>
      )}
    </div>
  );
}

export default FundraiserPage;
