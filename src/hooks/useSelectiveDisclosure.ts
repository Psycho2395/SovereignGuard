
import { useState, useCallback } from 'react';

export interface DisclosurePolicy {
  id: string;
  name: string;
  allowedAttributes: string[];
  conditions: Record<string, any>;
  auditLog: boolean;
  createdAt: Date;
}

export interface DisclosureRequest {
  id: string;
  verifierId: string;
  verifierName: string;
  requestedAttributes: string[];
  purpose: string;
  expiryDate: Date;
  status: 'pending' | 'approved' | 'denied';
}

export interface AuditLog {
  id: string;
  action: 'disclosure' | 'denial' | 'policy_update';
  timestamp: Date;
  verifierId: string;
  attributes: string[];
  userConsent: boolean;
}

export const useSelectiveDisclosure = () => {
  const [policies, setPolicies] = useState<DisclosurePolicy[]>([]);
  const [requests, setRequests] = useState<DisclosureRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const createPolicy = useCallback((
    name: string,
    allowedAttributes: string[],
    conditions: Record<string, any> = {}
  ) => {
    const newPolicy: DisclosurePolicy = {
      id: `policy_${Math.random().toString(36).substr(2, 12)}`,
      name,
      allowedAttributes,
      conditions,
      auditLog: true,
      createdAt: new Date()
    };

    setPolicies(prev => [...prev, newPolicy]);
    return newPolicy;
  }, []);

  const processDisclosureRequest = useCallback((
    verifierId: string,
    verifierName: string,
    requestedAttributes: string[],
    purpose: string
  ) => {
    const requestId = `req_${Math.random().toString(36).substr(2, 12)}`;
    const newRequest: DisclosureRequest = {
      id: requestId,
      verifierId,
      verifierName,
      requestedAttributes,
      purpose,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      status: 'pending'
    };

    setRequests(prev => [...prev, newRequest]);
    return newRequest;
  }, []);

  const approveDisclosure = useCallback((requestId: string, selectedAttributes: string[]) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return null;

    // Create audit log
    const auditEntry: AuditLog = {
      id: `audit_${Math.random().toString(36).substr(2, 12)}`,
      action: 'disclosure',
      timestamp: new Date(),
      verifierId: request.verifierId,
      attributes: selectedAttributes,
      userConsent: true
    };

    setAuditLogs(prev => [...prev, auditEntry]);
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));

    return {
      requestId,
      disclosedAttributes: selectedAttributes,
      auditId: auditEntry.id
    };
  }, [requests]);

  const denyDisclosure = useCallback((requestId: string, reason: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const auditEntry: AuditLog = {
      id: `audit_${Math.random().toString(36).substr(2, 12)}`,
      action: 'denial',
      timestamp: new Date(),
      verifierId: request.verifierId,
      attributes: request.requestedAttributes,
      userConsent: false
    };

    setAuditLogs(prev => [...prev, auditEntry]);
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'denied' as const } : req
    ));
  }, [requests]);

  const getFilteredCredentialData = useCallback((
    credentialData: Record<string, any>,
    allowedAttributes: string[]
  ) => {
    const filtered: Record<string, any> = {};
    allowedAttributes.forEach(attr => {
      if (credentialData[attr] !== undefined) {
        filtered[attr] = credentialData[attr];
      }
    });
    return filtered;
  }, []);

  return {
    policies,
    requests,
    auditLogs,
    createPolicy,
    processDisclosureRequest,
    approveDisclosure,
    denyDisclosure,
    getFilteredCredentialData
  };
};
