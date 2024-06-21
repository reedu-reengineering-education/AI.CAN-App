import { useAuthStore } from "./store/useAuthStore";
import { getBoxes, signin, signout } from "./api/openSenseMapClient";

const useOpenSenseMapAuth = () => {
  const setBoxes = useAuthStore((state) => state.setBoxes);

  const login = async (username: string, password: string) => {
    try {
      await signin(username, password);

      await refreshBoxes();
    } catch (error) {
      throw error;
    }
  };

  async function refreshBoxes() {
    const boxesData = await getBoxes();
    if (boxesData) {
      setBoxes(boxesData);
    }
  }

  const logout = async () => {
    try {
      await signout();
    } catch (error) {
      throw error;
    }
  };

  const isLoggedIn = async () => {
    try {
      const token = useAuthStore.getState().token;
      if (token) {
        await refreshBoxes();
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  return { login, logout, refreshBoxes, isLoggedIn };
};

export default useOpenSenseMapAuth;
