import { useEffect } from "react";
import { useAppDispatch, useAppSelector, RootState } from "../../redux/store";
import { getReviewByItemThunk } from "../../redux/reviews";
import { getOneItemThunk } from "../../redux/items";
import { IReview } from "../../redux/types/review";
import { IItemWithReviews } from "../../redux/types/item";
import { Rating } from "@mui/material";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import "./getAllReviews.css";

function GetAllReviews() {
    const { itemId } = useParams<{ itemId: string }>();
    const item: IItemWithReviews | null = useAppSelector((state) => state.items.currentItem);
  const dispatch = useAppDispatch();
  const reviews: IReview[] = useAppSelector((state: RootState) =>
      itemId ? (state.reviews.reviewsByItem[parseInt(itemId, 10)] || []) : []
    );
  const user = useAppSelector((state) => state.session.user);
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (itemId) {
      const itemNumber = parseInt(itemId, 10);
      dispatch(getOneItemThunk(itemNumber));
      dispatch(getReviewByItemThunk(itemNumber));
    }
  }, [dispatch, itemId]);

    if (!itemId) {
        return <div>Loading reviews...</div>;
    }

    if(!reviews || reviews.length === 0) {
        return (
          <div className="all-reviews-container">
            <h2>No reviews available for this item.</h2>
            <NavLink to={`/items/${item?.categoryId}/${item?.subcategoryId}/${item?.id}`} className="back-button">
              Back to Item
            </NavLink>
          </div>
        );
    }

  return (
    <div className="all-reviews-container">
        <h2>Reviews for {item?.name || `Item ${itemId}`}</h2>
       {item && (
         <NavLink to={`/category/${item.categoryId}/${item.subcategoryId}/items/${item.id}`} className="back-button">
           Back to Item
         </NavLink>
       )}
      {reviews.map((review: IReview) => (
        <div key={review.id} className="review-card">
          <Rating 
          name={`review-stars${review.id}`}
          value={review.stars} 
          readOnly
          size="small"
          />
          <p className="review-body">{review.reviewBody}</p>
          <span className="review-author">{review.user ? review.user.username : 'unknown'}</span>
          <span className="review-date">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default GetAllReviews;