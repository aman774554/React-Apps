Mutability: Primitive types are immutable, while non-primitive types are mutable.
================================================================================================================================================================================
Code 1: Remove Duplicate characters from String

function removeDuplicateCharacters() {
  var string='priya riya supriya'
 return Array.from(string).filter((data,index)=>{
     return string.indexOf(data) === index
 }).join('')
 
}
console.log(removeDuplicateCharacters());

//OR 
-----------------------------------
 console.log([... new Set(string)].join(""))

//OR (in - index, of - word)
----------------------------------
var string='priya riya supriya'
  arr = [];
    for(let i of string){
        if(!arr.includes(i)){
            arr.push(i)
        }
    }
    console.log(arr.join(""))
      
================================================================================================================================================================================
Code 2: Remove Duplicate characters from array of element and find the count of an elements using set object
var arr = [55, 44, 55,67,67,67,67,8,8,8,8,8,65,1,2,3,3,34,5];
var unique = [...new Set(arr)]
console.log(unique) //output: [55, 44, 67, 8, 65, 1, 2, 3, 34, 5]
console.log(unique.length) //output: 10

================================================================================================================================================================================
Code 4:String reverse without reversing of individual words (Array of elements can be reverse with reverse() method but for string it is won't possible so required to split 
and then join().

function removeDuplicates(){
   var string ="India is my country"
  let result = string.split('').reverse().join('');
  return result;
}
console.log(removeDuplicates()) 

================================================================================================================================================================================
Code 6:String reverse without using inbult function

function removeDuplicates(){
   var string ="India is my country"
  let result='';
  for(let i=string.length-1; i>=0; i--){
      result = result + string[i]; 
      }
  return result;
}
console.log(removeDuplicates()) 
  
================================================================================================================================================================================
Code 7: Find factorial of user input number

let num = parseInt(prompt("enter no."))
fact = 1;
if(num<0) console.log("Enter Positive number")
else if(num===0) console.log(1)
else{
    for(let i=1; i<= num; i++){
        fact *= i;
    }
}
console.log(fact)

================================================================================================================================================================================
Code 9: Swapping of 2 numbers with third variable
let a = 1;
let b = 2;
let c = b;
b=a;
a=c;
console.log(a,b)
  
================================================================================================================================================================================
Code 10: Swapping of 2 numbers without third variable
let a=10; 
let b=20;
   a=a+b //30
   b=a-b //10
   a=a-b //20
console.log (a,b)

================================================================================================================================================================================
Code 11: To check the string or number is palindrome or not( ex: 121,madam,anna) using reverse method
let str = prompt("Enter string: ")
let reveredString = str.split('').reverse().join('');
console.log(reveredString)
if(str === reveredString){
    console.log("yes")
}
else{
    console.log("no")
}
================================================================================================================================================================================
Code 12: To check the string or number is palindrome or not( ex: 121,madam,anna) using diving length by 2 and then comparing
function checkPalindrome(){
   const string = "12321"
   let len = string.length;
   for (i=0; i<len/2;i++){
     if (string[i]!==string[len-1-i]){
         console.log("Not Palindrome")
     }
     else{
         console.log(" Palindrome")
    }
   }
}
checkPalindrome()
  
================================================================================================================================================================================
Code 14: To find longest word from a string using functions
   const string = "a bb ccc"
   const longestWord = string.split(" ").sort((a,b)=>{ return b.length-a.length})
   console.log(longestWord[0])
     
================================================================================================================================================================================
Code 13: To find longest word from a string using (for of) /*for(var i=0; i>=num; i++) means iterate by indexing*/  /*for (var word of words) means iterate by an elements not 
by indexing*/
function longestWord(){
   let string = "supriya is a masooooom good girl"
   var words= string.split(' ')
   var longest=" "
   for(var word of words){
        console.log(word)
        if (word.length > longest.length)
        {
            longest=word;
         }
   }
    return longest.length
}
longestWord()
---------------------------
function longestWord(){
   let string = "supriya is a hahahahaha good girl"
   var arr= string.split(' ')
   var longest=" "
   for(var i=0; i<arr.length; i++){
      
        if (arr[i].length > longest.length)
        {
            longest=arr[i];
        }
   }
   return longest
}
console.log(longestWord())

================================================================================================================================================================================
Code 17: To find vowels and its count in a given string
let str = "aaeioux"
const vowels = ['a','e','i','o','u']
let words=""
for (let i of str){
    if (vowels.includes(i)){
        words = words.concat(i)
    }
}
console.log(words.length)
================================================================================================================================================================================
Code 18: To find char in string

const str = "hello world";
const count = str.split("o").length - 1;
console.log(count); // Output: 2

const str = "hello world";
const count = (str.match(/o/g) || []).length;
console.log(count); // Output: 2

const str = "hello world";
const i = "o"; // Variable to search for
const count = (str.match(new RegExp(i, "g")) || []).length;
console.log(count); // Output: 2

===========================================================================================================================
arr = [1,34,3]

console.log(arr.join('').toString().split('').sort((a,b)=>b-a).join('')) //4331

const largestNumber = arr
  .map(num => num.toString())
  .sort((a, b) => (b + a).localeCompare(a + b))
  .join('');

console.log(largestNumber); // Output: 3431
===========================================================================================================================
function fibonacci(n) {
  let fib = [0, 1]; // Initialize the first two numbers of the Fibonacci series
  
  for (let i = 2; i < n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2]; // Add the previous two numbers to get the next one
  }
  
  return fib.slice(0, n); // Return the first n Fibonacci numbers
}

console.log(fibonacci(10)); // Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

-----

  function fibonacciRecursive(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

let n = 10;
let fib = [];
for (let i = 0; i < n; i++) {
  fib.push(fibonacciRecursive(i));
}

console.log(fib); // Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

==========================================================================================================================
code 21: Longest Substring 
function longestSubstring(str) {
  let longest = '';
  let current = '';

  for (let char of str) {
    if (current.includes(char)) {
      // If character repeats, start a new substring from the character after the repeated one
      current = current.slice(current.indexOf(char) + 1);
      console.log(current)
    }
    current += char;
    longest = current.length > longest.length ? current : longest;
  }

  return longest;
}

console.log(longestSubstring("abcabcbb")); // Output: 3 (substring "abc")
console.log(longestSubstring("bbbbb"));    // Output: 1 (substring "b")
console.log(longestSubstring("pwwkew"));   // Output: 3 (substring "wke")

=============================================================================================================
code 22: Selection Sort 

function selectionSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    // Assume the current index is the minimum
    let minIndex = i;

    // Find the index of the smallest element in the remaining array
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap the found minimum element with the first element of the unsorted part
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // Swap using destructuring
    }
  }

  return arr;
}

console.log(selectionSort([64, 25, 12, 22, 11])); // Output: [11, 12, 22, 25, 64]

==============================================================================================================================
