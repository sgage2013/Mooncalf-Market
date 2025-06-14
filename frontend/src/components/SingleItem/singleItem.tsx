import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IItemWithReviews } from "../../redux/types/item";
import { IReview } from "../../redux/types/review";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getOneItemThunk } from "../../redux/items";
import { Rating } from "@mui/material";
import "./singleItem.css";

function SingleItem() {
  const { categoryId, subCategoryId, itemId } = useParams<{
    categoryId: string;
    subCategoryId: string;
    itemId: string;
  }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);

  const [item, setItem] = useState<IItemWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    let currentCategory: string;
    let currentSubcategory: string;
    let currentItem: string;

    if (categoryId && subCategoryId && itemId) {
      currentCategory = categoryId;
      currentSubcategory = subCategoryId;
      currentItem = itemId;
    } else {
      setErrors("Missing params");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrors(null);

    const categoryNumber = parseInt(currentCategory);
    const subCategoryNumber = parseInt(currentSubcategory);
    const itemNumber = parseInt(currentItem);

    dispatch(getOneItemThunk(categoryNumber, subCategoryNumber, itemNumber))
      .then((data: IItemWithReviews) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setErrors("Failed to load items");
        setLoading(false);
      });
  }, [dispatch, categoryId, subCategoryId, itemId]);

  if (loading) {
    return <div className="loading">Loading Item</div>;
  }
  if (!item) {
    return <div className="item-error">Item not found</div>;
  }
  if (errors) {
    <div className="errors">Error: {errors}</div>;
  }
  const images = [
    item.mainImageUrl,
    item.image2Url,
    item.image3Url,
    item.image4Url,
    item.image5Url,
  ].filter((url) => url !== null && url !== undefined) as string[];

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
                    className={`preview-thumbnail ${index === currentImage ? 'active' : ''}`}
                    onClick={() => setCurrentImage(index)}
                    />
                ))}
        </div>
          )}
      </div>
      <div className="item-info">
        <p className="price">
            ${item.price.toFixed(2)}
        </p>
        {item.reviewCount ? (
            <div className="rating">
                <Rating
                name='read-only-avg-rating'
                value={item.averageRating}
                precision={0.1}
                readOnly
                size='medium'
                />
                <span>
                    ({item.averageRating.toFixed(1)})
                </span>
            </div>) : (
                <p>No Reviews Yet</p>
        )};
        <p className="description">
        {item.description}
        </p>
        <div className="item-actions">
            <button className="add-to-cart">
                Add to Cart
            </button>
        </div>

      </div>
      <div className="reviews-container">
        <h2>
            Recent Reviews ({item.reviewCount})
        </h2>
        {item.reviews.length > 0 ? (
            <div className="recent-reviews">
                {item.reviews.map((review: IReview) => (
                    <div key={review.id} className='review-card'>
                        <Rating 
                        name={`review-stars${review.id}`}
                        value={review.stars}
                        readOnly
                        size="small"
                        />
                        <p className="review-body">
                            {review.reviewBody}
                        </p>
                        <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <p className="no-reviews">No Reviews Yet</p>
        )}
        <div className="review-action">
            <Link to={`/items/${item.id}/reviews`}
            >
                <button className="create-review">
                    Create Review
                </button>
                </Link>
                <Link to={`/items/${item.id}/reviews`}>
                <button>
                    View All Reviews ({item.reviewCount})
                </button>
                </Link>

        </div>

      </div>
    </div>
  )
}

export default SingleItem;
