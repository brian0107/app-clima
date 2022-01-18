/* dotenv es una libreria externa para crear variables de entorno, 
 para usarla solo crea un archivo .env y define las variables dentro, 
despues tendras acceso a ellas con: process.env.'nombreVariable' */
require("dotenv").config();

const {
  leerInput,
  inquirerMenu,
  pausar,
  listarLugares,
} = require("./helpers/inquirer");

const Busquedas = require("./models/busquedas");
require("colors");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar Mensaje
        const termino = await leerInput("Ciudad: "); //Recibimos el termino a buscar

        //  Buscar los lugares
        const lugares = await busquedas.buscarLugares(termino); // Realizamos la busqueda de los lugares coindicentes

        //  Seleccionar el lugar
        const id = await listarLugares(lugares); // Mostramos los lugares encontrados y obtenemos el id del lugar seleccionado
        if (id === "0") continue; // Termina la ejecución y sigue con la siguiente iteracion del ciclo
        const lugarSel = lugares.find((lugar) => lugar.id === id);
        const { nombre, lon, lat } = lugarSel;

        // Guardar en DB
        busquedas.agregarHistorial(nombre);

        //  Clima
        const clima = await busquedas.climaLugar(lat, lon);
        const { desc, min, max, temp } = clima;

        // Mostrar resultados
        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad:", nombre.green);
        console.log("Lat:", lat);
        console.log("Lon:", lon);
        console.log("Temperatura actual:", temp);
        console.log("Mínima:", min);
        console.log("Máxima:", max);
        console.log("Descripción del clima:", desc.green);

        break;

      case 2:
        // Mostrar historial de lugares
       busquedas.historialCapitalizado.forEach( (lugar, i) =>{
        const index = `${i + 1}.`.green;
        console.log(`${ index } ${ lugar }`);
       });      
        
        break;

      case 0:
        // Salir de la aplicación
        console.log("Seleccionaste la opcion 0");
        break;
    }

    if (opt !== 0) await pausar();
  } while (opt !== 0);
};

main();
