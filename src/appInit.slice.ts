import { createAsyncThunk, createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Minima_Service from './minima.service'
import { RootState, AppThunk } from './app/store'

export const createAuctionContract = createAsyncThunk('createAuctionContract', async () => {
    const auctionContractAddress = await Minima_Service.createAuctionContract()
    return auctionContractAddress
})

export const createBidContract = createAsyncThunk('createBidContract', async () => {
    const bidContractAddress = await Minima_Service.createBidContract()
    return bidContractAddress
})

export const createContracts = (): AppThunk => (dispatch, getState) => {
    Minima_Service.createAuctionContract().then((auctionContractAddress: any) => {
        dispatch(bidContractCreated(auctionContractAddress))
    })
    Minima_Service.createBidContract().then((bidContractAddrress: any) => {
        dispatch(auctionContractCreated(bidContractAddrress))
    })
}

export interface AppInitState {
    bidContractAddress: string
    auctionContractAddress: string
}

const initialAppInitState: AppInitState = {
    bidContractAddress: '',
    auctionContractAddress: '',
}

const bidContractCreated = createAction<string>('bidContractCreated')
const auctionContractCreated = createAction<string>('auctionContractCreated')

export const appInitSlice = createSlice({
    name: 'appInit',
    initialState: initialAppInitState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // .addCase(createBidContract.fulfilled, (state, action: any) => {
            //     state.bidContractAddress = action.payload
            // })
            // .addCase(createAuctionContract.fulfilled, (state, action: any) => {
            //     state.auctionContractAddress = action.payload
            // })
            .addCase(bidContractCreated, (state, action: any) => {
                state.bidContractAddress = action.payload
            })
            .addCase(auctionContractCreated, (state, action: any) => {
                state.auctionContractAddress = action.payload
            })
        // TODO add failure cases
    },
})

// export reducers and actions
const { actions, reducer } = appInitSlice

export default reducer
