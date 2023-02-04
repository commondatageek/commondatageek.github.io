---
title: "Rust Ownership"
date: 2023-02-02T04:37:54-07:00
draft: false
type: notes

tags: [rust]
categories: []
---

_Notes about Rust's ownership model. Specific care taken to document vocabulary
usage._

<!--more-->


## ownership

> Ownership is a set of rules that govern how a Rust program manages memory.

- Rust doesn't use garbage collection to free up memory.
- Rust doesn't require the programmer to manually free memory.
- Rust uses the concept of Ownership to determine when to free memory.

"Ownership" is a set of rules that your program must follow in order to compile.
If your program violates these rules, it won't compile.

> the main purpose of Ownership is to manage heap data
> 
> - keeping track of what parts of code are using what data on the heap
> - minimizing the amount of duplicate data on the heap
> - cleaning up unused data on the heap so you don’t run out of space


Writing code according to Ownership rules results in a logical guarantee of
memory safety. It is thus safer than manual allocation/freeing of memory.

Because it is all checked at compile time, the Ownership memory management model
incurs zero runtime cost. It is thus faster and more efficient than garbage
collection.


## Ownership Rules

> - Each value in Rust has an owner.
> - There can only be one owner at a time.
> - When the owner goes out of scope, the value will be dropped.


## References Rules

> - At any given time, you can have either one mutable reference or any number
>   of immutable references.
> - References must always be valid.


## Vocabulary List

- ownership (n)
- garbage collection (n)
- allocate memory (v), free / deallocate memory (v)
- stack (n), heap (n)
- run time (n), compile time (n)
- last in, first out (n)
- push a value onto a stack (v), pop a value off from a stack (v)
- fixed-size value (n)
	- can be known at compile time
	- can be pushed to the stack
- unknown-size value (n)
	- can only be known at run time
	- must be allocated on the heap
- memory allocator (n)
    - logic that can allocate, grow, shrink, and deallocate arbitrary blocks of
      memory
    - the default allocator used by Rust is `jemalloc`
    - it is possible to write and use custom allocators
    - The standard library now provides a handle to the system allocator, which can be used to switch to the system allocator when desired
- pointer (n)
    - a fixed-size value indicating the address of a block of data in memory
- address (n)
    - where in memory the storage for a data value begins
    - an integer
    - starts at 0
    - goes up to the theoretical "maximum addressable memory limit", which on a 64 bit
      system is about 16 exabytes (16 billion gigabytes)
    - on 32-bit systems, it's 4 gigabytes
- allocate on the heap / allocate (v)
    - kind of redundant, as "allocation" is something that only occurs on the
      heap
    - obtain a block of memory to be used for a value
- allocation (n)
    - grabbing a block of memory on the heap for data you'd like to store
- follow a pointer (v)
    - dereference a pointer
    - go see what actual data is stored in memory at that location
- the top of the stack (n)
    - the place where all the action happens
    - values are pushed onto the top
    - values are popped off of the top
- function parameters (n)
    - at compile time, the formal description of data that can be passed into a
      function, including:
        - the types of data
        - the order in which they are passed
        - the variable names that will be used to work with those data inside of
          the function
- function arguments (n)
    - at run time, the actual data that are passed into a function when the
      function is called
- function local variables (n)
- value (n)
	- an actual datum like:
        - an integer
        - a string
        - a struct representing a library book
        - a reference to data that is owned elsewhere
    - the thing that actually gets stored in memory
- owner (n)
    - The variable that is currently recognized by the compiler as owning a value
- scope (n) 
    - the range within a program for which a variable name is valid
- come into scope (v)
    - a variable is valid to use when it has "come into scope."
    - this generally happens either with the declaration of the variable or with
      the function signature
- go out of scope (v)
    - for variables, this happens at a closing curly brace
    - for references, this happens at the last time the reference is used
    - when variables that own heap data go out of scope, they Drop that data
    - when variables that have references or other Copy-able data go out of
      scope, nothing happens
- end of scope (n)
- drop a value (v)
    - deallocate/free/return memory for this value on the heap
- variable (n)
    - a name used for referencing a value in your code
- string literal (n)
    - a string value hardcoded into the text of the program
- declare a variable (v)
    - bring a variable name into scope
    - with a memory location either on the stack or on the heap
    - optionally provide an initial value for that variable
- valid (adj)
    - of a name, meaning it can be used within a scope
    - it begins being valid when it comes into scope
    - it stops being valid when it goes out of scope
- immutable (adj), mutable (adj)
    - whether or not data can be changed
    - variables in Rust are immutable by default
    - decided by the variable declaration
        - let x = 5      // immutable -- the underlying value cannot be
                            changed by any subsequent code
        - let mut x = 5  // mutable -- the underlying value CAN be changed by
                            subsequent code
- mutate (v)
    - modify the underyling value that is bound to a variable
    - not possible if you haven't declared the variable with `mut`, because
      variables are immutable by default
    - compare to shadow (v):
        - assign/bind a new value to the same variable name
        - TODO: does the old value go out of scope immediately? or at the
          closing curly brace?
- hardcoded values (adj)
    - a fixed value known at compile time that is written into the executable
      binary
    - not passed into the program at run time as input
- executable (n), binary (n)
    - the file artifact resulting from the compilation process -- a program that
      can be run on the computer
- invalid (adj)
- drop function (n)
    - a special function/method defined for any type that needs to allocate on
      the heap during its lifetime and return that memory when it goes out of
      scope
    - Copy-able methods do not (cannot) have a drop function, and they do not
      need to return memory to the heap when the go out of scope
- bind, assign (v) a value to a variable
    - associate a variable with a specific value located at a specific address
      in memory
- capacity (n)
    - for strings and other values of unknown size, this is the amount of memory
      that has been allocated on the heap for that value by the allocator
- length (n)
    - for strings and other values of unknown size, this is the amount of its
      allocated memory that it has used
- byte (n)
    - in most systems and programming languages, this is the smallest unit of
      addressable memory
- double free error (n)
    - an error that occurs when:
        - multiple variables are bound to the same value
        - those variables go out of scope
        - those variables each attempt to deallocate the heap memory associated
          with that value
- memory corruption (n)
    - the actual state of values in memory is no longer consistent with what
      your program logic expected it to be
    - often the result of data races and other types of bugs that Rust is
      designed to prevent
- reference (n)
- invalidated reference (n)
- invalidated variable (n)
    - when a variable is invalidated (due to a Move), you can no longer use that
      variable in subsequent lines of code
- shallow copy (n)
    - copying the data on the stack and binding to a new variable
- deep copy (n)
    - copying the data on the stack, PLUS the data on the heap and binding to a
      new variable
- Copy (n, v)
    - this has special meaning in Rust
    - Rust copies stack-only data from one variable to another
- Move (n, v)
    - this has special meaning in Rust
    - Rust invalidating one variable in favor of another
- the clone method (v)
    - performs what is known in other languages as a "deep copy": both the stack
      data and the heap data are copied
- the Copy trait (n)
    - only placed on types that are stored completely on the stack
    - variables that refer to these types are never Moved, but are Copied
      because it is trivial to do so
    - not possible to implement this trait on a type if the type or any of its
      parts have implemented the Drop trait -- results in compile-time error
- the Drop trait (n)
    - implementing this on a type tells Rust how to deallocate the heap memory
      and resources associated with this
- resource (n)
    - seems to be used in a special way to refer to things like file
      descriptors, etc.
- pass a value to a function (v)
- take ownership (v)
    - when a new scope takes ownership of a value from a different scope
- return ownership (v)
- static check (n)
    - checks the compiler runs at compile time to check your code for various
      errors
- return values (n)
- transfer ownership (v)
- references (n)
    - A reference is like a pointer in that it’s an address we can follow to
      access the data stored at that address; that data is owned by some other
      variable. Unlike a pointer, a reference is guaranteed to point to a valid
      value of a particular type for the life of that reference.
    - References are guaranteed to be safe.  Pointers are not.
    - Allow you to refer to a value without taking ownership of it
    - Immutable by default
- lifetime (n)
    - the lifetime of a reference, during which the reference is guaranteed to
      be valid
- create a reference (v)
    - We call the action of creating a reference borrowing
- referencing (v)
    - with the `&`
- dereferencing (v)
    - with the `*`
- refer (v)
- own (v)
- borrow (v)
    - create a reference to a value so you don't have to take ownership of it
- borrowed value (n)
- immutable reference (n)
- mutable reference (n)
    - allows us to make changes to the value
    - if you have a mutable reference to a value, you can have no other
      references to that value
    - The restriction preventing multiple mutable references to the same data at
      the same time allows for mutation but in a very controlled fashion
    - The benefit of having this restriction is that Rust can prevent data races
      at compile time
    - We also cannot have a mutable reference while we have an immutable one to
      the same value.
- data race (n)
    - Two or more pointers access the same data at the same time.
    - At least one of the pointers is being used to write to the data.
    - There’s no mechanism being used to synchronize access to the data.
- race condition (n)
- reference's scope (n)
	- starts where the reference is introduced
	- ends with the last time that reference is used
    - the compiler can tell that the reference is no longer being used at a
      point before the end of the scope.
- dangling pointer (n)
    - a pointer that references a location in memory that may have been given to
      someone else—by freeing some memory while preserving a pointer to that
      memory
    - In Rust, by contrast, the compiler guarantees that references will never
      be dangling references: if you have a reference to some data, the compiler
      will ensure that the data will not go out of scope before the reference to
      the data does
- lifetime specifier (n)
- slice (n)
    - a slice is a specific type of reference
    - it does not have ownership, it is a borrow
    - Slices let you reference a contiguous sequence of elements in a
      collection rather than the whole collection
- collection (n)
    - a data structure that groups more than one data value together in some way
    - lists
    - maps
    - queues
    - etc


## verbs with ownership

When assigning values to variables in the same function.  Also passing values to
function calls.

- copy (shallow / stack)
- clone (deep / heap)
- move
	- first reference to value is invalidated
	- leaves only second reference valid


## types of references that can be passed to functions

from the chapter on structs

- immutable
	- consume
- mutable
	- borrow
	- consume

Methods can take ownership of self, borrow self immutably as we’ve done here,
or borrow self mutably, just as they can any other parameter.


## stack

- push, pop, last-in/first-out
- data here must have a known, fixed size at compile time
- pushing to the stack is **not** referred to as allocating
- much faster than allocating on the heap because there's no searching or
  bookkeeping involved


## heap

- data with unknown or changeable size must be stored here
- space is allocated and a pointer is returned
- slower than pushing to the stack because it has to find space and keep track
  of where all the blocks of data begin and end
