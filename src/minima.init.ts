import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './minima.service'
import { RootState, AppThunk } from './app/store'
import { generateWalletAddress, generatePublicKey, createContracts } from './appInit.slice'
import { listAuctions } from './features/marketplace/marketplace.state'
import { listBidsMade } from './features/your-bids/bid.state'
import { fetchNfts } from './features/nft-wallet/nftwallet.state'
import { compareAuctionTokenLists } from './debug.state'

export interface InitState {
    connected: boolean
    latestMessage: string
    blockNumber: number
}

const initialState: InitState = {
    connected: false,
    latestMessage: '',
    blockNumber: 0,
}

const enum MinimaEventTypes {
    CONNECTED = 'connected',
    NEWBLOCK = 'newblock',
    NEWTRANSACTION = 'newtransaction',
    NEWTXPOW = 'newtxpow',
    NEWBALANCE = 'newbalance',
    NETWORK = 'network',
    TXPOWSTART = 'txpowstart',
    TXPOWEND = 'txpowend',
    MINIMGSTART = 'miningstart',
    MININGSTOP = 'miningstop',
}

export const newBlock = createAction<any>('minima_event/new_block')
export const newTransaction = createAction<any>('minima_event/new_transaction')
export const newTxPow = createAction<any>('minima_event/new_txpow')
export const newBalance = createAction<any>('minima_event/new_balance')
export const network = createAction<any>('minima_event/network')
export const txPowStart = createAction<any>('minima_event/tx_pow_start')
export const txPowEnd = createAction<any>('minima_event/tx_pow_end')
export const miningstart = createAction<any>('minima_event/mining_start')
export const miningstop = createAction<any>('minima_event/mining_stop')

export const initSlice = createSlice({
    name: 'init',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        initSuccess: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.connected = true
        },
        chainMessage: (state, action) => {
            state.latestMessage = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(newBlock, (state, action: any) => {
            state.blockNumber = parseInt(action.payload.txpow.header.block)
        })
    },
})

// export reducers and actions
const { actions, reducer } = initSlice
export const { initSuccess, chainMessage } = actions
export default reducer

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const minimaInit = (): AppThunk => (dispatch, getState) => {
    Minima_Service.initializeMinima((msg: any) => {
        switch (msg.event) {
            case MinimaEventTypes.CONNECTED:
                dispatch(initSuccess())
                dispatch(createContracts())
                dispatch(generateWalletAddress())
                dispatch(generatePublicKey())
                break
            case MinimaEventTypes.NEWBLOCK:
                dispatch(newBlock(msg.info))
                dispatch(listAuctions())
                dispatch(listBidsMade())
                dispatch(fetchNfts())
                dispatch(compareAuctionTokenLists())
                // TODO: dispatch(getBidsOnAllAuctions())
                break
            case MinimaEventTypes.NEWTRANSACTION:
                dispatch(newTransaction(msg.info))
                break
            case MinimaEventTypes.NEWTXPOW:
                dispatch(newTxPow(msg.info))
                break
            case MinimaEventTypes.NEWBALANCE:
                dispatch(newBalance(msg.info))
                break
            case MinimaEventTypes.NETWORK:
                dispatch(network(msg.info))
                break
            case MinimaEventTypes.TXPOWSTART:
                dispatch(txPowStart(msg.info))
                break
            case MinimaEventTypes.TXPOWEND:
                dispatch(txPowEnd(msg.info))
                break
            case MinimaEventTypes.MINIMGSTART:
                dispatch(miningstart(msg.info))
                break
            case MinimaEventTypes.MININGSTOP:
                dispatch(miningstop(msg.info))
                break
            default:
                console.error('Unknown event type: ', msg.event)
        }

        dispatch(chainMessage(msg))
    })
}

// Selectors

const selectInit = (state: RootState): InitState => {
    return state.init
}
export const selectBlockNumber = createSelector(selectInit, (init: InitState) => init.blockNumber)
