import React from 'react'
import { getAllMyNfts, sendNftToAuction } from './nftwallet.state'
import { useAppDispatch, useAppSelector } from './../../app/hooks'
import Button from '@mui/material/Button'
import { Token } from './../../minima.service'

const NftWallet = () => {
    const dispatch = useAppDispatch()
    const nfts = useAppSelector(getAllMyNfts)

    const onAuctionNft = (nft: Token) => {
        return () => {
            dispatch(sendNftToAuction(nft))
        }
    }

    return (
        <>
            <h1>NFT Wallet</h1>
            {nfts.map((nft, i) => (
                <div key={i}>
                    {nft.token}
                    <Button variant="text" onClick={onAuctionNft(nft)}>
                        Auction
                    </Button>
                </div>
            ))}
        </>
    )
}

export default NftWallet
