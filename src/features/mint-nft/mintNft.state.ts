import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import Minima_Service from './../../minima.service'
import { RootState, AppThunk } from './../../app/store'
import { enqueueSnackbar } from './../../layout/notifications.state'
import { Token } from './../../minima.service'

// with image
// export const createImageNFT = createAsyncThunk('createImageNFT', async () => {
//     const publicKey = await Minima_Service.buildNFT()
//     return publicKey
// })

// Type guard
function isToken(token: string | Token): token is Token {
    return (token as Token).token !== undefined
}

export const createUserImageNFT =
    ({ imageDataUrl, nftName }: { imageDataUrl: string; nftName: string }): AppThunk =>
    (dispatch, getState) => {
        const COMPRESSION_FACTOR_LOW = 0.1
        const COMPRESSION_FACTOR_MEDIUM = 0.5
        const COMPRESSION_FACTOR_HIGH = 0.9
        const quotedNftName = `"${nftName}"`
        Minima_Service.buildUserNFT(imageDataUrl, COMPRESSION_FACTOR_MEDIUM, quotedNftName).then(
            (tkn: string | Token) => {
                if (isToken(tkn)) {
                    const userImageNFTCreateSuccess = {
                        message: 'User Image NFT Created, ' + tkn.token,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                        },
                    }
                    dispatch(enqueueSnackbar(userImageNFTCreateSuccess))
                } else {
                    console.error('Error: successful NFT creation should return a token object')
                }
            },
            (msg) => {
                const userImageNFTCreateFailure = {
                    message: 'User Image NFT Create Failure, ' + msg,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                    },
                }
                dispatch(enqueueSnackbar(userImageNFTCreateFailure))
            }
        )
    }

export const createImageNFT = (): AppThunk => (dispatch, getState) => {
    Minima_Service.buildNFT().then(
        (tkn: string | Token) => {
            if (isToken(tkn)) {
                const imageNFTCreateSuccess = {
                    message: 'Image NFT Created, ' + tkn.token,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                    },
                }
                dispatch(enqueueSnackbar(imageNFTCreateSuccess))
            } else {
                console.error('Error: successful NFT creation should return a token object')
            }
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
