import {csrfFetch} from "./csrf";
import {ICartState, ICartItem} from "./types/cart";
import {IActionCreator} from "./types/redux";

const SET_CART_ITEMS = 'cart/setCartItems';
const ADD_TO_CART = 'cart/addToCart';
const UPDATE_CART_ITEM = 'cart/updateCartItem';
const REMOVE_FROM_CART = 'cart/removeFromCart';
const CLEAR_CART = 'cart/clearCart';


export const setCartItems = (cart: ICartState['cart']) => ({
    type: SET_CART_ITEMS,
    payload: cart,
});
export const addToCart = (item: ICartItem) => ({
    type: ADD_TO_CART,
    payload: item,
});
export const updateCartItem = (item: ICartItem) => ({
    type: UPDATE_CART_ITEM,
    payload: item,
});
export const removeFromCart = (itemId: number) => ({
    type: REMOVE_FROM_CART,
    payload: itemId,
});
export const clearCart = () => ({
    type: CLEAR_CART,
}); 

export const getCartItemsThunk = (): any => async (dispatch: any) => {
    try {
        const res = await csrfFetch('/api/cart');
        if (res.ok) {
            const data = await res.json();
            dispatch(setCartItems(data));
        }
    } catch (e) {
        const error = e as Response;
        return await error.json();
    }
};
export const addToCartThunk = (itemId: number, quantity: number): any => async (dispatch: any) => {
    try {
        const res = await csrfFetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, quantity }),
        });
        if (res.ok) {
            const data = await res.json();
            dispatch(addToCart(data));
            dispatch(getCartItemsThunk());
        }
    } catch (e) {
        const error = e as Response;
        return await error.json();
    }
};
export const updateCartItemThunk = (itemId: number, quantity: number): any => async (dispatch: any) => {
    try {
        const res = await csrfFetch('/api/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ itemId, quantity }),
        });
        if (res.ok) {
            const data = await res.json();
            dispatch(updateCartItem(data));
            dispatch(getCartItemsThunk());
        }
    } catch (e) {
        const error = e as Response;
        return await error.json();
    }
};
export const removeFromCartThunk = (itemId: number): any => async (dispatch: any) => {
    try {
        const res = await csrfFetch(`/api/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (res.ok) {
            dispatch(removeFromCart(itemId));
            dispatch(getCartItemsThunk());
        } else {
            const error = await res.json();
            return error;
        }
    } catch (e) {
        const error = e as Response;
        return await error.json();
    }
};
export const clearCartThunk = (): any => async (dispatch: any) => {
    try {
        const res = await csrfFetch('/api/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (res.ok) {
            dispatch(clearCart());
        } else {
            const error = await res.json();
            return error;
        }
    } catch (e) {
        const error = e as Response;
        return await error.json();
    }
};

const initialState: ICartState = {
    cart: null,
    subTotal: 0,
    tax: 0,
    shipping: 0,
    orderTotal: 0,
    errors: null,
    loading: false,
};

const cartReducer = (state = initialState, action: IActionCreator): ICartState => {
    switch (action.type) {
        case SET_CART_ITEMS:
            return {
                ...state,
                cart: {
                    id: action.payload.id || null,
                    userId: action.payload.userId || null,
                    cartItems: action.payload.items || [],
                },
                loading: false,
                subTotal: action.payload.subTotal || 0,
                tax: action.payload.tax || 0,
                shipping: action.payload.shipping || 0,
                orderTotal: parseFloat(action.payload.orderTotal) || 0,
                errors: null,
            };
        case ADD_TO_CART:
            return state;
            
        case UPDATE_CART_ITEM:
            return state;

        case REMOVE_FROM_CART:
            return state;
        case CLEAR_CART:
            return {
               ...initialState,
                loading: false,
            };
            default:
                return state;
        }
    };
    
    export default cartReducer;