import AsyncStorage from "@react-native-async-storage/async-storage";

class AsyncStorageController {
  constructor() {}

  async setItem(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  }

  async getItem(key: string) {
    return await AsyncStorage.getItem(key);
  }

  async deleteItem(key: string) {
    return await AsyncStorage.removeItem(key);
  }
}

export const asyncStorage = new AsyncStorageController();
