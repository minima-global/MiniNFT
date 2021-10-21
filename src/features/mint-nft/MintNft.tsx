import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { createImageNFT, createNFT } from './mintNft.state'
import Button from '@mui/material/Button'

const MintNft = () => {
    const dispatch = useAppDispatch()

    function createNftClicked() {
        dispatch(createNFT())
    }

    function createImageNftClicked() {
        dispatch(createImageNFT())
    }

    return (
        <>
            <h1>Mint NFT</h1>
            <Button onClick={createNftClicked}>Create NFT</Button>
            <Button onClick={createImageNftClicked}>Create Image NFT</Button>
        </>
    )
}

export default MintNft
