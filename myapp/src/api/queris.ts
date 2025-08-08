import type { CharacterListAPIResponse,Character } from "../types/characterTypes";

// Base URL for the Rick and Morty API
const API_URL = "https://rickandmortyapi.com/api";

//Fetches a list of characters from the Rick and Morty API based on the page number.
async function fetchCharacterList(page: number): Promise<CharacterListAPIResponse> {
  try {
    const response = await fetch(`${API_URL}/character?page=${page}`);
   if (!response.ok) {
      throw new Error(`Failed to fetch characters: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

//etches detailed data for a specific character by ID.
async function fetchCharacterData(charID:String): Promise<Character> {
  try {
    const response = await fetch(`${API_URL}/character/${charID}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch characters: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

export {fetchCharacterList,fetchCharacterData}