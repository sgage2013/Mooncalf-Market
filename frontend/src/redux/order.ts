import { IOrderPreview, IOrderState} from "./types/order";
import {IActionCreator} from "./types/redux";

const CREATE_ORDER = "order/createOrder";

export const createOrder = (order: IOrderPreview) => ({
  type: CREATE_ORDER,
  payload: order,
});

export const createOrderThunk =
  (paymentIntentId: string): any =>
  async (dispatch: any) => {
    try {
      const res = await fetch("/api/checkout/confirm-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (res.ok) {
        const data = await res.json();
        if(data.prder && data.success) {
        dispatch(createOrder(data.order));
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
      default:
        return state;
    }
  };

  export default orderReducer;