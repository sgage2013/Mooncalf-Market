import { csrfFetch } from "./csrf";
import { IItem, IItemState, IItemWithReviews } from "./types/item";
import { IActionCreator } from "./types/redux";

const GET_ALL_ITEMS = "items/getAllItems";
const GET_ONE_ITEM = "items/getOneItem";

export const getAllItems = (items: IItem[]) => ({
  type: GET_ALL_ITEMS,
  payload: items,
});
export const getOneItem = (items: IItemWithReviews) => ({
  type: GET_ONE_ITEM,
  payload: items,
});

export const getAllItemsThunk =
  (categoryId: number, subCategoryId: number): any =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch(
        `/api/category/${categoryId}/${subCategoryId}`
      );
      if(res.ok){
      const data = await res.json();
      dispatch(getAllItems(data.items));
      }
    } catch(e) {
      const error = e as Response;
      return await error.json();
    }
  };

export const getOneItemThunk =
  (categoryId: number, subCategoryId: number, itemId: number): any =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch(
        `/api/category/${categoryId}/${subCategoryId}/items/${itemId}`
      );
      if (res.ok) {
      const data = await res.json();
        dispatch(getOneItem(data));
      }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

  const initialState: IItemState = {
    allItems: [],
    currentItem: null,
    errors: null,
  }

  function itemsReducer(state = initialState, action: IActionCreator){
    switch (action.type){

        case GET_ALL_ITEMS:
        return {...state, allItems:action.payload, errors: null };
    
        case    GET_ONE_ITEM:
            return {...state, currentItem: action.payload, errors: null}

            default:
                return state
    }
  }

  export default itemsReducer;
