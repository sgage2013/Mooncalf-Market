import { ICartItemData } from "../../redux/types/cart";
import './CartItem.css';

function CartItem({
  cartItem,
  onUpdateQuantity,
  onRemoveFromCart,
}: ICartItemData) {
  const { item, quantity } = cartItem;

  const handleUpdateQuantity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    onUpdateQuantity(item.id, newQuantity);
  };
  const handleRemoveFromCart = () => {
    onRemoveFromCart(item.id);
  };
  const itemTotal = (item.price * quantity).toFixed(2);

  return (
    <div className="cart-item">
      <img
        src={item.mainImageUrl}
        alt={item.name}
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
        <div className="cart-item-quantity">
          <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
          <select
            id={`quantity-${item.id}`}
            value={quantity}
            onChange={handleUpdateQuantity}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
            <option value="0">Remove</option>
          </select>
          <p>Item Total: ${itemTotal}</p>
        </div>
        <p className="cart-item-total">Total: ${itemTotal}</p>
      </div>
        <button
          onClick={handleRemoveFromCart}
          className="remove-from-cart-button"
        >
          Remove
        </button>
    </div>
  );
}

export default CartItem;
