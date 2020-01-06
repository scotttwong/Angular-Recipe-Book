import * as ShoppingListActions from './shopping-list.actions';
import { Ingredient } from '../../shared/ingredient-model';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Pineapples', 2),
    new Ingredient('Tomatoes', 3)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function ShoppingListReducer(state = initialState, action: ShoppingListActions.Actions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const index = state.editedIngredientIndex;

      const newIngredient = { ...state.ingredients[index], ...action.payload };
      const newIngredients = [...state.ingredients];
      newIngredients[index] = newIngredient;

      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
        ingredients: newIngredients
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
        ingredients: state.ingredients.filter((ing, ingIndex) => {
          return ingIndex !== state.editedIngredientIndex;
        })
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredient: { ...state.ingredients[action.payload] },
        editedIngredientIndex: action.payload
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    default:
      return state;
  }
}
