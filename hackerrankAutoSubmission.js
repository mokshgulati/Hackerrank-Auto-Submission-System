let puppeteer = require('puppeteer');
let codeAnswers = require('./answers');
let loginCredentials = require('./loginCredentials');
let hkLoginLink = "https://www.hackerrank.com/auth/login";
let page;

let initBrowser = puppeteer.launch(
    {
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"]
    }
);

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

function waitAndClick(selector, page) {
    return new Promise(function (resolve, reject) {
        let waitingForSelector = page.waitForSelector(selector, { visible: true });
        waitingForSelector.then(function () {
            let clickingSelector = page.click(selector, { delay: 100 });
            return clickingSelector;
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        })
    })
}

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