// ==UserScript==
// @name         WinterClan event calendar link
// @namespace    https://winterclan.net/
// @version      0.1
// @description  Add a link to add an event to Google calendar
// @author       skr9
// @match        https://winterclan.net/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {

    $( "body > main > sections > section:nth-child(2) > dayview" ).load(function() {
alert('refresh!!');
    });

           $( "body > main > sections > section:nth-child(2) > dayview" ).on( "load", function() {
  alert('refresh!!!');
});

    setTimeout(
  function()
  {
     $(document).ready(function() {
         var rettime='';
         var longdate='';
         //get event date from page header
        var retdate=geteventdate(this);

         //iterate for each event block
         $('body > main > sections > section:nth-child(2) > dayview > eventlist > events').children('event').each(function(i) {
               rettime=geteventtime(this);
             longdate=retdate.concat(' ').concat(rettime);
             var startdatetm=new Date(longdate);
             //get GCal start date
             var cal_startdate=getGCalStartDate(startdatetm);
             //get Gcal end date
             var cal_enddate=getGCalEndtDate(startdatetm);
             //generate HTML text to inject
             var cal_htmltxt='<subheading><a style="pointer-events:auto;" target="_blank" href="https://calendar.google.com/calendar/render?action=TEMPLATE&dates=' + cal_startdate + '%2F' + cal_enddate + 'Z&location=PC&text=Destiny Event!" title="D2 Event" >Save event to Google Calendar</a></subheading>';
             $(this).children('textgroup').append(cal_htmltxt);
        });
    });
  }, 5000);


    function getGCalStartDate(fulldate)
    {
        //generate the complete event start date in Google Cal format

             var stripYYYY=fulldate.getFullYear().toString();
             var stripMM=leftpad(fulldate.getMonth()+1,2);
            var stripDD=leftpad(fulldate.getDate(),2);
             var stripHH=leftpad(fulldate.getHours(),2);
             var stripmm=leftpad(fulldate.getMinutes(),2);
             var stripss=leftpad(fulldate.getSeconds(),2);

             var cal_startdate=stripYYYY.concat(stripMM).concat(stripDD).concat('T').concat(stripHH).concat(stripmm).concat(stripss);
        return cal_startdate;
    }

     function getGCalEndtDate(fulldate)
    {
         //generate the complete event start date in Google Cal format
        fulldate=addHours(fulldate,1);
             var stripYYYY=fulldate.getFullYear().toString();
             var stripMM=leftpad(fulldate.getMonth()+1,2);
            var stripDD=leftpad(fulldate.getDate(),2);
             var stripHH=leftpad(fulldate.getHours(),2);
             var stripmm=leftpad(fulldate.getMinutes(),2);
             var stripss=leftpad(fulldate.getSeconds(),2);

             var cal_startdate=stripYYYY.concat(stripMM).concat(stripDD).concat('T').concat(stripHH).concat(stripmm).concat(stripss);
        return cal_startdate;
    }

    function geteventdate()
    {
        //extract event date from the page header
        var dt_raw=$('body > main > sections > section:nth-child(2) > dayview > subheading > t').html();
        var dt_arr = dt_raw.split(",",3);
        var dt=dt_arr[1];
        dt = dt.replace("rd", "");
        dt = dt.replace("st", "");
        dt = dt.replace("rd", "");
        dt = dt.replace("th", "");
        var yr=dt_arr[2];
        var ret=dt.concat(yr);
        return ret;
    }

      function geteventtime(evt)
    {
        //extract event time, for each event block
        var tm_raw=$(evt).find('textgroup > subheading').eq(0).children('left').html();
        var tm_arr=tm_raw.split("-");
        var ret_arr=tm_arr[0].split(" ");
        var ret=ret_arr[ret_arr.length-2];
        ret = ret.replace("AM", " AM");
        ret = ret.replace("PM", " PM");
        return ret;
    }

    function leftpad (str, max) {
        str = str.toString();
        return str.length < max ? leftpad("0" + str, max) : str;
    }

    function addHours(dt,hrs)
    {
     var ret = dt;
        ret.setHours(ret.getHours() + hrs);
        return ret;
    }


})();
