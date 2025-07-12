import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { IItem } from "../../redux/types/item";
import { IHomeState } from "../../redux/types/home";
import { getHomeDataThunk } from "../../redux/home";
import { Rating } from "@mui/material";
import "./home.css";

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { highestRated, newArrivals } = useAppSelector(
    (state) => state.home as IHomeState
  );
  const user = useAppSelector((state) => state.session.user);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setErrors(null);
    dispatch(getHomeDataThunk())
      setLoading(false);
      setErrors(null);
  }, [dispatch]);


  if (loading) {
    return <div>Loading home...</div>;
  }

  if (errors) {
    setErrors(errors)
    setLoading(false)
    return <div>Error: {errors}</div>;
  }

  return (
    <div className="main-container">
      <div className="home-container">
        <div className="highest-rated">
          <h2>Highest Rated Items</h2>
        
        <div className="items-grid">
          {highestRated.map((item: IItem) => (
            <div key={item.id} className="item-card">
              <Link
                to={`/category/${item.categoryId}/${item.subCategoryId}/items/${item.id}`}
              >
                <img
                  src={item.mainImageUrl}
                  alt={item.name}
                  className="item-image"
                />
                <h3 className="item-title">{item.name}</h3>
                <p className="item-price">${typeof item.price === "string" ?
                parseFloat(item.price).toFixed(2) : item.price.toFixed(2)}</p>
                <div className="item-rating">
                  <Rating
                    name={`item-rating=${item.id}`}
                    value={item.avgRating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <span className="item-avg-rating">
                    {item.avgRating !== null &&
                    typeof item.avgRating === "number"
                      ? (item.avgRating || 0).toFixed(1)
                      : "No ratings yet"}{" "}
                    {item.reviewCount}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        </div>

        <div className="new-arrivals">
          <h2>New Arrivals</h2>
          <div className="items-grid">
            {newArrivals.map((item: IItem) => (
              <div key={item.id} className="item-card">
                <Link
                  to={`/category/${item.categoryId}/${item.subCategoryId}/items/${item.id}`}
                >
                  <img
                    src={item.mainImageUrl}
                    alt={item.name}
                    className="item-image"
                  />
                  <h3 className="item-title">{item.name}</h3>
                  <p className="item-price">
                    ${typeof item.price === "string" ?
                    parseFloat(item.price).toFixed(2) : item.price.toFixed(2)}
                  </p>
                  {item.avgRating && (
                    <div className="item-rating">
                      <Rating
                        name={`item-rating-${item.id}`}
                        value={item.avgRating}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <span className="item-avg-rating">
                        {(item.avgRating || 0).toFixed(1)}
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
