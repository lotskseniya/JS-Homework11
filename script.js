let rate = {};
let box = document.querySelector(".box");
let currencyRate = document.querySelector('[data-value="currency"]');
let input = document.querySelector(".input");
let select = document.querySelector("#select");
let finalSelect = document.querySelector("#finalSelection");
let final = document.querySelector(".final");
let block = document.querySelector(".block");
let leftBlock = document.querySelector("#left-block");
let rightBlock = document.querySelector("#right-block");
let btn = document.querySelector(".button-switch");

getNBUCourse();
setInterval(getNBUCourse, 10000000);
async function getNBUCourse() {
  let nbuApi = await fetch(
    "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
  );
  let data = await nbuApi.json();
  let result = await data;

   // Динамически вывела все валюты из API файла в списке select
  //  и записала в объект rate все курсы валют в том же порядке, 
  // что и в API файле

  let keys = Object.values(result);
  for (i = 0; i < keys.length; i++) {
    select.innerHTML += `
     <option value="${keys[i]["cc"]}">${keys[i]["cc"]}</option>`;

    rate[i] = keys[i]["rate"];
  }

  input.oninput = convertALl;
  select.oninput = convertALl;

  // Функция конвертации валют и показа актуального курса: 
  function convertALl() {
    for (i = 0; i < keys.length; i++) {
      if (select.value === keys[i]["cc"]) {
        final.value = (parseFloat(input.value) * rate[i]).toFixed(2);
        block.classList.add("selected");
        document.querySelector(".course-rate").innerHTML = `
       <span> 1 ${select.value} = ${rate[i]} UAH </span>`;

        let currentcourseUah = document.querySelector(".course-uah");
        let courseUah = (1 / `${rate[i]}`).toFixed(4);
        currentcourseUah.innerHTML = `<span> 1 UAH = ${courseUah} ${select.value} </span>`;
      }


      // функция замены местами блоков с валютами при нажатии на кнопку:

      btn.addEventListener("click", function () {
        for (i = 0; i < keys.length; i++) {
          if (select.value === keys[i]["cc"]) {
            let tempFinal = rate[i];
            box.replaceChildren(rightBlock, leftBlock);
            leftBlock.classList.remove("selected");
            rightBlock.classList.add("selected");
            final.oninput = function(){
              input.value = ((final.value)/tempFinal).toFixed(2);
            }
            btn.addEventListener("click", function () {
              box.replaceChildren(leftBlock, rightBlock);
              rightBlock.classList.remove("selected");
              leftBlock.classList.add("selected");
          })
        }
      }
      return;
      })
    }
    return;
  }
}
