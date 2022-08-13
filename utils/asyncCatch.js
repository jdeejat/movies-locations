/*
section 9 116 
link > https://3m.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065210#questions


in order to get rid of our try catch blocks, we simply wrapped or asynchronous function inside of the catchAsync function

This function will then return a new anonymous function, which is this one here
(req, res, next) => {}

this function will then be assigned to the function that is wrapped inside catchAsync(). 

this function here that will get called as soon as it is called from the handler. And so that's why it has the exact same signature
(req, res, next)
async function with request response and next. 

this function here will then call the function that we passed in initially. And it will then execute all the code that is in there. Now since it's an async function here it will return a promise and therefore in case there is an error in this promise, or in other words, in case it gets rejected, we can then catch the error that happened using the catch method that is available on all promises. Okay. 
And in the end, it is this catch method here, which will pass the error into the next function, which will then make it so that our error ends up in our global error handling middleware. Okay, so this here, this line of code is really where all the magic happens.

*/
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
