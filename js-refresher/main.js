// console.log('Hi');

// console.log(a); // undefined (not error)
// // console.log(b); // ❌ ReferenceError
// // console.log(c); // ❌ ReferenceError
// var a = 5; // Hoisted and initialized to undefined. - no TDZ - don't use

// // From the start of the scope to the declaration line, they are in the Temporal Dead Zone (TDZ).
// // Accessing them in TDZ → ReferenceError
// let b = 10; // Hoisted but NOT initialized. // use when you want to reassign
// const c = 15; // Hoisted but NOT initialized. // always use this

// function hello () {
//     let arguments = 'asdasd'; //dont take the variable name arguments
//     console.log('hello world ' + arguments[0] + arguments[1]);
// }

// function hello1 () {
//     let argument = 'asdasd'; //dont take the variable name arguments
//     console.log('hello world ' + arguments[0] + arguments[1]);
//     console.log('hello world ' + argument[0] + argument[1]);
// }

// hello(1, 2);
// hello('Arnav', 'Gupta');

// hello1(1, 2);
// hello1('Arnav', 'Gupta');

// function createGreeter(greet_msg)
// {
//     function greet(name)
//     {
//         console.log(greet_msg,name);
//     }
//     return greet;
// }

// let g1 = createGreeter('Hi');
// console.log(typeof g1);
// console.log(g1('haseeb'));

// function getName() {
//     return document.getElementById('namebox').value;
// }

// console.log("--------")





