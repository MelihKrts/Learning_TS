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
// console.log(sym1 === sym2)

// Type Compatibility

// let value: string = "Pilli Bebek"
// value = 15;
// console.log(value)

// Explicit Types
const age: number = 24;
console.log(age)

// Implicit Types
const arr = ["TS", "JS", "TSX"]
//@ts-ignore
arr [3] = 15;

// Special Types

// Any
let anyExp: any = false;
anyExp = "true"
anyExp = {name: "John"}
console.log(anyExp)
