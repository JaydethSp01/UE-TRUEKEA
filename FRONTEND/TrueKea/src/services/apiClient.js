import axios from "axios";
export default axios.create({ baseURL: "https://api.truekea.test", timeout: 5000 });
