import { combineReducers} from 'redux';
// import errorReducer from './errorReducer';
import authReducer from './authReducer';
import uiReducer from './uiReducer';
import statusReducer from './statusReducer';

import musicReducer from './musicReducer';


export default combineReducers({
    // error: errorReducer,
    auth: authReducer,
    ui: uiReducer,
    status: statusReducer,
    music: musicReducer
});