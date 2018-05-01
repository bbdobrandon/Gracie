// console.log(Date.now());
// const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sar'];
// var now = new Date();
// var hour = now.getHours();
// var min = now.getMinutes();
// var time = '03:00:00';
// var eles = time.split(':').map(Number);
// if (hour > eles[0] && eles[0] < 12) {
//     eles[0] += 12;
//     console.log('small');
//     console.log(eles[0]);
// }
// else {
//     console.log('large');
// }
// var timeparsed = new Date();
// // timeparsed.setHours('03', '00', '00');
// timeparsed.setDate('13', '2', '2018');

// var delta = (timeparsed-now);

// console.log(now);
// console.log(hour);
// console.log(min);
// console.log(now.getMonth());
// console.log((timeparsed.getMonth()+1).toString()+'-'+timeparsed.getDay()+'-'+timeparsed.getFullYear()+' '+timeparsed.getHours()+':'+timeparsed.getMinutes()+':'+timeparsed.getSeconds());
// console.log(delta);

// time = [
//     {date: '12-21-2018'},
//     {time: '03:00:00'}
// ]

// var obj = time.find(o => o.hasOwnProperty('time-period'));

// if (obj){
//     console.log(obj);
// }else {
//     console.log('not found')
// }

// var apptTimeperd = '08:00:00/12:00:00';
// var timePerdEles = apptTimeperd.split('/');
// var perdStart = parseInt(timePerdEles[0].split(':')[0]);
// var perdEnd = parseInt(timePerdEles[1].split(':')[0]);

// console.log('%j', timePerdEles);
// console.log(perdStart);
// console.log(perdEnd);

// var appt = {
//     time: [{date: '02-16-2018'}, {date: '02-17-2018'}]
// };
// var result = appt.time.find(o => o.hasOwnProperty('date')) || '';

// console.log('%j', result);

// var appt = {
//     model: 'ELE'
// };

// var demo = {
//     name: ''
// };

// var msg = `Hi ${appt.model} here. available and can't wait to meet u`;
// msg += demo.name ? demo.name : '' +'.'
// console.log(msg);

// var res = {};

// if (res['random']) {
//     console.log('Y');
// }
// else {
//     console.log('N');
// }

// var res = {name: ''};
// console.log('%j', res);

// var name = res.name;
// name = 'Gina';

// console.log('%j', res);

// res.name = 'Gina';

// console.log('%j', res);
// var reply = 'test: ';
// var confirm_hour = 10;
// var confirm_min = 30;
// reply += ` I have time in the next couple of hours. want to meet around ${confirm_hour}` +  (confirm_min ? `${confirm_min}?` : '?');
// console.log(reply);
// var reply = 'test: ';
// var confirm_hour = 10;
// var confirm_min = 0;
// reply += ` I have time in the next couple of hours. want to meet around ${confirm_hour}` +  (confirm_min ? `${confirm_min}?` : '?');
// console.log(reply);

// var x = {
//     "parameters": {
//         "relative-time": {
//         "duration": {
//             "amount": 10,
//             "unit": "min"
//         },
//         "time-relative": "later"
//         },
//         "exact-time": [],
//         "service": "",
//         "atlanta-neighborhood": ""
//     }
// };

// var date = '1';
// var time = '';
// var complete = (date&&time) ? 1 : 0;
// console.log(complete);

// console.log([1,2,3].indexOf(1));

// var data = {a: '1'};

// var a = data.a || null;
// var b = data.b || null;

// console.log(a);
// console.log(b);
// var intent = 'Intent.Give_TimeSlot';
// var exactTime = [];
// var relativeTime = null;
//  if (intent != 'Intent.Availability' && !(['Default Fallback Intent', 'Intent.Give_TimeSlot'].indexOf(intent) >= 0 && ((exactTime && exactTime.length > 0) || relativeTime))) {
//      console.log(1);
//  }
//  else {
//      console.log(0);
//  }

//  if (exactTime) {
//      console.log(1);
//  }
//  else {
//     console.log(0);
//  }

// var test = {};
// if (test) {
//     console.log(test);
// }
// else {
//     console.log(0)
// }
function getTime(hour, min) {
    return [hour+1, min+1];
}

var [hour, min] = getTime(3, 4);

console.log(`hour: ${hour}, min: ${min}`);