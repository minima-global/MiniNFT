import { Token } from './../../minima.service'

// Auction as stored in the smart contract
interface RawAuction {
    coin: string
    tokenid: string
}

// We add the token information and flags to the raw auction if we can find it
export default interface AuctionToken extends RawAuction, Token {
    own: boolean
}
