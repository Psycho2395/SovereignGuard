
import React, { useState } from 'react';
import { Key, Shield, Users, Smartphone, Monitor, HardDrive, Cloud, RotateCcw, AlertTriangle } from 'lucide-react';
import { useMpcKeyManagement } from '../../hooks/useMpcKeyManagement';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';

const MpcKeyManager = () => {
  const { toast } = useToast();
  const {
    keyShares,
    socialContacts,
    recoveryRequests,
    isGenerating,
    generateMpcKeyShares,
    addSocialRecoveryContact,
    initiateRecovery,
    approveRecovery,
    reconstructKey,
    rotateKeyShares
  } = useMpcKeyManagement();

  const [activeTab, setActiveTab] = useState<'shares' | 'social' | 'recovery'>('shares');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  const deviceTypes = [
    { type: 'mobile' as const, icon: Smartphone, label: 'Mobile Device', color: 'bg-blue-500' },
    { type: 'desktop' as const, icon: Monitor, label: 'Desktop', color: 'bg-green-500' },
    { type: 'hardware' as const, icon: HardDrive, label: 'Hardware Key', color: 'bg-purple-500' },
    { type: 'cloud' as const, icon: Cloud, label: 'Cloud HSM', color: 'bg-orange-500' }
  ];

  const handleGenerateShares = async () => {
    const devices = [
      { id: 'device_mobile_1', type: 'mobile' as const },
      { id: 'device_desktop_1', type: 'desktop' as const },
      { id: 'device_hardware_1', type: 'hardware' as const }
    ];

    try {
      await generateMpcKeyShares(2, 3, devices);
      toast({
        title: "MPC Key Shares Generated!",
        description: "Your private key has been split across multiple devices.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate key shares. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddContact = async () => {
    if (!newContactName || !newContactEmail) {
      toast({
        title: "Invalid Input",
        description: "Please provide both name and email.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addSocialRecoveryContact(
        newContactName,
        newContactEmail,
        `pubkey_${Math.random().toString(36).substr(2, 32)}`
      );
      
      setNewContactName('');
      setNewContactEmail('');
      
      toast({
        title: "Contact Added",
        description: "Social recovery contact has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to Add Contact",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInitiateRecovery = async () => {
    try {
      await initiateRecovery('current_user_id');
      toast({
        title: "Recovery Initiated",
        description: "Recovery requests have been sent to your trusted contacts.",
      });
    } catch (error) {
      toast({
        title: "Recovery Failed",
        description: "Failed to initiate recovery process.",
        variant: "destructive"
      });
    }
  };

  const handleRotateKeys = async () => {
    try {
      await rotateKeyShares();
      toast({
        title: "Keys Rotated",
        description: "All key shares have been rotated for enhanced security.",
      });
    } catch (error) {
      toast({
        title: "Rotation Failed",
        description: "Failed to rotate key shares.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <Key className="w-6 h-6" />
          Multi-Party Computation Key Management
        </h2>
        <p className="text-indigo-100">Secure your identity with distributed key management</p>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{keyShares.length}</div>
            <div className="text-sm text-indigo-200">Key Shares</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{socialContacts.length}</div>
            <div className="text-sm text-indigo-200">Trusted Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{recoveryRequests.length}</div>
            <div className="text-sm text-indigo-200">Recovery Requests</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex gap-2">
          {[
            { id: 'shares', label: 'Key Shares', icon: '🔑' },
            { id: 'social', label: 'Social Recovery', icon: '👥' },
            { id: 'recovery', label: 'Recovery Status', icon: '🚨' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Shares Management */}
      {activeTab === 'shares' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generate MPC Key Shares</h3>
            
            {keyShares.length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <p className="text-gray-600 mb-4">
                    Split your private key across multiple devices for enhanced security.
                    You'll need at least 2 out of 3 shares to reconstruct your key.
                  </p>
                  <Button onClick={handleGenerateShares} disabled={isGenerating} size="lg">
                    {isGenerating ? 'Generating Shares...' : 'Generate Key Shares'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Active Key Shares</h4>
                  <Button onClick={handleRotateKeys} disabled={isGenerating} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Rotate Keys
                  </Button>
                </div>

                <div className="grid gap-3">
                  {keyShares.map((share) => {
                    const deviceType = deviceTypes.find(d => d.type === share.deviceType);
                    const Icon = deviceType?.icon || HardDrive;
                    
                    return (
                      <div key={share.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${deviceType?.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold">Share #{share.shareIndex}</div>
                              <div className="text-sm text-gray-600">{deviceType?.label}</div>
                              <div className="text-xs text-gray-500">
                                Device: {share.deviceId}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">
                              {share.threshold}/{share.totalShares} Threshold
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              Created: {share.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Security Information</h4>
                      <p className="text-sm text-blue-600">
                        Your private key is split into {keyShares[0]?.totalShares} shares. 
                        You need at least {keyShares[0]?.threshold} shares to reconstruct your key.
                        Each share is encrypted and stored securely on the respective device.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Social Recovery */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Add Trusted Contact</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Name</label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddContact} className="w-full">
                Add Trusted Contact
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Trusted Contacts</h3>
            
            {socialContacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No trusted contacts added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {socialContacts.map((contact) => (
                  <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{contact.name}</div>
                        <div className="text-sm text-gray-600">{contact.email}</div>
                        <div className="text-xs text-gray-500">
                          Added: {contact.addedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={contact.verified ? 'bg-green-500' : 'bg-yellow-500'}>
                        {contact.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {socialContacts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button onClick={handleInitiateRecovery} variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Initiate Key Recovery
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recovery Status */}
      {activeTab === 'recovery' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recovery Requests</h3>
          
          {recoveryRequests.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recovery requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recoveryRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Recovery Request</h4>
                      <p className="text-sm text-gray-600">
                        Initiated: {request.createdAt.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires: {request.expiresAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={
                      request.status === 'approved' ? 'bg-green-500' :
                      request.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }>
                      {request.status}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">
                      Approvals: {request.approvals.length} / {request.requiredApprovals}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(request.approvals.length / request.requiredApprovals) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {request.status === 'approved' && (
                    <Button 
                      onClick={() => reconstructKey(keyShares.slice(0, 2))}
                      className="w-full"
                    >
                      Reconstruct Key
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MpcKeyManager;
