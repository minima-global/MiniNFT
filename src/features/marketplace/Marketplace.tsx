import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { listAuctions, selectAllAuctions } from './marketplace.state'
import AuctionSummaryCard from './AuctionSummaryCard'
import Grid from '@mui/material/Grid'

const Marketplace = () => {
    const dispatch = useAppDispatch()
    const auctions = useAppSelector(selectAllAuctions)

    useEffect(() => {
        dispatch(listAuctions())
    }, [dispatch])

    return (
        <>
            <h1>List all auctions ({auctions.length})</h1>
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

export default Marketplace
