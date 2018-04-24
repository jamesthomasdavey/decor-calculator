// modal components.
const infoEl = document.querySelector(`.info`);
const modalEl = document.querySelector(`.modal`);
const modalCloseEl = document.querySelector(`.modal__close`);

// form and result components.
let resultEl = document.querySelector(`#result`);
let bodyEl = document.querySelector(`body`);
let calculateEl = document.querySelector(`#calculate`);
let resetEl = document.querySelector(`#reset`);
let formEl = document.querySelector(`form`);

// function to convert a decimal to a fraction. this was stolen from somebody else.
let decimalToFraction = number => {
  var numerator = 1.0;
  var denominator = 1.0;
  if (number === 0.0) {
    return "0/1";
  }
  var isNegative = number < 0.0;
  if (isNegative) {
    number = number - number * 2;
  }
  while (numerator / denominator !== number) {
    if (numerator / denominator < number) {
      numerator++;
      denominator--;
    } else if (numerator / denominator > number) {
      denominator++;
    }
  }
  if (isNegative) {
    return "-" + numerator.toString() + "/" + denominator.toString();
  }
  return numerator.toString() + "/" + denominator.toString();
};

// function to split number into integer and decimal, use decimalToFraction on the decimal, and contatenate them.
let toFraction = num => {
  if (num % 1 === 0) {
    return num.toString();
  } else {
    let newNum = ``;
    newNum += num - num % 1;
    newNum += ` ${decimalToFraction(num % 1)}`;
    return newNum;
  }
};

// function to calculates hook points on wall using parameters from runHangPoints funtion
let hangPoints = (wallWidth, artWidth, unit, artQuantity) => {
  let blankWallSpace = wallWidth - artQuantity * artWidth;
  let spaceBetween = blankWallSpace / (artQuantity + 1);
  let lastPoint = 0;
  let array = [];
  for (let i = 0; i < artQuantity; i++) {
    if (i === 0) {
      lastPoint += spaceBetween + artWidth / 2;
      array.push(lastPoint);
    } else {
      lastPoint += spaceBetween + artWidth;
      array.push(lastPoint);
    }
  }
  let convertedOutput = [];
  // rounds to nearest hundredth if `centimeters` is selected
  if (unit === `centimeters`) {
    for (let item of array) {
      convertedOutput.push(Math.round(10 * item) / 10 + `cm`);
    }
  } else {
    // rounds to nearest 1/16th if `inches` is selected, and uses toFraction function
    for (let item of array) {
      convertedOutput.push(toFraction(Math.round(16 * item) / 16) + `"`);
    }
  }
  return convertedOutput.join(`</p><p>`); // the <p> tags are to create a line break for each item
};

// function to gather user inputs, validate for value completion, and complete the code if allowed.
function runHangPoints() {
  let wallWidth = document.querySelector(`#wall-width`).value;
  let artWidth = document.querySelector(`#art-width`).value;
  let unit = document.getElementsByTagName(`option`)[document.querySelector(`#units`).selectedIndex].value;
  let artQuantity = document.querySelector(`#art-quantity`).value;
  window.location.href = `#result`;
  if (
    wallWidth === `` ||
    artWidth === `` ||
    artQuantity === `` ||
    wallWidth === `WALL WIDTH` ||
    artWidth === `DECOR WIDTH` ||
    artQuantity === `ART QUANTITY`
  ) {
    resultEl.classList.add(`show`);
    resultEl.innerHTML = `All fields are required.`;
  } else if (wallWidth <= 0 || artWidth <= 0 || artQuantity <= 0) {
    resultEl.classList.add(`show`);
    resultEl.innerHTML = `Please enter only positive values.`;
  } else if (artQuantity % 1 !== 0) {
    resultEl.classList.add(`show`);
    resultEl.innerHTML = `Decor quantity must be a whole number.`;
  } else if (artWidth * artQuantity > wallWidth) {
    resultEl.classList.add(`show`);
    resultEl.innerHTML = `Not enough wall space!`;
  } else {
    resultEl.classList.add(`show`);
    resultEl.innerHTML = hangPoints(Number(wallWidth), Number(artWidth), unit, Number(artQuantity));
    // if the user changes the "unit" selection, the whole function reruns.
    document.querySelector(`#units`).addEventListener(`change`, runHangPoints);
  }
}

// function to form and erase any previous result.
function resetForm() {
  resultEl.innerHTML = ``;
  resultEl.classList.remove(`show`);
  formEl.reset();
  document.querySelector(`#wall-width`).focus();
}

// if the node with the id "calculate" is clicked, runHangPoints is executed.
calculateEl.addEventListener(`click`, runHangPoints);

// pressing "enter" initiates clicking "calculate"
window.addEventListener(`keyup`, function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.querySelector(`#calculate`).click();
  }
});

// reset button triggers resetForm
resetEl.addEventListener(`click`, resetForm);

// modal functionality
infoEl.addEventListener(`click`, function () {
  modalEl.classList.toggle(`open`);
});
modalCloseEl.addEventListener(`click`, function () {
  modalEl.classList.toggle(`open`);
});
window.addEventListener(`click`, function (event) {
  if (event.target === modalEl) {
    modalEl.classList.remove(`open`);
  }
});