import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfileButton from "./ProfileButton";
import { useAppSelector } from "../../redux/store";
import { ISubCategory, ICategory } from "../../redux/types/category";
import {ICartItem} from "../../redux/types/cart";
import SearchIcon from '@mui/icons-material/Search'
import BackpackOutlinedIcon from '@mui/icons-material/BackpackOutlined'
import "./Navigation.css";

function Navigation(): JSX.Element {
  const categories = useAppSelector((state) => state.categories.categories);
  const [hoverCategory, setHoverCategory] = useState<ICategory | null>(null);
  const user = useAppSelector((state) => state.session.user);
  const cartItems = useAppSelector((state) => state.cart.cart?.cartItems || []);

  const handleCategoryHover = (category: ICategory) => {
    setHoverCategory(category);
  };
  const handleCategoryLeave = () => {
    setHoverCategory(null);
  };
  const totalItems = cartItems.reduce(
    (acc: number, item: ICartItem) => acc + item.quantity,
    0
  );
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  alert("Search function coming soon!");
};


  return (
    <>
    <div className="nav-wrapper">
      <header className="main-header">
        <div className="header-top">
          <div className="search-logo">
        <NavLink to="/home" className="logo-link">
 <div className="logo-container">
          <img src="/logo.png" alt="Home Logo" className="logo" />
          </div>
          <span className='logo-name'>MOONCALF MARKET</span>
        </NavLink>
      </div>
          <form
            className="search-bar"
                onSubmit={handleSearch}
          >
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search wands, cloaks, potions..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          <div className="cart-profile-group">
            <div className="profile-cart">
              <ProfileButton />
              {!user && <span className="nav-action-label">Sign in</span>}
            </div>

            <NavLink to="/cart" className="cart-link">
              <BackpackOutlinedIcon className="shopping-cart" />
              <span className="nav-action-label">Knapsack</span>
              <span className="knapsack-badge">{totalItems}</span>
            </NavLink>
          </div>
        </div>
      </header>
      <nav className="categories-nav">
        <div className="categories-nav-inner">
        
        {categories.map((category: ICategory) => (
            <div
              key={category.id}
              className="category-item"
              onMouseEnter={() => handleCategoryHover(category)}
              onMouseLeave={handleCategoryLeave}
            >
              <NavLink to={`/category/${category.id}`} className="category-link">
                {category.name}
              </NavLink>
              {hoverCategory &&
                hoverCategory.id === category.id &&
                hoverCategory.subcategories &&
                hoverCategory.subcategories.length > 0 && (
                  <div className="sub-category-dropdown">
                    {hoverCategory.subcategories.map(
                      (subCategory: ISubCategory) => (
                        <NavLink
                          key={subCategory.id}
                          to={`/category/${category.id}/${subCategory.id}/items`}
                          className="sub-category-link"
                        >
                          {subCategory.name}
                        </NavLink>
                      )
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      </nav>
    </div>
    </>
  );
}

export default Navigation;
