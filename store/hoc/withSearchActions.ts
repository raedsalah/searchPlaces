import { connect } from "react-redux";
import {
  fetchPlacesRequest,
  fetchPlaceDetailsRequest,
  addToSearchHistory,
  clearSearchHistory,
  addToFav,
  removeFromFav,
  clearFav,
} from "../slices/searchSlice";

const mapDispatchToProps = {
  fetchPlacesRequest,
  fetchPlaceDetailsRequest,
  addToSearchHistory,
  clearSearchHistory,
  addToFav,
  removeFromFav,
  clearFav,
};

export const withSearchActions = connect(null, mapDispatchToProps);
