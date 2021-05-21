/////////////////////////////////////////////////

//All the elements needed
let getCurrentDate = document.querySelector(".get-cur-date");

let inputCurDate = document.querySelector("#currentdate");
let inputTarDate = document.querySelector("#targetdate");

let getBattery = document.querySelector(".get-battery");

let buttons = document.querySelectorAll('.btn');
buttons = Object.assign([], buttons);

let showTimeText = document.querySelector(".show-time");

//Global intervals
let secInterv;
let minInterv;
let timeInterv;

///Get and Set the battery level for the user
navigator.getBattery().then(function(battery){
  getBattery.textContent = `Battery - ${Math.trunc(battery.level * 100)}%`
})

///Setting today's date and time for the user at the header
function setTodayDate () {
  let dateValues = getTodayDate();
  getCurrentDate.innerHTML = `${dateValues[0]} ${dateValues[1]} ${dateValues[2]} <br> ${dateValues[3]}:${dateValues[4]}:${dateValues[5]} ${dateValues[6]}`;
}
setTodayDate();
///Setting today's date for the user after every sec at the header.
let curInterv = setInterval(setTodayDate,1000);

//Set default current date for the "current date" input.
let dateValues = getTodayDate();
let month = dateValues[7] >= 10? dateValues[7] : "0" + dateValues[7];
inputCurDate.value = `${dateValues[2]}-${month}-${dateValues[0]}`

//If any one of the input has no value, the function getTimeLeft (below) won't even be called
buttons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    if (Boolean(inputCurDate.value) && Boolean(inputTarDate.value)) {
      let cur = inputCurDate.value.split("-");
      let tar = inputTarDate.value.split("-");

      let arry = [0, 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

      cur = cur[2] + arry[Number(cur[1])] + cur[0];
      tar = tar[2] + arry[Number(tar[1])] + tar[0];

      getTimeLeft(cur, tar, button.textContent);
    } else {
      showTimeText.innerHTML = `<span class="error">ERROR</span>: Either The Month And/Or Day And/Or Year Of One Of The Dates Is Empty`
    }
  });
});

///Function to get today's date and time
function getTodayDate () {
  let presentTimeDate = new Date();

  let ampm = presentTimeDate.toLocaleString("default", {hour: "numeric", hour12: true}).split(" ");

  let day = presentTimeDate.getDate() >= 10? presentTimeDate.getDate() : "0" + presentTimeDate.getDate();

  let month = presentTimeDate.toLocaleString("default", {month: "short"});

  let year = presentTimeDate.getFullYear();
  //
  let hour = presentTimeDate.getHours();
  hour = hour % 12;
  hour = hour? hour : 12;
  hour = hour >= 10? hour : "0" + hour;

  let minute = presentTimeDate.getMinutes() >= 10?  presentTimeDate.getMinutes() : "0" + presentTimeDate.getMinutes();

  let second = presentTimeDate.getSeconds() >= 10?  presentTimeDate.getSeconds() : "0" + presentTimeDate.getSeconds();

  return [day, month, year, hour, minute, second, ampm[1], presentTimeDate.getMonth() + 1];
}

///Function for each of the buttons.
function getTimeLeft(cur, tar, only) {
  //note: the future time is greater than the past time.
  //clean up
  if (secInterv) {
    clearInterval(secInterv);
  }
  if (minInterv) {
    clearInterval(minInterv);
  }
  if (timeInterv) {
    clearInterval(timeInterv);
  }
  let sameDateAsToday = false;
  let curtime = new Date(cur);
  //checking to see if the curtime gotten tallies with today's date, if so use new Date(), so we can get access to current hour and minutes and seconds
  if (curtime.getDate() == new Date().getDate()) {
    if (curtime.getMonth() + 1 == new Date().getMonth() + 1) {
      if (curtime.getFullYear() == new Date().getFullYear()) {
        curtime = new Date();
        sameDateAsToday = true;
      }
    } //else {sameDateAsToday = false;}
  }

  let tartime = new Date(tar);

  let difInTime = tartime - curtime;

  if ((tartime - curtime) < 1) {
    showTimeText.innerHTML = `<span class="error">ERROR</span>: 'Target Date' Can't Be A Past Date In Relation To 'Current Date', Try Picking A Date In The Future`;
  } else {
    //Get the time
    let totalSeconds = Math.trunc(difInTime / 1000);
    let totalHours = Math.trunc(totalSeconds / 3600);
    let totalMinutes = Math.trunc(totalSeconds / 60);
    let totalDays = Math.trunc(totalHours / 24);
    let hoursLeft = totalHours % 24;
    
    let minutes = Math.trunc((totalSeconds - (totalHours * 3600)) / 60);

    let seconds = (totalSeconds - (totalHours * 3600)) - minutes * 60;


    if (only == "Get Only Days") {
      showTimeText.innerHTML = `You have <span>${totalDays}</span> day(s) left.`;
    }
    else if (only == "Get Only Hours") {
      showTimeText.innerHTML = `You have <span>${totalHours}</span> hour(s) left.`;
    }
    else if (only == "Get Only Minutes") {
      showTimeText.innerHTML = `You have <span>${totalMinutes}</span> minutes(s) left.`;

      if (sameDateAsToday) {
        minInterv = setInterval(function () {
          let difInTime = tartime - new Date();
          let mins = Math.trunc(Math.trunc(difInTime / 1000) / 60);
          showTimeText.innerHTML = `You have <span>${mins}</span> minutes left.`;

          if (difInTime < 1) {
            showTimeText.innerHTML = `TARGET DATE REACHED!!`;
            clearInterval(minInterv);
          }
        }, 60000);
      }

    }
    else if (only == "Get Only Seconds") {
      showTimeText.innerHTML = `You have <span>${totalSeconds}</span> second(s) left.`;

      if (sameDateAsToday) {
        secInterv = setInterval(function () {
          let difInTime = tartime - new Date();
          let secs = Math.trunc(difInTime / 1000);
          showTimeText.innerHTML = `You have <span>${secs}</span> second(s) left.`;
        }, 1000);

        if (difInTime < 1) {
          showTimeText.innerHTML = `TARGET DATE REACHED!!`;
          clearInterval(secInterv);
        }
      }

    }
    else {

      showTimeText.innerHTML = `You have <span>${totalDays}</span> day(s) <span>${hoursLeft}</span> hour(s) <span>${minutes}</span> minute(s) <span>${seconds}</span> second(s) left.`;

      if (sameDateAsToday) {
        timeInterv = setInterval(function () {
          let difInTime = tartime - new Date();
          let totalSeconds = Math.trunc(difInTime / 1000);
          let totalHours = Math.trunc(totalSeconds / 3600);
          let totalDays = Math.trunc(totalHours / 24);
          let hoursLeft = totalHours % 24;

          let minutes = Math.trunc((totalSeconds - (totalHours * 3600)) / 60);

          let seconds = (totalSeconds - (totalHours * 3600)) - minutes * 60;

          showTimeText.innerHTML = `You have <span>${totalDays}</span> day(s) <span>${hoursLeft}</span> hour(s) <span>${minutes}</span> minute(s) <span>${seconds}</span> second(s) left.`;
        }, 1000);

        if (difInTime < 1) {
          showTimeText.innerHTML = `TARGET DATE REACHED!!`;
          clearInterval(timeInterv);
        }

      }//
    }// end of parent else

  }
}