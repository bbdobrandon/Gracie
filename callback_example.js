
function test (base , cb) {
    cb(base);
}

function num(x) {
    console.log('num');
    console.log(x*2);
    return function (x) {console.log(x*3)};
}

var num2 = function(x) {
    console.log('num2');
    console.log(x*2)
};

test(1, function (x) {
    console.log('num0');
    console.log(x*2);
});
test(1, num);
test(1, num2);
test(1, num(1));
/////////////////////////////
var result = undefined;

function test2 (cb) {
    addOne(process.argv[2], function PrintAddOne (x) {
        result = x;
        cb();
    });
}

function addOne (y, cb) {
    var x = y + 1;
    cb(x);
}

function printNum () {
    console.log(result);
}

test2(printNum);