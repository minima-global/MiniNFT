import React from 'react'
import Button from '@mui/material/Button'

const AuctionSummaryCard = (props: any) => {
    console.log(props)

    // TODO: create function on button click
    // dispatches bid event with auction as argument

    return (
        <>
            <div>{props.auction.token}</div>
            <div>{props.auction.tokenid}</div>
            <div>{props.auction.description}</div>
            <div>{props.auction.icon}</div>
            <div>{props.auction.own ? null : <Button variant="text">Bid 2 Minima</Button>}</div>
        </>
    )
}

export default AuctionSummaryCard
