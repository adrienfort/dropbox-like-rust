import axios from "axios";
import foldersService from "./folders";
import config from "../config";

const servicesURL = axios.create({
  baseURL: config.env.BACKEND_URL,
  timeout: 10000,
});

const services = {
  folders: foldersService,
};

export default servicesURL;
export { services };
