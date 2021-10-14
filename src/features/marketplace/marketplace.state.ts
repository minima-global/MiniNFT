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
