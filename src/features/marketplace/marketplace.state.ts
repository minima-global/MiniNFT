import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'
import { enqueueSnackbar } from './../../layout/notifications.state'
import AuctionToken from './Auction'

export const listAuctions = (): AppThunk => (dispatch, getState) => {
    const auctionAddress = getState().appInit.auctionContractAddress
    if (auctionAddress === '') {
        console.error(`async error, auction address is still '' when you read it`) // TODO: notification or action here
        return
    }
    Minima_Service.getAllAuctionsWithData(auctionAddress).then((auctions) => {
        const imageParsedAuctions = parseImageFromAuction(auctions)
        dispatch(marketplaceActions.storeAuctions(imageParsedAuctions))
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
        Minima_Service.createBidTransaction(
            bidAmount,
            bidAddress,
            myAddress,
            myKey,
            auction.tokenid,
            auction.coin
        ).then(
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
    auctions: AuctionToken[]
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

//////////// selectors///////////

const selectMarketplace = (state: RootState): MarketplaceState => {
    return state.marketplace
}
export const selectAllAuctions = createSelector(
    selectMarketplace,
    (marketplace: MarketplaceState) => marketplace.auctions
)

// Return auctions with the given auction coin id
const makeSelectAuctionByCoinId = createSelector(
    [selectMarketplace, (state: RootState, selectedAuctionCoinId: string) => selectedAuctionCoinId],
    (marketplace: MarketplaceState, selectedAuctionCoinId) =>
        marketplace.auctions.filter((auction) => auction.coin === selectedAuctionCoinId)
)
// will return either an array with the single auction in it [selectedAuction], or empty array []
export const selectAuctionByCoinId = (selectedAuctionCoinId: string) => (state: RootState) =>
    makeSelectAuctionByCoinId(state, selectedAuctionCoinId)

// return all auctions that are either own or not own
const makeSelectOwnAuctions = createSelector(
    [selectMarketplace, (state: RootState, selectedOwn: boolean) => selectedOwn],
    (marketplace: MarketplaceState, selectedOwn) =>
        marketplace.auctions.filter((auction) => auction.own === selectedOwn)
)
export const selectOwnAuctions = (selectedOwn: boolean) => (state: RootState) =>
    makeSelectOwnAuctions(state, selectedOwn)

////////// Helper Functions ///////////

function parseImageFromAuction(auctionList: AuctionToken[]): AuctionToken[] {
    const auctionWithImageParsed = auctionList.map((auction) => {
        const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
        const imageField: any = auction.description
        let imageUrl = fallbackImage // populate with image if we have one, or keep fallback if we don't

        // https://bugzilla.mozilla.org/show_bug.cgi?id=1554068
        // Firefox users still see error in console even if we catch it
        try {
            var parser = new DOMParser()
            const doc = parser.parseFromString(imageField, 'application/xml')
            const errorNode2 = doc.querySelector('parsererror')
            if (errorNode2) {
                // console.log('Token does not contain an image: ' + auction.token)
            } else {
                // console.log('parsing succeeded')
                var imageString = doc.getElementsByTagName('artimage')[0].innerHTML
                imageUrl = `data:image/jpeg;base64,${imageString}`
            }
        } catch (err) {
            // console.error('Token does not contain an image: ' + auction.token)
        }

        return {
            ...auction,
            imageUrl,
        }
    })
    return auctionWithImageParsed
}
