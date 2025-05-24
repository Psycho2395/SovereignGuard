
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Users, FileText, Clock, CheckCircle, XCircle, Settings } from 'lucide-react';
import { useSelectiveDisclosure } from '../../hooks/useSelectiveDisclosure';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';

const SelectiveDisclosureManager = () => {
  const { toast } = useToast();
  const {
    policies,
    requests,
    auditLogs,
    createPolicy,
    processDisclosureRequest,
    approveDisclosure,
    denyDisclosure
  } = useSelectiveDisclosure();

  const [activeTab, setActiveTab] = useState<'requests' | 'policies' | 'audit'>('requests');
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [newPolicyName, setNewPolicyName] = useState('');

  const availableAttributes = [
    'name', 'age', 'dateOfBirth', 'nationality', 'email', 'phone',
    'address', 'occupation', 'education', 'income', 'creditScore',
    'healthStatus', 'licenseNumber', 'certifications'
  ];

  const handleCreateTestRequest = () => {
    const testRequest = processDisclosureRequest(
      'verifier_123',
      'DeFi Platform',
      ['age', 'nationality', 'creditScore'],
      'KYC Verification for loan application'
    );

    toast({
      title: "Test Request Created",
      description: "A mock disclosure request has been generated for testing.",
    });
  };

  const handleApproval = (requestId: string) => {
    if (selectedAttributes.length === 0) {
      toast({
        title: "No Attributes Selected",
        description: "Please select attributes to disclose.",
        variant: "destructive"
      });
      return;
    }

    approveDisclosure(requestId, selectedAttributes);
    setSelectedAttributes([]);
    
    toast({
      title: "Disclosure Approved",
      description: "Selected attributes have been shared with the verifier.",
    });
  };

  const handleDenial = (requestId: string) => {
    denyDisclosure(requestId, 'User denied request');
    
    toast({
      title: "Request Denied",
      description: "The disclosure request has been rejected.",
    });
  };

  const handleCreatePolicy = () => {
    if (!newPolicyName || selectedAttributes.length === 0) {
      toast({
        title: "Invalid Policy",
        description: "Please provide a name and select attributes.",
        variant: "destructive"
      });
      return;
    }

    createPolicy(newPolicyName, selectedAttributes, {
      autoApprove: false,
      maxUsage: 10,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    setNewPolicyName('');
    setSelectedAttributes([]);

    toast({
      title: "Policy Created",
      description: "New disclosure policy has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <Eye className="w-6 h-6" />
          Selective Disclosure Manager
        </h2>
        <p className="text-purple-100">Control what you share with granular precision</p>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{requests.length}</div>
            <div className="text-sm text-purple-200">Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{policies.length}</div>
            <div className="text-sm text-purple-200">Policies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <div className="text-sm text-purple-200">Audit Logs</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex gap-2">
          {[
            { id: 'requests', label: 'Disclosure Requests', icon: '📋' },
            { id: 'policies', label: 'Privacy Policies', icon: '🔒' },
            { id: 'audit', label: 'Audit Logs', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test Area */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-yellow-800">Test Selective Disclosure</h3>
            <p className="text-sm text-yellow-600">Generate a mock disclosure request for testing</p>
          </div>
          <Button onClick={handleCreateTestRequest} variant="outline">
            Create Test Request
          </Button>
        </div>
      </div>

      {/* Disclosure Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
            
            {requests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No pending disclosure requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.filter(r => r.status === 'pending').map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{request.verifierName}</h4>
                        <p className="text-sm text-gray-600">{request.purpose}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {request.expiryDate.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Requested Attributes:</p>
                      <div className="flex flex-wrap gap-2">
                        {request.requestedAttributes.map(attr => (
                          <Badge key={attr} variant="secondary">{attr}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Select attributes to disclose:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {request.requestedAttributes.map(attr => (
                          <label key={attr} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedAttributes.includes(attr)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAttributes(prev => [...prev, attr]);
                                } else {
                                  setSelectedAttributes(prev => prev.filter(a => a !== attr));
                                }
                              }}
                            />
                            <span className="text-sm">{attr}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproval(request.id)}
                        className="flex-1"
                        disabled={selectedAttributes.length === 0}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleDenial(request.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Deny
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Request History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Request History</h3>
            <div className="space-y-3">
              {requests.filter(r => r.status !== 'pending').map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{request.verifierName}</span>
                      <p className="text-sm text-gray-600">{request.purpose}</p>
                    </div>
                    <Badge className={
                      request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                    }>
                      {request.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policies */}
      {activeTab === 'policies' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Policy Name</label>
                <input
                  type="text"
                  value={newPolicyName}
                  onChange={(e) => setNewPolicyName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., KYC Basic Policy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Allowed Attributes</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableAttributes.map(attr => (
                    <label key={attr} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAttributes.includes(attr)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAttributes(prev => [...prev, attr]);
                          } else {
                            setSelectedAttributes(prev => prev.filter(a => a !== attr));
                          }
                        }}
                      />
                      <span className="text-sm">{attr}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreatePolicy} className="w-full">
                Create Policy
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Existing Policies</h3>
            
            {policies.length === 0 ? (
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No privacy policies created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {policies.map((policy) => (
                  <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{policy.name}</h4>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {policy.allowedAttributes.map(attr => (
                        <Badge key={attr} variant="secondary" className="text-xs">
                          {attr}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Created: {policy.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
          
          {auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No audit logs available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={
                          log.action === 'disclosure' ? 'bg-green-500' :
                          log.action === 'denial' ? 'bg-red-500' : 'bg-blue-500'
                        }>
                          {log.action}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {log.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Verifier: {log.verifierId}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {log.attributes.map(attr => (
                          <Badge key={attr} variant="outline" className="text-xs">
                            {attr}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.userConsent ? 'default' : 'destructive'}>
                        {log.userConsent ? 'Consented' : 'Denied'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectiveDisclosureManager;
