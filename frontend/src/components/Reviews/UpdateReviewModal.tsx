import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { useModal } from '../../context/Modal'
import { Rating } from '@mui/material'
import { updateReviewThunk } from '../../redux/reviews'
import { useNavigate } from 'react-router-dom'
import { IExistingReview } from '../../redux/types/review'
import './UpdateReviewModal.css'

interface IUpdateReviewModalProps {
  itemId: number;
  review: IExistingReview
}

function UpdateReviewModal({ review }: IUpdateReviewModalProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.session.user)
  const { closeModal } = useModal()
  const [stars, setStars] = useState<number>(review.stars)
  const [reviewBody, setReviewBody] = useState<string>(review.reviewBody)
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
  if (!user){
    navigate('/login')
  }
}, [user, navigate]);

useEffect(() => {
    setStars(review.stars);
    setReviewBody(review.reviewBody);
}, [review]);

useEffect(() => {
    if(user && review && user.id !== review.userId) {
        closeModal();
    }
}, [user, review, review.userId, closeModal]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrors([]);
  let validationErrors: string[] = [];
  if (stars < 1 || stars > 5) {
    validationErrors.push('Please provide a star rating between 1 and 5 stars.');
  }
  if (reviewBody.length < 25 || reviewBody.length > 250) {
    validationErrors.push('Review body must be between 25 and 250 characters.');
  }
  if (validationErrors.length) {
    setErrors(validationErrors);
    return;
  }
  setIsSubmitting(true);

  const updatedReviewData = {
    stars: stars,
    reviewBody: reviewBody,
  };
  const updatedReview = await dispatch(updateReviewThunk(review!.id, updatedReviewData));
  setIsSubmitting(false);

  if (updatedReview && !updatedReview.errors) {
    closeModal();
  } else if (updatedReview && updatedReview.errors) {
    setErrors(updatedReview.errors);
  }
};

return (
  <div className="update-review-modal">
    <form onSubmit={handleSubmit}>
      <div>
        <Rating
          name="star-rating"
          value={stars}
          onChange={(event, newValue) => {
            setStars(newValue || 0);
          }}
          precision={1}
          size='large'
        />
      </div>
      <div>
        <textarea
          value={reviewBody}
          onChange={(e) => setReviewBody(e.target.value)}
          placeholder="Write your review here..."
          maxLength={250}
        />
      </div>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
            </div>
          ))}
        </div>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Update Review'}
      </button>
      <button type="button" onClick={closeModal} disabled={isSubmitting}>
          Cancel
        </button>
    </form>
  </div>
)
}

export default UpdateReviewModal;
