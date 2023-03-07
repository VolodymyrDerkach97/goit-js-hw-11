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
      per_page: 85,
      page: this.page,
    });

    try {
      const colections = await axios.get(`${BASE_URL}?${serchParamets}`);
      this.getTotalElements();
      return colections;
    } catch (error) {
      error.message;
    }
  }
  resetTotalElements() {
    this.totalElements = 0;
  }
  getTotalElements() {
    this.totalElements += 85;
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
