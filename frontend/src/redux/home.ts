import { csrfFetch } from "./csrf";
import { IItem } from "./types/item";
import { ICategory } from "./types/category";
import { IActionCreator } from "./types/redux";
import { IHomeState } from "./types/home";

const GET_HOME_DATA = 'items/getHomeData'

export const getHomeData = (data: {
    highestRated: IItem[];
    newArrivals: IItem[];
    categories: ICategory[];
}): any => ({
    type: GET_HOME_DATA,
    payload: data,
});

export const getHomeDataThunk = (): any => async (dispatch: any) => {
    try{
    const res = await csrfFetch('/api/home');
    const data = await res.json();
    if(res.ok){
    dispatch(getHomeData({
        highestRated: data.highestRated,
        newArrivals: data.newArrivals,
        categories: data.categories
    }));
}
    }catch(e) {
      const error = e as Response;
      return await error.json();
    }
};

const initialState: IHomeState = {
    highestRated: [],
    newArrivals: [],
    categories: [],
};

function homeReducer(state = initialState, action: IActionCreator){
    switch(action.type) {
        case GET_HOME_DATA:
            return {
                ...state,
                highestRated: action.payload.highestRated,
                newArrivals: action.payload.newArrivals,
                categories: action.payload.categories,
            };
            default: 
            return state;
    }
}

export default homeReducer;

