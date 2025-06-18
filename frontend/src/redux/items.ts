import { csrfFetch } from "./csrf";
import { IItem, IItemState, IItemWithReviews } from "./types/item";
import { IActionCreator } from "./types/redux";

const GET_SUBCATEGORY_ITEMS = "items/getSubcategoryItems";
const GET_ONE_ITEM = "items/getOneItem";
const GET_CATEGORY_ITEMS = "items/getCategoryItems"


export const getSubcategoryItems = (items: IItem[]) => ({
  type: GET_SUBCATEGORY_ITEMS,
  payload: items,
});
export const getOneItem = (item: IItemWithReviews) => ({
  type: GET_ONE_ITEM,
  payload: item,
});
export const getCategoryItems = (items: IItem[]) => ({
  type: GET_CATEGORY_ITEMS,
  payload: items
});

export const getSubcategoryItemsThunk =
  (categoryId: number, subCategoryId: number): any =>
  async (dispatch: any) => {
    try {
      console.log('fetching with:', categoryId, subCategoryId)
      const res = await csrfFetch(
        `/api/subcategoryItems/category/${categoryId}/${subCategoryId}/items`
      );
      if(res.ok){
      const data = await res.json();
      dispatch(getSubcategoryItems(data.items));
      return data.items
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

  export const getCategoryItemsThunk = 
  (categoryId: number): any => async (dispatch: any) => {
    try {
      const res = await csrfFetch(`/api/category/${categoryId}/items`);
      if(res.ok){
        const data = await res.json();
        dispatch(getCategoryItems(data));
      }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

  const initialState: IItemState = {
    subCategoryItems: [],
    categoryItems: [],
    currentItem: null,
    errors: null,
  }

  function itemsReducer(state = initialState, action: IActionCreator){
    switch (action.type){

        case GET_SUBCATEGORY_ITEMS:
        return {...state, subCategoryItems:action.payload, errors: null };
    
        case GET_ONE_ITEM:
            return {...state, currentItem: action.payload, errors: null};

        case GET_CATEGORY_ITEMS: 
        return{...state, categoryItems: action.payload, errors: null};  

            default:
                return state
    }
  }

  export default itemsReducer;
