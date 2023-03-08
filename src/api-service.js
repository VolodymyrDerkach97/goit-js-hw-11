const axios = require('axios').default;
const KEY_PIXABEY = '34196458-ef7b15c4268daa5ba120fe84d';
const BASE_URL = 'https://pixabay.com/api/';

export class APIService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalElements = 0;
  }

  async getImages(searchQuery) {
    const serchParamets = new URLSearchParams({
      key: KEY_PIXABEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });

    try {
      const { data } = await axios.get(`${BASE_URL}?${serchParamets}`);
      this.setTotalElements();
      return data;
    } catch (error) {
      error.message;
    }
  }

  resetTotalElements() {
    this.totalElements = 0;
  }

  setTotalElements() {
    this.totalElements += 40;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
