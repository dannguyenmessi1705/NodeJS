function add(num1, num2) {
    return num1 + num2;
}
var input1 = document.getElementById("num1"); // Nghĩa là nó sẽ trả về 1 element có id là num1 và có kiểu dữ liệu là HTMLInputElement
var input2 = document.getElementById("num2");
var button = document.querySelector("button"); // Nghĩa là nó sẽ trả về 1 element có kiểu dữ liệu là button
var output = document.getElementById("result"); // Nghĩa là nó sẽ trả về 1 element có id là result
button.addEventListener("click", function () {
    var num1 = input1.value;
    var num2 = input2.value;
    var result = add(+num1, +num2);
    output.innerText = result.toString();
    console.log(result);
});
