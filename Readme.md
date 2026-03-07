<!-- Ans 01 -->

1. var
   You can change its value later.
   You can use it before you declare it (hoisting).
   It is not block-scoped — it works outside {} blocks like if or for.

2. let
   You can change its value later.
   You cannot use it before declaring it.
   It is block-scoped — only works inside {}.

3. const
   You cannot change its value once set.
   You cannot use it before declaring it.
   It is block-scoped.

<!-- Ans 02 -->

The spread operator (...) spreads out elements from an array, object, or string. Think of it like opening a box and taking everything inside out.

<!-- Ans 03 -->

map(), filter(), and forEach() are all array methods in JavaScript used to loop through arrays, but they work differently. forEach() simply goes through each item and does something with it (like printing or changing a variable), but it doesn't return a new array. map() also goes through each item but returns a new array with the same length after transforming each element. filter() goes through each item and returns a new array but only with elements that pass a certain condition (so the new array might be shorter than the original).

<!-- Ans 04 -->

An arrow function is a shorter way to write functions in JavaScript. It uses the => syntax (looks like an arrow).

<!-- Ans 05 -->

Template Literals are a feature in JavaScript used to create strings more easily. They are written using backticks ( ) instead of single quotes (' ') or double quotes (" "). Template literals allow you to insert variables and expressions inside a string using ${ }.

They also support multi-line strings, so you can write text on multiple lines without using special characters like \n.
