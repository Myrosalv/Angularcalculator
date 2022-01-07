import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  num1: number = 0
  num2: number = 0
  operand: string = ''
  result: number = 0
  value: string = ''

  constructor() { }

  ngOnInit(): void {
  }

  addValue(num: number): void {
    if (this.operand.length === 0) {
      if (this.num1 === 0) {
        this.num1 = num
        this.value = this.num1.toString()
      } else {
        this.num1 = Number(this.num1.toString() + num)
        this.value = this.num1.toString()
      }
    }
    if (this.operand.length === 1) {
      if (this.num2 === 0) {
        this.num2 = num
        this.value = this.num1.toString() + this.operand + this.num2.toString()
      } else {
        this.num2 = Number(this.num2.toString() + num)
        this.value = this.num1.toString() + this.operand + this.num2.toString()
      }
    }
  }

  addOperand(operand: string): void {
    this.operand = operand
    this.value = this.num1.toString() + this.operand
  }

  clear(): void {
    this.num1 = 0
    this.num2 = 0
    this.operand = ''
    this.result = 0
    this.value = ''
  }

  operation(): void {
    let result = this.calculate(this.num1, this.num2, this.operand)
    this.num1 = Number(result)
    this.num2 = 0
    this.operand = ''
    this.value = result.toString()
  }

  calculate(num1: number, num2: number, operand: string): number | string {
    switch (operand) {
      case '+':
        return num1 + num2
      case '-':
        return num1 - num2
      case '*':
        return num1 * num2
      case '/':
        if (num2 === 0) {
        } else {
          return num1 / num2
        }

    }

    return 'User did not enter valid values'
  }
}