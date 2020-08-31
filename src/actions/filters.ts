export interface FiltersState {
  text: string;
  types: string;
  sortBy: string;
  from: string;
  to: string;
}
export interface SetTextFilter {
  type: "SET_TEXT_FILTER";
  text: FiltersState;
}
export const setTextFilter = (text: FiltersState): SetTextFilter => ({
  type: "SET_TEXT_FILTER",
  text,
});
export interface SetTypeFilter {
  type: "SET_TYPE_FILTER";
  types: FiltersState;
}
export const setTypeFilter = (types: FiltersState): SetTypeFilter => ({
  type: "SET_TYPE_FILTER",
  types,
});
export interface SortBy {
  type: "SORT_BY";
  sortBy: FiltersState;
}
export const sortBy = (sortBy: FiltersState): SortBy => ({
  type: "SORT_BY",
  sortBy,
});
export interface SetFrom {
  type: "SET_FROM";
  from: FiltersState;
}
export const setFrom = (from: FiltersState): SetFrom => ({
  type: "SET_FROM",
  from,
});
export interface SetTo {
  type: "SET_TO";
  to: FiltersState;
}
export const setTo = (to: FiltersState): SetTo => ({
  type: "SET_TO",
  to,
});
export interface ResetFilters {
  type: "RESET_FILTERS";
}
export const resetFilters = (): ResetFilters => ({
  type: "RESET_FILTERS",
});
