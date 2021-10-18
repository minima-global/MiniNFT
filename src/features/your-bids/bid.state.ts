import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'
import BidToken from './Bid'

export const listBidsMade = (): AppThunk => (dispatch, getState) => {
    const state = getState()
    const bidAddress = state.appInit.bidContractAddress
    if (bidAddress === '') {
        console.error(`async error, bid address '' when you read it`) // TODO: notification or action here
        return
    }
    Minima_Service.getAllBidsOwnedWithData(bidAddress).then((res: any) => {
        console.log(res)
        dispatch(bidActions.storeBids(res))
    })
}

export const acceptBid =
    (bid: BidToken): AppThunk =>
    (dispatch, getState) => {
        const state = getState()
        const myAddress = state.appInit.walletAddress
        const myKey = state.appInit.publicKey
        Minima_Service.acceptThisBid(bid, myAddress, myKey)
    }

export interface BidsState {
    bids: any[]
}

const initialBidState: BidsState = {
    bids: [],
}

export const bidSlice = createSlice({
    name: 'bids',
    initialState: initialBidState,
    reducers: {
        storeBids: (state, action: PayloadAction<any[]>) => {
            state.bids = action.payload
        },
    },
})

// export reducers and actions
const bidActions = bidSlice.actions
const bidReducer = bidSlice.reducer

export default bidReducer

// Custom actions

// selectors
const selectBids = (state: RootState): BidsState => {
    return state.bids
}
export const selectAllBids = createSelector(selectBids, (bids: BidsState) => bids.bids)
