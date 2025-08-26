import instance from '@/lib/api/axios';
import { CLIENT_REQUESTS_API } from '@/config/api';


// List Client Requests (optionally with filters)
export const listClientRequests = async (params?: Record<string, any>) => {
  const response = await instance.get(CLIENT_REQUESTS_API, { params });
  return response.data.data;
};

// Get Client Request by ID
export const getClientRequestById = async (requestId: string) => {
  const response = await instance.get(`${CLIENT_REQUESTS_API}${requestId}`);
  return response.data.data;
};


// Get a signed S3 upload URL for a file
export const getSignedUploadUrl = async (fileName: string, contentType: string, folder?: string) => {
  const response = await instance.post('/api/v1/upload/single', { fileName, contentType, folder });
  return response.data;
};

// Get a presigned access URL for a fileKey (S3 key)
export const getPresignedAccessUrl = async (fileKey: string, expiresIn = 10000) => {
  return await instance.post('/api/v1/upload/single/access', { fileKey, expiresIn });
};

// Get documents for a client request by requestId
export const getClientRequestDocuments = async (requestId: string) => {
  const response = await instance.get(`${CLIENT_REQUESTS_API}${requestId}/documents`);
  return response.data;
}; 