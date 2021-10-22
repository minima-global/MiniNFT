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

    const imageField: any = auction.description
    let imageUrl = null // populate with image if we have one, or keep null if we don't

    // https://bugzilla.mozilla.org/show_bug.cgi?id=1554068
    // Firefox users still see error in console even if we catch it
    try {
        var parser = new DOMParser()
        const doc = parser.parseFromString(imageField, 'application/xml')
        const errorNode2 = doc.querySelector('parsererror')
        if (errorNode2) {
            console.log('Token does not contain an image: ' + auction.token)
        } else {
            console.log('parsing succeeded')
            var imageString = doc.getElementsByTagName('artimage')[0].innerHTML
            imageUrl = `data:image/jpeg;base64,${imageString}`
        }
    } catch (err) {
        console.error('Token does not contain an image: ' + auction.token)
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        {auction.token ? <div>{auction.token}</div> : <div>Token not found</div>}
                    </Typography>
                    <Typography>coinId: {auction.coin}</Typography>
                    <Typography>tokenId: {auction.tokenid}</Typography>
                    {auction.own ? null : <Button onClick={bidOnAuctionClicked}>Bid 2 Minima</Button>}
                    {imageUrl ? <img src={imageUrl} width="300" height="200"></img> : null}
                </CardContent>
            </Card>
        </>
    )
}

export default AuctionSummaryCard
