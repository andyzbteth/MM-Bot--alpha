// sellBot.js
require('dotenv').config();
const { ethers } = require('ethers');

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const MAX_TOKEN_PER_TX = process.env.MAX_TOKEN_PER_TX;
const TARGET_SELL_PRICE = process.env.TARGET_SELL_PRICE;

// Setup provider and wallet
const provider = new ethers.providers.InfuraProvider('mainnet', INFURA_PROJECT_ID);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Uniswap Router address
const UNISWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap V3 Router

// Uniswap Router ABI (simplified)
const routerABI = [
  'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) returns (uint256 amountOut)',
];

const routerContract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerABI, wallet);

async function sellToken() {
  // Approve the router to spend your tokens
  const tokenABI = [
    'function approve(address spender, uint256 amount) public returns (bool)',
  ];
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenABI, wallet);
  const approveTx = await tokenContract.approve(UNISWAP_ROUTER_ADDRESS, ethers.utils.parseEther(MAX_TOKEN_PER_TX));
  console.log('Approval Transaction Sent:', approveTx.hash);
  await approveTx.wait();
  console.log('Approval Transaction Mined');

  // Define parameters for the swap
  const params = {
    tokenIn: TOKEN_ADDRESS,
    tokenOut: '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2', // WETH
    fee: 3000, // 0.3%
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    amountIn: ethers.utils.parseEther(MAX_TOKEN_PER_TX), // Amount of Token to swap
    amountOutMinimum: 0, // Set to 0 or calculate based on slippage
    sqrtPriceLimitX96: 0, // No price limit
  };

  try {
    const tx = await routerContract.exactInputSingle(params, {
      gasLimit: ethers.utils.hexlify(1000000),
    });
    console.log('Sell Transaction Sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Sell Transaction Mined:', receipt.transactionHash);
  } catch (error) {
    console.error('Sell Transaction Failed:', error);
  }
}

module.exports = sellToken;
