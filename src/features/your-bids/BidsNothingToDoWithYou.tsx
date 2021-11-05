import React from 'react'
import Bid from './Bid'
import BidCard from './BidCard'
import Grid from '@mui/material/Grid'

interface IProps {
    bids: Bid[]
}

const BidsNothingToDoWithYou = ({ bids }: IProps) => {
    return (
        <>
            <h2>Bids Nothin To Do With You, and Stale Bids ({bids.length})</h2>
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

export default BidsNothingToDoWithYou
