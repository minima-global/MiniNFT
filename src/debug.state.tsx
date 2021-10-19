import { createAsyncThunk, createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Minima_Service from './minima.service'
import { RootState, AppThunk } from './app/store'

export const compareAuctionTokenLists = (): AppThunk => (dispatch, getState) => {
    const auctionAddress = getState().appInit.auctionContractAddress
    const publicKey = Minima_Service.compareTokenLists(auctionAddress).then((listComparison) => {
        dispatch(storeListComparison(listComparison))
    })
}

const initialDebugState: any = {
    auctionContracts: {},
}

const storeListComparison = createAction<any>('storeListComparison')

export const debugSlice = createSlice({
    name: 'debug',
    initialState: initialDebugState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(storeListComparison, (state, action: any) => {
            state.auctionContracts = action.payload
        })
    },
})

const debugReducer = debugSlice.reducer

export default debugReducer
