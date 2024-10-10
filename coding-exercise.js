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
 console.log([... new Set(string)].join(""))

//OR (in - index, of - word)
var string='priya riya supriya'
  arr = [];
    for(let i of string){
        if(!arr.includes(i)){
            arr.push(i)
        }
    }
    console.log(arr.join(""))
