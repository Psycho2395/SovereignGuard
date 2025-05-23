
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Shield, Fingerprint, Eye, Smartphone, Key, CheckCircle, AlertTriangle, Timer } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

const AuthenticationSystem = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    authLevel: 0,
    methods: {
      password: false,
      biometric: false,
      device: false,
      twoFactor: false
    }
  });

  const [authProgress, setAuthProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('password');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  const authMethods = [
    {
      id: 'password',
      name: 'Password Authentication',
      icon: Lock,
      description: 'Enter your secure password',
      security: 'Medium',
      color: 'blue'
    },
    {
      id: 'biometric',
      name: 'Biometric Verification',
      icon: Fingerprint,
      description: 'Fingerprint or facial recognition',
      security: 'High',
      color: 'green'
    },
    {
      id: 'device',
      name: 'Device Verification',
      icon: Smartphone,
      description: 'Trusted device confirmation',
      security: 'Medium',
      color: 'purple'
    },
    {
      id: 'twoFactor',
      name: 'Two-Factor Authentication',
      icon: Key,
      description: 'SMS or authenticator app',
      security: 'High',
      color: 'orange'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAuthMethod = async (methodId: string) => {
    setCurrentStep(methodId);
    
    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAuthState(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        [methodId]: true
      }
    }));

    const completedMethods = Object.values({
      ...authState.methods,
      [methodId]: true
    }).filter(Boolean).length;

    setAuthProgress((completedMethods / 4) * 100);
    
    if (completedMethods === 4) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        authLevel: 100
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Shield className="w-6 h-6" />
              Multi-Factor Authentication
            </h2>
            <p className="text-indigo-100">Secure your identity with multiple verification layers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{authProgress.toFixed(0)}%</div>
            <div className="text-sm text-indigo-200">Security Level</div>
          </div>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {authState.isAuthenticated ? (
              <Unlock className="w-6 h-6 text-green-500" />
            ) : (
              <Lock className="w-6 h-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold">
              {authState.isAuthenticated ? 'Authenticated' : 'Authentication Required'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Timer className="w-4 h-4" />
            <span>Session expires in {formatTime(timeRemaining)}</span>
          </div>
        </div>

        <Progress value={authProgress} className="h-3 mb-4" />
        
        <div className="grid md:grid-cols-2 gap-4">
          {authMethods.map((method) => {
            const Icon = method.icon;
            const isCompleted = authState.methods[method.id as keyof typeof authState.methods];
            const isCurrent = currentStep === method.id;
            
            return (
              <div
                key={method.id}
                className={`border rounded-lg p-4 transition-all ${
                  isCompleted 
                    ? 'border-green-500 bg-green-50' 
                    : isCurrent 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : `bg-${method.color}-100`
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isCompleted 
                          ? 'text-green-600' 
                          : `text-${method.color}-600`
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={method.security === 'High' ? 'default' : 'secondary'}>
                    {method.security} Security
                  </Badge>
                  {!isCompleted && (
                    <Button 
                      size="sm"
                      onClick={() => handleAuthMethod(method.id)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Authenticating...' : 'Verify'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Security Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Enable Hardware Security Key</p>
              <p className="text-sm text-blue-600">Add a physical security key for maximum protection</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Regular Security Audits</p>
              <p className="text-sm text-green-600">Schedule monthly security reviews</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium text-purple-800">Update Recovery Methods</p>
              <p className="text-sm text-purple-600">Keep backup recovery options current</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationSystem;
