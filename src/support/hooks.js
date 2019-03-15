const { setDefaultTimeout, After, Before, Status } = require("cucumber");

setDefaultTimeout(async function () {
  setDefaultTimeout(60 * 1000);
})

Before(async function () {
  await this.OpenPage(`${this.UI_PROJECT_HOST}`);
});

After(async function (testCase) {
  if (testCase.result.status === Status.FAILED) {
    await this.attachScreenShot();
  }
  await this.closePage();
});
