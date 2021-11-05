import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'
import BidToken from './Bid'
import { enqueueSnackbar } from './../../layout/notifications.state'
import { selectAllAuctions } from './../marketplace/marketplace.state'

export const listBidsMade = (): AppThunk => (dispatch, getState) => {
    const state = getState()
    const bidAddress = state.appInit.bidContractAddress
    const auctionAddress = state.appInit.auctionContractAddress
    if (bidAddress === '') {
        console.error(`async error, bid address '' when you read it`) // TODO: notification or action here
        return
    }
    Minima_Service.getAllBidsOwnedDataStale(bidAddress, auctionAddress).then((res: any) => {
        dispatch(bidActions.storeBids(res))
    })
}

// TODO: IMPORTANT. We are using the tokenId to search the auction list for the auction this bid relates to.
// Now we have coinId we should be using that instead
// In fact we have a new selector, getAuctionByCoinId
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
        const currentBlock = getState().init.blockNumber
        const userCanCancelBlockNumber = bid.inblock + 100
        if (currentBlock === 0) {
            const waitingForBlock = {
                message: 'Waiting for latest block. Please try again in 1 minute',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'info',
                },
            }
            dispatch(enqueueSnackbar(waitingForBlock))
            return // dont try anything else
        }
        if (currentBlock < userCanCancelBlockNumber) {
            const cancelTooEarly = {
                message: `Please wait for block ${userCanCancelBlockNumber} before you cancel`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'info',
                },
            }
            dispatch(enqueueSnackbar(cancelTooEarly))
        } else {
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
    }

// TODO: use Bid type
export interface BidsState {
    bids: BidToken[]
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

// https://github.com/reduxjs/reselect#q-how-do-i-create-a-selector-that-takes-an-argument
// https://stackoverflow.com/questions/40291084/use-reselect-selector-with-parameters
const makeSelectBidsForAuction = createSelector(
    [selectBids, (state: RootState, selectedAuctionCoinId: string) => selectedAuctionCoinId],
    (bids: BidsState, selectedAuctionCoinId) => bids.bids.filter((bid) => bid.auctionCoinId === selectedAuctionCoinId)
)
export const selectBidsForAuction = (selectedAuctionCoinId: string) => (state: RootState) =>
    makeSelectBidsForAuction(state, selectedAuctionCoinId)
