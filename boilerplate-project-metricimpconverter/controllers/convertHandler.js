/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      if (isNaN(input[i]) && input[i] !== '/' && input[i] !== '.') {
        if (i === 0) {
          break;
        }
        break;
      }
      result += input[i];
    }
    
    if (isNaN(Number(result)) && result !== "invalid number" && result !== '') {
      let split = result.split('/');
      if (split.length > 2) {
        return "invalid number";
      }
      result = parseFloat(split[0], 10) / parseFloat(split[1], 10);
    }
    else if (result === '') {
      result = 1;
    }
    else if (result === "invalid number") {
      return result;
    }
    return Number(result);
  };
  
  this.getUnit = function(input) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      if (isNaN(input[i]) && input[i] !== '/' && input[i] !== '.') {
        result += input[i];
      }
    }
    
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    let result = initUnit;

    if (initUnit === 'gal') {
      result = 'l';
    }
    else if (initUnit === 'L' || initUnit === 'l') {
      result = 'gal';
    }
    else if (initUnit === 'lbs') {
      result = 'kg';
    }
    else if (initUnit === 'kg') {
      result = 'lbs';
    }
    else if (initUnit === 'mi') {
      result = 'km';
    }
    else if (initUnit === 'km') {
      result = 'mi'
    }
    else {
      result = 'invalid unit';
    }
    
    return result;
  };

  this.spellOutUnit = function(unit) {
    let result;
    if (unit === 'gal') {
      result = 'gallons';
    }
    else if (unit === 'L' || unit === 'l') {
      result = 'liters';
    }
    else if (unit === 'lbs') {
      result = 'pounds';
    }
    else if (unit === 'kg') {
      result = 'kilograms';
    }
    else if (unit === 'mi') {
      result = 'miles';
    }
    else {
      result = 'kilometers';
    }
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    if (isNaN(initNum)) {
        return 'invalid number';
    }
    else if (initUnit === 'gal') {
      result = initNum * galToL;
    }
    else if (initUnit === 'L' || initUnit === 'l') {
      result = initNum / galToL;
    }
    else if (initUnit === 'lbs') {
      result = initNum * lbsToKg;
    }
    else if (initUnit === 'kg') {
      result = initNum / lbsToKg;
    }
    else if (initUnit === 'mi') {
      result = initNum * miToKm;
    }
    else if (initUnit === 'km') {
      result = initNum / miToKm;
    }
    else {
      result = 'invalid unit';
    }

    if (result !== 'invalid unit') {
      return Number(result.toFixed(5));
    }
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result;
    if (returnNum === 'invalid number' || returnUnit === 'invalid unit') {
      result = `Error - ${initNum}${initUnit}`;
    }
    else {
      result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    }
    return result;
  };
}

module.exports = ConvertHandler;
