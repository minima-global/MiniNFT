import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'
import BidToken from './Bid'
import { enqueueSnackbar } from './../../layout/notifications.state'
import { selectAllAuctions } from './../marketplace/marketplace.state'

export const listBidsMade = (): AppThunk => (dispatch, getState) => {
    const state = getState()
    const bidAddress = state.appInit.bidContractAddress
    if (bidAddress === '') {
        console.error(`async error, bid address '' when you read it`) // TODO: notification or action here
        return
    }
    Minima_Service.getAllBidsOwnedWithData(bidAddress).then((res: any) => {
        dispatch(bidActions.storeBids(res))
    })
}

export const acceptBid =
    (bid: BidToken): AppThunk =>
    (dispatch, getState) => {
        const state = getState()
        const myAddress = state.appInit.walletAddress

        // search auctions for the original public key you used to create it
        const allAuctions = selectAllAuctions(state)
        const nftTokenId = bid.auctionTokenId
        const originalAuction = allAuctions.find((auction) => auction.tokenid === nftTokenId)

        if (typeof originalAuction !== 'undefined') {
            const originalAuctionKey = originalAuction.sellerKey
            Minima_Service.acceptThisBid(bid, myAddress, originalAuctionKey).then(
                (msg) => {
                    const acceptBidSuccess = {
                        message: 'Bid Accepted, ' + msg,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                        },
                    }
                    dispatch(enqueueSnackbar(acceptBidSuccess))
                },
                (msg) => {
                    const acceptBidFailure = {
                        message: 'Bid Accept Failure, ' + msg,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'error',
                        },
                    }
                    dispatch(enqueueSnackbar(acceptBidFailure))
                }
            )
        } else {
            const originalAuctionSearchFailure = {
                message: 'Auction search failure: Can not find original auction ' + bid.token,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            dispatch(enqueueSnackbar(originalAuctionSearchFailure))
        }
    }

export const cancelBid =
    (bid: BidToken): AppThunk =>
    (dispatch, getState) => {
        Minima_Service.cancelBid(bid.coin, bid.bidderAddress, bid.bidderPubKey, bid.amount).then(
            (msg) => {
                const cancelBidSuccess = {
                    message: 'Bid Cancelled, ' + msg,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                dispatch(enqueueSnackbar(cancelBidSuccess))
            },
            (msg) => {
                const cancelBidFailure = {
                    message: 'Bid Cancel Failure, ' + msg,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                    },
                }
                dispatch(enqueueSnackbar(cancelBidFailure))
            }
        )
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
