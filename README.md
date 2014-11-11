Analysis
========

Static and Dynamic Analysis

Watch [5:00-14:30,28:00-34:00](https://www.youtube.com/watch?v=ACYZFkvq0Sk).

Create a static analyzer for basic code complexity metrics using [esprima](http://esprima.org/).  Use the [demo page](http://esprima.org/demo/parse.html) to get live feedback on the AST. For live example of a code complexity calculator, see [jscomplexity](http://jscomplexity.org/).

The repository contains a stub that already calculates the first metric.

     // Number of functions in code. 
     Functions:0,
     
Provide the code to fill in the remaining metrics.

     // Number of if statements/loops + 1
     SimpleCyclomaticComplexity: 0,
     // The max depth of scopes (nested ifs, loops, etc)
     MaxNestingDepth: 0,
     // Average number of parameters for functions
     MeanParameterCount: 0,
     // Max number of parameters for functions
     MaxParameterCount: 0,
     
