const result = document.getElementById("result");
const numberKeys = document.getElementsByClassName("num");
const operators = document.getElementsByClassName("operator");
const functions = document.querySelectorAll(".function:not(#clear)");
const operatorsWithoutEqual = document.querySelectorAll(".operator:not(#equals)");

const clearKey = document.getElementById("clear");
let curNumber = 0;
let prevNumber = 0;
let afterOperation = false;
let curOperation = undefined;

const bodyCompStyle = window.getComputedStyle(document.body, null).getPropertyValue("font-size");
const resultFontSize = parseFloat(bodyCompStyle);
let updatedResultFontSize = resultFontSize;

function resetDisplayTextSize() {
  document.body.style.fontSize = resultFontSize + "px";
  updatedResultFontSize = resultFontSize;
}

function changeDisplayVal(numString) {
  let disabled = (el) => el.hasAttribute("disabled");
  const operatorsArray = Array.from(operators);   // HTMLCollections and NodeLists don't like ES6 methods I guess
  if (operatorsArray.some(disabled)) {
    enableButtons();
  }

  if (result.innerHTML === '0' || afterOperation) {
    resetDisplayTextSize();   // resets input size after hitting an operand and upon the second input being entered
    result.innerHTML = '';
    afterOperation = false;
  }

  if (numString === '.' && result.innerHTML.indexOf('.') > -1) {
    numString = '';
  }

  let resultLen = result.innerHTML.length + 1;
  if (resultLen < 17) {
    result.innerHTML += numString;
  }

  curNumber = Number(result.innerHTML);

  // TODO: adjust so it only does this if the container width is under i dunno 200px?
  if (resultLen >= 9 && resultLen < 17) {
    document.body.style.fontSize = (updatedResultFontSize - 1.5) + "px";
    updatedResultFontSize -= 1.5;
  }
}

function doOperation(operation) {
  if (!curOperation) {
    prevNumber = curNumber;
    curOperation = operation;
    afterOperation = true;
  } else if (!afterOperation) {
    evaluate(curOperation);
    prevNumber = curNumber
    curOperation = operation;
    afterOperation = true;
  } else {
    curOperation = operation;
  }
}

function clearAll() {
  curNumber = 0;
  prevNumber = 0;
  curOperation = undefined;
  afterOperation = false;
  result.innerHTML = '0';
}

function factorial(num) {
  if (num < 0) {
    return NaN;
  }

  if (num === 0 || num === 1) return 1;

  let returnVal = 1;
  for (let i = 2; i <= num; i++)
    returnVal *= i;
  return returnVal;
}

function disableButtons() {
  for (let i = 0; i < operatorsWithoutEqual.length; i++) {
    operatorsWithoutEqual[i].setAttribute("disabled", "");
  }

  for (let i = 0; i < functions.length; i++) {
    functions[i].setAttribute("disabled", "");
  }

  document.getElementById("decimal").setAttribute("disabled", "");
}

function enableButtons() {
  afterOperation = true;

  for (let i = 0; i < operatorsWithoutEqual.length; i++) {
    if (operatorsWithoutEqual[i].hasAttribute("disabled")) {
      operatorsWithoutEqual[i].removeAttribute("disabled");
    }
  }

  for (let i = 0; i < functions.length; i++) {
    if (functions[i].hasAttribute("disabled")) {
      functions[i].removeAttribute("disabled");
    }
  }

  document.getElementById("decimal").removeAttribute("disabled");
}

function checkForUndefined(res) {
  if (isNaN(res) || res === Infinity || res === -Infinity) {
    result.innerHTML = "Not a number";
    disableButtons();
    return true;
  }
  return false;
}

/* 
  TODO: mostly works, but doesn't apply unary function to result.
  so this prevents applying a func to a result. but it does allow to stack them beforehand.
  check the doOperation method. may need to refactor this function.
*/

function evaluate(operationBtn) {
  const operation = operationBtn.id;
  if (!afterOperation) {
    switch (operation) {
      case 'add':
        curNumber = prevNumber + curNumber;
        break;
      case 'subtract':
        curNumber = prevNumber - curNumber;
        break;
      case 'multiply':
        curNumber = prevNumber * curNumber;
        break;
      case 'divide':
        curNumber = prevNumber / curNumber;
        break;
      case 'percent':
        curNumber /= 100;
        break;
      case 'invert':
        curNumber === 0 ? curNumber : curNumber = -curNumber;
        break;
      case 'square-root':
        curNumber = Math.sqrt(curNumber);
        break;
      case 'cube-root':
        curNumber = Math.cbrt(curNumber);
        break;
      case 'pi':
        curNumber = Math.PI;
        break;
      case 'e':
        curNumber = Math.E;
        break;
      case 'abs':
        curNumber = Math.abs(curNumber);
        break;
      case 'factorial':
        curNumber = factorial(curNumber);
        break;
      case 'sine':
        curNumber = Math.sin(curNumber);
        break;
      case 'cosine':
        curNumber = Math.cos(curNumber);
        break;
      case 'tangent':
        curNumber = Math.tan(curNumber);
        break;
      case 'arcsin':
        curNumber = Math.asin(curNumber);
        break;
      case 'arccos':
        curNumber = Math.acos(curNumber);
        break;
      case 'arctan':
        curNumber = Math.atan(curNumber);
        break;
      case 'random':
        curNumber = Math.random();
        break;
      case 'ten-to-x':
        curNumber = Math.pow(10, curNumber);
        break;
      case 'exponent':
        curNumber = Math.pow(prevNumber, curNumber);  // 👀
        break;
    }

    if (!checkForUndefined(curNumber)) {
      if (curNumber.toString().length >= 16) {
        curNumber = Number(curNumber.toFixed(16));
      }
      result.innerHTML = curNumber;
    }
  }

  afterOperation = true;
  if (operationBtn.classList.contains("operator")) {
    curOperation = undefined;
  }
}

for (let i = 0; i < numberKeys.length; i++) {
  numberKeys[i].addEventListener("click", () => {
    clearKey.innerHTML = 'C';
    changeDisplayVal(numberKeys[i].innerHTML);
  });
}

// executing unary functions like negation
for (let i = 0; i < functions.length; i++) {
  if (functions[i].classList.contains("operator")) continue;    // skip sci calc binary functions like x^y
  functions[i].addEventListener("click", () => {
    if (functions[i].classList.contains("toggle")) {
      toggle(functions[i]);         // i'll add this function later. for 2nd, rad/deg.
    } else {
      evaluate(functions[i]);
      afterOperation = false;       // allows second unary input after operator use
    }
  });
}

for (let i = 0; i < operators.length; i++) {
  operators[i].addEventListener("click", () => {
    if (operators[i].classList.contains("equals")) {
      evaluate(curOperation);
    } else {
      doOperation(operators[i]);
    }
  });
}

clearKey.addEventListener("click", () => {
  clearAll();
  enableButtons();
  clearKey.innerHTML = 'AC';
  resetDisplayTextSize();
});
