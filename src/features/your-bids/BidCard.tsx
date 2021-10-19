import React from 'react'
import Bid from './Bid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAppDispatch, useAppSelector } from './../../app/hooks'
import { acceptBid } from './bid.state'

interface IProps {
    bid: Bid
}

const BidCard = ({ bid }: IProps) => {
    const dispatch = useAppDispatch()

    function onAcceptBidClicked() {
        dispatch(acceptBid(bid))
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        {bid.token ? <div>{bid.token}</div> : <div>Token not found</div>}
                    </Typography>
                    <Typography>{bid.coin}</Typography>
                    <Typography>{bid.auctionTokenId}</Typography>
                    {bid.myToken ? <Button onClick={onAcceptBidClicked}>Accept Bid</Button> : null}
                </CardContent>
            </Card>
        </>
    )
}

export default BidCard
