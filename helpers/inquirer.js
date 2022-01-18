const inquirer = require("inquirer"); // Libreria externa. Una colección de interfaces de usuario de línea de comando interactivas comunes.

require("colors");

const inquirerMenu = async () => {

  const choices = [
    {
      value: 1, //Valor que retorna como respuesta al ser seleccionada
      name: `${'1.'.green} Buscar Ciudad`, //Texto de la opcion
    },

    {
      value: 2,
      name: `${'2.'.green} Historial`,
    },

    {
      value: 0,
      name: `${'0.'.green} Salir`,
    }
  ];
  const question = [ //Array que contiene un objeto de pregunta
    {
      type: "list", //Tipo de solicitud, lista una serie de opciones que son navegables atravez de las flechas y numeros del teclado.
      name: "opt", // El nombre que se usará al almacenar la respuesta en el objeto de respuestas.
      message: "¿Qué Desea Hacer?", // La pregunta para imprimir
      choices // Matriz de opciones. Los valores de matriz pueden ser números simples, cadenas u objetos que contienen un nombre (para mostrar en la lista), un valor (para guardar en el hash de respuestas) y propiedades breves (para mostrar después de la selección). La matriz de opciones también puede contener un separador.
    }
  ];

  console.clear();
  console.log("=================".green);
  console.log("MENÚ DE OPCIONES".white);
  console.log("=================\n".green);

  const { opt } = await inquirer.prompt(question); //await espera la respuesta de una funcion que retorna una promesa
  return opt; //Obtenemos el numero de la opcion seleccionada
}; // Fin

const pausar = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Presione ${"ENTER".green} para continuar`,
    },
  ];
  console.log("\n");
  await inquirer.prompt(question); //Esperamos a que se ingrese un Enter
}; // Fin

const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      }
    }
  ];
  const { desc } = await inquirer.prompt(question);
  return desc;
}; // Fin

const listarLugares = async ( lugares = []) => {

  const choices = lugares.map( (lugar, i) =>{ //Creamos un arreglo con las opciones
    const {id, nombre} = lugar;
    const index = `${i + 1}.`.green;
    
    return { //Creamos una opcion por cada tarea existente
      value: id, //Cada opcion de tarea tiene como valor su id.
      name: `${ index } ${ nombre }`
    }
  });

  choices.unshift({ // Con unshift agregamos una opcion al inicio del array. Con esto el usuario puede cancelar la acción
    value: '0',
    name: '0.'.green + ' Cancelar'
  });

  const question = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione lugar:',
      choices //Las opciones son las creadas anteriormente
    }
  ]
  const {id} = await inquirer.prompt(question);
  return id;
}; // Fin

const confirmar = async (message) => {
  const question = [
    {
      type: 'confirm',
      name: 'ok',
      message
    }
  ];
  const {ok} = await inquirer.prompt(question);
  return ok; //Retorna true o false
}; // Fin

const completarTareasChecklist = async (tareas = []) => {

  const choices = tareas.map( (tarea, i) =>{ //Creamos un arreglo con las opciones
   const {id, desc, completadoEn} = tarea;
   const index = `${i + 1}.`.green;
    
    return { //Creamos una opcion por cada tarea existente
      value: id, //Cada opcion de tarea tiene como valor su id.
      name: `${ index } ${ desc }`,
      checked: completadoEn ? true : false
    }
  });

  const question = [
    {
      type: 'checkbox',
      name: 'ids',
      message: 'Selecciones:',
      choices //Las opciones son las creadas anteriormente
    }
  ]
  const {ids} = await inquirer.prompt(question);
  return ids; //Obtenemos un array de ids
}; // Fin


module.exports = {
  inquirerMenu,
  pausar,
  leerInput,
  listarLugares,
  confirmar,
  completarTareasChecklist
};
