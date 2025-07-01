import { IOrderPreview, IOrderState} from "./types/order";
import {IActionCreator} from "./types/redux";
import { csrfFetch } from "./csrf";

const CREATE_ORDER = "order/createOrder";
const ORDER_SUCCESS = "order/orderSuccess";

export const createOrder = (order: IOrderPreview) => ({
  type: CREATE_ORDER,
  payload: order,
});
export const orderSuccess = (order: IOrderPreview) => ({
  type: ORDER_SUCCESS,
  payload: order,
});

export const createOrderThunk =
  (paymentIntentId: string, shippingInfo: { address: string; city: string; state: string; zip: string }) =>
  async (dispatch: any) => {
    try {
      console.log('shippingInfo', shippingInfo);
      const res = await csrfFetch("/api/checkout/confirm-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId, ...shippingInfo }),
      });

      if (res.ok) {
        const data = await res.json();
        if(data.order && data.success) {
        dispatch(createOrder(data.order));
        return data.order;
      } 
    }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

  export const orderSuccessThunk =
  (orderId: number) =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch(`/api/checkout/success/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          dispatch(orderSuccess(data.order));
          return data.order;
        }
      }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

  const initialState: IOrderState = {
    orders: [],
    order: null,
    orderPreview: null,
    isLoading: false,
    errors: null,
  };

  const orderReducer = (state = initialState, action: IActionCreator) => {
    switch (action.type) {
      case CREATE_ORDER:
        return {
          ...state,
          orders: [...state.orders, action.payload],
            orderPreview: action.payload,
            errors: null,
        };
        case ORDER_SUCCESS:
        return {
          ...state,
          order: action.payload,
          errors: null,
        };
      default:
        return state;
    }
  };

  export default orderReducer;