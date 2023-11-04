// Inicializar constantes y llenarlas con los datos del body y del header de los menus
const allTabsBody = document.querySelectorAll(".tab-body-single");
const allTabsHead = document.querySelectorAll(".tab-head-single");

//Indica cual menu esta activo, en este caso es informacion
let activeTab = 1;

//Funcion que se genera cada que se inicializa la app
const init = () => {
  showActiveTabBody();
  showActiveTabHead();
};

//Muestra el menu
const showActiveTabHead = () => {
  allTabsHead[activeTab - 1].classList.add("active-tab");
};

//Muestra la informacion
const showActiveTabBody = () => {
  hideAllTabBody();
  allTabsBody[activeTab - 1].classList.add("show-tab");
};

//Bloquea la informacion
const hideAllTabBody = () => {
  allTabsBody.forEach((singleTabBody) =>
    singleTabBody.classList.remove("show-tab")
  );
};

//Desactiva el menu
const hideAllTabHead = () => {
  allTabsHead.forEach((singleTabHead) =>
    singleTabHead.classList.remove("active-tab")
  );
};

//Funcion de escucha de cuando se inicializa
window.addEventListener("DOMContentLoaded", () => init());

//Funcion para cambiar el menu y el contenido activos
allTabsHead.forEach((singleTabHead) => {
  singleTabHead.addEventListener("click", () => {
    hideAllTabHead();
    activeTab = singleTabHead.dataset.id;
    showActiveTabHead();
    showActiveTabBody();
  });
});


//Creacion de variables que carguen la informacion del search y la lista de busqueda y variable vacia para cargar todos los datos de la API
const searchForm = document.querySelector(".app-header-search");
let searchList = document.getElementById("search-list");
let dataApi;

//Busqueda por nombre de los personajes de la serie
const fetchCharacters = async (searchText) => {
  let url = `https://rickandmortyapi.com/api/character/?name=${searchText}`;
  try {
    const response = await fetch(url);
    dataApi = await response.json();
    if (dataApi.error === undefined) {
      showSearchList(dataApi.results);
    }
  } catch (error) {
    console.log(error);
  }
};

//Mostrar lista de busqueda
const showSearchList = (data) => {
  searchList.innerHTML = "";
  data.forEach((dataItem) => {
    const divElem = document.createElement("div");
    divElem.classList.add("search-list-item");
    divElem.innerHTML = `<div class="search-list-item">
        <img src="${
          dataItem.image ? dataItem.image : ""
        }" alt="Imágen de busqueda super héroe">
        <p data-id = "${dataItem.id}" >${dataItem.name}</p>
    </div>`;
    searchList.appendChild(divElem);
  });
};

//Busqueda sin necesidad de apretar, reconoce cada vez que se presiona una tecla del teclado y que sea mas de una letra
searchForm.search.addEventListener("keyup", () => {
  if (searchForm.search.value.length > 1) {
    fetchCharacters(searchForm.search.value);
  } else {
    searchList.innerHTML = "";
  }
});

//Escoger un personaje de la lista buscada para cargar informacion en pantalla, y en las pestañas
searchList.addEventListener("click", (event) => {
  let searchId = event.target.dataset.id;
  let singleData;
  dataApi.results.forEach((dataItem) => {
    if (dataItem.id == searchId) {
      singleData = dataItem;
    }
  });
  showDetails(singleData);
  searchList.innerHTML = "";
});

//Rellena de informacion del personaje seleccionado previamente
const showDetails = (data) => {

  document.querySelector(
    ".app-body-content-thumbnail"
  ).innerHTML = `<span>"${data.name}"</span>
                 <img src="${data.image}" alt="${data.name}"/>`;

  document.querySelector(".informacion").innerHTML = `
  <li>
      <div>
          <span>
          <i class="fas fa-radiation"></i>
          Status</span>
      </div>
      <span>
      ${data.status}</span>
  </li>
  <li>
      <div>
          <span>
          <i class="fas fa-radiation"></i>
          Especie</span>
      </div>
      <span>${data.species}</span>
  </li>
  <li>
      <div>
          <span>
          <i class="fas fa-radiation"></i>
          Genero</span>
      </div>
      <span>${data.gender}</span>
  </li>
  `;

  document.querySelector(".origen").innerHTML = `
  <li>
      <span>
      <i class="fas fa-map-marker-alt"></i>
      Nombre</span>
      <span>${data.origin.name}</span>
  </li>
  <li>
  `;

  document.querySelector(".locacion").innerHTML = `
    <li>
        <span>
            <i class="fas fa-home"></i>
            Nombre
        </span>
        <span>${data.location.name}</span>
    </li>
    `;
    
};
