
import React, { useState } from 'react';
import { Fingerprint, Eye, Smartphone, HardDrive, Trash2, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { usePasswordlessAuth } from '../../hooks/usePasswordlessAuth';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';

const PasswordlessAuthManager = () => {
  const { toast } = useToast();
  const {
    credentials,
    isRegistering,
    isAuthenticating,
    checkWebAuthnSupport,
    registerCredential,
    authenticateWithBiometric,
    removeCredential,
    getAuthenticationMethods
  } = usePasswordlessAuth();

  const [deviceName, setDeviceName] = useState('');
  const [selectedAuthType, setSelectedAuthType] = useState<'fingerprint' | 'face' | 'pin' | 'hardware_key'>('fingerprint');

  const authTypes = [
    { type: 'fingerprint' as const, icon: Fingerprint, label: 'Fingerprint', color: 'bg-blue-500' },
    { type: 'face' as const, icon: Eye, label: 'Face ID', color: 'bg-green-500' },
    { type: 'pin' as const, icon: Smartphone, label: 'Device PIN', color: 'bg-purple-500' },
    { type: 'hardware_key' as const, icon: HardDrive, label: 'Hardware Key', color: 'bg-orange-500' }
  ];

  const isSupported = checkWebAuthnSupport();
  const authMethods = getAuthenticationMethods();

  const handleRegister = async () => {
    if (!deviceName) {
      toast({
        title: "Device Name Required",
        description: "Please enter a name for this device.",
        variant: "destructive"
      });
      return;
    }

    try {
      await registerCredential(deviceName, selectedAuthType);
      setDeviceName('');
      
      toast({
        title: "Authentication Method Added!",
        description: "Your biometric authentication has been registered successfully.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to register authentication method. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAuthenticate = async (credentialId?: string) => {
    try {
      const result = await authenticateWithBiometric(credentialId);
      
      toast({
        title: "Authentication Successful!",
        description: "You have been authenticated using biometric verification.",
      });
      
      console.log('Authentication result:', result);
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Biometric authentication failed. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemove = (credentialId: string) => {
    removeCredential(credentialId);
    
    toast({
      title: "Authentication Method Removed",
      description: "The authentication method has been removed from your account.",
    });
  };

  if (!isSupported) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-800">WebAuthn Not Supported</h2>
          </div>
          <p className="text-red-700">
            Your browser or device doesn't support WebAuthn/FIDO2. Please use a modern browser 
            like Chrome, Firefox, Safari, or Edge on a device with biometric capabilities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <Fingerprint className="w-6 h-6" />
          Passwordless Authentication
        </h2>
        <p className="text-green-100">Secure your identity with biometric and hardware authentication</p>
        
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{credentials.length}</div>
            <div className="text-sm text-green-200">Devices</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{authMethods.fingerprint ? '✓' : '✗'}</div>
            <div className="text-sm text-green-200">Fingerprint</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{authMethods.face ? '✓' : '✗'}</div>
            <div className="text-sm text-green-200">Face ID</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{authMethods.hardware_key ? '✓' : '✗'}</div>
            <div className="text-sm text-green-200">Hardware</div>
          </div>
        </div>
      </div>

      {/* Quick Authentication */}
      {credentials.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Authentication</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => handleAuthenticate()}
              disabled={isAuthenticating}
              size="lg"
              className="h-16"
            >
              {isAuthenticating ? 'Authenticating...' : 'Authenticate Now'}
            </Button>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <Fingerprint className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Place your finger or look at camera</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Method */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Authentication Method</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Device Name</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="e.g., iPhone 15, MacBook Pro, YubiKey"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Authentication Type</label>
            <div className="grid grid-cols-2 gap-3">
              {authTypes.map(({ type, icon: Icon, label, color }) => (
                <button
                  key={type}
                  onClick={() => setSelectedAuthType(type)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedAuthType === type 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleRegister} 
            disabled={!deviceName || isRegistering}
            className="w-full"
          >
            {isRegistering ? 'Registering...' : 'Register Authentication Method'}
          </Button>
        </div>
      </div>

      {/* Registered Methods */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Registered Authentication Methods</h3>
        
        {credentials.length === 0 ? (
          <div className="text-center py-8">
            <Plus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No authentication methods registered yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {credentials.map((credential) => {
              const authType = authTypes.find(t => t.type === credential.authenticatorType);
              const Icon = authType?.icon || Fingerprint;
              
              return (
                <div key={credential.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${authType?.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{credential.deviceName}</div>
                        <div className="text-sm text-gray-600">{authType?.label}</div>
                        <div className="text-xs text-gray-500">
                          Used {credential.usageCount} times • 
                          Last used: {credential.lastUsed.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {credential.deviceType}
                      </Badge>
                      <Button
                        onClick={() => handleAuthenticate(credential.id)}
                        disabled={isAuthenticating}
                        size="sm"
                        variant="outline"
                      >
                        Test
                      </Button>
                      <Button
                        onClick={() => handleRemove(credential.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Passwordless Security Benefits</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Eliminates password-related security risks</li>
              <li>• Biometric data never leaves your device</li>
              <li>• Phishing-resistant authentication</li>
              <li>• Faster and more convenient login experience</li>
              <li>• Compliant with FIDO2 and WebAuthn standards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordlessAuthManager;
