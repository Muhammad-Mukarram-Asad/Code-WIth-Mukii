// React Lazy and Suspense Example

const LazyComponent = ()=>{
return(
  <h1>I am the lazy component.</h1>
)
}
export default LazyComponent;

// Now in main app.js file:
const HomePage = () => {
  const lazyComponent = import(()=> React.Lazy("./LazyComponent"));
  return (
    <h1>Main Component</h1>
    
  )
}  

// Using Suspense with lazy Loading
Another common use of the Suspense component is when importing components with lazy loading:  
In the example above we had to fake a delay of two seconds to see the loading message. A task like displaying three fruits from an array would be too fast to see the loading message at all.  
But with lazy loading, we can import a component dynamically, and it will display a loading message while it is loading, even if the task is very fast.
Lets first create an example WITHOUT using lazy loading, where we do not fake a two seconds delay:  

// Example
// This example is too fast to see the loading message:

import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import Cars from './Cars';

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Cars />
      </Suspense>
    </div>
  );
};

// Same example as above, but using lazy loading:

import { createRoot } from 'react-dom/client';
import { Suspense, lazy } from 'react';

const Cars = lazy(() => import('./Cars')); // importing a cars component with React.Lazy() 

function App() {
  return (
    <div>
      {/* Fallback UI when the component is loading state like heavy fetch results or data etc  */}
      <Suspense fallback={<div>Loading...</div>}> 
        <Cars />
      </Suspense>
    </div>
  );
}
