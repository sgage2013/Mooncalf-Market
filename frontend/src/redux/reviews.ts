import { csrfFetch } from "./csrf";
import { IActionCreator } from "./types/redux";
import { IReview, IReviewState } from "./types/review";

const GET_REVIEW_BY_ITEM = "/reviews/getReviewByItem";
const CREATE_REVIEW = "/reviews/createReview";
const UPDATE_REVIEW = "/reviews/updateReview";
const DELETE_REVIEW = "/reviews/deleteReview";

export const getReviewByItem = (itemId: number, reviews: IReview[]) => ({
  type: GET_REVIEW_BY_ITEM,
  payload: { itemId, reviews },
});

export const createReview = (review: IReview) => ({
  type: CREATE_REVIEW,
  payload: review,
});

export const updateReview = (review: IReview) => ({
  type: UPDATE_REVIEW,
  payload: review,
});
export const deleteReview = (reviewId: number) => ({
  type: DELETE_REVIEW,
  payload: { reviewId },
});

export const getReviewByItemThunk =
  (itemId: number): any =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch(`/api/items/${itemId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        dispatch(getReviewByItem(itemId, data));
      }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

export const createReviewThunk =
  (itemId: number, reviewData: IReview): any =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch(`/api/items/${itemId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(createReview(data.newReview));
        return data;
      }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

export const updateReviewThunk =
  (reviewId: number, reviewData: {reviewBody: string, stars: number}): any =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(updateReview(data));
      }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

export const deleteReviewThunk =
  (reviewId: number): any =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        dispatch(deleteReview(reviewId));
      }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

const initialState: IReviewState = {
  reviewsByItem: {},
  errors: null,
};

function reviewsReducer(
  state = initialState,
  action: IActionCreator
): IReviewState {
  switch (action.type) {
    case GET_REVIEW_BY_ITEM: {
      const { itemId, reviews } = action.payload as {
        itemId: number;
        reviews: IReview[];
      };
      return {
        ...state,
        reviewsByItem: {
          ...state.reviewsByItem,
          [itemId]: reviews,
        },
        errors: null,
      };
    }
    case CREATE_REVIEW: {
      const review = action.payload as IReview;
      const existingReviews = state.reviewsByItem[review.itemId] || [];
      return {
        ...state,
        reviewsByItem: {
          ...state.reviewsByItem,
          [review.itemId]: [review, ...existingReviews],
        },
        errors: null,
      };
    }
    case UPDATE_REVIEW: {
      const updatedReview = action.payload as IReview;
      const itemId = updatedReview.itemId;

      const updatedReviews = state.reviewsByItem[itemId]?.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      );
      return {
        ...state,
        reviewsByItem: {
          ...state.reviewsByItem,
          [itemId]: updatedReviews,
        },
        errors: null,
      };
    }
    case DELETE_REVIEW: {
      const deletedReview = action.payload as IReview;
      const itemId = deletedReview.itemId;

      const updatedReviews =
        state.reviewsByItem[itemId]?.filter(
          (review) => review.id !== deletedReview.id
        ) || [];

      return {
        ...state,
        reviewsByItem: {
          ...state.reviewsByItem,
          [itemId]: updatedReviews,
        },
        errors: null,
      };
    }
    default:
      return state;
  }
}

export default reviewsReducer;
