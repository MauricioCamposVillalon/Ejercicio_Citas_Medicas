import * as http from 'http';
import url from 'url';
import axios from 'axios';
import chalk from 'chalk';
import _ from 'lodash';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

let arr_usuario = [];

http.createServer((req, res) => {
    let requestUrl = url.parse(req.url, true);

    let {codigo} = requestUrl.query;
    codigo = codigo;

    if(req.url.startsWith('/usuarios')){ // Inicio del servidor en puerto 8080

        let urlConsulta = 'https://randomuser.me/api/'; // llamada de la API
        axios.get(urlConsulta)                          // Uso de Axios para resolver la llamada
             .then(response => {
            res.writeHead(200, {'content-type': 'text/html;charset=utf8'});
            let nombre = response.data.results[0].name.first;       //se obtiene Nombre  desde la api 
            let apellido = response.data.results[0].name.last;      // se obtiene el Apellido desde la api

            
            let obj = {             //Se guarda la informacion dentro de un objeto
                nombre: nombre,
                apellido: apellido,
                id: uuidv4().slice(30),
                fecha: moment().format('MMM Do YYYY, h:mm:ss a')
            }
            arr_usuario.push(obj); 

            let usuario = _.defaults(arr_usuario)  // con chalk obtengo la informacion desde el arreglo a variable  usuario 
            
            res.write('<p>HISTORIAL DE CONSULTAS:</p>')
            _.forEach(usuario, (m) => { // aqui la variable usuario nos permite llamar la informacion guardada
                res.write(`<p>Nombre: ${m.nombre} - Apellido: ${m.apellido} - ID: ${m.id} - Timestamp: ${m.fecha} </p>`)
                console.log(chalk.blue.bgWhite(`Nombre : ${m.nombre} - Apellido ${m.apellido} - ID: ${m.id} - Timestamp: ${m.fecha}`))
            })
            
            res.end();
        }).catch(error => {
            res.writeHead(500, {'content-type': 'text/html;charset=utf8'});
            res.write('<p>Ha ocurrido un error interno en el servidor, intente más tarde.</p>')
            console.log("Error al consultar la API  con las personas");
            res.end();
        })


    }
}).listen(8080, () => {
    console.log("Servidor corriendo en http://localhost:8080")
})