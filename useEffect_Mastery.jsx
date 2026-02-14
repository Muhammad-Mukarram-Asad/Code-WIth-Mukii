# 🚀 Module 2 — useEffect Mastery

> The most misunderstood hook. Most bugs in React apps come from useEffect misuse. After this module you'll be able to spot and fix them instantly.

---

## What useEffect Actually IS

Most people think of it as "run code after render." That's incomplete.
```
The real mental model:

  useEffect is a SYNCHRONIZATION tool.
  It synchronizes your component with something OUTSIDE React.

  Outside React means:
    → API calls (fetch data)
    → Timers (setTimeout, setInterval)
    → Event listeners (window.addEventListener)
    → Browser APIs (localStorage, document.title)
    → WebSockets, subscriptions
```
```
Wrong mental model:  "Run this code when X happens"
Right mental model:  "Keep THIS external thing in sync with THESE values"  

## The Anatomy of useeffect:  
useEffect(() => {
  // 1. SETUP — runs after render
  //    synchronize your external thing here

  return () => {
    // 2. CLEANUP — runs before next effect OR unmount
    //    undo whatever setup did
  };

}, [dep1, dep2]); // 3. DEPENDENCIES — when to re-synchronize

