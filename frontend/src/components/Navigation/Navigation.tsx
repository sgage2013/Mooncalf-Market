import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfileButton from "./ProfileButton";
import { useAppSelector } from "../../redux/store";
import { ISubCategory, ICategory } from "../../redux/types/category";
import "./Navigation.css";

function Navigation(): JSX.Element {
  const categories = useAppSelector((state) => state.categories.categories);
  const [hoverCategory, setHoverCategory] = useState<ICategory | null>(null);

  const handleCategoryHover = (category: ICategory) => {
    setHoverCategory(category);
  };
  const handleCategoryLeave = () => {
    setHoverCategory(null);
  };

  return (
    <>
      <header className="main-header">
        <div className="header-top">
          <div className="search-logo">
 <div className="logo-container">
        <NavLink to="/home">
          <img src="/logo.jpg" alt="Home Logo" className="logo" />
        </NavLink>
          </div>
      </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" className="search-input" />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
          <div>
            <NavLink to="/cart" className="cart-link">
              <img
                src="find later"
                alt="Shopping Cart"
                className="shopping-cart"
              />
            </NavLink>
          </div>
          <div className="profile-cart">
                 <ProfileButton />
          </div>
        </div>
      </header>
      <nav className="categories-nav">
        
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
                hoverCategory.subCategories &&
                hoverCategory.subCategories.length > 0 && (
                  <div className="sub-category-dropdown">
                    {hoverCategory.subCategories.map(
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
      </nav>
    </>
  );
}

export default Navigation;
