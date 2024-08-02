// alert("hello yar welcome back");

// fundamentals of js

// arrays
var array = [1, 2, 3, { name: "Laiba" }, "hello welcome"];

console.log(array);

let arr = [1, 3, 7, 4, 8];

console.log("orignal array: " + arr);

let arr2 = arr.forEach(function (item, index, arr) {
    arr[index] = item * 3;
});

console.log("array after for each processing: " + arr);

let ans = arr.map(function (x) {
    return (x + 2);
});

console.log("new array of map: " + ans);

let filterArray = arr.filter(function (x) {
    return x % 2;
});

console.log("new array of filtered elements: " + filterArray);

console.log("array after changing: " + arr);

var num = arr.indexOf(12, 0);
console.log("index of 12 is: " + num);


function fun(elem) {
    return elem > 20;
}

let findElem = arr.find(fun);
console.log("1st num in array which is greater than 20 is: " + findElem);
