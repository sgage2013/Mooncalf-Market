import { useAppDispatch } from "../../redux/store";
import { deleteReviewThunk } from "../../redux/reviews";
import { useModal } from "../../context/Modal";
import { IExistingReview } from "../../redux/types/review";

interface DeleteReviewModalProps {
  review: IExistingReview; 
}

function DeleteReviewModal({ review }: DeleteReviewModalProps) {

const dispatch = useAppDispatch();
const { closeModal } = useModal();

const handleDelete = async () => {
    await dispatch(deleteReviewThunk(review.id));
    closeModal();
  };
  

  return (
    <div className="delete-review-modal">
      <h2>Delete Review</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="delete-review-actions">
        <button className="delete-review-button" onClick={handleDelete}>
          Delete
        </button>
        <button className="cancel-delete-button" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;