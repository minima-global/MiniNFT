import React from 'react'
import { getAllMyNfts, sendNftToAuction } from './nftwallet.state'
import { useAppDispatch, useAppSelector } from './../../app/hooks'
import Button from '@mui/material/Button'
import { Token } from './../../minima.service'
import NftCard from './NftfCard'
import Grid from '@mui/material/Grid'

const NftWallet = () => {
    const dispatch = useAppDispatch()
    const nfts = useAppSelector(getAllMyNfts)

    return (
        <>
            <h1>NFT Wallet</h1>
            <Grid container spacing={2}>
                {nfts.map((nft, i) => (
                    <Grid item xs={12}>
                        <NftCard key={i} nft={nft}></NftCard>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default NftWallet
