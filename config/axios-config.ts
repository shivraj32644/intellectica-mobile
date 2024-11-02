import Axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import Config from "react-native-config";
const BASE_URL = "http://192.168.1.6:8888/api";
console.log("BASE_URL", BASE_URL);
export const apiInstance = Axios.create({
  baseURL: BASE_URL,
});
