let display = document.getElementById("display");
let numberKeys = document.getElementsByClassName("num");
let operators = document.getElementsByClassName("operator");
let clearKey = document.getElementById("clear");
let curNumber = 0,
  prevNumber = 0,
  afterOperation = false,
  curOperation = undefined;

// add listeners to number numberKeys
for (let i = 0; i < numberKeys.length; i++) {
  numberKeys[i].addEventListener("click", () => {
    changeDisplayVal(numberKeys[i].innerHTML);
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
  display.innerHTML = '0';
}

function changeDisplayVal(numString) {
  if (display.innerHTML === '0' || afterOperation) {
    display.innerHTML = '';
    afterOperation = false;
  }
  // fix having more than one decimal point
  if (numString === '.' && display.innerHTML.indexOf('.') > -1) {
    numString = '';
  }
  if (display.innerHTML.length >= 16) {
    // do nothing (16 digit limit)
  } else {
    display.innerHTML += numString;
  }

  // set current number
  curNumber = Number(display.innerHTML);
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
    display.innerHTML = curNumber;
  }
  afterOperation = true;
  curOperation = undefined;
}