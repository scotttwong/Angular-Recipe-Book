import { Recipe } from '../recipe.model';
import * as RecipeActions from '../store/recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function RecipeReducer(state: State = initialState, action: RecipeActions.Actions) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: action.payload
      };
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case RecipeActions.UPDATE_RECIPE:
      const index = action.payload.index;
      const newRecipe = { ...state.recipes[index], ...action.payload.recipe };
      const newRecipes = [...state.recipes];
      newRecipes[index] = newRecipe;

      return {
        ...state,
        recipes: newRecipes
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((val, idx) => {
          return idx !== action.payload;
        })
      };
    case RecipeActions.FETCH_RECIPES:
      return state;
    default:
      return state;
  }
}
