// Closure Examole: 

function Outer() {
  let count = 0;
  
  function Inner() {
    count++;
    console.log(count);
  }
  
  return Inner;  // Outer FINISHES here, returns Inner function
}

const counter = Outer();  // ← Outer() EXECUTES and FINISHES here
// At this point:
// - Outer() has finished execution
// - But count is NOT destroyed!
// - counter now holds the Inner function
// - Inner still has access to count (closure!)

counter();  // Now Inner executes → logs 1
counter();  // Inner executes again → logs 2
