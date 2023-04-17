import { configureStore } from '@reduxjs/toolkit'
import parkingReducer from './parkings'

const store = configureStore({
    reducer: {
        getData: parkingReducer,
    }
});

export default store;