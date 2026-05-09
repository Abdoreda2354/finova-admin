import axios from "axios";

// 1. Create the messenger
const apiClient = axios.create({
    baseURL: "https://puzzledly-unglistening-yun.ngrok-free.dev",
    headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
    },
    auth: {
        username: 'admin',
        password: 'admin123'
    }
});

// 2. Teach the messenger to attach the Basic Auth credentials to every request
apiClient.interceptors.request.use((config) => {
  // Check if we have the Basic Auth code saved in the pocket
  const storedAuth = localStorage.getItem("basicAuth");
  
  if (storedAuth) {
    // If yes, clip it to the header as Basic Authentication
    config.headers.Authorization = `Basic ${storedAuth}`;
  }
  return config;
});

export default apiClient;