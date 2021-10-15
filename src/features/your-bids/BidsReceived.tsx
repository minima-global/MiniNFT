import React from 'react'
import Bid from './Bid'

interface IProps {
    bids: Bid[]
}

const BidsReceived = ({ bids }: IProps) => {
    return (
        <>
            <h2>Bids Recieved</h2>
            {bids.map((bid, i) => (
                <div key={i}>
                    <div>coinId: {bid.coin}</div>
                    <div>tokenId: {bid.auctionTokenId}</div>
                </div>
            ))}
        </>
    )
}

export default BidsReceived
