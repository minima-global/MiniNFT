import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CardActionArea } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import CardMedia from '@mui/material/CardMedia'
import { bidOnAuction, cancelAuction } from './marketplace.state'
import AuctionToken from './Auction'
import { selectBidsForAuction } from './../your-bids/bid.state'
import BidToken from './../your-bids/Bid'

interface IProps {
    auction: AuctionToken
}

const AuctionSummaryCard = ({ auction }: IProps) => {
    const dispatch = useAppDispatch()
    let navigate = useNavigate()

    const auctionBids = useAppSelector(selectBidsForAuction(auction.coin))
    // console.log(`Bids on ${auction.token}`, auctionBids)

    function getHighestBid(bidList: BidToken[]) {
        const sorted = bidList.sort((b1, b2) => b2.amount - b1.amount)
        if (sorted.length > 0) {
            return sorted[0].amount
        } else {
            return 0
        }
    }

    const onImageClicked = (myAuction: AuctionToken) => () => {
        navigate('/auction/' + myAuction.coin)
    }

    return (
        <>
            <Card>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="194"
                        image={auction.imageUrl}
                        onClick={onImageClicked(auction)}
                    />
                </CardActionArea>
                <CardContent>
                    <Typography variant="h5">
                        {auction.token ? <div>{auction.token}</div> : <div>Token not found</div>}
                    </Typography>
                    <Typography mb={2}>Highest Bid: {getHighestBid(auctionBids)}</Typography>
                    <Typography component="div" variant="caption">
                        coinId: {auction.coin}
                    </Typography>
                    <Typography component="div" variant="caption">
                        tokenId: {auction.tokenid}
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}

export default AuctionSummaryCard
