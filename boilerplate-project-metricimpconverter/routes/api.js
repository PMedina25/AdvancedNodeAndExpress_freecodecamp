/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      let input = req.query.input;
      let initNum = convertHandler.getNum(input);
      let initUnit = convertHandler.getUnit(input);
      let returnNum = convertHandler.convert(initNum, initUnit);
      let returnUnit = convertHandler.getReturnUnit(initUnit);
      let toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      
      if (returnNum === 'invalid number' && returnUnit === 'invalid unit') {
        res.json('invalid number and unit');
      }
      else if (returnNum === 'invalid number' && returnUnit !== 'invalid unit') {
        res.json('invalid unit');
      }
      else if (returnNum !== 'invalid number' && returnUnit === 'invalid unit') {
        res.json('invalid unit');
      }
      else {
         res.json({
           initNum,
           initUnit,
           returnNum,
           returnUnit,
           string: toString
          });
      }
    });
    
};
