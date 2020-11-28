// ========================
// Puerto
// ========================
/* 
* El process es un objeto global que está corriendo a lo largo de toda
* la aplicación de node, y también ese objeto es actualizado dependiendo del environment 
* o el entorno donde está corriendo
*/
process.env.PORT = process.env.PORT || 3000;


// ========================
// Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
// Base de datos
// ========================
let urlDB;

/*
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/freecodecamp'
} else {
    urlDB = 'mongodb+srv://strider:qAFu0zifL1kPeqAv@cluster0.m9yxb.mongodb.net/freecodecamp?retryWrites=true&w=majority';
}
*/

urlDB = 'mongodb+srv://strider:qAFu0zifL1kPeqAv@cluster0.m9yxb.mongodb.net/freecodecamp?retryWrites=true&w=majority';


process.env.urlDB = urlDB;