import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import usersReducer from "./users";
import homeReducer from "./home";
import itemsReducer from "./items";
import categoriesReducer from "./categories";
import reviewsReducer from "./reviews";
import checkoutReducer from "./checkout";
import cartReducer from "./cart";
import orderReducer from "./order";

const rootReducer = combineReducers({
  session: sessionReducer,
  users: usersReducer,
  home: homeReducer,
  items: itemsReducer,
  categories: categoriesReducer,
  reviews: reviewsReducer,
  checkout: checkoutReducer,
  cart: cartReducer,
  order: orderReducer,
});



let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger:any = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState:any) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

const store = configureStore({
  rootReducer,
  devTools: import.meta.env.VITE_NODE_ENV !== 'production'
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
// export default configureStore;
