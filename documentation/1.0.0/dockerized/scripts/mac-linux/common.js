function getEndDate(date) {
    let endDate = date.split(' ');
    if (endDate[1] === '' || endDate[1] === undefined) {
      date = endDate[0] + ' 23:59:59';
    }
    date = new Date(date);
    date = addOffsetToDateTime(date,"+05:30");
    console.log(date,"this is date")
    return date;
  }


  function addOffsetToDateTime(time, timeZoneDifference) {
    //get the offset time from env with respect UTC
    let localTimeZone = timeZoneDifference;
    //convert offset time to minutes
    let localTime = localTimeZone.split(':');
    let localHourDifference = Number(localTime[0]);
    let getTimeDiffInMinutes =
      localHourDifference * 60 + (localHourDifference / Math.abs(localHourDifference)) * Number(localTime[1]);
    //get server offset time w.r.t. UTC time
    let timeDifference = new Date().getTimezoneOffset();
    //get actual time difference in minutes
    let differenceWithLocal = timeDifference + getTimeDiffInMinutes;
    // if its 0 then return same time
    if (differenceWithLocal === 0) {
      return time;
    } else {
      // set time difference
      let getMinutes = differenceWithLocal % 60;
      let getHours = (differenceWithLocal - getMinutes) / 60;
      time.setHours(time.getHours() - getHours);
      time.setMinutes(time.getMinutes() - getMinutes);
      return time;
    }
  }


  module.exports = {
    getEndDate
  }