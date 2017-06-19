import { combineReducers } from 'redux';
import { reducer as mapLegendConfig } from 'arcgis-react-redux-legend';

const AppReducers = combineReducers({ mapLegendConfig });

export default AppReducers;
