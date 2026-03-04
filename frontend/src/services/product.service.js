import { CONSTANTS } from '../utils/constants';

export const fetchProducts = async () => {
  try {
    const response = await fetch(CONSTANTS.DATA_URL);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching cards", error);
    return [];
  }
};