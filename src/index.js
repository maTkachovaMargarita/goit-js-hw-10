import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInformation = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();

  if (!inputValue) {
    clearMarkup(countryList);
    clearMarkup(countryInformation);
    return;
  }

  fetchCountries(inputValue)
    .then(name => {
      if (name.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      findsCountryByName(name);
    })
    .catch(error => {
      console.log(error);
      clearMarkup(countryList);
      clearMarkup(countryInformation);
      Notify.failure('Oops, there is no country with that name');
    });
}

function findsCountryByName(name) {
  if (name.length === 1) {
    clearMarkup(countryList);
    const markupInfo = createInformationOfCountrie(name);
    countryInformation.innerHTML = markupInfo;
  } else {
    clearMarkup(countryInformation);
    const markupList = createListOfCountries(name);
    countryList.innerHTML = markupList;
  }
}

function createListOfCountries(e) {
  return e
    .map(
      ({ name, flags }) =>
        `<li class="item"><img class="image" src="${flags.png}" alt="${name.official}" width="60" height="40"><span class="text">${name.official}</span></li>`
    )
    .join('');
}

function createInformationOfCountrie(e) {
  return e.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class="countrie-card"><h1 class="title"><img class="image" src="${
        flags.png
      }" alt="${name.official}" width="40" height="40">${name.official}</h1>
      <p class="text-title">Capital: <span class="text">${capital}</span></p>
      <p class="text-title">Population: <span class="text">${population}</span></p>
      <p class="text-title">Languages: <span class="text">${Object.values(
        languages
      )}</span></p></div>`
  );
}

function clearMarkup(e) {
  e.innerHTML = '';
}
