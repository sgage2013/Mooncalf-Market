import { csrfFetch } from "./csrf";
import { ICheckoutState } from "./types/checkout";
import { IActionCreator } from "./types/redux";

const CHECKOUT_START = 'checkout/start'
const CHECKOUT_SUCCESS = 'checkout/success'
const CHECKOUT_FAIL = 'checkout/fail'

export const checkoutStart = () => ({
    type: CHECKOUT_START,
});

export const checkoutSuccess = (clientSecret: string) => ({
    type: CHECKOUT_SUCCESS,
    payload: { clientSecret },
});

export const checkoutFail = (error: string) => ({
    type: CHECKOUT_FAIL,
    payload: {error}
});

export const checkoutStartThunk = () => async (dispatch: any) => {
    dispatch(checkoutStart());
    try{
        const res = await csrfFetch('/api/checkout/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
        });
        if(res.ok){
            const data = await res.json();
            dispatch(checkoutSuccess(data.clientSecret));
}    else{
    const error = await res.json();
    dispatch(checkoutFail(error))
}
}catch(e){
    const error = e as Response
    return await error.json()
}
};

const initialState: ICheckoutState = {
    clientSecret: null,
    errors: null,

};

function checkoutReducer(state = initialState, action: IActionCreator) {
    switch (action.type) {
        case CHECKOUT_START:
            return {
                ...state,
                errors: null,
                clientSecret: null,
            };
        case CHECKOUT_SUCCESS:
            return {
                ...state,
                clientSecret: action.payload.clientSecret,
                errors: null,
            };
        case CHECKOUT_FAIL:
            return {
                ...state,
                errors: action.payload.error,
            };
        default:
            return state;
    }
}

export default checkoutReducer;