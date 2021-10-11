import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import initReducer from './../minima.init'
import reducer from '../appInit.slice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        init: initReducer,
        appInit: reducer,
    },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
