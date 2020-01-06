import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authErrorMessage: string;
  isLoading: boolean;
}

const initialState = {
  user: null,
  authErrorMessage: null,
  isLoading: false
};

export function AuthReducer(state: State = initialState, action: AuthActions.Actions) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      // const user = new User(
      //   action.payload.email,
      //   action.payload.expiresInSecs,
      //   action.payload.idToken,
      //   action.payload.userId,
      //   action.payload.refreshToken
      // );
      return {
        ...state,
        user: action.payload.user,
        authErrorMessage: null,
        isLoading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        authErrorMessage: null,
        isLoading: false
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authErrorMessage: null,
        isLoading: true
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authErrorMessage: action.payload,
        isLoading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authErrorMessage: null
      };
    default:
      return state;
  }
}
