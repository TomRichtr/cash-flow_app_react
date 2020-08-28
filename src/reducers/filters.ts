import {
  SortBy,
  SetFrom,
  SetTo,
  SetTextFilter,
  SetTypeFilter,
  ResetFilters,
} from "../actions/filters";

const filtersReducerDefaultState = {
  text: "",
  types: "",
  sortBy: "date",
  from: undefined,
  to: undefined,
};

export default (
  state = filtersReducerDefaultState,
  action:
    | SortBy
    | SetFrom
    | SetTo
    | SetTextFilter
    | SetTypeFilter
    | ResetFilters
) => {
  switch (action.type) {
    case "SET_TEXT_FILTER":
      return { ...state, text: action.text };
    case "SET_TYPE_FILTER":
      return { ...state, types: action.types };
    case "SORT_BY":
      return { ...state, sortBy: action.sortBy };
    case "SET_FROM":
      return { ...state, from: action.from };
    case "SET_TO":
      return { ...state, to: action.to };
    case "RESET_FILTERS":
      return filtersReducerDefaultState;
    default:
      return {
        ...state,
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      };
  }
};
