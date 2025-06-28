export interface ICartItem {
    id: number;
    quantity: number;
    itemId: number;
    item: {
        id: number;
        name: string;
        price: number;
        mainImageUrl: string;
        avgRating?: number;
    }
}

export interface ICartState {
    cart: {
        id: number;
        userId: number;
        cartItems: ICartItem[];
    } | null;
    subTotal: number;
    tax: number;
    shipping: number;
    orderTotal: number;
    errors: string | null;
    loading: boolean;
}

export interface ICartItemData {
   cartItem: ICartItem;
   onUpdateQuantity: (itemId: number, quantity: number) => void;
   onRemoveFromCart: (itemId: number) => void;
}