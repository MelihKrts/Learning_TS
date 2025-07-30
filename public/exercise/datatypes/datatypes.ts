//  Datatype.ts

// String
const text: string = "Hello World";

// Number
const numOne: number = 15;

// Boolean
const isOpen: boolean = true;

// BigInt
const numTwo: bigint = 1234567890123456789012345678901234567890n;

// Symbol
const sym1 = Symbol("Symbol 1")
const sym2 = Symbol("Symbol 1")
// @ts-ignore
console.log(sym1 === sym2)

// Type Compatibility

// @ts-ignore
let name = 15
// @ts-ignore
name = "Deneme"