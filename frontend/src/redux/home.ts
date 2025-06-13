import { csrfFetch } from "./csrf";
import { IItem } from "./types/item";
import { ICategory } from "./types/category";
import { IActionCreator } from "./types/redux";
import { IHomeState } from "./types/home";

const GET_HOME_DATA = 'items/getHomeData'

export const getHomeData = (data: {
    highestRated: IItem[];
    newest: IItem[];
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
        newest: data.newest,
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
    newest: [],
    categories: [],
};

function homeReducer(state = initialState, action: IActionCreator){
    switch(action.type) {
        case GET_HOME_DATA:
            return {
                ...state,
                highestRated: action.payload.highestRated,
                newest: action.payload.newest,
                categories: action.payload.categories,
            };
            default: 
            return state;
    }
}

export default homeReducer;

