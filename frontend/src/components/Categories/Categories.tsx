import { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getCategoryItemsThunk } from "../../redux/items";
import { IItem } from "../../redux/types/item";
import { ISubCategory, ICategory } from "../../redux/types/category";
import { Rating } from "@mui/material";
import './Categories.css'

function CategoryPage() {

    const { categoryId } = useParams<{ categoryId: string }>();
    const user = useAppSelector((state) => state.session.user)
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const categoryItems = useAppSelector(state => state.items.categoryItems);
    const allCategories = useAppSelector(state => state.categories.categories);
    const currentCategory: ICategory | undefined = allCategories.find((category: ICategory) => category.id === parseInt(categoryId || '', 10) )
    const subcategories: ISubCategory[] = currentCategory?.subCategories || [];
    const [loading, setLoading] = useState(true)
    const [errors, seterrors] = useState< string | null>(null)

     useEffect(() => {
        if (!user) {
          navigate("/login");
        }
      }, [user, navigate]);

    useEffect(() => {
        if(categoryId){
            const numberId = parseInt(categoryId || '', 10)
            if(!isNaN(numberId)){
            dispatch(getCategoryItemsThunk(numberId));
            }
        } else{
            seterrors('Failed to load categories');
            setLoading(false);
        }
    }, [dispatch, categoryId])
    
    if(!categoryId || !currentCategory){
        setLoading(false)
        return "Loading category info...."
    };
    if(errors) {
        return <div className="errors"> Error: {errors}</div>
    }

    return (
        <div className="category-page-container">
            <h1>{currentCategory.name}</h1>
            <div className="category-content-layout">
                    <h2>Subcategories</h2>
                <div className="subcategories">
                    {subcategories.length > 0 ? (
                        <ul>
        {subcategories.map((subCategory: ISubCategory) => (
            <li key={subCategory.id}>
                <NavLink to={`/category/${categoryId}/${subCategory.id}/items`} className='subcategory-link'>
                {subCategory.name}
                </NavLink>
            </li>
        ))}
    </ul>
) : (
    <p>No subcategories found</p>
)}
                </div>
                <div className="category-main-content">
                    <h2>New Arrivals</h2>
                    {categoryItems?.items && categoryItems.items.length > 0 ? (
                        <div className="items-grid">
                            {categoryItems.items.map((item: IItem) => (
                                <div key={item.id} className="item">
                                    <NavLink to={`/category/${categoryId}/${item.subCategoryId}/items/${item.id}`}>
                                    <img
                                    src={item.mainImageUrl} alt={item.name} className="item-image"/>
                                    <h3 className="item-name">{item.name}</h3>
                                    <p className="item-price">{item.price.toFixed(2)}</p>
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
                    ) : (
                        <div>No new arrivals</div>
                    )}
                </div>
            </div>
        </div>

    )
};

export default CategoryPage;