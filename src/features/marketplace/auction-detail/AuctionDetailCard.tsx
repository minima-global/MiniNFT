import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import CardMedia from '@mui/material/CardMedia'
import { bidOnAuction, cancelAuction } from '../marketplace.state'
import AuctionToken from '../Auction'
import { selectBidsForAuction } from '../../your-bids/bid.state'
import BidToken from '../../your-bids/Bid'
import BidCard from './../../your-bids/BidCard'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'

interface IProps {
    auction: AuctionToken
}

const AuctionDetailCard = ({ auction }: IProps) => {
    const dispatch = useAppDispatch()
    const [minimaBidAmount, setMinimaBidAmount] = useState(0)

    const auctionBids = useAppSelector(selectBidsForAuction(auction.coin))
    const sortedAuctionBids = auctionBids.sort((b1, b2) => b2.amount - b1.amount)

    function bidOnAuctionClicked() {
        dispatch(bidOnAuction(auction, minimaBidAmount))
    }

    function cancelAuctionClicked() {
        dispatch(cancelAuction(auction))
    }

    function onIncrementClicked() {
        setMinimaBidAmount((bid) => bid + 1)
    }

    function onDecrementClicked() {
        if (minimaBidAmount > 0) {
            setMinimaBidAmount((bid) => bid - 1)
        }
    }

    const MyImage = styled('img')({
        width: '100%',
        height: 'auto',
        maxWidth: '800px',
    })

    const MyContainer = styled('div')({
        width: '100%',
        overflow: 'hidden',
    })

    return (
        <>
            <MyContainer>
                <MyImage src={auction.imageUrl} />
                <Typography variant="h5">
                    {auction.token ? <div>{auction.token}</div> : <div>Token not found</div>}
                </Typography>
                <Typography component="div" variant="caption">
                    coinId: {auction.coin}
                </Typography>
                <Typography component="div" variant="caption">
                    tokenId: {auction.tokenid}
                </Typography>
                {auction.own ? (
                    <Button onClick={cancelAuctionClicked}>Cancel Auction</Button>
                ) : (
                    <div>
                        <ButtonGroup variant="outlined" aria-label="outlined button group">
                            <Button onClick={onDecrementClicked}>-</Button>
                            <Button disabled>{minimaBidAmount}</Button>
                            <Button onClick={onIncrementClicked}>+</Button>
                        </ButtonGroup>
                        <Button onClick={bidOnAuctionClicked}>Bid Minima</Button>
                    </div>
                )}
            </MyContainer>
            <h2>Bids</h2>
            <Grid container spacing={2}>
                {sortedAuctionBids.map((bid, i) => (
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <BidCard bid={bid} key={i}></BidCard>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default AuctionDetailCard
