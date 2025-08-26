import instance from '@/lib/api/axios';

export const getAuditorById = async (auditorId: string) => {
  const response = await instance.get(`/api/v1/auditors/${auditorId}`);
  return response.data.data;
};

export const getAuditFirmById = async (firmId: string) => {
  const response = await instance.get(`/api/v1/auditors/audit-firm/${firmId}`);
  return response.data.data;
}; 