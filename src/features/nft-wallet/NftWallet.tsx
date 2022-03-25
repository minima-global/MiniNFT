import { useEffect } from 'react'
import { getAllMyNfts } from './nftwallet.state'
import { useAppDispatch, useAppSelector } from './../../app/hooks'
import NftCard from './NftfCard'
import Grid from '@mui/material/Grid'
import { listAuctions, selectOwnAuctions } from './../marketplace/marketplace.state'
import AuctionSummaryCard from './../marketplace/AuctionSummaryCard'

const NftWallet = () => {
    const dispatch = useAppDispatch()
    const nfts = useAppSelector(getAllMyNfts)
    const auctions = useAppSelector(selectOwnAuctions(true))

    useEffect(() => {
        dispatch(listAuctions())
    }, [dispatch])

    // double check
    auctions.forEach((auction) => {
        if (!auction.own) {
            console.error('Not own auction error', auction)
        }
    })

    return (
        <>
            <h1>NFT Wallet ({nfts.length})</h1>
            <Grid container spacing={2}>
                {nfts.map((nft, i) => (
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <NftCard key={i} nft={nft}></NftCard>
                    </Grid>
                ))}
            </Grid>

            <h1>Your Auctions ({auctions.length})</h1>
            <Grid container spacing={2}>
                {auctions.map((auction, i) => (
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <AuctionSummaryCard auction={auction}></AuctionSummaryCard>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default NftWallet
