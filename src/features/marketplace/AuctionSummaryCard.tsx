import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import CardMedia from '@mui/material/CardMedia'
import { bidOnAuction, cancelAuction } from './marketplace.state'
import AuctionToken from './Auction'

interface IProps {
    auction: AuctionToken
}

const AuctionSummaryCard = ({ auction }: IProps) => {
    const dispatch = useAppDispatch()
    const [minimaBidAmount, setMinimaBidAmount] = useState(0)

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

    const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
    const imageField: any = auction.description
    let imageUrl = null // populate with image if we have one, or keep null if we don't

    // TODO: move this into the auction object in redux so it doesnt parse on every render

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
                {imageUrl ? (
                    <CardMedia component="img" height="194" image={imageUrl} />
                ) : (
                    <CardMedia component="img" height="194" image={fallbackImage} />
                )}
                <CardContent>
                    <Typography variant="h5">
                        {auction.token ? <div>{auction.token}</div> : <div>Token not found</div>}
                    </Typography>
                    <Typography>coinId: {auction.coin}</Typography>
                    <Typography>tokenId: {auction.tokenid}</Typography>

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
                </CardContent>
            </Card>
        </>
    )
}

export default AuctionSummaryCard
