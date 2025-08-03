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
console.log(sym1 === sym2)

// Type Compatibility

let value: string = "Pilli Bebek"
value = 15;
console.log(value)

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

// Never Type
type Shape = "circle" | "square"

function fail(msg: string): never {
    throw new Error(msg);
}

function getArea(shape: Shape): number {
    if (shape === "circle") {
        return Math.PI * 2 * 2 // area
    } else if (shape === "square") {
        return 4 * 4
    } else {
        return fail(`Unexcepted shape: ${shape}`);
    }
}

console.log(getArea("circle"))
console.log(getArea("square"))
// @ts-ignore
console.log(getArea("pentagon"))

// Unknown
let unkVal: unknown;
unkVal = 1;
unkVal = "text"
unkVal = {name: "John"}
unkVal = [22, 15, "C", "A"]
// Any türünden farkı işlem yapmadan önce kontrol eder şöyle;


let valNameErr = unkVal.name()
// TS 18046 value is of type unknown

console.log(valNameErr)
let valName = (unkVal as { name: string }).name;
const valArr = (unkVal as any).sort((a: any, b: any) => a - b)
// type guard ile kodu daha fazla uzatmamak, yeni başlayanlara hitap ettiği ve karıştırmamak için any kullanıldı any kullanmamaya özen gösterin.
console.log(valArr)

console.log(valName);


unkVal = {name: "John", age: 32}
const valObj = (unkVal as { name: string, age: number })
console.log(`Name: ${valObj.name}, Age: ${valObj.age} `)
