import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'
import { enqueueSnackbar } from './../../layout/notifications.state'

// with image
// export const createImageNFT = createAsyncThunk('createImageNFT', async () => {
//     const publicKey = await Minima_Service.buildNFT()
//     return publicKey
// })

export const createImageNFT = (): AppThunk => (dispatch, getState) => {
    Minima_Service.buildNFT().then(
        (msg) => {
            const imageNFTCreateSuccess = {
                message: 'Image NFT Created, ' + msg,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                },
            }
            dispatch(enqueueSnackbar(imageNFTCreateSuccess))
        },
        (msg) => {
            const imageNFTCreateFailure = {
                message: 'Image NFT Create Failure, ' + msg,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            dispatch(enqueueSnackbar(imageNFTCreateFailure))
        }
    )
}

// without image
// export const createNFT = createAsyncThunk('createNFT', async () => {
//     const publicKey = await Minima_Service.createNFT()
//     return publicKey
// })

export const createNFT = (): AppThunk => (dispatch, getState) => {
    Minima_Service.createNFT().then(
        (msg) => {
            const NFTCreateSuccess = {
                message: 'NFT Created, ' + msg,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                },
            }
            dispatch(enqueueSnackbar(NFTCreateSuccess))
        },
        (msg) => {
            const NFTCreateFailure = {
                message: 'NFT Create Failure, ' + msg,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            dispatch(enqueueSnackbar(NFTCreateFailure))
        }
    )
}

export interface MintNftState {
    mintedNFTs: any[]
}

const initialMintNftState: MintNftState = {
    mintedNFTs: [],
}

export const mintNFTSlice = createSlice({
    name: 'mintNFT',
    initialState: initialMintNftState,
    reducers: {},
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(createImageNFT.fulfilled, (state, action: any) => {
    //             state.mintedNFTs.push(action.payload)
    //         })
    //         .addCase(createNFT.fulfilled, (state, action: any) => {
    //             state.mintedNFTs.push(action.payload)
    //         })
    // },
})

// export reducers and actions
const mintNFTActions = mintNFTSlice.actions
const mintNFTReducer = mintNFTSlice.reducer

export default mintNFTReducer

// selectors
