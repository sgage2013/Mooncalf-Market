import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { IItem } from "../../redux/types/item";
import { IHomeState } from "../../redux/types/home";
import { getHomeDataThunk } from "../../redux/home";
import { Rating } from "@mui/material";
import './home.css'

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { highestRated, newArrivals, categories } = useAppSelector(
    (state) => state.home as IHomeState);
  const user = useAppSelector((state) => state.session.user);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState<string | null>(null);

  
  useEffect(() => {

      if(!user){
          navigate('/login')
        }
    }, [user, navigate])

  useEffect(() => {
    setErrors(null);
    dispatch(getHomeDataThunk())
    .then(() => setLoading(false))
    .catch((error: any) => {
        setErrors(error.message);
        setLoading(false)
    })
  }, [dispatch]);

  if (loading) {
    return <div>Loading home...</div>;
  }

  if (errors) {
    return <div>Error: {errors}</div>;
  }

  return (
    <div className="main-container">
      <div className="home-container">
        <div className="highest-rated">
            <h2>Highest Rated Items</h2>
        </div>
        <div className="items-grid">
            {highestRated.map((item: IItem) => (
                <div key={item.id} className="item-card">
                    <Link to ={`category/${item.categoryId}/${item.subCategoryId}/items/${item.id}`}>
                    <img
                    src={item.mainImageUrl}
                    alt={item.name}
                    className="item-image"
                    />
                    <h3 className="item-title">{item.name}</h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    {item.avgRating && (
                        <div className='item-rating'>
                            <Rating
                            name={`item-raying-${item.id}`}
                            value={item.avgRating}
                            precision={0.1}
                            readOnly
                            size="small"
                            />
                            <span className='item-avg-rating'>{item.avgRating.toFixed(1)}</span>
                        </div>
                    )}
                    </Link>
                    </div>
            ))}
        </div>

      <div className="newArrivals">
        <h2>NewArrivals</h2>
        <div className="items-grid">
            {newArrivals.map((item: IItem) => (
                <div key={item.id} className='item-card'>
                    <Link to={`/category/${item.categoryId}/${item.subCategoryId}/items/${item.id}`}>
                    <img
                    src={item.mainImageUrl}
                    alt={item.name}
                    className="item-image"
                    />
                    <h3 className="item-title">{item.name}</h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    {item.avgRating && (
                        <div className="item-rating">
                            <Rating
                            name={`item-rating-${item.id}`}
                            value={item.avgRating}
                            precision={0.1}
                            readOnly
                            size="small"
                            />
                            <span className="item-avg-rating">{item.avgRating.toFixed(1)}</span>
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
