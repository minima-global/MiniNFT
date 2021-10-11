import { createAsyncThunk, createAction, createSlice } from '@reduxjs/toolkit'
import Minima_Service from './minima.service'
import { RootState, AppThunk } from './app/store'
import { createBidContract, createAuctionContract, createContracts } from './appInit.slice'

export interface InitState {
    connected: boolean
    latestMessage: string
}

const initialState: InitState = {
    connected: false,
    latestMessage: '',
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
}

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
                // dispatch(createBidContract())
                // dispatch(createAuctionContract())
                break
            case MinimaEventTypes.NEWBLOCK:
                dispatch(newBlock(msg.info))
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
            default:
                console.error('Unknown event type: ', msg.event)
        }

        dispatch(chainMessage(msg))
    })
}

export const newBlock = createAction<any>('minima_event/new_block')
export const newTransaction = createAction<any>('minima_event/new_transaction')
export const newTxPow = createAction<any>('minima_event/new_txpow')
export const newBalance = createAction<any>('minima_event/new_balance')
export const network = createAction<any>('minima_event/network')
export const txPowStart = createAction<any>('minima_event/tx_pow_start')
export const txPowEnd = createAction<any>('minima_event/tx_pow_end')
