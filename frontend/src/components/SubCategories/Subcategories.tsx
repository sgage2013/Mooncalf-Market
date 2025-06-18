import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useParams, NavLink, useNavigate } from "react-router-dom";

import { IItem } from "../../redux/types/item";
import { getSubcategoryItemsThunk } from "../../redux/items";
import { Rating } from "@mui/material";

function SubcategoryItems() {
  const { categoryId, subCategoryId } = useParams<{
    categoryId: string;
    subCategoryId: string;
  }>();
  const user = useAppSelector((state) => state.session.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.items.subCategoryItems);
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string | null>(null)

   useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [user, navigate]);

  useEffect(() => {
    if (categoryId && subCategoryId) {
      const numberCategory = parseInt(categoryId || "", 10);
      const numberSubcategory = parseInt(subCategoryId || "", 10);
      if (!isNaN(numberCategory) && !isNaN(numberSubcategory)) {
        dispatch(getSubcategoryItemsThunk(numberCategory, numberSubcategory));
        setLoading(false);
        setErrors(null)
      }
    }
  }, [dispatch, categoryId, subCategoryId]);

  if (loading) {
    setLoading(false)
    return "Loading Items...";
  }
  if(errors){
    setErrors(errors)
    return <div className="errors">Error: {errors}</div>
  }

  return (
    <div className="items-container">
      <h2>Items</h2>
      <div className="items-grid">
        {items.map((item: IItem) => (
          <div className="item-card" key={item.id}>
            <NavLink
              to={`/category/${item.categoryId}/${item.subCategoryId}/items/${item.id}`}
            >
              <img
                src={item.mainImageUrl}
                alt={item.name}
                className="item-image"
              />
              <h3 className="item-name">{item.name}</h3>
              <p className="item-price">{item.price}</p>
              <div className="item-rating">
                <Rating
                  name={`item-rating=${item.id}`}
                  value={item.avgRating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <span className="item-avg-rating">
                  {item.avgRating !== null && typeof item.avgRating === 'number' 
                    ? item.avgRating.toFixed(1)
                    : 'No ratings yet'}{" "}
                  ({item.reviewCount} reviews)
                </span>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubcategoryItems;
