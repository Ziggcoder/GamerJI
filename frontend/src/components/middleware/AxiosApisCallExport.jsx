import axios from 'axios'
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const token = cookies.get('JWTcookie')
// console.log(token)
var instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  headers: { 'Authorization': 'Bearer ' + token }
});


// const baseUrl=""
export const csvGetReq = async (path) => {
  try {
    const response = await instance.get(
      `/${path}`
    )
    const data = response.data
    return data
  } catch (error) {
    console.warn(error)
  }
}

export const importCSV = async (path, form) => {
  try {
    instance.headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    }
    const response = await instance.post(
      `/${path}/ImportCSV`, form, 
    )
    const data = response.data
    return data
  } catch (error) {
    console.warn(error)
  }
}



