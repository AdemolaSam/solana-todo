# solana-todo

## DESCRIPTION

### This is a simple ToDo web app built to demonstrate authentication in solana using the `solana/web3.js` SDK- i.e. wallet connection and signing.

### It comprises of two parts, `client` - frontend where we use the following packages provided by Solana for wallet connection and authentication

- @solana/wallet-adapter-react
- @solana/wallet-adapter-base
- @solana/web3.js
- @solana/wallet-adapter-wallets
- @solana/wallet-adapter-react-ui
- @solana/wallet-adapter-react-ui/styles.css

### The second part, `server` - backend. An express nodejs backend that sends message to frontend for signing, verifying the signature and authenticationg user using JsonWebToken (JWT) to maintain stateless authentication. It connects with a MongoDb database for file storing user details, todos, and retrieving them.

### The backend used the following tools for verifying wallets and signed messages

- @solana/web3.js
- tweetnacl
- bs58

## Running the project

### Frontend/client

- navigate to the `solana-todo/client` directory from your terminal

* install packages - `pnpm install`
* run - `pnpm dev`

### Backend/server

- navigate to the `solana-todo/server` directory from your terminal

* install packages - `npm install`
* run - `npm run dev`

#### If you find this helpful, do well to star this repo. Cheers!!
