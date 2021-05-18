function getTimeLeft(cur, tar, only) {
  //note: the future time is greater than the past time.
  let curtime = new Date(cur);
  let tartime = new Date(tar);

  if ((tartime - curtime) < 1) {
    //show message:I cannot go back in time, I can only move forward to the future.
  } else {
    //Get the time
    if (only == "getOnlyDays") {

    }
    else if (only == "getOnlyHours") {}
    else if (only == "getOnlyMinutes") {}
    else if (only == "getOnlySeconds") {}
    else {

    }

  }//end of parent else
}//end of function getTimeLeft

