# Auction

1. You created the auction (coins auctionContract relevant:true) (yourAuctions)

2. You did not create the auction, but (coins auctionContract relevant:false)
    1. You created a bid on that auction, or (yourBids n auctions on tokenId)
    2. You did not create the auction, or any bid on it (nothing to do with you)

# Bid

1. You created the bid (coins bidContract relevant:true) (yourBids)

2. You did not create the bid, but (coins bidContract relevant:false)
    1. You created the auction with that bid in it, or (yourAuctions n bids on tokenId)
    2. You did not create the bid, or the auction its on (nothing to do with you)

# Tasks

1. publicKey is used to create the auction. The same public key will be needed to accept the bid. If you restart the app between these two events, you will loose the public key from memory and not be able to do anything. Need to find a solution
2. java -jar minima/Minima/jar/minima.jar -port 8000 -cleanhard -conf minimaconf2. This restarts a node from scratch. Tokns command will have no tokens. coins command can see all the coinId and tokenId in the auction contract, but not details (NFT name, description, icon etc)
3. What happens when you accept a bid for an incorrect amount
    1. User 1: Auction a token
    2. User 2: Bid 1 minima on the token
    3. User 1: Accept the bid with an (incorrect) 2 minima amount. Transaction comes back with 'Send Success'. Neither minima nor nft is transfered
4.  1. User 1: Auction a token
    2. User 2: Bid 6 minima on the token
    3. User 1: Accept the bid with an (incorrect) 2 minima amount. Transaction comes back with 'Send Success'. 2 minima and nft is transfered. Not sure what happens with the other 4 minima?
5. When a seller accepts a bid, the other bids do not automatically get cancelled.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can???t go back!**

If you aren???t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you???re on your own.

You don???t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn???t feel obligated to use this feature. However we understand that this tool wouldn???t be useful if you couldn???t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
