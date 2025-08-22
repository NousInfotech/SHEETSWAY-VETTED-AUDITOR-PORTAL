// Centralized API endpoints for the marketplace

// Business Profiles
export const BUSINESS_PROFILES_API = '/api/v1/users/business-profiles';

//Plaid Integrations
export const PLAID_LINK_TOKEN_API = '/api/v1/plaid-integration/link-token';
export const PLAID_EXCHANGE_TOKEN_API = '/api/v1/plaid-integration/exchange-token';
export const PLAID_CREATE_ACCOUNT_API = '/api/v1/plaid-integration/create-account'; 

// List Plaid Accounts (for dropdown)
export const PLAID_ACCOUNTS_API = '/api/v1/users/plaid-accounts';

// Apideck Integrations
export const APIDECK_LINK_TOKEN_API = '/api/v1/apideck-integrations/link-token';
export const APIDECK_ACCOUNTING_INTEGRATIONS_API = '/api/v1/users/accounting-integrations';

// Client Requests
export const CLIENT_REQUESTS_API = '/api/v1/client-requests/';

// Proposals
export const PROPOSALS_API = '/api/v1/proposals/';
export const PROPOSAL_STATUS_API = (proposalId: string) => `/api/v1/proposals/${proposalId}/status`;
export const PROPOSAL_BY_ID_API = (proposalId: string) => `/api/v1/proposals/${proposalId}`;


// engagements

export const ENGAGEMENT_API = '/api/v1/engagements';
export const ENGAGEMENT_BY_ID_API = (engagementId: string) => `/api/v1/engagements/${engagementId}`;
export const CLIENT_ENGAGEMENT_API = '/api/v1/engagements/client';


//payment
export const PAYMENT_API = '/api/v1/payments';


// salt-edge
export const SALTEDGE_API = '/api/v1/salt-edge';



// Centralized API object (optional, for easier import)
export const API = {
  BUSINESS_PROFILES: BUSINESS_PROFILES_API,
  PLAID_ACCOUNTS: PLAID_ACCOUNTS_API,
  APIDECK_ACCOUNTING: APIDECK_ACCOUNTING_INTEGRATIONS_API,
  CLIENT_REQUESTS: CLIENT_REQUESTS_API,
  PROPOSALS: PROPOSALS_API,
  PROPOSAL_STATUS: PROPOSAL_STATUS_API,
  PROPOSAL_BY_ID: PROPOSAL_BY_ID_API,
}; 