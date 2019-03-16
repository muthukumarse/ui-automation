const { Given, When, Then } = require("cucumber");

When(/^I am going to Github$/, async function() {
  await this.OpenPage(`${this.UI_PROJECT_HOST}`);
});

When(/^I am clicking Github Sign Up Link$/, async function () {
  // just current xpath to avoid breaking
  await this.clickElement(
    "body > div.position-relative.js-header-wrapper > header > div > div.HeaderMenu.HeaderMenu--logged-out.position-fixed.top-0.right-0.bottom-0.height-fit.position-lg-relative.d-lg-flex.flex-justify-between.flex-items-center.flex-auto > div.d-lg-flex.flex-items-center.px-3.px-lg-0.text-center.text-lg-left > a.HeaderMenu-link.d-inline-block.no-underline.border.border-gray-dark.rounded-1.px-2.py-1"
  );
});

Then(/^The application shows Sign Up Page$/, async function () {
  // just current xpath to avoid breaking
  await this.checkElementExist(
    "body > div.application-main > main > div > div > div.setup-header.setup-org > h1"
  );
  await this.checkHTMLText(
    "body > div.application-main > main > div > div > div.setup-header.setup-org > h1",
    "Join GitHub"
  );
});
