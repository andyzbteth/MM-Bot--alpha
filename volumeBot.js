// volumeBot.js
require('dotenv').config();
const { ethers } = require('ethers');

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const MAX_TOKEN_PER_TX = process.env.MAX_TOKEN_PER_TX;
const MAX_ETH_PER_TX = process.env.MAX_ETH_PER_TX;

// Setup provider and wallet
const provider = new ethers.providers.InfuraProvider('mainnet', INFURA_PROJECT_ID);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Uniswap Router address
const UNISWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap V3 Router

// Uniswap Router ABI (simplified)
const routerABI = [
  'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) payable returns (uint256 amountOut)',
  'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) returns (uint256 amountOut)',
];

const routerContract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerABI, wallet);

async function buyTokenVolume() {
  // Define buy parameters
  const params = {
    tokenIn: '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2', // WETH
    tokenOut: TOKEN_ADDRESS,
    fee: 3000, // 0.3%
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    amountIn: ethers.utils.parseEther(MAX_ETH_PER_TX),
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  try {
    const tx = await routerContract.exactInputSingle(
      params,
      {
        value: ethers.utils.parseEther(MAX_ETH_PER_TX),
        gasLimit: ethers.utils.hexlify(1000000),
      }
    );
    console.log('Volume Buy Transaction Sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Volume Buy Transaction Mined:', receipt.transactionHash);
  } catch (error) {
    console.error('Volume Buy Transaction Failed:', error);
  }
}

async function sellTokenVolume() {
  // Approve the router to spend your tokens
  const tokenABI = [
    'function approve(address spender, uint256 amount) public returns (bool)',
  ];
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenABI, wallet);
  const approveTx = await tokenContract.approve(UNISWAP_ROUTER_ADDRESS, ethers.utils.parseEther(MAX_TOKEN_PER_TX));
  console.log('Approval Transaction Sent:', approveTx.hash);
  await approveTx.wait();
  console.log('Approval Transaction Mined');

  // Define sell parameters
  const params = {
    tokenIn: TOKEN_ADDRESS,
    tokenOut: '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2', // WETH
    fee: 3000, // 0.3%
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    amountIn: ethers.utils.parseEther(MAX_TOKEN_PER_TX),
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  try {
    const tx = await routerContract.exactInputSingle(params, {
      gasLimit: ethers.utils.hexlify(1000000),
    });
    console.log('Volume Sell Transaction Sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Volume Sell Transaction Mined:', receipt.transactionHash);
  } catch (error) {
    console.error('Volume Sell Transaction Failed:', error);
  }
}

async function volumeCycle(intervalSeconds) {
  while (true) {
    await buyTokenVolume();
    // Wait for the transaction to complete
    await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 60 seconds
    await sellTokenVolume();
    // Wait for the transaction to complete
    await new Promise((resolve) => setTimeout(resolve, intervalSeconds * 1000));
  }
}

module.exports = volumeCycle;
