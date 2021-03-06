import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  lcdValue: string = '';
  lcdValueExpression: boolean = false;
  clearValue: string = 'AC'
  completePattern = new RegExp("[0-9-+*/.()]");
  numbersPattern = new RegExp('^[0-9]+$');
  lcdBackGroundColor: string = '#424242';
  parenthesisFlag: number = 0;
  expression: string = '';

  constructor() { }

  calcButtonPress(inputValue: string) {
    if (this.lcdValue === 'Error' || this.lcdValue === 'NaN') this.lcdValue = '';
    if (this.validateInput(inputValue)) {
      if ('/*-+'.indexOf(inputValue) === -1 && !this.lcdValueExpression) {
        this.lcdValue = inputValue;
      } else if (this.completePattern.test(inputValue)) {
        this.lcdValue += inputValue;
      } else if (inputValue === '=') {
        this.evaluate();
        return;
      }
      this.flipACButton(true);
    } else {
      this.flashLCD();
    }
  }

  handleKeyboardEvents(keyPress: KeyboardEvent) {
    let key = keyPress.key;
    switch (key) {
      case '0': this.calcButtonPress(key); break;
      case '1': this.calcButtonPress(key); break;
      case '2': this.calcButtonPress(key); break;
      case '3': this.calcButtonPress(key); break;
      case '4': this.calcButtonPress(key); break;
      case '5': this.calcButtonPress(key); break;
      case '6': this.calcButtonPress(key); break;
      case '7': this.calcButtonPress(key); break;
      case '8': this.calcButtonPress(key); break;
      case '9': this.calcButtonPress(key); break;
      case '+': this.calcButtonPress(key); break;
      case '-': this.calcButtonPress(key); break;
      case '*': this.calcButtonPress(key); break;
      case '/': this.calcButtonPress(key); break;
      case '(': this.calcButtonPress(key); break;
      case ')': this.calcButtonPress(key); break;
      case '.': this.calcButtonPress(key); break;
      case '=': this.calcButtonPress(key); break;
      case 'Enter': this.calcButtonPress('='); break;
    }
  }

  validateInput(input) {
    let lastValue = this.lcdValue.substr(this.lcdValue.length - 1, 1);
    this.editParenthesisFlag(input, true);
    if (!lastValue || '(/*+.'.indexOf(lastValue) > -1) {
      if (')*/'.indexOf(input) > -1) {
        this.editParenthesisFlag(input, false);
        return false;
      }
      if (lastValue === '.' && ')(-+'.indexOf(input) > -1) {
        this.editParenthesisFlag(input, false);
        return false;
      }
    }
    if (this.numbersPattern.test(lastValue) && this.parenthesisFlag) {
      if (')'.indexOf(input) > -1) {
        this.editParenthesisFlag(input, false);
        return false;
      }
    }
    return true;
  }

  editParenthesisFlag(input: string, add: boolean) {
    if (add) {
      if ('('.indexOf(input) > -1) this.parenthesisFlag += 1;
      if (')'.indexOf(input) > -1) this.parenthesisFlag -= 1;
    } else {
      if ('('.indexOf(input) > -1) this.parenthesisFlag -= 1;
      if (')'.indexOf(input) > -1) this.parenthesisFlag += 1;
    }
  }

  flashLCD() {
    let currentLCDValue = this.lcdValue;
    this.lcdValue = 'Input Error';
    this.lcdBackGroundColor = '#a02626';
    setTimeout(() => {
      this.lcdBackGroundColor = '#424242';
      this.lcdValue = currentLCDValue;
    }, 500);
  }

  clearButtonPress() {
    if (this.lcdValueExpression) {
      let valueToRemove = this.lcdValue.substring(this.lcdValue.length, this.lcdValue.length - 1);
      if ('()'.indexOf(valueToRemove) > -1) {
        this.editParenthesisFlag(valueToRemove, false);
      }
      this.lcdValue = this.lcdValue.slice(0, -1);
      if (!this.lcdValue) this.flipACButton(false);
      else this.flipACButton(true);
    } else {
      this.lcdValue = '';
      this.expression = '=';
      this.parenthesisFlag = 0;
      this.flipACButton(false);
    }
  }

  flipACButton(input: boolean) {
    this.lcdValueExpression = input;
    this.clearValue = (this.lcdValueExpression) ? 'CE' : 'AC';
  }

  replaceBy(target: string, find: string, replace: string) {
    return target
      .split(find)
      .join(replace);
  }

  roundValue(input: string) {
    const dotLocation: number = input.toString().indexOf('.');
    let flagDigit: boolean = false;

    if (dotLocation > -1 && input.length > 15) {
      const afterDotString = input.substring(dotLocation, input.length);
      for (let i = 0; i < afterDotString.length; i++) {
        if (parseInt(afterDotString[i]) > 0) flagDigit = true;
        if (afterDotString[i] === '0' && flagDigit) {
          return input.substring(0, dotLocation + i);
        }
      }
    }
    return input;
  }

  evaluate() {
    let valueToEvaluate: string = this.lcdValue;
    let polishNotation: string = '';
    let solution: string = '';

    if (this.completePattern.test(valueToEvaluate) && !this.parenthesisFlag) {
      polishNotation = this.convertToPolishNotation(valueToEvaluate);
      solution = this.solvePolishNotation(polishNotation);
      this.expression = this.lcdValue + ' =';
      this.lcdValue = this.roundValue(solution);
    } else {
      this.expression = 'Cannot resolve: ' + this.lcdValue;
      this.lcdValue = "Error";
      this.parenthesisFlag = 0;
    }
    this.flipACButton(false);
  }

  convertToPolishNotation(input) {
    let output: string = "";
    let operatorStack: Array<any> = [];
    const operators = {
      "/": { weight: 3 },
      "*": { weight: 3 },
      "+": { weight: 2 },
      "-": { weight: 2 }
    }

    input = this.standardizeString(input);
    input = input.replace(/\s+/g, '');
    input = input.split(/([\+\-\*\/\^\(\)])/);
    input = this.cleanArray(input);

    for (let i = 0; i < input.length; i++) {
      let token = input[i];
      if ('(/*'.indexOf(input[i - 1]) > -1 && token === '-') {
        token += input[i + 1];
        i += 1;
      }
      if (this.isNumeric(token)) {
        output += token + ' ';
      } else if ('*/+-'.indexOf(token) !== -1) {
        let r1 = token;
        let r2 = operatorStack[operatorStack.length - 1];
        while ('*/+-'.indexOf(r2) !== -1 && operators[r1].weight <= operators[r2].weight) {
          output += operatorStack.pop() + ' ';
          r2 = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(r1);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack[operatorStack.length - 1] !== '(') {
          output += operatorStack.pop() + ' ';
        }
        operatorStack.pop();
      }
    }
    while (operatorStack.length > 0) {
      output += operatorStack.pop() + ' ';
    }
    return output;
  }

  solvePolishNotation(polish) {
    let results: Array<any> = [];
    polish = polish.split(" ");
    polish = this.cleanArray(polish);
    for (let i = 0; i < polish.length; i++) {
      if (this.isNumeric(polish[i])) {
        results.push(polish[i]);
      } else {
        let a = results.pop();
        let b = results.pop();
        if (polish[i] === '+') {
          results.push(parseFloat(a) + parseFloat(b));
        } else if (polish[i] === '-') {
          results.push(parseFloat(b) - parseFloat(a));
        } else if (polish[i] === '*') {
          results.push(parseFloat(a) * parseFloat(b));
        } else if (polish[i] === '/') {
          results.push(parseFloat(b) / parseFloat(a));
        }
      }
    }
    if (results.length > 1) {
      return 'Error';
    } else {
      return results
        .pop()
        .toString();
    }
  }

  standardizeString(input: string) {
    while (input.charAt(0) === '+') input = input.substr(1);
    input = this.replaceBy(input, ' ', '');
    input = this.replaceBy(input, 'x', '*');
    input = this.replaceBy(input, '-(', '-1*(');
    input = this.replaceBy(input, ')(', ')*(');
    input = this.replaceBy(input, '--', '+');
    input = this.replaceBy(input, '+-', '-');
    input = this.replaceBy(input, '-+', '-');
    input = this.replaceBy(input, '++', '+');
    input = this.replaceBy(input, '(+', '(');
    for (let i = 0; i < 10; i++) {
      input = this.replaceBy(input, `${i}(`, `${i}*(`);
    }
    return input;
  }

  cleanArray(input: Array<any>) {
    for (let i = 0; i < input.length; i++) {
      if (input[i] === '') input.splice(i, 1);
    }
    return input;
  }

  isNumeric(input: string) {
    return !isNaN(parseFloat(input));
  }

}


