import { CapacitorHttp } from "@capacitor/core";
import axios from "axios";
import { BoxEntity, BoxResponse, useAuthStore } from "../store/useAuthStore";
import { headers } from "next/headers";

const OSEM_BASE_URL = "https://api.opensensemap.org";

const axiosApiInstance = axios.create({
  baseURL: OSEM_BASE_URL,
});
const axiosApiInstanceWithoutInterceptor = axios.create({
  baseURL: OSEM_BASE_URL,
});

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await refreshAccessToken();
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      return axiosApiInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  try {
    const response = await axiosApiInstanceWithoutInterceptor.post(
      "/users/refresh-auth",
      {
        token: refreshToken,
      }
    );
    if (response.status === 200) {
      const { token, refreshToken } = response.data;
      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setRefreshToken(refreshToken);
      return token;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    // Log out user in case of an error
    useAuthStore.getState().setToken("");
    useAuthStore.getState().setRefreshToken("");
    useAuthStore.getState().setEmail("");
    useAuthStore.getState().setIsLoggedIn(false);
    throw error;
  }
};

export async function signin(username: string, password: string) {
  try {
    // dont use the axiosApiInstance here, because we dont want to send the token
    const response = await axiosApiInstanceWithoutInterceptor.post(
      "/users/sign-in",
      {
        email: username,
        password: password,
      }
    );
    if (response.status === 200) {
      const { token, refreshToken } = response.data;
      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setRefreshToken(refreshToken);
      useAuthStore.getState().setEmail(username);
      useAuthStore.getState().setIsLoggedIn(true);
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw error;
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    // dont use the axiosApiInstance here, because we dont want to send the token
    const response = await axiosApiInstanceWithoutInterceptor.post(
      "/users/register",
      {
        name: name,
        email: email,
        password: password,
      }
    );
    if (response.status === 201) {
      const { token, refreshToken } = response.data;
      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setRefreshToken(refreshToken);
      useAuthStore.getState().setEmail(email);
      useAuthStore.getState().setIsLoggedIn(true);
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw error;
  }
}

export async function getBoxes() {
  const response = await axiosApiInstance.get("/users/me/boxes");
  if (response.status === 200) {
    const { data } = response.data;
    return data as BoxResponse;
  } else {
    throw new Error(response.data.message);
  }
}

export async function getUser() {
  const response = await axiosApiInstance.get("/users/me");
  if (response.status === 200) {
    const { data } = response.data;
    return data;
  } else {
    throw new Error(response.data.message);
  }
}

export async function signout() {
  const response = await axiosApiInstance.post("/users/sign-out");
  if (response.status === 200) {
    useAuthStore.getState().setToken("");
    useAuthStore.getState().setRefreshToken("");
    useAuthStore.getState().setEmail("");
    useAuthStore.getState().setIsLoggedIn(false);
    return true;
  } else {
    throw new Error(response.data.message);
  }
}

export type UploadData = {
  sensor: string;
  value: number | string;
  createdAt: string;
  location: {
    lng: number;
    lat: number;
  };
}[];

export async function uploadData(box: BoxEntity, data: any) {
  const response = await CapacitorHttp.post({
    url: `${OSEM_BASE_URL}/boxes/${box._id}/data`,
    headers: {
      Authorization: box.access_token,
      "Content-Type": "application/json",
    },
    data,
  });
  if (response.status === 201) {
    return true;
  } else {
    throw new Error(response.data.message);
  }
}

export async function uploadMeasurement(boxId: number, data: any) {
  const response = await axiosApiInstance.post(`/boxes/${boxId}/data`, data);
  if (response.status === 201) {
    return true;
  } else {
    throw new Error(response.data.message);
  }
}

export async function createWaterSenseBox(
  name: string,
  latitude: number,
  longitude: number
) {
  const boxData = {
    name: name,
    exposure: "mobile",
    location: [longitude, latitude],
    grouptag: ["AI.CAN"],
    sensors: [
      {
        title: "Wassertemperatur",
        unit: "°C",
        sensorType: "water temperature sensor",
      },
      { title: "pH-Wert", unit: "pH-Wert", sensorType: "pH sensor" },
      {
        title: "Elektrische Leitfähigkeit",
        unit: "µS/cm",
        sensorType: "conductivity sensor",
      },
      { title: "Windstärke", unit: "m/s", sensorType: "UserInput" },
      { title: "Wetter", unit: "Beobachtung", sensorType: "UserInput" },
      {
        title: "Bebauungsgrad",
        unit: "Stufe",
        sensorType: "urbanization level sensor",
      },
      { title: "Färbung", unit: "Farbe", sensorType: "UserInput" },
      { title: "Geruch", unit: "Intensität", sensorType: "UserInput" },
    ],
  };

  try {
    const response = await axiosApiInstance.post("/boxes", boxData);
    if (response.status === 201) {
      const { data } = response.data;
      return data; // Assuming data contains the BoxEntity
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error(
      // @ts-ignore
      error.response?.data?.message || "Error creating the SenseBox"
    );
  }
}

export async function getBoxesByGrouptag(grouptag: string) {
  try {
    const response = await axios.get(
      `https://api.opensensemap.org/boxes?grouptag=${grouptag}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching boxes by grouptag", error);
    throw error;
  }
}

export async function getSensorDataByBoxId(boxId: string) {
  try {
    const response = await axios.get(
      `https://api.opensensemap.org/boxes/${boxId}/sensors`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching sensor data by box id", error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const response = await axios.get("https://api.opensensemap.org/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("Token verification failed", error);
    return false;
  }
}
