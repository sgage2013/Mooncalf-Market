import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { IItem } from "../../redux/types/item";
import { IHomeState } from "../../redux/types/home";
import { getHomeDataThunk } from "../../redux/home";
import { addToCartThunk } from "../../redux/cart";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import "./home.css";

function Home() {
  const dispatch = useAppDispatch();
  const { highestRated, newArrivals } = useAppSelector(
    (state) => state.home as IHomeState,
  );
  const [homeLoading, setHomeLoading] = useState(true);
  const [errors, setErrors] = useState<string | null>(null);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const getQty = (itemId: number) => quantities[itemId] ?? 1;

  useEffect(() => {
    const getHomeData = async () => {
      setErrors(null);
      setHomeLoading(true);
      try {
        await dispatch(getHomeDataThunk());
        setHomeLoading(false);
        setErrors(null);
      } catch (error: any) {
        setErrors("Failed to load home data");
        setHomeLoading(false);
      }
    };
    getHomeData();
  }, [dispatch]);

  const scrollToShop = () => {
    const el = document.getElementById("most-loved");
    el?.scrollIntoView({ behavior: "smooth" });
  };
  const addToCart = (item: IItem) => {
    const qty = getQty(item.id);
    dispatch(addToCartThunk(item.id, qty));
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId((prev) => (prev === item.id ? null : prev));
    }, 1800);
  };

  if (homeLoading) {
    return <div className="loading">Loading home...</div>;
  }

  if (errors) {
    setErrors(errors);
    setHomeLoading(false);
    return (
      <div className="main-container">
        <div className="home-container">
          <div>Error: {errors}</div>
          <button
            type="button"
            className="mm-btn mm-btn--ghost"
            onClick={() => dispatch(getHomeDataThunk())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="home-container">
        <div className="hero-section">
          <div className="hero-content">
            <p className="hero-eyebrow">EST. 2024</p>
            <h1 className="hero-headline">BEYOND ORDINARY.</h1>
            <p className="hero-subheadline">
              Shop spells, scrolls, and supplies — no wand-waving required
            </p>
          </div>
          <div className="hero-actions">
            <button
              type="button"
              onClick={scrollToShop}
              className="hero-btn-primary"
            >
              Shop the collection →
            </button>
            <Link to="/category/3" className="hero-btn-secondary">
              Find your wand
            </Link>
          </div>
        </div>
        <div className="highest-rated" id="most-loved">
          <p className="section-eyebrow">CUSTOMER FAVORITES</p>
          <h2>MOST LOVED ITEMS</h2>

          <div className="items-grid">
            {highestRated.map((item: IItem) => (
              <div key={item.id} className="item-card">
                <Link
                  to={`/category/${item.categoryId}/${item.subCategoryId}/items/${item.id}`}
                >
                  <div className="item-image-wrap">
                    <span className="item-badge">BESTSELLER</span>
                    <img
                      src={item.mainImageUrl}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>
                  <h3 className="item-title">{item.name}</h3>
                  <div className="item-rating">
                    {item.avgRating !== null &&
                    typeof item.avgRating === "number" ? (
                      <>
                        <StarRoundedIcon
                          style={{ color: "#F5C427" }}
                          aria-hidden="true"
                        />
                        <span className="item-avg-rating">
                          {item.avgRating.toFixed(1)}
                        </span>
                        {typeof item.reviewCount === "number" && (
                          <span className="item-review-count">
                            ({item.reviewCount})
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="item-review-count">No ratings yet</span>
                    )}
                  </div>
                </Link>
                <div className="item-card-footer">
                  <p className="item-price">
                    $
                    {typeof item.price === "string"
                      ? parseFloat(item.price).toFixed(2)
                      : item.price.toFixed(2)}
                  </p>
                  <div className="item-add-controls">
                    <div className="item-qty-stepper">
                      <button
                        type="button"
                        className="item-qty-btn"
                        aria-label={`Decrease quantity for ${item.name}`}
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.id]: Math.max(1, (prev[item.id] ?? 1) - 1),
                          }))
                        }
                      >
                        −
                      </button>
                      <span className="item-qty-value">{getQty(item.id)}</span>
                      <button
                        type="button"
                        className="item-qty-btn"
                        aria-label={`Increase quantity for ${item.name}`}
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.id]: Math.min(99, (prev[item.id] ?? 1) + 1),
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="item-add-pill"
                      onClick={() => addToCart(item)}
                    >
                      {addedItemId === item.id ? "Added!" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="new-arrivals">
          <p className="section-eyebrow">FRESHLY CONJURED</p>
          <h2>Shop our newest arrivals</h2>

          <div className="items-grid">
            {newArrivals.map((item: IItem) => (
              <div key={item.id} className="item-card">
                <Link
                  to={`/category/${item.categoryId}/${item.subCategoryId}/items/${item.id}`}
                >
                  <div className="item-image-wrap">
                    <span className="item-badge">NEW</span>
                    <img
                      src={item.mainImageUrl}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>
                  <h3 className="item-title">{item.name}</h3>
                  {item.avgRating && (
                    <div className="item-rating">
                      {item.avgRating !== null &&
                      typeof item.avgRating === "number" ? (
                        <>
                          <StarRoundedIcon
                            style={{ color: "#F5C427" }}
                            aria-hidden="true"
                          />
                          <span className="item-avg-rating">
                            {item.avgRating.toFixed(1)}
                          </span>
                          {typeof item.reviewCount === "number" && (
                            <span className="item-review-count">
                              ({item.reviewCount})
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="item-review-count">
                          No ratings yet
                        </span>
                      )}
                    </div>
                  )}
                </Link>
                <div className="item-card-footer">
                  <p className="item-price">
                    $
                    {typeof item.price === "string"
                      ? parseFloat(item.price).toFixed(2)
                      : item.price.toFixed(2)}
                  </p>
                  <div className="item-add-controls">
                    <div className="item-qty-stepper">
                      <button
                        type="button"
                        className="item-qty-btn"
                        aria-label={`Decrease quantity for ${item.name}`}
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.id]: Math.max(1, (prev[item.id] ?? 1) - 1),
                          }))
                        }
                      >
                        −
                      </button>
                      <span className="item-qty-value">{getQty(item.id)}</span>
                      <button
                        type="button"
                        className="item-qty-btn"
                        aria-label={`Increase quantity for ${item.name}`}
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.id]: Math.min(99, (prev[item.id] ?? 1) + 1),
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="item-add-pill"
                      onClick={() => addToCart(item)}
                    >
                      {addedItemId === item.id ? "Added!" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
