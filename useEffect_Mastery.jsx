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

Dependency Array — The 3 Forms
jsx// Form 1 — No array
useEffect(() => {
  console.log('runs after EVERY render');
});
// ⚠️ Dangerous — usually not what you want

// Form 2 — Empty array
useEffect(() => {
  console.log('runs ONCE after first render');
}, []);
// ✅ Good for: one-time setup, initial data fetch

// Form 3 — With dependencies
useEffect(() => {
  console.log('runs when userId OR filter changes');
}, [userId, filter]);
// ✅ Good for: re-fetching when something changes

🔥 The Stale Closure Bug — Most Common Interview Topic
jsxfunction Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(count); // 🐛 always prints 0!
      setCount(count + 1); // 🐛 always sets to 1!
    }, 1000);

    return () => clearInterval(interval);
  }, []); // empty deps

  return <div>{count}</div>;
}
```

**Why is this broken?**
```
When useEffect runs (on mount):
  It creates a closure over count = 0
  That closure is FROZEN at count = 0
  Even as count updates, the interval
  still sees the OLD count = 0

  After 3 seconds:
  Screen shows: 1 (because setCount(0+1) keeps running)
  Console logs: 0, 0, 0 (stale closure!)
Fix 1 — Functional update (best for this case):
jsxuseEffect(() => {
  const interval = setInterval(() => {
    setCount(prev => prev + 1); // ✅ no closure needed!
    //        ↑ React gives you fresh value
  }, 1000);

  return () => clearInterval(interval);
}, []); // empty deps is now safe
Fix 2 — Add count to dependencies:
jsxuseEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1); // ✅ count is always fresh
  }, 1000);

  return () => clearInterval(interval);
}, [count]); // re-runs when count changes
// ⚠️ but this creates/destroys interval every second

🔥 The Race Condition Bug — Classic Interview Question
jsxfunction UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data)); // 🐛 race condition!
  }, [userId]);
}
```

**The bug:**
```
User clicks Profile 1 → fetch request A starts (slow, takes 2s)
User clicks Profile 2 → fetch request B starts (fast, takes 0.5s)

Request B finishes → setUser(profile2) ✅
Request A finishes → setUser(profile1) ❌ OVERWRITES profile2!

Screen shows wrong user!
The fix — Cleanup flag:
jsxuseEffect(() => {
  let cancelled = false; // 🛡️ guard flag

  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setUser(data); // only update if still relevant
    });

  return () => {
    cancelled = true; // 🧹 cancel on cleanup
  };
}, [userId]);
```
```
Now:
  Request A starts → cancelled=false
  userId changes → cleanup runs → cancelled=true
  Request B starts → new cancelled=false
  Request A resolves → cancelled is true → setUser SKIPPED ✅
  Request B resolves → cancelled is false → setUser runs ✅

The Cleanup Function — 4 Cases You Must Know
jsx// Case 1: Interval cleanup
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // ✅
}, []);

// Case 2: Event listener cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize); // ✅
}, []);

// Case 3: Subscription cleanup
useEffect(() => {
  const sub = websocket.subscribe(channel);
  return () => sub.unsubscribe(); // ✅
}, [channel]);

// Case 4: Fetch cleanup (AbortController — modern way)
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name === 'AbortError') return; // ignore cancelled requests
    });

  return () => controller.abort(); // ✅ cancels the fetch itself
}, [url]);
```

---

## ⚡ React Strict Mode Double-Invoke

Remember your confusion from Q2 in the diagnostic? Here's the full explanation:
```
In development + Strict Mode, React intentionally:
  1. Renders your component
  2. Runs your useEffect setup
  3. Runs your useEffect CLEANUP
  4. Runs your useEffect setup AGAIN

Why? To catch cleanup bugs!
If your cleanup is wrong, double-invoke will expose it.
This ONLY happens in development. Production = normal behavior.
jsx// This is why proper cleanup matters:
useEffect(() => {
  const id = setInterval(tick, 1000);
  // No cleanup ❌ → Strict Mode creates 2 intervals!
}, []);

useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // ✅ Strict Mode cleans first, then remounts
}, []);
```

---

## 🧠 Module 2 Summary
```
useEffect = synchronization tool, not a lifecycle method
Dependency array controls WHEN to re-synchronize
Stale closure = effect captures old value, fix with functional update
Race condition = old request resolves after new one, fix with cancel flag
Cleanup = always clean what you set up (intervals, listeners, requests)
Strict Mode = double-invokes in dev to catch missing cleanups

