import { Token } from './../../minima.service'

// export default interface Bid {
//     coin: string
//     auctionTokenId: string
//     bidderAddress?: string
//     bidderPubKey?: string
//     madeBid?: boolean // flag to tell if you made the bid or someone else
//     myToken?: boolean // flag to tell if the bid is on one of your own tokens
//     token?: string
//     description?: string
// }

// Bid as stored in the smart contract
interface RawBid {
    coin: string
    auctionTokenId: string
    bidderAddress: string
    bidderPubKey: string
}

// We add the token information and flags to the raw bid if we can find it
export default interface BidToken extends RawBid, Token {
    madeBid?: boolean // flag to tell if you made the bid or someone else
    myToken?: boolean // flag to tell if the bid is on one of your own tokens
}
