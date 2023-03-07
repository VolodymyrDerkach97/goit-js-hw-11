import { APIService } from './api-service';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiService = new APIService();

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

form.addEventListener('submit', onSubmitSerchForm);
btnLoadMore.addEventListener('click', onLoadMoreBtn);

async function onSubmitSerchForm(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  btnLoadMore.classList.add('visually-hidden');
  apiService.resetPage();
  apiService.resetTotalElements();
  apiService.query = e.currentTarget.elements.searchQuery.value;

  try {
    const colections = await apiService.getImages(apiService.searchQuery);
    console.log(colections);
    renderGalleryImageCards(colections.data.hits);
    apiService.incrementPage();

    btnLoadMore.classList.remove('visually-hidden');
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMoreBtn() {
  try {
    const colections = await apiService.getImages(apiService.searchQuery);
    renderGalleryImageCards(colections.data.hits);
    apiService.incrementPage();

    if (apiService.totalElements >= colections.data.totalHits) {
      btnLoadMore.classList.add('visually-hidden');
    }
  } catch (error) {
    error.message;
  }
}

function renderGalleryImageCards(arrImages) {
  const markup = arrImages
    .map(
      a =>
        `<a href="${a.largeImageURL}"><div class="photo-card">
        <img src="${a.webformatURL}" alt="${a.tags}" loading="lazy" width='300' height='200'/>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${a.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${a.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${a.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${a.downloads}</b>
          </p>
        </div>
      </div></a>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const galleryLightbox = new SimpleLightbox('.gallery a', {
    docClose: true,
    enableKeyboard: true,
    loop: true,

    captions: true,
    captionSelector: '.photo-card',
    captionType: 'attr',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}
