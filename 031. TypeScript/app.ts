function add(num1: number, num2: number) {
    return num1+num2
}

const input1 = document.getElementById("num1") as HTMLInputElement; // Nghĩa là nó sẽ trả về 1 element có id là num1 và có kiểu dữ liệu là HTMLInputElement
const input2 = document.getElementById("num2") as HTMLInputElement;
const button = document.querySelector("button")!; // Nghĩa là nó sẽ trả về 1 element có kiểu dữ liệu là button
const output = document.getElementById("result")!; // Nghĩa là nó sẽ trả về 1 element có id là result
const arr : number[] = [] // Nghĩa là nó sẽ trả về 1 mảng có kiểu dữ liệu là number
const arr2 : Array<number> = [] // Nghĩa là nó sẽ trả về 1 mảng có kiểu dữ liệu là number
const arr3 : [number, string] = [1, "1"] // Nghĩa là nó sẽ trả về 1 mảng có kiểu dữ liệu là number và string
type Person = {name: string, age: number} // Nghĩa là nó sẽ trả về 1 object có kiểu dữ liệu là Person
const arr4 : Person[] = [] // Nghĩa là nó sẽ trả về 1 mảng có kiểu dữ liệu là Person
interface Person2 {name: string, age: number} // Nghĩa là nó sẽ trả về 1 object có kiểu dữ liệu là Person2
const arr5 : Person2[] = [] // Nghĩa là nó sẽ trả về 1 mảng có kiểu dữ liệu là Person2

button.addEventListener("click", function() {
    const num1 = input1.value;
    const num2 = input2.value;
    const result = add(+num1, +num2);
    output.innerText = result.toString();
    console.log(result);
})