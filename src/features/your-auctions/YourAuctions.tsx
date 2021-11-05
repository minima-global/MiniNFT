import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { listAuctions, selectOwnAuctions } from './../marketplace/marketplace.state'
import AuctionSummaryCard from './../marketplace/AuctionSummaryCard'
import Grid from '@mui/material/Grid'

const YourAuctions = () => {
    const dispatch = useAppDispatch()
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

export default YourAuctions
