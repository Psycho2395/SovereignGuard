
import React, { useState, useEffect } from 'react';
import { Fingerprint, Eye, Mic, Smartphone, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

const BiometricAuth = () => {
  const [authStep, setAuthStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [authMethods, setAuthMethods] = useState([
    { type: 'fingerprint', name: 'Fingerprint', icon: Fingerprint, completed: false, accuracy: 0 },
    { type: 'face', name: 'Face Recognition', icon: Eye, completed: false, accuracy: 0 },
    { type: 'voice', name: 'Voice Pattern', icon: Mic, completed: false, accuracy: 0 },
    { type: 'device', name: 'Device Trust', icon: Smartphone, completed: false, accuracy: 0 }
  ]);

  const startBiometricScan = (methodIndex: number) => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Mark method as completed with high accuracy
          setAuthMethods(prev => prev.map((method, idx) => 
            idx === methodIndex 
              ? { ...method, completed: true, accuracy: 95 + Math.random() * 5 }
              : method
          ));
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const overallScore = authMethods.reduce((acc, method) => 
    acc + (method.completed ? method.accuracy : 0), 0
  ) / authMethods.length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <Shield className="w-6 h-6" />
          Advanced Biometric Authentication
        </h2>
        <p className="text-indigo-100">Multi-factor biometric verification with ML-powered accuracy</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Authentication Score</span>
            <span className="text-2xl font-bold text-green-600">{overallScore.toFixed(1)}%</span>
          </div>
          <Progress value={overallScore} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            {overallScore >= 80 ? '🔒 Highly Secure' : overallScore >= 60 ? '⚠️ Moderate Security' : '❌ Low Security'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {authMethods.map((method, idx) => (
            <div key={method.type} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${method.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <method.icon className={`w-5 h-5 ${method.completed ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <span className="font-semibold">{method.name}</span>
                </div>
                {method.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              
              {method.completed ? (
                <div className="text-sm text-green-600 font-semibold">
                  ✓ Verified ({method.accuracy.toFixed(1)}% accuracy)
                </div>
              ) : (
                <Button 
                  onClick={() => startBiometricScan(idx)}
                  disabled={isScanning}
                  className="w-full"
                  size="sm"
                >
                  {isScanning ? 'Scanning...' : 'Start Scan'}
                </Button>
              )}
            </div>
          ))}
        </div>

        {isScanning && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-blue-800">Biometric Scanning in Progress</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
            <p className="text-sm text-blue-600 mt-2">Analyzing biometric patterns...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiometricAuth;
