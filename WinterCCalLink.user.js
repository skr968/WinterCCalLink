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
    var updated=false;
    setTimeout(
        function()
        {
            //generate links if directly landing on event page
            createLink();

            $(document).ready(function() {
                //generate links if navigating from one event page to next/prev day
                const elementToObserve = document.querySelector("body > main > sections > section:nth-child(2) > dayview > eventlist");
                const observer = new MutationObserver(function() {
                    setTimeout(
                        function()
                        {
                            createLink();
                        }, 1000);
                });
                observer.observe(elementToObserve, {subtree: false, childList: true});


                //generate links if navigating from homepage to event page
                //document.querySelector("body > main > sections > section:nth-child(2) > monthview > daylist > darkpadder > eventsgroups > eventsgroup:nth-child(10)")
                // const elementToObserve2 = document.querySelector("body > main > sections > section:nth-child(2) ");
                // const observer2 = new MutationObserver(function() {
                // setTimeout(
                // function()
                // {
                // createLink();
                // }, 1000);
                //   });
                // observer2.observe(elementToObserve2, {subtree: false, childList: true});


            });
        }, 4000);


    function createLink()
    {


        var rettime='';
        var longdate='';
        //get event date from page header
        var retdate=geteventdate(this);
        //alert('in createlink');
        //iterate for each event block

        if ( $( "#callink" ).length==0) {
            $('body > main > sections > section:nth-child(2) > dayview > eventlist > events').children('event').each(function(i) {
                rettime=geteventtime(this);
                longdate=retdate.concat(' ').concat(rettime);
                var startdatetm=new Date(longdate);
                //get GCal start date
                var cal_startdate=getGCalStartDate(startdatetm);
                //get Gcal end date
                var cal_enddate=getGCalEndtDate(startdatetm);

                //get cal event details
                var cal_title=geteventtitle(this);
                var cal_location=geteventloc(this);
                var cal_body=geteventbody(this);

                //generate HTML text to inject
                var cal_htmltxt='<subheading class"callink"><a style="pointer-events:auto;" target="_blank" href="https://calendar.google.com/calendar/render?action=TEMPLATE&dates=' + cal_startdate + '%2F' + cal_enddate + 'Z&location=' + cal_location +'&text=' + cal_title + '&details=' + cal_body + '" title="D2 Event" >Save event to Google Calendar</a></subheading>';
                $(this).children('textgroup').append(cal_htmltxt);
                var ics_htmltxt='<subheading><a style="pointer-events:auto;" title="Download .ics (Apple iCal) file"  href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:' + cal_startdate + 'Z%0ADTEND:' + cal_enddate +'Z%0ASUMMARY:' + cal_title + '%0ALOCATION:' + cal_location +'%0AEND:VEVENT%0AEND:VCALENDAR%0A">Download ICS file </a></subheading>';
                $(this).children('textgroup').append(ics_htmltxt);
            });
        }

    }

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

    function geteventtitle(evt)
    {
        //extract event title
        var tm_raw=$(evt).find('textgroup > heading > t').html();
        tm_raw=tm_raw + ' - ' + $(evt).find('textgroup > heading > type').html();
        return tm_raw;
    }

    function geteventloc(evt)
    {
        //extract event title
        var tm_raw=$(evt).find('textgroup > subheading').eq(1).html();
        return tm_raw;
    }

    function geteventbody(evt)
    {
        //extract event title
        var tm_raw=$(evt).find('textgroup > subheading').eq(3).html();
        return tm_raw;
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