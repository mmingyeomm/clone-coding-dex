'use client'

import React, { useEffect, useState } from 'react'

import { ethers, Signer } from "ethers";
import { SourceTextModule } from 'vm';

const tokenABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const ammABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token0",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_token1",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amount1",
        "type": "uint256"
      }
    ],
    "name": "addLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shares",
        "type": "uint256"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reserve0",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reserve1",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenIn",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amountIn",
        "type": "uint256"
      }
    ],
    "name": "swap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token0",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token1",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const tokenA_Address = "0x7f168Cff981073842e9Dfa6E565d918eF61205ea"
const tokenB_Address = "0x3cAd95620b39b0e8EcE4E6628dfc4ca358269E02"
const ammAddress = "0x12bacCf45A0502B2224e49d22f7abAdDd59a2a34"


interface SwapIconProps {
  className?: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const SwapIcon: React.FC<SwapIconProps> = ({ className }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l4 4 4-4" />
    <path d="M12 8v8" />
  </svg>
)

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 text-center rounded-lg font-medium transition-colors
      ${active 
        ? 'bg-violet-600 text-white' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
  >
    {children}
  </button>
)

const TokenInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  tokenSymbol: string;
}> = ({ label, value, onChange, tokenSymbol }) => (
  <div className="bg-gray-800 rounded-xl p-4 mb-2">
    <div className="flex justify-between mb-2">
      <label className="text-gray-400 text-sm">{label}</label>
      <span className="text-gray-400 text-sm">Balance: 0.0</span>
    </div>
    <div className="flex gap-4">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.0"
        className="bg-transparent text-2xl text-white outline-none w-full"
      />
      <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-medium">
        {tokenSymbol}
      </button>
    </div>
  </div>
)

export default function DexPage() {
  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity'>('swap')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [signer, setSigner] = useState<Signer | null>(null);
  const [token1Amount, setToken1Amount] = useState('')
  const [token2Amount, setToken2Amount] = useState('')
  const [reserve0, setReserve0] = useState<string>('0');
  const [reserve1, setReserve1] = useState<string>('0');
  const [x, setX] = useState('');

  let provider:any;

  useEffect(() => {
    const initializeEthereum = async () => {

      if (window.ethereum == null) {

          // If MetaMask is not installed, we use the default provider,
          // which is backed by a variety of third-party services (such
          // as INFURA). They do not have private keys installed,
          // so they only have read-only access
          console.log("MetaMask not installed; using read-only defaults")
          provider = ethers.getDefaultProvider()

      } else {

          // Connect to the MetaMask EIP-1193 object. This is a standard
          // protocol that allows Ethers access to make all read-only
          // requests through MetaMask.
          provider = new ethers.BrowserProvider(window.ethereum)

          // It also provides an opportunity to request access to write
          // operations, which will be performed by the private key
          // that MetaMask manages for the user.
          

          setSigner(await provider.getSigner());

          console.log(provider)
          console.log(signer)

          fetchReserves();
      }
    }

    initializeEthereum()
  }, [])

  const fetchReserves = async () => {
      try{

        if (!provider) {
          provider = new ethers.BrowserProvider(window.ethereum);
        }

        const contract = new ethers.Contract(ammAddress, ammABI, provider); 

        const [res0, res1] = await Promise.all([
          contract.reserve0(),
          contract.reserve1()
        ])


        console.log(res0 , res1);

        setReserve0(ethers.formatEther(res0));
        setReserve1(ethers.formatEther(res1));

      }catch(error){
        console.error("error fetching reserves")
      }
  };



  const handleSwap = async () => {
    try{
      if (!signer){


        console.log("wallet not connected")
        return 
      }
      
      let a = parseFloat(reserve0) * 10 ** 18; 
      let b = parseFloat(reserve1) * 10 ** 18; 

      const calculatedX = ((2000000 - ((a - parseInt(fromAmount)) * b)) / (a - parseInt(fromAmount))).toString();

      setX(calculatedX); 


      const tokenAContract = new ethers.Contract(tokenA_Address, tokenABI, signer)
      const ammContract = new ethers.Contract(ammAddress, ammABI, signer)

      const tx1 = await tokenAContract.approve(ammAddress, fromAmount)

      await tx1.wait()

      console.log("tx1 complete")

      

      const tx2 = await ammContract.swap(tokenA_Address, fromAmount)

      await tx2.wait()

      console.log("tx2 complete")


    }catch(error){
      console.log("error swapping tokens")
    }
  }

  const handleAddLiquidity = async () => {
    
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-800">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">DEX</h1>
          
          {/* Tab Buttons */}
          <div className="flex gap-2 bg-gray-800 p-1 rounded-lg mb-6">
            <TabButton 
              active={activeTab === 'swap'} 
              onClick={() => setActiveTab('swap')}
            >
              Swap
            </TabButton>
            <TabButton 
              active={activeTab === 'liquidity'} 
              onClick={() => setActiveTab('liquidity')}
            >
              Add Liquidity
            </TabButton>
          </div>

          {activeTab === 'swap' ? (
            /* Swap Interface */
            <>
              <TokenInput
                label="From"
                value={fromAmount}
                onChange={setFromAmount}
                tokenSymbol="TokenA"
              />

              <div className="flex justify-center -my-2 relative z-10">
                <button className="bg-gray-900 rounded-full p-1 border border-gray-800 hover:border-violet-500 transition-colors">
                  <SwapIcon className="text-violet-500" />
                </button>
              </div>

              <TokenInput
                label="To"
                value={x}
                onChange={setToAmount}
                tokenSymbol="TokenB"
              />

              <button
                onClick={handleSwap}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl font-bold text-lg transition-colors mt-4"
              >
                Swap
              </button>

              <div className="mt-4 text-gray-400 text-sm">
                <p>1 ETH = 2,000 USDC</p>
              </div>
            </>
          ) : (
            /* Add Liquidity Interface */
            <>
              <TokenInput
                label="Token 1"
                value={token1Amount}
                onChange={setToken1Amount}
                tokenSymbol="TokenA"
              />

              <TokenInput
                label="Token 2"
                value={token2Amount}
                onChange={setToken2Amount}
                tokenSymbol="TokenB"
              />

              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Pool Information</h3>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>Pool Share: {token1Amount && token2Amount ? '0.001%' : '-'}</p>
                  <p>ETH per USDC: 0.0005</p>
                  <p>USDC per ETH: 2,000</p>
                </div>
              </div>

              <button
                onClick={handleAddLiquidity}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl font-bold text-lg transition-colors"
              >
                Add Liquidity
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}