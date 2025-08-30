import axiosInstance from "@/lib/api/axios"

const CLIENT_USER_API = '/api/v1/users'


export const getClientUser = async (userId:string) => {
   const response = axiosInstance.get(`${CLIENT_USER_API}/user/${userId}`)
   return (await response).data.data
}