var page = require('webpage').create();
var url = 'http://127.0.0.1:5055';
page.onConsoleMessage = function(msg) {
    console.log("\t" + msg);
};
var steps = [
    function() {
        test("should open login page and login", function(expect) {
            expect(document).toBeDefined();
            document.getElementById("loginid").value = "admin";
            document.getElementById("password").value = "123";
            document.querySelector('form').submit();
        });
    },
    function() {
        test("should land on the mobile page", function(expect) {
            expect(document).toBeDefined();
            expect(document.querySelector('h1').innerHTML).toBe('Phantom test');
            var link = document.querySelector('a');
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 1, 0, 0);
            link.dispatchEvent(event);
        });
    },
    function() {
        test("should return to the home page", function(expect) {
            expect(document.querySelector('h1').innerHTML).toBe('First page ');
        });
    }
];

page.onLoadFinished = function(status) {
    console.log("phantom: load finished");
    page.injectJs('./framework.js');
    page.evaluate(steps.shift());
    if (steps.length == 0) {
        console.log("phantom: browser terminated");
        phantom.exit();
    }
};

page.open(url);