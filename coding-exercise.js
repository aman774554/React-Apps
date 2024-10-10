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
