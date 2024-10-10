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
