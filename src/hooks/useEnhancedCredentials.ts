
import { useState, useCallback } from 'react';

export interface VerifiableCredential {
  id: string;
  type: string[];
  issuer: {
    id: string;
    name: string;
    verified: boolean;
  };
  subject: {
    id: string;
    claims: Record<string, any>;
  };
  issuanceDate: Date;
  expirationDate?: Date;
  revocationId?: string;
  proof: {
    type: string;
    created: Date;
    verificationMethod: string;
    signature: string;
    zkProof?: string;
  };
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  metadata: {
    credentialSchema: string;
    refreshService?: string;
    revocationRegistry?: string;
  };
}

export interface CredentialTemplate {
  type: string;
  name: string;
  description: string;
  schema: Record<string, any>;
  validityPeriod: number; // in days
  renewable: boolean;
}

const credentialTemplates: CredentialTemplate[] = [
  {
    type: 'AgeVerification',
    name: 'Age Verification',
    description: 'Proves age without revealing exact birthdate',
    schema: { minimumAge: 'number', verified: 'boolean' },
    validityPeriod: 365,
    renewable: true
  },
  {
    type: 'EducationCredential',
    name: 'Education Certificate',
    description: 'Academic qualifications and degrees',
    schema: { degree: 'string', institution: 'string', graduationYear: 'number' },
    validityPeriod: -1, // No expiration
    renewable: false
  },
  {
    type: 'ProfessionalLicense',
    name: 'Professional License',
    description: 'Professional certifications and licenses',
    schema: { license: 'string', authority: 'string', specialization: 'string' },
    validityPeriod: 730, // 2 years
    renewable: true
  },
  {
    type: 'IdentityVerification',
    name: 'Identity Verification',
    description: 'Government-issued identity verification',
    schema: { verified: 'boolean', nationality: 'string', documentType: 'string' },
    validityPeriod: 1825, // 5 years
    renewable: true
  }
];

export const useEnhancedCredentials = (userDid: string | null) => {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);
  const [revocationRegistry, setRevocationRegistry] = useState<Set<string>>(new Set());

  const issueCredential = useCallback(async (
    templateType: string,
    claims: Record<string, any>,
    issuerDid: string
  ) => {
    if (!userDid) throw new Error('User DID required');
    
    setIsIssuing(true);
    
    try {
      const template = credentialTemplates.find(t => t.type === templateType);
      if (!template) throw new Error('Invalid credential template');

      // Simulate credential issuance
      await new Promise(resolve => setTimeout(resolve, 3000));

      const credentialId = `vc:${Math.random().toString(36).substr(2, 20)}`;
      const revocationId = `rev:${Math.random().toString(36).substr(2, 16)}`;
      
      const expirationDate = template.validityPeriod > 0 
        ? new Date(Date.now() + template.validityPeriod * 24 * 60 * 60 * 1000)
        : undefined;

      const newCredential: VerifiableCredential = {
        id: credentialId,
        type: ['VerifiableCredential', templateType],
        issuer: {
          id: issuerDid,
          name: template.name + ' Authority',
          verified: true
        },
        subject: {
          id: userDid,
          claims
        },
        issuanceDate: new Date(),
        expirationDate,
        revocationId,
        proof: {
          type: 'EcdsaSecp256k1Signature2019',
          created: new Date(),
          verificationMethod: `${issuerDid}#key-1`,
          signature: `sig_${Math.random().toString(36).substr(2, 64)}`,
          zkProof: `zkp_${Math.random().toString(36).substr(2, 32)}`
        },
        status: 'active',
        metadata: {
          credentialSchema: `https://schemas.identity.com/${templateType.toLowerCase()}`,
          refreshService: template.renewable ? `https://refresh.identity.com/${credentialId}` : undefined,
          revocationRegistry: `https://revocation.identity.com/registry`
        }
      };

      setCredentials(prev => [...prev, newCredential]);
      return newCredential;
    } finally {
      setIsIssuing(false);
    }
  }, [userDid]);

  const revokeCredential = useCallback(async (credentialId: string, reason?: string) => {
    const credential = credentials.find(c => c.id === credentialId);
    if (!credential || !credential.revocationId) {
      throw new Error('Credential not found or not revocable');
    }

    // Add to revocation registry
    setRevocationRegistry(prev => new Set([...prev, credential.revocationId!]));
    
    // Update credential status
    setCredentials(prev => prev.map(cred => 
      cred.id === credentialId 
        ? { ...cred, status: 'revoked' as const }
        : cred
    ));

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [credentials]);

  const verifyCredential = useCallback(async (credential: VerifiableCredential) => {
    // Check expiration
    if (credential.expirationDate && new Date() > credential.expirationDate) {
      return { valid: false, reason: 'Credential has expired' };
    }

    // Check revocation
    if (credential.revocationId && revocationRegistry.has(credential.revocationId)) {
      return { valid: false, reason: 'Credential has been revoked' };
    }

    // Simulate proof verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    return { valid: true, reason: 'Credential is valid' };
  }, [revocationRegistry]);

  const refreshCredential = useCallback(async (credentialId: string) => {
    const credential = credentials.find(c => c.id === credentialId);
    if (!credential || !credential.metadata.refreshService) {
      throw new Error('Credential not found or not renewable');
    }

    // Simulate refresh process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const template = credentialTemplates.find(t => credential.type.includes(t.type));
    if (!template) throw new Error('Template not found');

    const newExpirationDate = template.validityPeriod > 0 
      ? new Date(Date.now() + template.validityPeriod * 24 * 60 * 60 * 1000)
      : undefined;

    setCredentials(prev => prev.map(cred => 
      cred.id === credentialId 
        ? { ...cred, expirationDate: newExpirationDate, status: 'active' as const }
        : cred
    ));
  }, [credentials]);

  // Auto-check expiration status
  const getCredentialStatus = useCallback((credential: VerifiableCredential) => {
    if (credential.revocationId && revocationRegistry.has(credential.revocationId)) {
      return 'revoked';
    }
    if (credential.expirationDate && new Date() > credential.expirationDate) {
      return 'expired';
    }
    return credential.status;
  }, [revocationRegistry]);

  return {
    credentials,
    credentialTemplates,
    isIssuing,
    issueCredential,
    revokeCredential,
    verifyCredential,
    refreshCredential,
    getCredentialStatus
  };
};
