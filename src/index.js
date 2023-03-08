import { APIService } from './api-service';
import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiService = new APIService();

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

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

form.addEventListener('submit', onSubmitSerchForm);
btnLoadMore.addEventListener('click', onLoadMoreBtn);
form.addEventListener(
  'input',
  e => (apiService.query = e.currentTarget.elements.searchQuery.value)
);

async function onSubmitSerchForm(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  if (apiService.searchQuery === '') {
    Notiflix.Notify.info(
      `You have not entered anything. Please fill in the search field.`
    );
    return;
  }

  btnLoadMore.classList.add('visually-hidden');

  apiService.resetPage();
  apiService.resetTotalElements();
  apiService.query = e.currentTarget.elements.searchQuery.value;

  try {
    const data = await apiService.getImages(apiService.searchQuery);
    console.log(data);

    if (!(data.total === 0)) {
      renderGalleryImageCards(data.hits);
      apiService.incrementPage();

      galleryLightbox.refresh();
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      btnLoadMore.classList.remove('visually-hidden');
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMoreBtn() {
  try {
    const data = await apiService.getImages(apiService.searchQuery);
    renderGalleryImageCards(data.hits);
    apiService.incrementPage();
    scroll();

    if (apiService.totalElements >= data.totalHits) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      btnLoadMore.classList.add('visually-hidden');
    }
  } catch (error) {
    error.message;
  }
}

function renderGalleryImageCards(arrImagesCards) {
  const markup = arrImagesCards
    .map(
      imagesCard =>
        `<a href="${imagesCard.largeImageURL}"><div class="photo-card">
        <img src="${imagesCard.webformatURL}" alt="${imagesCard.tags}" loading="lazy" width='300' height='200'/>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${imagesCard.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${imagesCard.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${imagesCard.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${imagesCard.downloads}</b>
          </p>
        </div>
      </div></a>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

gallery.addEventListener('scroll', e => console.log(e));
