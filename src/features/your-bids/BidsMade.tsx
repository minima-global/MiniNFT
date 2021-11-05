import React from 'react'
import Bid from './Bid'
import BidCard from './BidCard'
import Grid from '@mui/material/Grid'

interface IProps {
    bids: Bid[]
}

const BidsMade = ({ bids }: IProps) => {
    return (
        <>
            <h2>Bids You Have Made ({bids.length})</h2>
            <Grid container spacing={2}>
                {bids.map((bid, i) => (
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <BidCard bid={bid} key={i}></BidCard>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default BidsMade
