
import { useState, useCallback } from 'react';

export interface ChainConfig {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
}

export interface MultiChainDid {
  id: string;
  chain: string;
  address: string;
  document: any;
  createdAt: Date;
  status: 'active' | 'revoked' | 'suspended';
}

const supportedChains: ChainConfig[] = [
  { id: 'bnb', name: 'BNB Smart Chain', symbol: 'BNB', rpcUrl: 'https://bsc-dataseed.binance.org/', explorerUrl: 'https://bscscan.com' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', rpcUrl: 'https://mainnet.infura.io', explorerUrl: 'https://etherscan.io' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', rpcUrl: 'https://polygon-rpc.com', explorerUrl: 'https://polygonscan.com' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', rpcUrl: 'https://api.mainnet-beta.solana.com', explorerUrl: 'https://explorer.solana.com' }
];

export const useMultiChainDid = () => {
  const [dids, setDids] = useState<MultiChainDid[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createDid = useCallback(async (chainId: string, context?: string) => {
    setIsCreating(true);
    
    try {
      // Simulate DID creation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const chain = supportedChains.find(c => c.id === chainId);
      if (!chain) throw new Error('Unsupported chain');

      const didId = `did:${chainId}:${Math.random().toString(36).substr(2, 20)}`;
      const address = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      const newDid: MultiChainDid = {
        id: didId,
        chain: chainId,
        address,
        document: {
          '@context': ['https://www.w3.org/ns/did/v1'],
          id: didId,
          verificationMethod: [{
            id: `${didId}#key-1`,
            type: 'EcdsaSecp256k1VerificationKey2019',
            controller: didId,
            publicKeyHex: Math.random().toString(16).substr(2, 64)
          }],
          authentication: [`${didId}#key-1`],
          service: context ? [{
            id: `${didId}#${context}`,
            type: context,
            serviceEndpoint: `https://identity.${chain.name.toLowerCase()}.com`
          }] : []
        },
        createdAt: new Date(),
        status: 'active'
      };

      setDids(prev => [...prev, newDid]);
      return newDid;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const revokeDid = useCallback((didId: string) => {
    setDids(prev => prev.map(did => 
      did.id === didId ? { ...did, status: 'revoked' as const } : did
    ));
  }, []);

  const resolveDid = useCallback(async (didId: string) => {
    const did = dids.find(d => d.id === didId);
    if (!did) throw new Error('DID not found');
    
    // Simulate blockchain resolution
    await new Promise(resolve => setTimeout(resolve, 500));
    return did.document;
  }, [dids]);

  return {
    dids,
    supportedChains,
    isCreating,
    createDid,
    revokeDid,
    resolveDid
  };
};
