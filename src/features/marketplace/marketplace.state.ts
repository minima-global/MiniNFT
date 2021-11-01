import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'
import { enqueueSnackbar } from './../../layout/notifications.state'

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

export const bidOnAuction =
    (auction: any, bidAmount: number): AppThunk =>
    (dispatch, getState) => {
        const state = getState()
        const bidAddress = state.appInit.bidContractAddress
        const myAddress = state.appInit.walletAddress
        const myKey = state.appInit.publicKey
        if (bidAddress === '' || myAddress === '' || myKey === '') {
            console.error(`async error, bid address, key, or wallet is still '' when you read it`) // TODO: notification or action here
            return
        }
        Minima_Service.createBidTransaction(bidAmount, bidAddress, myAddress, myKey, auction.tokenid).then(
            (msg) => {
                const bidCreatedSuccess = {
                    message: 'Bid Created, ' + msg,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                dispatch(enqueueSnackbar(bidCreatedSuccess))
            },
            (msg) => {
                const bidCreatedFailure = {
                    message: 'Bid Failure, ' + msg,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                    },
                }
                dispatch(enqueueSnackbar(bidCreatedFailure))
            }
        )
    }

export const cancelAuction =
    (auction: any): AppThunk =>
    (dispatch, getState) => {
        const state = getState()
        const myAddress = state.appInit.walletAddress
        Minima_Service.cancelAuction(auction.coin, myAddress, auction.tokenid, auction.sellerKey, auction.scale).then(
            (msg) => {
                const cancelAuctionSuccess = {
                    message: 'Auction Cancelled, ' + msg,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                dispatch(enqueueSnackbar(cancelAuctionSuccess))
            },
            (msg) => {
                const cancelAuctionFailure = {
                    message: 'Auction Cancel Failure, ' + msg,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                    },
                }
                dispatch(enqueueSnackbar(cancelAuctionFailure))
            }
        )
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
