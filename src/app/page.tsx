'use client'

import React, { useEffect, useState } from 'react'

import { ethers, Signer } from "ethers";



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


  let provider: any;
 
  useEffect(() => {
    const initializeEthereum = async () => {
      

    }

    initializeEthereum()
  }, [])

  const fetchReserves = async () => {
    
  };


  const handleSwap = async () => {
    
    alert('Swap functionality would be implemented here')
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
                value={fromAmount}
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