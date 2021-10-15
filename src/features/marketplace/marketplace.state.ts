import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'

export const listAuctions = (): AppThunk => (dispatch, getState) => {
    const auctionAddress = getState().appInit.auctionContractAddress
    if (auctionAddress === '') {
        console.error(`async error, auction address is still '' when you read it`) // TODO: notification or action here
        return
    }
    Minima_Service.getAllAuctionsWithData(auctionAddress).then((auctions: any) => {
        dispatch(marketplaceActions.storeAuctions(auctions))
    })
}

// TODO: create auction type
export const bidOnAuction =
    (auction: any): AppThunk =>
    (dispatch, getState) => {
        const state = getState()
        const bidAddress = state.appInit.bidContractAddress
        const myAddress = state.appInit.walletAddress
        const myKey = state.appInit.publicKey
        if (bidAddress === '' || myAddress === '' || myKey === '') {
            console.error(`async error, bid address, key, or wallet is still '' when you read it`) // TODO: notification or action here
            return
        }
        Minima_Service.createBidTransaction(2, bidAddress, myAddress, myKey, auction.tokenid).then((res: any) => {
            console.log(res)
            // TODO: dispatch soe sort of successful notification
            // new block event will read any new bids and populate them
        })
    }

export interface MarketplaceState {
    auctions: any[]
}

const initialMarketplaceState: MarketplaceState = {
    auctions: [],
}

export const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState: initialMarketplaceState,
    reducers: {
        storeAuctions: (state, action: PayloadAction<any[]>) => {
            state.auctions = action.payload
        },
    },
})

// export reducers and actions
const marketplaceActions = marketplaceSlice.actions
const marketplaceReducer = marketplaceSlice.reducer

export default marketplaceReducer

// selectors
const selectMarketplace = (state: RootState): MarketplaceState => {
    return state.marketplace
}
export const selectAllAuctions = createSelector(
    selectMarketplace,
    (marketplace: MarketplaceState) => marketplace.auctions
)
