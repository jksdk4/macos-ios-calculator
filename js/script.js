const result = document.getElementById("result");
const numberKeys = document.getElementsByClassName("num");
const operators = document.getElementsByClassName("operator");
const clearKey = document.getElementById("clear");
let curNumber = 0;
let prevNumber = 0;
let afterOperation = false;
let curOperation = undefined;

const body = document.body;
let bodyCompStyle = window.getComputedStyle(body, null).getPropertyValue("font-size");
let resultFontSize = parseFloat(bodyCompStyle);
let updatedResultFontSize = resultFontSize;

function changeDisplayVal(numString) {
  if (result.innerHTML === '0' || afterOperation) {
    result.innerHTML = '';
    afterOperation = false;
  }
  // prevent having more than one decimal point
  if (numString === '.' && result.innerHTML.indexOf('.') > -1) {
    numString = '';
  }

  let resultLen = result.innerHTML.length + 1;

  // prevent input of more than 16
  if (resultLen < 17) {
    result.innerHTML += numString;
  }

  curNumber = Number(result.innerHTML);

  // TODO: adjust so it only does this if the container width is under i dunno 200px?
  if (resultLen >= 9 && resultLen < 17) {
    // decrease result text size up to length 16
    body.style.fontSize = (updatedResultFontSize - 1.5) + "px";
    updatedResultFontSize -= 1.5;
  }
}

for (let i = 0; i < numberKeys.length; i++) {
  numberKeys[i].addEventListener("click", () => {
    changeDisplayVal(numberKeys[i].innerHTML);
    clearKey.innerHTML = 'C';
  });
}

for (let i = 0; i < operators.length; i++) {
  operators[i].addEventListener("click", () => {
    if (operators[i].classList.contains("equals")) {
      evaluate(curOperation);
    } else {
      const operation = operators[i].id;
      doOperation(operation);
    }
  });
}

clearKey.addEventListener("click", () => {
  clearAll();
  clearKey.innerHTML = 'AC';
  body.style.fontSize = resultFontSize + "px";
  updatedResultFontSize = resultFontSize;
});

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

function evaluate(operation) {
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
    }
    if (curNumber.toString().length >= 16) {
      curNumber = Number(curNumber.toFixed(16));
    }
    result.innerHTML = curNumber;
  }
  afterOperation = true;
  curOperation = undefined;
}