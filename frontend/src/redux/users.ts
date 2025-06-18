import { IPublicUser, IFullUser, IUserState } from "./types/session";
import { IActionCreator } from "./types/redux";
import { csrfFetch } from "./csrf";

const LOAD_USERS = "users/loadUser";
const GET_CURRENT_USER = "users/getOneUser";
const UPDATE_USER = "users/updateUser";
const DELETE_USER = "users/deleteUser";

export const getAllUsers = (user: IPublicUser[]) => ({
  type: LOAD_USERS,
  payload: user,
});

export const getCurrentUser = (user: IFullUser) => ({
  type: GET_CURRENT_USER,
  payload: user,
});

export const updateUser = (user: IFullUser) => ({
  type: UPDATE_USER,
  payload: user,
});
export const deleteUser = (user: IFullUser) => ({
  type: DELETE_USER,
  payload: user,
});

export const getAllUsersThunk = (): any => async (dispatch: any) => {
  try {
    const res = await csrfFetch("/api/users/all");

    if (res.ok) {
      const users = await res.json();
      dispatch(getAllUsers(users));
    }
  }catch (e) {
      const error = e as Response;
      return await error.json();
    }
};

export const getUserProfileThunk =
  (userId: number): any =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch(`/api/users/${userId}`);

      if (res.ok) {
        const user = await res.json();
        dispatch(getCurrentUser(user));
      }
    } catch (e) {
      const error = e as Response;
      return await error.json();
    }
  };

export const updateProfileThunk =
  (updatedData: Partial<IFullUser> & { password?: string }): any =>
  async (dispatch: any) => {
    try {
      const res = await csrfFetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(updateUser(data.user));
        return data.user;
      } else {
        return data;
      }
    } catch (e) {
      const err = e as Response;
      return await err.json();
    }
  };

export const DeleteProfilethunk = (): any => async (dispatch: any) => {
  try {
    const res = await csrfFetch("/api/users/profile", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.ok) {
      dispatch(deleteUser(data.user));
      return data.user;
    }
  } catch (e) {
    const error = e as Response;
    return await error.json();
  }
};

const initialState: IUserState = {
  allUsers: {},
  currentUser: null,
  errors: null,
};

function usersReducer(state = initialState, action: IActionCreator) {
  let newState = {
    ...state,
    allUsers: { ...state.allUsers },
  };

  switch (action.type) {
    case LOAD_USERS:
      const usersArray = action.payload as IPublicUser[];
      const newById: { [id: number]: IPublicUser } = {};
      usersArray.forEach((user) => {
        newById[user.id] = user;
      });
      newState.allUsers = newById;
      return newState;

    case GET_CURRENT_USER:
      newState.currentUser = action.payload as IFullUser;
      return newState;

    case UPDATE_USER:
      const updatedUser = action.payload as IFullUser;
      newState.allUsers[updatedUser.id] = updatedUser;

      if (newState.currentUser && newState.currentUser.id === updatedUser.id) {
        newState.currentUser = updatedUser;
      }
      return newState;

    case DELETE_USER:
      const deletedUser = action.payload as IFullUser;
      delete newState.allUsers[deletedUser.id];
      if (newState.currentUser?.id === deletedUser.id) {
        newState.currentUser = null;
      }
      return newState;

    default:
      return state;
  }
}

export default usersReducer;
