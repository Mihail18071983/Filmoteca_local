import { Notify } from 'notiflix/build/notiflix-notify-aio';
import MovieApiService from './getAllMovieApi';
import { galleryMarkupСreation } from '../showTrending/renderTrending';
import { fetchGenres } from '../fetchGenres';
import * as tuiPagination from '../pagination/pagination';

export const movieApiService = new MovieApiService();

console.log(movieApiService.page)

const refs = {
  searchMovie: document.querySelector('.searchForm'),
  gallery: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.searchForm__button'),
  searchQueryInput: document.querySelector('input[name=searchQuery]'),
};

refs.searchMovie.addEventListener('submit', handleInputSearchMovie);
refs.searchQueryInput.addEventListener('input', handleInputSearchCondition);
refs.searchBtn.setAttribute('disabled', 'true');

function handleInputSearchCondition(e) {
  if (e.currentTarget.value.length > 0) {
    refs.searchBtn.removeAttribute('disabled');
    refs.searchQueryInput.removeEventListener(
      'input',
      handleInputSearchCondition
    );
    // console.log(e);
  }
}

export async function handleInputSearchMovie(e) {
  e.preventDefault();
  let searchValue = e.currentTarget.elements.searchQuery.value.trim();

  if (searchValue !== movieApiService.userRequest) {
    movieApiService.resetPage();
  }
  movieApiService.request = searchValue;

  const response = await movieApiService.getMovie();
  const results = response.results;
  console.log(results.length);

  tuiPagination.pagination.off('beforeMove', tuiPagination.loadMoreTrendingFilms);
  tuiPagination.pagination.off('beforeMove', tuiPagination.loadMoreFilmsByQuery);
  tuiPagination.pagination.on('beforeMove', tuiPagination.loadMoreFilmsByQuery);
  tuiPagination.pagination.reset(movieApiService.totalResults);
  
  

  // console.log(movieApiService.request);
  const { genres } = await fetchGenres();
  // console.log(genres);

  if (results.length === 0) {
    console.log(results);
    Notify.info(
      'Search result not successful. Enter the correct movie name and',
      {
        position: 'center-top',
        distance: '150px',
        width: '394px',
        fontSize: '14px',
      }
    );
    return;
  }

  clearRender();
  // console.log(movieApiService);
  // console.log(results);
  refs.gallery.innerHTML = galleryMarkupСreation(results, genres);
}

function clearRender() {
  refs.gallery.innerHTML = '';
}
