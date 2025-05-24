
import { useState, useCallback } from 'react';

export interface WebAuthnCredential {
  id: string;
  credentialId: string;
  publicKey: string;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  authenticatorType: 'fingerprint' | 'face' | 'pin' | 'hardware_key';
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
}

export interface AuthenticationRequest {
  id: string;
  challenge: string;
  allowCredentials: string[];
  userVerification: 'required' | 'preferred' | 'discouraged';
  createdAt: Date;
  expiresAt: Date;
}

export const usePasswordlessAuth = () => {
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const checkWebAuthnSupport = useCallback(() => {
    return !!(window.navigator && window.navigator.credentials && window.PublicKeyCredential);
  }, []);

  const registerCredential = useCallback(async (
    deviceName: string,
    authenticatorType: WebAuthnCredential['authenticatorType']
  ) => {
    if (!checkWebAuthnSupport()) {
      throw new Error('WebAuthn not supported');
    }

    setIsRegistering(true);

    try {
      // Simulate WebAuthn registration
      await new Promise(resolve => setTimeout(resolve, 3000));

      const credential: WebAuthnCredential = {
        id: `cred_${Math.random().toString(36).substr(2, 16)}`,
        credentialId: `webauthn_${Math.random().toString(36).substr(2, 32)}`,
        publicKey: `pk_${Math.random().toString(36).substr(2, 64)}`,
        deviceName,
        deviceType: authenticatorType === 'hardware_key' ? 'cross-platform' : 'platform',
        authenticatorType,
        createdAt: new Date(),
        lastUsed: new Date(),
        usageCount: 0
      };

      setCredentials(prev => [...prev, credential]);
      return credential;
    } finally {
      setIsRegistering(false);
    }
  }, [checkWebAuthnSupport]);

  const authenticateWithBiometric = useCallback(async (credentialId?: string) => {
    if (!checkWebAuthnSupport()) {
      throw new Error('WebAuthn not supported');
    }

    setIsAuthenticating(true);

    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 2000));

      const credential = credentialId 
        ? credentials.find(c => c.id === credentialId)
        : credentials[0];

      if (!credential) {
        throw new Error('No suitable credential found');
      }

      // Update usage stats
      setCredentials(prev => prev.map(c => 
        c.id === credential.id 
          ? { ...c, lastUsed: new Date(), usageCount: c.usageCount + 1 }
          : c
      ));

      return {
        credentialId: credential.id,
        authenticatorData: `auth_${Math.random().toString(36).substr(2, 32)}`,
        clientDataJSON: `client_${Math.random().toString(36).substr(2, 32)}`,
        signature: `sig_${Math.random().toString(36).substr(2, 64)}`,
        timestamp: new Date()
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, [checkWebAuthnSupport, credentials]);

  const createAuthenticationRequest = useCallback((
    allowedCredentials: string[] = [],
    userVerification: 'required' | 'preferred' | 'discouraged' = 'preferred'
  ): AuthenticationRequest => {
    return {
      id: `auth_req_${Math.random().toString(36).substr(2, 12)}`,
      challenge: `challenge_${Math.random().toString(36).substr(2, 32)}`,
      allowCredentials: allowedCredentials.length > 0 ? allowedCredentials : credentials.map(c => c.credentialId),
      userVerification,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };
  }, [credentials]);

  const removeCredential = useCallback((credentialId: string) => {
    setCredentials(prev => prev.filter(c => c.id !== credentialId));
  }, []);

  const getAuthenticationMethods = useCallback(() => {
    const methods = {
      fingerprint: credentials.filter(c => c.authenticatorType === 'fingerprint').length > 0,
      face: credentials.filter(c => c.authenticatorType === 'face').length > 0,
      pin: credentials.filter(c => c.authenticatorType === 'pin').length > 0,
      hardware_key: credentials.filter(c => c.authenticatorType === 'hardware_key').length > 0
    };

    return methods;
  }, [credentials]);

  return {
    credentials,
    isRegistering,
    isAuthenticating,
    checkWebAuthnSupport,
    registerCredential,
    authenticateWithBiometric,
    createAuthenticationRequest,
    removeCredential,
    getAuthenticationMethods
  };
};
