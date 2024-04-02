import user from "./login";

import { combineReducers } from "redux";
import selected from './selected';
import pagination from './pagination';

const reducers = combineReducers(
    {
        //   myNumber:login
        user,
        selected,
        pagination,
    }
);

export default reducers;