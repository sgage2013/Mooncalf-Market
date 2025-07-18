import { csrfFetch } from "./csrf";
import { IActionCreator } from "./types/redux";
import {
  ICredentials,
  IFullUser,
  ISignUpUser,
  IUser,
  SessionInitialState,
} from "./types/session";
import { UPDATE_PROFILE } from "./users";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

export const setUser = (user: IUser) => ({
  type: SET_USER,
  payload: user,
});

export const removeUser = () => ({
  type: REMOVE_USER,
});



export const thunkAuthenticate = (): any => async (dispatch: any) => {
  try {
    const response = await csrfFetch("/api/session");
    if (response.ok) {
      const data = await response.json();
      console.log("data", data);
      if (data.errors) {
        throw response;
      }
      dispatch(setUser(data.user));
      console.log("authenticated:", data.user);
    } else {
      dispatch(removeUser());
      throw response;
    }
  } catch (e) {
    dispatch(removeUser());
    console.log(e);
  }
};

export const thunkLogin =
  (credentials: ICredentials): any =>
  async (dispatch: any) => {
    try {
      let credential;

      if (credentials.email) {
        credential = credentials.email;
      } else if (credentials.credential) {
        credential = credentials.credential;
      } else {
        throw Error("Client Error: Invalid credential object");
      }

      const credentialRequest = {
        password: credentials.password,
        credential,
      };

      const response = await csrfFetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentialRequest),
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
        return response;
      } else {
        throw response;
      }
    } catch (e) {
      const err = e as Response;
      const errorMessages = await err.json();
      return errorMessages;
    }
  };

export const restoreUser = () => async (dispatch: any) => {
  const response = await csrfFetch("/api/session");
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } else {
    throw new Error("Unable to restore user");
  }
};

export const thunkSignup =
  (user: ISignUpUser): any =>
  async (dispatch: any) => {
    const { firstName, lastName, email, username, password } = user;
    try {
      const response = await csrfFetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          password,
          lastName,
          email,
          username,
        }),
      });
      const data = await response.json();
      dispatch(setUser(data.user));
    } catch (res: any) {
      if (!res.ok) {
        let errors = await res.json();
        return errors;
      }
    }
  };

export const thunkLogout = (): any => async (dispatch: any) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  dispatch(removeUser());
  return response;
};

const initialState: SessionInitialState = { user: null, loading: true };

function sessionReducer(
  state = initialState,
  action: IActionCreator
): SessionInitialState {
  let newState = {
    ...state,
  };

  switch (action.type) {
    case SET_USER:
      console.log("setUser action payload:", action.payload);
      return { ...state, user: action.payload, loading: false };
    case REMOVE_USER:
      return { ...state, user: null, loading: false };
    default:
      return state;
      case UPDATE_PROFILE:
        return {
          ...state,
          user: action.payload as IFullUser
        }
      }
}

export default sessionReducer;
