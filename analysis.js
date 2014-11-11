var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");
var istanbul = require('istanbul');

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["analysis.js"];
	}
	var filePath = args[0];
	
	complexity(filePath);
	complexityBuilder.report();

	//dynamic(filePath);

}

function dynamic(filePath)
{
	var inst = new istanbul.Instrumenter({embedSource:true});
	var buf = fs.readFileSync(filePath, 'utf8');
	inst.instrument(buf, function (err, data) {
		console.log(data);
	});
}

var complexityBuilder = 
{
	// Number of functions in code.
	Functions:0,
	// Number of if statements/loops + 1
	SimpleCyclomaticComplexity: 0,
	// The max depth of scopes (nested ifs, loops, etc)
	MaxNestingDepth: 0,
	// Average number of parameters for functions
	MeanParameterCount: 0,
	// Max number of parameters for functions
	MaxParameterCount: 0,

	report : function()
	{
		console.log(
		   ("Number of functions {0}\n" + 
			"Cyclomatic complexity {1}\n" +
			"Nesting Depth {2}\n" +
			"Mean Parameters {3}\n" +
			"Max Parameters {4}\n")
			.format(complexityBuilder.Functions,
				complexityBuilder.SimpleCyclomaticComplexity, 
				this.MaxNestingDepth,
				complexityBuilder.MeanParameterCount, 
				complexityBuilder.MaxParameterCount)
		);
	}
};

function complexity(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var result = esprima.parse(buf, options);
	console.log("[*]. Lists of statistics results :");
	traverse(result, function (node) 
	{	
		//calculate the total number of Functions
		if (node.type === 'FunctionDeclaration') 
		{
			console.log( "Line : {0}, Function: {1}, Number of Parameters: {2}".format(node.loc.start.line,
				functionName(node),node.params.length));

			complexityBuilder.Functions++;

			if(node.params.length > complexityBuilder.MaxParameterCount)
			{
				complexityBuilder.MaxParameterCount = node.params.length;
			}

			complexityBuilder.MeanParameterCount += node.params.length; 
		}
		//calculate the complexity of Cyclomatic
		if(node.type == 'IfStatement' || node.type === 'ForStatement' || node.type == 'ForInStatement')
		{
			console.log( "Line : {0}, Type of Cyclomatic: {1}".format(node.loc.start.line, 
				node.type));

			complexityBuilder.SimpleCyclomaticComplexity++;
		}
	});

	//calculate average number of parameters
	complexityBuilder.MeanParameterCount = complexityBuilder.MeanParameterCount / complexityBuilder.Functions;


	//still missing "The max depth of scopes (nested ifs, loops, etc)"
}

function traverse(object, visitor) 
{
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor)
{
    var key, child;

    if( visitor.call(null, object) )
    {
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            child = object[key];
	            if (typeof child === 'object' && child !== null) {
	                traverseWithCancel(child, visitor);
	            }
	        }
	    }
 	 }
}

function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "";
}


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();

