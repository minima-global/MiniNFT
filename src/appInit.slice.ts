import { createAsyncThunk, createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Minima_Service from './minima.service'
import { RootState, AppThunk } from './app/store'
import { listAuctions } from './features/marketplace/marketplace.state'

export const generateWalletAddress = createAsyncThunk('generateWalletAddress', async () => {
    const walletAddress = await Minima_Service.newAddress()
    return walletAddress
})

export const generatePublicKey = createAsyncThunk('generatePublicKey', async () => {
    const publicKey = await Minima_Service.newKey()
    return publicKey
})

export const createContracts = (): AppThunk => (dispatch, getState) => {
    Minima_Service.createAuctionContract().then((auctionContractAddress: any) => {
        dispatch(auctionContractCreated(auctionContractAddress))
        // now we can list auctions because we know we have the auction contract address
        // TODO: although we cant be certain its saved to state yet
        dispatch(listAuctions())
    })
    Minima_Service.createBidContract().then((bidContractAddrress: any) => {
        dispatch(bidContractCreated(bidContractAddrress))
    })
}

export interface AppInitState {
    walletAddress: string
    publicKey: string
    bidContractAddress: string
    auctionContractAddress: string
}

const initialAppInitState: AppInitState = {
    walletAddress: '',
    publicKey: '',
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
            .addCase(generateWalletAddress.fulfilled, (state, action: any) => {
                state.walletAddress = action.payload
            })
            .addCase(generatePublicKey.fulfilled, (state, action: any) => {
                state.publicKey = action.payload
            })
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
