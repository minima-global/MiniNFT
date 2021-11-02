import React from 'react'
import Bid from './Bid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAppDispatch, useAppSelector } from './../../app/hooks'
import { acceptBid, cancelBid } from './bid.state'

interface IProps {
    bid: Bid
}

const BidCard = ({ bid }: IProps) => {
    const dispatch = useAppDispatch()

    function onAcceptBidClicked() {
        dispatch(acceptBid(bid))
    }

    function onCancelBidClicked() {
        dispatch(cancelBid(bid))
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        {bid.token ? <div>{bid.token}</div> : <div>Token not found</div>}
                    </Typography>
                    <Typography>Coin Id: {bid.coin}</Typography>
                    <Typography>Token Id: {bid.auctionTokenId}</Typography>
                    <Typography>Amount: {bid.amount}</Typography>
                    {bid.myToken ? <Button onClick={onAcceptBidClicked}>Accept Bid</Button> : null}
                    {bid.madeBid ? (
                        <Button onClick={onCancelBidClicked}>Cancel Bid After Block {bid.inblock + 100}</Button>
                    ) : null}
                    {bid.staleBid ? <Typography color="error">Stale</Typography> : null}
                </CardContent>
            </Card>
        </>
    )
}

export default BidCard
