// npm i puppeteer
let puppeteer = require('puppeteer');

// importing "answers" and "loginCredentials" file code here
let codeAnswers = require('./answers');
let loginCredentials = require('./loginCredentials');

// hackerrank link that will open at launch
let hkLoginLink = "https://www.hackerrank.com/auth/login";
let page;

// launching puppeteer and creating first promise
let initBrowser = puppeteer.launch(
    {
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"]
    }
);

// Taking that promise and resolving it using "then"
// Putting a new function(carrying out a new task) on the data obtained by resolved promise
// Which creates a new promise, so returning a new promise again
// which is futher resolved by using "then" again
// ****************************************************************************************
// This use of "then" again and again is called chaining
// It helps the async functions to act in a synchronous manner
// ****************************************************************************************
// Here, all the other things are being handled like- opening browser, then tab of hackerrank,
// then, logging in, then finally to point of submiiting answers
initBrowser
    .then(function (browserObj) {
        console.log('Browser Opened!');
        let newTabOpened = browserObj.newPage();
        return newTabOpened;
    }).then(function (newTab) {
        console.log('New Tab Created!');
        page = newTab;
        let hkLogin = page.goto(hkLoginLink);
        return hkLogin;
    }).then(function () {
        console.log('HackerRank Website Opened!');
        let typeId = page.type("input[id='input-1']", loginCredentials.id, { delay: 50 });
        return typeId;
    }).then(function () {
        console.log("Id typed");
        let typePwd = page.type("input[id='input-2']", loginCredentials.pwd, { delay: 50 });
        return typePwd;
    }).then(function () {
        console.log("Password typed!");
        let loggingIn = page.click("button[data-analytics='LoginPassword']", { delay: 100 });
        return loggingIn;
    }).then(function () {
        console.log("We are loggedIn ladies & gentlemen!");
        let waitClick1 = waitAndClick("a[data-attr2='algorithms']", page);
        return waitClick1;
    }).then(function () {
        console.log("Entered into algorithms!");
        let waitClick2 = waitAndClick("input[value='warmup']", page);
        return waitClick2;
    }).then(function () {
        console.log("Checked Warmup!");
        let challengesArray = page.$$(".challenge-submit-btn", { delay: 100 });
        return challengesArray;
    }).then(function (array) {
        let solvingChallenge = challengeSolver(array[0], page);
        return solvingChallenge;
    }).then(function () {
        console.log("Challenge is solved!");
    })

// this submits answers by solving each challenge one by one
// it takes answers from "answers" file
function challengeSolver(arrayElem, page) {
    return new Promise(function (resolve, reject) {
        let clickSolveChallenge = arrayElem.click(".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled", { delay: 100 });
        clickSolveChallenge
            .then(function () {
                return page.waitFor(3000);
            }).then(function () {
                let waitClick3 = waitAndClick("input[type='checkbox']", page);
                return waitClick3;
            }).then(function () {
                return page.waitFor(3000);
            }).then(function () {
                let waitClick6 = waitAndClick(".custom-input.theme-old.size-medium", page);
                return waitClick6;
            }).then(function () {
                return page.type(".custom-input.theme-old.size-medium", codeAnswers.answers[0], { delay: 50 })
            }).then(function () {
                return page.keyboard.down("Control");
            }).then(function () {
                return page.keyboard.press("A", { delay: 100 });
            }).then(function () {
                return page.keyboard.press("X", { delay: 100 });
            }).then(function () {
                let waitClick4 = waitAndClick(".monaco-editor.no-user-select.vs", page);
                return waitClick4;
            }).then(function () {
                return page.keyboard.down("Control");
            }).then(function () {
                return page.keyboard.press("A", { delay: 100 });
            }).then(function () {
                return page.keyboard.press("V", { delay: 100 });
            }).then(function () {
                let waitClick5 = waitAndClick(".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled", page);
                return waitClick5;
            }).then(function () {
                console.log("Submitted!");
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            })
    })
}

// It is just a helper function
// only made bcz certain tasks were needed to be done again and again
// so, wrapped into a promise returing function
// So, instead of carrying out individual tasks one by one until last promise is generated to be used further,
// all tasks are wrapped into a fn and return just final promise (outcome)
function waitAndClick(selector, page) {
    return new Promise(function (resolve, reject) {
        let waitingForSelector = page.waitForSelector(selector, { visible: true });
        waitingForSelector
            .then(function () {
                let clickingSelector = page.click(selector, { delay: 100 });
                return clickingSelector;
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            })
    })
}