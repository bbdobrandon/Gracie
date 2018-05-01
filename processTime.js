if (appt['exact-time']) {
    var apptTime = utils.getEntity('time', appt['exact-time']);
    var now = new Date();
    var now_hour = now.getHours();
    var now_min = now.getMinutes();
    var appoint = new Date();
    var confirm_date = 'today';
    var reply = ''; 

    // date default to be 'today', use dateDelta to determine whether change date to 'tomorrow' or 'weekday'
    if (apptTime.date) {
        var dateEles = apptTime.date.split('-').map(Number);
        appoint.setDate(dateEles[2], dateEles[1], dateEles[0]);
        var dateDelta = (appoint - now)/1000/3600/24;
        // session.send(dateDelta.toString());
        if (dateDelta >= 1 && dateDelta < 2 )  {
            confirm_date = 'tomorrow'
        }
        else if (dateDelta >= 2) {
            confirm_date = weekday[date.getDay()];
        }
    }
    // Define time to be next 30 or hour, which ever is later if time is now; Otherwise use time given
    if (apptTime.time) {
        var timeEles = apptTime.time.split(':').map(Number);
        appoint.setTime(timeEles[0], timeEles[1], timeEles[2]);
        if (date=='today') {
            // if (now_hour > timeEles[0] && timeEles[0] < 12) {
            // 	timeEles[0] += 12;
            // }
            var timeDelta = (appoint - now);
            if (timeDelta < 100 && timeDelta > 0) {
                var confirm_hour = (now_hour + 1).toString();
                if (confirm_hour > 12) {
                     confirm_hour -= 12;
                }
                if (now_min < 30) {
                    var confirm_min = 0;
                }
                else {
                    var confirm_min = 30;
                }
                var data = {
                    confirm: {date: confirm_date, hour: confirm_hour, min: confirm_min},
                    now: {datetime: now, hour: now_hour, min: now_min} 
                };
                reply += ` I have time in the next couple of hours. want to meet around ${confirm_hour}` + (confirm_min ? `${confirm_min}?` : '?');
                session.beginDialog('confirmTime:/', {time: data, reply: reply});
            }	
        }
        else {
            var confirm_hour = appoint.getHours();
            var confirm_min = appoint.getMinutes();
            var data = {
                confirm: {date: confirm_date, hour: confirm_hour, min: confirm_min},
                now: {datetime: now, hour: now_hour, min: now_min} 
            };
            reply += ` ${confirm_date} available at ${confirm_hour}` + (confirm_min ? `${confirm_min}`:'') + `. You want to meet at that time?`;
            session.beginDialog('confirmTime:/', {time: data, reply: reply});
        }
    }
    //If no given time, use the middle hour or period, or the next 30 or hour, whichever comes later
    if (apptTime['time-period']) {
        var timePerdEles = apptTime['time-period'].split('/');
        var perdStart = parseInt(timePerdEles[0].split(':')[0]);
        var perdEnd = parseInt(timePerdEles[1].split(':')[0]);

        if (!confirm_hour) {
            var confirm_hour = (perdStart + perdEnd)/2;
            var confirm_min = '';
            if (confirm_hour <= now_hour ) {
                confirm_hour = now_hour + 1;
                if (now_minute > 30) {
                    var confirm_min = '30';
                }
            }
            if (confirm_hour > 12) {
                confirm_hour -= 12;
            }
            var data = {
                confirm: {date: confirm_date, hour: confirm_hour, min: confirm_min},
                now: {datetime: now, hour: now_hour, min: now_min} 
            };
            reply += ` want to meet around ${confirm_hour}${confirm_min} ${confirm_date}?`;
            session.beginDialog('confirmTime:/', {time: data, reply: reply});						
        }
    }
    //if no time is available, ask for time
    if (!confirm_hour) {
        var confirm_hour = null;
        var confirm_minute = null;
        var data = {
            confirm: {date: confirm_date, hour: confirm_hour, min: confirm_min},
            now: {datetime: now, hour: now_hour, min: now_min} 
        };
        reply += ` what time do you have in mind?`;
        session.beginDialog('confirmTime:/', {time: data, reply: reply});				
    }

    session.userData.profile.confirmation.time = {date: confirm_date, hour: confirm_hour, minute: confirm_min};

}