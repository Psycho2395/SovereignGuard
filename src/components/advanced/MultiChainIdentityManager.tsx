import React, { useState } from 'react';
import { Plus, Link, CheckCircle, AlertTriangle, ExternalLink, Copy, Shield } from 'lucide-react';
import { useMultiChainDid } from '../../hooks/useMultiChainDid';
import { useEnhancedCredentials } from '../../hooks/useEnhancedCredentials';
import { useOptimizedZkp } from '../../hooks/useOptimizedZkp';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';

const MultiChainIdentityManager = () => {
  const { toast } = useToast();
  const { dids, supportedChains, isCreating, createDid, revokeDid } = useMultiChainDid();
  const { credentials, credentialTemplates, isIssuing, issueCredential, verifyCredential, getCredentialStatus } = useEnhancedCredentials(dids[0]?.id || null);
  const { proofs, availableCircuits, isGenerating, generateProof, verifyProof, createProofRequest, getProofStats } = useOptimizedZkp();
  
  const [selectedChain, setSelectedChain] = useState<string>('bnb');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'dids' | 'credentials' | 'proofs'>('dids');

  const handleCreateDid = async () => {
    try {
      const newDid = await createDid(selectedChain, 'identity');
      toast({
        title: "DID Created Successfully!",
        description: `Your identity is now active on ${supportedChains.find(c => c.id === selectedChain)?.name}`,
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create DID. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleIssueCredential = async () => {
    if (!selectedTemplate || !dids[0]) return;
    
    try {
      const sampleClaims = {
        AgeVerification: { minimumAge: 18, verified: true },
        EducationCredential: { degree: 'Bachelor of Science', institution: 'Tech University', graduationYear: 2023 },
        ProfessionalLicense: { license: 'Software Engineering', authority: 'Tech Board', specialization: 'Web3' },
        IdentityVerification: { verified: true, nationality: 'Global', documentType: 'Digital Passport' }
      };

      await issueCredential(
        selectedTemplate,
        sampleClaims[selectedTemplate as keyof typeof sampleClaims],
        'did:issuer:authority123'
      );

      toast({
        title: "Credential Issued!",
        description: "Your verifiable credential has been created and stored securely.",
      });
    } catch (error) {
      toast({
        title: "Issuance Failed",
        description: "Failed to issue credential. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateProof = async (credentialId: string) => {
    try {
      const request = createProofRequest(
        'credential-proof',
        'Prove credential ownership without revealing details',
        { credentialId },
        [credentialId]
      );

      const circuit = availableCircuits.find(c => c.protocol === 'zk-SNARK');
      if (!circuit) return;

      await generateProof(request, { credentialHash: `hash_${credentialId}` }, circuit.id);

      toast({
        title: "Zero-Knowledge Proof Generated!",
        description: "Your privacy-preserving proof is ready for verification.",
      });
    } catch (error) {
      toast({
        title: "Proof Generation Failed",
        description: "Failed to generate proof. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard.",
    });
  };

  const getChainColor = (chainId: string) => {
    const colors = {
      bnb: 'bg-yellow-500',
      ethereum: 'bg-blue-500',
      polygon: 'bg-purple-500',
      solana: 'bg-green-500'
    };
    return colors[chainId as keyof typeof colors] || 'bg-gray-500';
  };

  const stats = getProofStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <Link className="w-6 h-6" />
          Multi-Chain Identity Manager
        </h2>
        <p className="text-blue-100">Manage your decentralized identities across multiple blockchains</p>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{dids.length}</div>
            <div className="text-sm text-blue-200">DIDs Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{credentials.length}</div>
            <div className="text-sm text-blue-200">Credentials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{proofs.length}</div>
            <div className="text-sm text-blue-200">ZK Proofs</div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex gap-2">
          {[
            { id: 'dids', label: 'DIDs', icon: '🔗' },
            { id: 'credentials', label: 'Credentials', icon: '🏆' },
            { id: 'proofs', label: 'ZK Proofs', icon: '🔐' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* DIDs Section */}
      {activeSection === 'dids' && (
        <div className="space-y-4">
          {/* Create DID */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Create New DID</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {supportedChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChain(chain.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedChain === chain.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${getChainColor(chain.id)} flex items-center justify-center text-white text-xs font-bold`}>
                    {chain.symbol[0]}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{chain.name}</div>
                    <div className="text-xs text-gray-500">{chain.symbol}</div>
                  </div>
                </button>
              ))}
            </div>
            <Button onClick={handleCreateDid} disabled={isCreating} className="w-full">
              {isCreating ? 'Creating DID...' : 'Create DID'}
            </Button>
          </div>

          {/* DID List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your DIDs</h3>
            {dids.length === 0 ? (
              <div className="text-center py-8">
                <Chain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No DIDs created yet. Create your first one above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dids.map((did) => (
                  <div key={did.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 rounded-full ${getChainColor(did.chain)} flex items-center justify-center text-white text-xs font-bold`}>
                            {supportedChains.find(c => c.id === did.chain)?.symbol[0]}
                          </div>
                          <span className="font-semibold">{supportedChains.find(c => c.id === did.chain)?.name}</span>
                          <Badge className={did.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                            {did.status}
                          </Badge>
                        </div>
                        <div className="text-sm font-mono text-gray-600 mb-1">{did.id}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{did.address}</span>
                          <button onClick={() => copyToClipboard(did.address)}>
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Created: {did.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        {did.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeDid(did.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Credentials Section */}
      {activeSection === 'credentials' && (
        <div className="space-y-4">
          {/* Issue Credential */}
          {dids.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Issue New Credential</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {credentialTemplates.map((template) => (
                  <button
                    key={template.type}
                    onClick={() => setSelectedTemplate(template.type)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selectedTemplate === template.type 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500">{template.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Valid: {template.validityPeriod > 0 ? `${template.validityPeriod} days` : 'Permanent'}
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={handleIssueCredential} disabled={!selectedTemplate || isIssuing} className="w-full">
                {isIssuing ? 'Issuing Credential...' : 'Issue Credential'}
              </Button>
            </div>
          )}

          {/* Credentials List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Credentials</h3>
            {credentials.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No credentials issued yet. {dids.length === 0 ? 'Create a DID first.' : 'Issue your first credential above!'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {credentials.map((credential) => {
                  const status = getCredentialStatus(credential);
                  return (
                    <div key={credential.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{credential.type[1]}</span>
                            <Badge className={
                              status === 'active' ? 'bg-green-500' :
                              status === 'expired' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }>
                              {status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            Issued by: {credential.issuer.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Issued: {credential.issuanceDate.toLocaleDateString()}
                            {credential.expirationDate && ` • Expires: ${credential.expirationDate.toLocaleDateString()}`}
                          </div>
                          {credential.proof.zkProof && (
                            <div className="text-xs text-blue-600 mt-1">
                              ZK Proof Available
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateProof(credential.id)}
                            disabled={isGenerating}
                          >
                            Generate ZK Proof
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ZK Proofs Section */}
      {activeSection === 'proofs' && (
        <div className="space-y-4">
          {/* Proof Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Proof Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalProofs}</div>
                <div className="text-sm text-gray-500">Total Proofs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.verificationRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-500">Verification Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.avgProvingTime.toFixed(0)}ms</div>
                <div className="text-sm text-gray-500">Avg Proving Time</div>
              </div>
            </div>
          </div>

          {/* Available Circuits */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Available ZK Circuits</h3>
            <div className="grid gap-3">
              {availableCircuits.map((circuit) => (
                <div key={circuit.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{circuit.name}</span>
                        <Badge variant="outline">{circuit.protocol}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{circuit.description}</div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>Constraints: {circuit.constraints.toLocaleString()}</div>
                        <div>Variables: {circuit.variables.toLocaleString()}</div>
                        <div>Proving: {circuit.provingTime}ms</div>
                        <div>Verification: {circuit.verificationTime}ms</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Proofs */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generated Proofs</h3>
            {proofs.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No proofs generated yet. Create credentials first to generate proofs!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {proofs.map((proof) => (
                  <div key={proof.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Proof #{proof.id.slice(-8)}</span>
                          <Badge className={proof.verified ? 'bg-green-500' : 'bg-gray-500'}>
                            {proof.verified ? 'Verified' : 'Unverified'}
                          </Badge>
                          <Badge variant="outline">{proof.metadata.protocol}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          Circuit: {proof.metadata.circuit}
                        </div>
                        <div className="text-xs text-gray-500">
                          Generated: {proof.createdAt.toLocaleString()} • 
                          Proving Time: {proof.metadata.provingTime}ms • 
                          Size: {proof.metadata.proofSize} bytes
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!proof.verified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyProof(proof.id)}
                          >
                            Verify
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiChainIdentityManager;
