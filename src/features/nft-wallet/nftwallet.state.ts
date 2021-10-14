import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service, { Token } from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'

export const fetchNfts = createAsyncThunk('nftwallet/fetchNfts', async () => {
    return Minima_Service.getAllMyNFTs()
})

export const sendNftToAuction =
    (nft: any): AppThunk =>
    (dispatch, getState) => {
        const auctionScriptAddress = getState().appInit.auctionContractAddress
        const myTokenId = nft.tokenid
        const publicKey = getState().appInit.publicKey
        Minima_Service.createAuction(auctionScriptAddress, myTokenId, publicKey).then((res) => {
            // dispatch success action
            console.log('auciton created', res)
        })
    }

export interface NftWalletState {
    nfts: Token[]
}

const initialNftwalletState: NftWalletState = {
    nfts: [],
}

// creates actions and reducers
export const marketplaceSlice = createSlice({
    name: 'nftwallet',
    initialState: initialNftwalletState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchNfts.fulfilled, (state, action) => {
            state.nfts = action.payload
        })
    },
})

// export reducers and actions
const nftWalletActions = marketplaceSlice.actions
const nftWalletReducer = marketplaceSlice.reducer

export default nftWalletReducer

// selectors
const selectNfts = (state: RootState): NftWalletState => {
    return state.nftwallet
}
export const getAllMyNfts = createSelector(selectNfts, (nftWallet: NftWalletState) => nftWallet.nfts)
