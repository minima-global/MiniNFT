import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'

// with image
export const createImageNFT = createAsyncThunk('createImageNFT', async () => {
    const publicKey = await Minima_Service.buildNFT()
    return publicKey
})

// without image
export const createNFT = createAsyncThunk('createNFT', async () => {
    const publicKey = await Minima_Service.createNFT()
    return publicKey
})

export interface MintNftState {
    mintedNFTs: any[]
}

const initialMintNftState: MintNftState = {
    mintedNFTs: [],
}

export const mintNFTSlice = createSlice({
    name: 'mintNFT',
    initialState: initialMintNftState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createImageNFT.fulfilled, (state, action: any) => {
                state.mintedNFTs.push(action.payload)
            })
            .addCase(createNFT.fulfilled, (state, action: any) => {
                state.mintedNFTs.push(action.payload)
            })
    },
})

// export reducers and actions
const mintNFTActions = mintNFTSlice.actions
const mintNFTReducer = mintNFTSlice.reducer

export default mintNFTReducer

// selectors
