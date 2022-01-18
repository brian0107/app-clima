const fs = require("fs"); //libreria de node

const axios = require("axios"); //libreria de terceros

class Busquedas {
  constructor() {
    this.historial = []; //Crear array de historial
    this.dbPath = "./db/database.json"; // Crear path donde almacenamos el json (bd)
    this.leerDB(); // Disparamos la función que obtiene los datos del json (db)
  }

  get historialCapitalizado() {
    // Capitalizar cada palabra (Todo el texto viene en minusculas, hacemos la primera letra de cada palabra mayuscula)
      return this.historial.map( lugar => { //Retornamos un array con los lugare capitalizados

        let palabras = lugar.split(' '); //Obtenemos un array con las palabras de cada lugar.
       
        palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) ); //Iteramos en cada palabra haciendo mayuscula la primera letra.
        
        return palabras.join(' '); // Transformamos el lugar de nuevo a string y retornamos
      })
    
  }

  get paramsMapbox() {
    return {
      'access_token': process.env.MAPBOX_KEY, // Colocamos nuestro token generado en la pagina de https://account.mapbox.com/ que nos permite usar la API
      'limit': 10, // Establecemos un limite de maximo 10 resultados
      'language': "es", // Establecemos lenguaje español
    };
  }
  // Busca lugares por nombre
  async buscarLugares(lugar = "") {
    try {
      //Creamos una instancia de axios
      const instance = axios.create({
        //Definimos la url a consultar y los parametros deseados.
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`, // Api a consultar. La API de geocodificación le permite buscar direcciones y lugares por nombre o coordenadas.
        params: this.paramsMapbox, // Especificamos los parametros
      });

      const respuesta = await instance.get(); // Realizamos la peticion con axios y especificamos el metodo get. Axios funciona con promesas asi que utilizamos await

      // Obtenemos el array con los lugares encontrados y creamos un nuevo array de objetos con ciertos datos de cada lugar.
      const ciudades = respuesta.data.features.map((lugar) => ({
        //Si encerramos entre parentesis las llaves de esta forma ({}) retornamos un objeto explicitamente. Es decir no es necesario retornar lo de esta forma: return { params };

        id: lugar.id, // Id del lugar (para listarlos con inquirer y al seleccionar uno retornar su id).
        nombre: lugar.place_name, // Nombre del lugar
        lon: lugar.center[0], // longitud
        lat: lugar.center[1], // latitud
      })); // Devolvemos un objeto con datos importantes de cada lugar encontrado.

      return ciudades;
    } catch (error) {
      return [];
    }
  }

  get paramsOpenWeather() {
    return {
      'appid': process.env.OPENWEATHER_KEY, // Colocamos nuestro token generado en la pagina de https://openweathermap.org/ que nos permite usar la API
      'units': "metric", // Establecemos medida en celcius
      'lang': "es", // Establecemos lenguaje español
    };
  }

  //api.openweathermap.org/data/2.5/weather?lat=19.93658&lon=-105.24954&appid=0f6f8ce4d3c993b7e458af5f56b41643&units=metric&lang=es
  async climaLugar(lat, lon) {
    try {
      // instance axios
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon }, // Creamos una copia del objeto recibido y agregamos la latitud y la longitud.
      });
      // respuesta
      const respuesta = await instance.get(); // Realizamos la peticion con axios y especificamos el metodo get. Axios funciona con promesas asi que utilizamos await
      const { weather, main } = respuesta.data;

      return {
        desc: weather[0].description, // weather es un arreglo de objetos y el objeto que necesitamos esta en la primera posición
        temp: main.temp,
        max: main.temp_max,
        min: main.temp_min,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    // Evitar duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    // Definimos un historial con un limite de 10 registros
    this.historial = this.historial.splice(0,9); //El método splice() cambia el contenido de un array en este caso eliminamos los elementos que no esten en la posicion 0-9
    // Agregamos un nuevo lugar al historial
    this.historial.unshift(lugar.toLocaleLowerCase()); //Agrega al inicio

    // Grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const data = { //Creamos un objeto en caso de querer agregar mas atributos
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(data)); //Creamos un archivo con un objeto que contiene nuestro arreglo de historial
  }

  leerDB() { 
    // Verificar que exista el archivo json ...
    if (!fs.existsSync( this.dbPath ) ) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" }); //El método fs.readFileSync() se utiliza para leer el archivo y devolver su contenido. Recibe el archivo a leer y el tipo de encoding (utf-8) para que muestre los datos como caracteres en español.
    const data = JSON.parse( info ); // JSON.parse() y analiza los datos json y retorna el objeto que se corresponde con el texto JSON entregado.
    this.historial = data.historial; // data es un objeto asi que accedemos al array de historial.
    
  }
}

module.exports = Busquedas;
