
import React, { useState } from 'react';
import { Plus, Shield, CheckCircle, Clock, FileText, Award, Building, GraduationCap, Heart, CreditCard } from 'lucide-react';
import { useZkpCredentials } from '../../hooks/useZkpCredentials';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ZkpCredentialManagerProps {
  did: string | null;
}

const ZkpCredentialManager: React.FC<ZkpCredentialManagerProps> = ({ did }) => {
  const { credentials, isGenerating, generateCredential, verifyCredential, revokeCredential } = useZkpCredentials(did);
  const [selectedType, setSelectedType] = useState<'age' | 'citizenship' | 'education' | 'employment' | 'medical' | 'financial' | null>(null);

  const credentialTypes = [
    { type: 'age' as const, icon: Clock, label: 'Age Verification', color: 'bg-blue-500' },
    { type: 'citizenship' as const, icon: FileText, label: 'Citizenship', color: 'bg-green-500' },
    { type: 'education' as const, icon: GraduationCap, label: 'Education', color: 'bg-purple-500' },
    { type: 'employment' as const, icon: Building, label: 'Employment', color: 'bg-orange-500' },
    { type: 'medical' as const, icon: Heart, label: 'Medical', color: 'bg-red-500' },
    { type: 'financial' as const, icon: CreditCard, label: 'Financial', color: 'bg-indigo-500' }
  ];

  const getStatusBadge = (verified: boolean, expiryDate: Date) => {
    const isExpired = new Date() > expiryDate;
    if (isExpired) return <Badge variant="destructive">Expired</Badge>;
    if (verified) return <Badge className="bg-green-500">Verified</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  if (!did) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Identity Found</h3>
        <p className="text-gray-500">Create your DID first to manage ZKP credentials</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Zero-Knowledge Credentials</h2>
            <p className="text-indigo-100">Manage your privacy-preserving credentials</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{credentials.length}</div>
            <div className="text-sm text-indigo-200">Total Credentials</div>
          </div>
        </div>
      </div>

      {/* Add New Credential */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Credential</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {credentialTypes.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedType === type 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
        <Button
          onClick={() => selectedType && generateCredential(selectedType)}
          disabled={!selectedType || isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating ZKP...' : 'Generate Credential'}
        </Button>
      </div>

      {/* Credentials List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Credentials</h3>
        {credentials.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No credentials yet. Generate your first one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {credentials.map((credential) => {
              const credType = credentialTypes.find(t => t.type === credential.type);
              const Icon = credType?.icon || FileText;
              
              return (
                <div key={credential.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${credType?.color || 'bg-gray-500'} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800">{credential.name}</h4>
                          {getStatusBadge(credential.verified, credential.expiryDate)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Issued by {credential.issuer}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Issued: {credential.issuedDate.toLocaleDateString()}</span>
                          <span>Expires: {credential.expiryDate.toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            ZKP: {credential.zkProof}
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!credential.verified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verifyCredential(credential.id)}
                        >
                          Verify
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => revokeCredential(credential.id)}
                      >
                        Revoke
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
  );
};

export default ZkpCredentialManager;
