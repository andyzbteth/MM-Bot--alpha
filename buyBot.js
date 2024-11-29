// buyBot.js
require('dotenv').config();
const { ethers } = require('ethers');

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const MAX_ETH_PER_TX = process.env.MAX_ETH_PER_TX;
const TARGET_BUY_PRICE = process.env.TARGET_BUY_PRICE;

// Setup provider and wallet
const provider = new ethers.providers.InfuraProvider('mainnet', INFURA_PROJECT_ID);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Uniswap Router address
const UNISWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap V3 Router

// Uniswap Router ABI (simplified)
const routerABI = [
  'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) payable returns (uint256 amountOut)',
];

const routerContract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerABI, wallet);

async function buyToken() {
  // Define parameters for the swap
  const params = {
    tokenIn: '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2', // WETH
    tokenOut: TOKEN_ADDRESS,
    fee: 3000, // 0.3%
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    amountIn: ethers.utils.parseEther(MAX_ETH_PER_TX), // Amount of ETH to swap
    amountOutMinimum: 0, // Set to 0 or calculate based on slippage
    sqrtPriceLimitX96: 0, // No price limit
  };

  try {
    const tx = await routerContract.exactInputSingle(
      params,
      {
        value: ethers.utils.parseEther(MAX_ETH_PER_TX),
        gasLimit: ethers.utils.hexlify(1000000),
      }
    );
    console.log('Buy Transaction Sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Buy Transaction Mined:', receipt.transactionHash);
  } catch (error) {
    console.error('Buy Transaction Failed:', error);
  }
}

module.exports = buyToken;
