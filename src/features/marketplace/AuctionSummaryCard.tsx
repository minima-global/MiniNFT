import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { bidOnAuction } from './marketplace.state'
import AuctionToken from './Auction'

interface IProps {
    auction: AuctionToken
}

const AuctionSummaryCard = ({ auction }: IProps) => {
    const dispatch = useAppDispatch()

    function bidOnAuctionClicked() {
        dispatch(bidOnAuction(auction))
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        {auction.token ? <div>{auction.token}</div> : <div>Token not found</div>}
                    </Typography>
                    <Typography>{auction.coin}</Typography>
                    <Typography>{auction.tokenid}</Typography>
                    {auction.own ? null : <Button onClick={bidOnAuctionClicked}>Bid 2 Minima</Button>}
                </CardContent>
            </Card>
        </>
    )
}

export default AuctionSummaryCard
