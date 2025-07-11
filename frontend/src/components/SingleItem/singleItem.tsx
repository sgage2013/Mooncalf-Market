import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IItemWithReviews } from "../../redux/types/item";
import { IReview, IExistingReview } from "../../redux/types/review";
import { useAppDispatch, useAppSelector, RootState } from "../../redux/store";
import { getOneItemThunk } from "../../redux/items";
import { getReviewByItemThunk } from "../../redux/reviews";
import { addToCartThunk } from "../../redux/cart";
import { Rating } from "@mui/material";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import UpdateReviewModal from "../Reviews/UpdateReviewModal";
import DeleteReviewModal from "../Reviews/DeleteReviewModal";
import "./singleItem.css";

function SingleItem() {
  const { itemId } = useParams<{
    categoryId: string;
    subCategoryId: string;
    itemId: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const item: IItemWithReviews | null = useAppSelector(
    (state) => state.items.currentItem
  );
  const reviews: IReview[] = useAppSelector((state: RootState) =>
    itemId ? state.reviews.reviewsByItem[parseInt(itemId, 10)] || [] : []
  );
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const refreshReviews = useCallback(() => {
    if (itemId) {
      const itemNumber = parseInt(itemId, 10);
      dispatch(getReviewByItemThunk(itemNumber));
    }
  }, [dispatch, itemId]);

  const getItemDetails = useCallback(() => {
    if (itemId) {
      const itemNumber = parseInt(itemId, 10);
      dispatch(getOneItemThunk(itemNumber));
    }
  }, [dispatch, itemId]);

  const handleReviewClose = useCallback(async () => {
    console.log("handle review close started");
    await refreshReviews();
    await getItemDetails();
    console.log("handle review close finished");
  }, [refreshReviews, getItemDetails]);

  useEffect(() => {
    refreshReviews();
    getItemDetails();
  }, [refreshReviews, getItemDetails]);

  const handleAddToCart = async () => {
    if (item?.id === undefined) return;
    const quantity = 1;
    const res = await dispatch(addToCartThunk(item.id, quantity));
    if (res) {
      alert(`${item?.name} has been added to your knapsack!`);
    }
  };
  useEffect(() => {
    let currentItem: string;

    if (itemId) {
      currentItem = itemId;
    } else {
      setLoading(false);
      setErrors("Missing params");
      return;
    }

    setLoading(false);
    setErrors(null);

    // const itemNumber = parseInt(currentItem);

    getItemDetails();
    refreshReviews();

    // if (!item || item.id !== itemNumber) {
    //   dispatch(getOneItemThunk(itemNumber));
    // }
  }, [itemId, refreshReviews, getItemDetails]);

  if (loading) {
    return <div className="loading">Loading Item</div>;
  }
  if (!item) {
    return <div className="item-error">Item not found</div>;
  }
  if (errors) {
    return <div className="errors">Error: {errors}</div>;
  }
  const images = [
    item.mainImageUrl,
    item.image2Url,
    item.image3Url,
    item.image4Url,
    item.image5Url,
  ].filter((url) => Boolean(url)) as string[];

  const handleNextImage = () => {
    setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="main-container">
      <div className="item-name">
        <p>{item.name}</p>
      </div>
      <div className="item-details">
        <div className="image-gallery-container">
          <div className="image-gallery">
            <img
              src={images[currentImage]}
              alt={item.name}
              className="main-image"
            />
            {images.length > 1 && (
              <>
                {" "}
                <button onClick={handlePrevImage} className="image-prev-button">
                  &lt;{" "}
                </button>
                <button onClick={handleNextImage} className="image-next-button">
                  &gt;
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="image-previews">
              {images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${item.name} preview ${index + 1}`}
                  className={`preview-thumbnail ${
                    index === currentImage ? "active" : ""
                  }`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="item-info">
          <p className="price">
            $
            {typeof item.price === "string"
              ? parseFloat(item.price).toFixed(2)
              : item.price.toFixed(2)}
          </p>
          {item.stars ? (
            <div className="rating">
              <Rating
                name="read-only-avg-rating"
                value={item.stars}
                precision={0.1}
                readOnly
                size="medium"
              />
              <span>({item.stars.toFixed(1)})</span>
            </div>
          ) : (
            <p>No Ratings Yet</p>
          )}
          <p className="description">{item.description}</p>
          <div className="item-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="reviews-container">
        <h2>Recent Reviews {item.reviewCount}</h2>
        {reviews.length > 0 ? (
          <div className="recent-reviews">
            {reviews.map((review: IReview) => (
              <div key={review.id} className="review-card">
                <Rating
                  name={`review-stars${review.id}`}
                  value={review.stars}
                  readOnly
                  size="small"
                />
                <p className="review-body">{review.reviewBody}</p>
                <span className="review-author">
                  {review.user ? review.user.username : "unknown"}
                </span>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>

                {user &&
                  user.id === review.userId &&
                  (console.log(
                    "user.id:",
                    user.id,
                    "review.userId:",
                    review.userId
                  ),
                  (
                    <div className="review-actions">
                      <OpenModalButton
                        buttonText="Update Review"
                        modalComponent={
                          <UpdateReviewModal
                            itemId={item.id}
                            review={review as IExistingReview}
                            onSuccess={handleReviewClose}
                          />
                        }
                        onModalClose={handleReviewClose}
                      />
                    </div>
                  ))}
                {user && user.id === review.userId && (
                  <OpenModalButton
                    buttonText="Delete Review"
                    modalComponent={
                      <DeleteReviewModal review={review as IExistingReview}
                        onSuccess={handleReviewClose}
                      />
                    }
                    onModalClose={handleReviewClose}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No Reviews Yet</p>
        )}
        <div className="review-action">
          {item.id !== undefined && (
            <OpenModalButton
              modalComponent={
                <CreateReviewModal
                  itemId={item.id}
                  onSuccess={handleReviewClose}
                />
              }
              buttonText="Write a Review"
              onModalClose={handleReviewClose}
            />
          )}
          {reviews.length > 0 && (
            <Link to={`/items/${item.id}/reviews`} className="view-all-reviews">
              View All Reviews {item.reviewCount}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleItem;
