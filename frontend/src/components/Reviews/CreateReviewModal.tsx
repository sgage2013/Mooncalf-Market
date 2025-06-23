import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { useModal } from '../../context/Modal'
import { Rating } from '@mui/material'
import { createReviewThunk } from '../../redux/reviews'
import { useNavigate } from 'react-router-dom'
import './CreateReviewModal.css'

function CreateReviewModal({ itemId }: { itemId: number }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.session.user)
  const { closeModal } = useModal()
  const [stars, setStars] = useState<number>(0)
  const [reviewBody, setReviewBody] = useState<string>('')
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
  if (!user){
    navigate('/login')
  }
}, [user, navigate]);

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

  const newReview = {
    userId: user!.id,
    itemId: itemId,
    stars: stars,
    reviewBody: reviewBody,
    createdAt: new Date().toString(),
  };
  const createdReview = await dispatch(createReviewThunk(itemId, newReview));
  setIsSubmitting(false);

  if (createdReview && !createdReview.errors) {
    closeModal();
  } else if (createdReview && createdReview.errors) {
    setErrors(createdReview.errors);
  }
};

return (
  <div className="create-review-modal">
    <h2>Create Review</h2>
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
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
      <button type="button" onClick={closeModal} disabled={isSubmitting}>
        Cancel
      </button>
    </form>
  </div>
)
}

export default CreateReviewModal;
