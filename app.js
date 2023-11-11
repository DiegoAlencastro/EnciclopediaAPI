//Variables a utilizar en el aplicativo
let dataApi;
const formBusqueda = document.querySelector(".formularioBusqueda");
//Obtenemos el menu, donde va estar la lista de personajes
let menu = document.getElementById("menu");

//Al iniciar la aplicacion se carga una lista de datos
window.addEventListener("DOMContentLoaded", () => initData());

//Se va a buscar por defecto el filtro en los parametros
const initData = () => {
    buscarpersonajes("rick");

};

//Se va a buscar por defecto el filtro en los parametros
formBusqueda.search.addEventListener("keyup", () => {
    if (formBusqueda.search.value.length > 1) {
        buscarpersonajes(formBusqueda.search.value);
    } else {
        menu.innerHTML = `<p>No hay concidencias con la busqueda</p>`;
        mostrarDatos(undefined);
    }
});

//Muestra la lista lateral con el resultado
const mostrarResultadoBusqueda = (data) => {
    menu.innerHTML = "";
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const divElem = document.createElement("div");
        divElem.innerHTML = `<p data-id = "${element.id}" >${element.name}</p>`;
        menu.appendChild(divElem);
        if (index === 7) {
            break;
        }
    }
};

//Añade el evento para que cada item del menu indique la informacion
menu.addEventListener("click", (event) => {
    let searchId = event.target.dataset.id;
    let singleData;
    dataApi.results.forEach((dataItem) => {
        if (dataItem.id == searchId) {
            singleData = dataItem;
        }
    });
    mostrarDatos(singleData);
});

//Es el consumo de la API mediante fetch
const buscarpersonajes = async (searchText) => {
    let url = `https://rickandmortyapi.com/api/character/?name=${searchText}`;
    try {
        const response = await fetch(url);
        dataApi = await response.json();
        if (dataApi.error === undefined) {
            mostrarResultadoBusqueda(dataApi.results);
            mostrarDatos(dataApi.results[0]);
        }
        if (dataApi.error === "There is nothing here") {
            mostrarDatos(dataApi.results);
            menu.innerHTML = `<p>No hay concidencias con la busqueda</p>`;
        }
    } catch (error) {
        mostrarDatos(dataApi.results);
        menu.innerHTML = `<p>No hay concidencias con la busqueda</p>`;
    }
};

//Al seleccionar un elemento se muestra en la pantalla
const mostrarDatos = (data) => {

    if (data === undefined) {

        //Si es que no encuentra nada, da una imagen por defecto
        document.querySelector(
            ".mensaje"
        ).innerHTML = `
            <h2>Tu búsqueda no es de este planeta, o no seleccionaste de manera correct</h2>
          `;

        document.querySelector(
            ".detalles"
        ).innerHTML = `
        <img src="https://cdn.dribbble.com/users/1882425/screenshots/4000754/media/cd074c9055a0ca4761b7a2756b3991aa.png" alt="Personaje">  
        `;

        document.querySelector(
            ".cuadroDerecho"
        ).innerHTML = `
        <img src="https://cdn.dribbble.com/users/1916180/screenshots/3875427/media/2c0c92969637e9bc9d293152ec783552.jpg" alt="Personaje">  
        `;

        document.querySelector(
            ".contenedorBotonEpisodios"
        ).innerHTML = ``;

    }
    else {
        document.querySelector(
            ".mensaje"
        ).innerHTML = `
            <h2>Detalles</h2
          `;

        document.querySelector(
            ".detalles"
        ).innerHTML = `
        <table>
            <tr>
                <td>Status</td>
                <td>${data.status}</td>
            </tr>
            <tr>
                <td>Especie</td>
                <td>${data.species}</td>
            </tr>
            <tr>
                <td>Tipo</td>
                <td>${data.type}</td>
            </tr>
            <tr>
                <td>Genero</td>
                <td>${data.gender}</td>
            </tr>
            <tr>
                <td>Origen</td>
                <td>${data.origin.name}</td>
            </tr>
            <tr>
                <td>Posicion actual</td>
                <td>${data.location.name}</td>
            </tr>        
        </table>
        `;

        document.querySelector(
            ".cuadroDerecho"
        ).innerHTML = `
            <h2>${data.name}</h2>
            <img src="${data.image}" alt="Personaje">  
          `;

        document.querySelector(
            ".contenedorBotonEpisodios"
        ).innerHTML = `
        <a class="btnEpisodios" href="#modalEpisodios">Ver episodios</a>
        `;
            
        let listaepisodios='';
        data.episode.forEach((episodio) => {
            //De los episodios que devuelve el objeto le saco el ultimo valor, para poder usarlo en el boton
            const myArray = episodio.split("/");
            const last = myArray[myArray.length - 1];
            listaepisodios=listaepisodios+`<button type="button" class="botonEpisodio" onclick="informacionEpisodios('${episodio}')">${last.padStart(2, '0')}</button>`; 
        });

        document.querySelector(
            ".modalmask"
        ).innerHTML = `
        <div class="modalbox rotate">
            <a href="#close" title="Close" class="close">X</a>
            <h2>Episodios</h2>
            ${listaepisodios}
            <div class="detalleEpisodio">
        </div>
        `;


    }
};

 //Saca la informacion del episodio
const informacionEpisodios = async (url) => {
    try {
        const response = await fetch(url);
        dataApiEpisodio = await response.json();
        document.querySelector(
            ".detalleEpisodio"
        ).innerHTML = `
        <h4>${dataApiEpisodio.name}</h4>
        <h4>${dataApiEpisodio.air_date}</h4>
        <h4>${dataApiEpisodio.episode}</h4>
        `;
    } catch (error) {
        console.log(error);
    }
};
