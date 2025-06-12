import { csrfFetch } from "./csrf";
import { ICategory, ICategoryState } from "./types/category";
import { IActionCreator } from "./types/redux";

const GET_CATEGORIES = "categories/getCategories";

export const getCategories = (categories: ICategory[]) => ({
  type: GET_CATEGORIES,
  payload: categories,
});

export const getCategoriesThunk = (): any => async (dispatch: any) => {
  try {
    const res = await csrfFetch("api/categories");
    if (res.ok) {
      const data = await res.json();
      dispatch(getCategories(data.categories));
    }
  } catch (e) {
    const error = e as Response;
    return await error.json();
  }
};

const initialState: ICategoryState = {
  categories: [],
  errors: null,
};

function categoriesReducer(
  state = initialState,
  action: IActionCreator
): ICategoryState {
  switch (action.type) {
    case GET_CATEGORIES:
      return { ...state, categories: action.payload, errors: null };
    default:
      return state;
  }
}

export default categoriesReducer;
