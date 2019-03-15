const { setWorldConstructor } = require("cucumber");
const pptrChrome = require("puppeteer");
const pptrFirefox = require('puppeteer-firefox');
const assert = require('assert')

class Core {
  constructor(params) {
    this.inputValue = "";
    this.attach = params.attach;
    this.parameters = params.parameters
    this.state = {};
    this.tempState = {};
    this.headless = true;
    this.UI_PROJECT_HOST =
      process.env.UI_PROJECT_HOST ||
      "http://localhost:3000";
  }

  getState(key) {
    if (key) {
      return this.state[key];
    }
    return this.state;
  }
  setState(key, obj) {
    this.state[key] = obj;
  }

  getTempState(key) {
    if (key) {
      return this.tempState[key];
    }
    return this.tempState;
  }
  setTempState(key, value) {
    this.tempState[key] = value;
  }

  async OpenPage(PAGE) {
    if (this.parameters.browser && this.parameters.browser === 'firefox') {
      this.browser = await pptrFirefox.launch({ headless: this.headless});
      this.page = await this.browser.newPage();
    } else {
      this.browser = await pptrChrome.launch({
        headless: this.headless,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      this.page = await this.browser.newPage();
    }

    await this.page.setDefaultNavigationTimeout(100000);
    await this.page.setViewport({ width: 2560, height: 1800 });
    await this.page.on('error', function (err) {
      console.log('Error -', err);
      throw err;
    });
    await this.page.goto(PAGE);
  }

  async attachScreenShot() {
    await this.waitForLoading();
    if (this.headless) {
      await this.page.screenshot({ fullPage: true }).then((png) => {
        var decodedImage = new Buffer(png, 'base64');
        this.attach(decodedImage, 'image/png');
      });
    }
  }

  async waitForLoading() {
    await this.page.waitForFunction(() => !document.querySelector('.loading'), { polling: 'mutation' });
  }

  async waitForElementExist(el) {
    await this.page.waitForFunction((el) => document.querySelector(el), { polling: 'mutation' });
  }

  async waitForElementNotExist(el) {
    await this.page.waitForFunction((el) => !document.querySelector(el), { polling: 'mutation' });
  }

  async checkHTMLTextExist(selector, key) {
    await this.page.waitForSelector(selector);
    const htmlText = await this.page.$eval(selector, el => el.innerText);
    if (key) this.setTempState(key, htmlText);
    // console.log('checkHTMLTextExist', 'selector-', selector, 'key-', key, 'htmlText-', htmlText);
    assert.notEqual(htmlText, undefined);
  }

  async checkHTMLText(selector, text) {
    await this.page.waitForSelector(selector);
    let htmlText = await this.page.$eval(selector, el => el.innerText);
    htmlText = htmlText.replace('\n', '');
    // console.log('checkHTMLText', 'selector-', selector, 'text-$', text, '$htmlText-@', htmlText, '@');
    assert.equal(htmlText, text);
  }

  async checkElementExist(selector) {
    await this.page.waitForSelector(selector);
    const htmlText = await this.page.$eval(selector, el => el.innerText);
    assert.notEqual(htmlText, undefined);
  }

  async checkElementNotExist(selector) {
    const node = await this.page.$(selector) == null
    assert.notEqual(node, undefined);
  }

  async checkElementValue(selector, text) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector, el => el.value);
    // console.log('checkElementValue', 'selector-', selector, 'text-', text, 'inputValue-', inputValue);
    assert.equal(inputValue, text);
  }

  async checkElementValueExist(selector) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector, el => el.value);
    // console.log('checkElementValueExist', 'selector-', selector, 'inputValue-', inputValue);
    assert.notEqual(inputValue, '');
  }

  async checkCSSClassExist(selector, className, regex) {
    await this.page.waitForSelector(selector);
    const eleClass = await this.page.$eval(selector, el => el.className);
    // console.log('checkCSSClassExist', 'selector-', selector, 'className-', className, 'regex-', regex, 'eleClass-', eleClass);
    if (regex && eleClass.indexOf(className) !== -1) {
      assert.equal(true, true);
    } else if (!regex && eleClass === className) {
      assert.equal(true, true);
    } else {
      assert.equal(false, true);
    }
  }

  async checkCSSClassNotExist(selector, className, regex) {
    await this.page.waitForSelector(selector);
    const eleClass = await this.page.$eval(selector, el => el.className);
    // console.log('checkCSSClassExist', 'selector-', selector, 'className-', className, 'regex-', regex, 'eleClass-', eleClass);
    if (regex && eleClass.indexOf(className) !== -1) {
      assert.equal(false, true);
    } else if (!regex && eleClass === className) {
      assert.equal(false, true);
    } else {
      assert.equal(true, true);
    }
  }

  async checkRadioInputValue(selector, value) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector + ":checked", el => el.value);
    // console.log('checkRadioInputValue', selector, value, inputValue);
    assert.equal(inputValue, value);
  }

  async checkSelectInputValue(selector, value) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector, el => el.value);
    // console.log('checkRadioInputValue', 'selector -', selector, 'value-', value, 'inputValue-', inputValue);
    assert.equal(inputValue, value);
  }

  async clickElement(selector, button = 'left') {
    await this.page.waitForSelector(selector);
    await this.page.click(selector, { button });
  }

  async rightClickElement(selector) {
    this.clickElement(selector, 'right');
  }

  async sendKeys(selector, value, isSpecialKey = false) {
    if (selector) {
      await this.page.waitForSelector(selector);
      await this.page.focus(selector);
    }
    if (isSpecialKey) {
      await this.page.keyboard.press(value);
    } else {
      await this.page.click(selector, { clickCount: 3 });
      await this.page.keyboard.type(value);
    }
  }

  async getHTMLText(selector) {
    await this.page.waitForSelector(selector);
    const htmlText = await this.page.$eval(selector, el => el.innerText);
    return htmlText;
  }

  async getTextInputValue(selector) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector, el => el.value);
    return inputValue;
  }

  async setTextInputValue(id, value, selector) {
    const selectorEle = selector ? selector : '#' + id;
    await this.page.waitForSelector(selectorEle);
    if (id) this.setState(id, { selector: selectorEle, value, type: 'TextInput' });
    await this.page.click(selectorEle, { clickCount: 3 });
    await this.page.type(selectorEle, value);
  }

  async getTextareaInputValue(selector) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector, el => el.value);
    return inputValue;
  }

  async setTextareaInputValue(id, value, selector) {
    const selectorEle = selector ? selector : '#' + id;
    await this.page.waitForSelector(selectorEle);
    if (id) this.setState(id, { selector: selectorEle, value, type: 'Textarea' });
    await this.page.click(selectorEle, { clickCount: 3 });
    await this.page.type(selectorEle, value);
  }

  async getSelectInputValue(selector) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector, el => el.value);
    return inputValue;
  }

  async setSelectInputValue(id, value, selector) {
    const selectorEle = selector ? selector : '#' + id;
    await this.page.waitForSelector(selectorEle);
    if (id) this.setState(id, { selector: selectorEle, value, type: 'SelectInput' });
    await this.page.select(selectorEle, value)
  }

  async getCheckboxInputValue(selector) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector + ":checked", el => el.value);
    return inputValue;
  }

  async setCheckboxInputValue(id, value, selector) {
    const selectorEle = selector ? selector : "input[name='" + id + "'][value='" + value + "']";
    await this.page.waitForSelector(selectorEle);
    if (id) this.setState(id, { selector: selectorEle, value, type: 'CheckboxInput' });
    await this.clickElement(selectorEle);
  }

  async getRadioInputValue(selector) {
    await this.page.waitForSelector(selector);
    const inputValue = await this.page.$eval(selector + ":checked", el => el.value);
    return inputValue;
  }

  async setRadioInputValue(id, value, selector) {
    const selectorEle = selector ? selector : "input[name='" + id + "'][value='" + value + "']";
    await this.page.waitForSelector(selectorEle);
    if (id) this.setState(id, { selector: selectorEle, value, type: 'RadioInput' });
    await this.clickElement(selectorEle);
  }

  async closePage() {
    await this.browser.close();
  }

  // Only used on Notification dom - RenderInBody
  async waitForServerResponse(selector, response) {
    let responseReceived = false;
    await this.page.waitForSelector(selector);
    while (!responseReceived) {
      const htmlText = await this.page.$eval(selector, el => el.innerText);
      responseReceived = htmlText === response;
    };
  }

  // special case, avoid using this.wait - used due to RenderInBody
  async wait(time) {
    await this.page.waitFor(time);
  }

  async setCurrentDateToCreationDate() {
    await this.clickElement('#createdDt-field button');
    for (let i = 1; i <= 3; i++) {
      await this.sendKeys(undefined, 'ArrowDown', true);
    }
    await this.sendKeys(undefined, 'Enter', true);
    await this.sendKeys(undefined, 'Enter', true);
  };

  async checkCSSStyleExist(selector, property, value) {
    await this.page.$eval(selector, (elem, property, value) => {
      return window.getComputedStyle(elem).getPropertyValue(property) === value;
    }, property, value);
  }

  async clearTextElementValue(selector) {
    await this.page.waitForSelector(selector);
    await this.page.click(selector, { clickCount: 3 });
    await this.page.keyboard.press('Backspace');
  }

  async validatePreviousState(fields) {
    const currState = this.getState();
    // console.log('currState', currState);
    const fieldsList = fields === undefined ? Object.keys(currState) : fields;
    for (const key in currState) {
      if (fieldsList.indexOf(key) != -1) {
        const { selector, value, type } = currState[key];
        if (type === "HTMLText") {
          await this.checkHTMLText(selector, value);
        } else {
          await this.checkElementValue(selector, value);
        }
      }
    }
  }
}

setWorldConstructor(Core);
