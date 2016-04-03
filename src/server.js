
var polyfill   = require('babel-polyfill');
var Koa        = require('koa');
var BodyParser = require('koa-bodyparser');
var Router     = require('koa-router');
var unirest = require('unirest');
var cors = require('kcors');



const app    = new Koa();
const router = new Router();


const API_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com";
const IMG_URL = "https://spoonacular.com/recipeImages";
const API_KEY = "eFwDAjOB2Dmsh3lOPUJBmupT1i8Yp1wNeGsjsnQlwrJSoDJQ0L";

app.use(cors());
app.use(BodyParser({
  extendTypes: {
    json: ['application/json'] // will parse application/x-javascript type body as a JSON string
  }
}));
app.use(router.routes());
app.use(router.allowedMethods());
/*
 * ROUTES
 */

//intolerances could be: dairy, egg, gluten, peanut, sesame, seafood, shellfish, soy, sulfite, tree nut, and wheat.
 //example http://localhost:8080/api/Recipes?search=lasagne&intolerances=eggs,gluten
router.get('/api/Recipes', async (ctx, next) => new Promise((resolve, reject) => {
//https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/12435/information?includeNutrition=false")
var recipe = "/recipes";
//var id_int = parseInt(ctx.params.id || '', 10) | 0;
var query = ctx.query;
var intolerances = "";
if(query["intolerances"] !== undefined){
	 intolerances = query["intolerances"];
}

var url = API_URL + recipe + '/search?intolerances=' + intolerances +'&limitLicense=false&number=10&offset=0&query=' + query["search"];
	unirest.get(url)
	.header("X-Mashape-Key", API_KEY)
	.end(function (result) {

		if(result.body !== null && result.body !== undefined && result.body instanceof Object && results["results"] instanceof Array){
			var resultArr = [];
			result.body["results"].forEach(function(value) {
			var imageUrl = IMG_URL + '/' + value["image"];
			resultArr.push({ id: value["id"], title: value["title"], minutes: value["readyInMinutes"], image: imageUrl})
			});
			ctx.body   = JSON.stringify(resultArr);
			ctx.status = 200;
			resolve();
		} else {
			ctx.body   = JSON.stringify([]);
			ctx.status = 200;
			reject();
		}
		
	});
})
);



router.get('/api/Recipe/:id', async (ctx, next) => new Promise((resolve, reject) => {
//https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/12435/information?includeNutrition=false")
var recipe = "/recipes/";
var includeNutrition = "?includeNutrition=false";
var id = ctx.params.id;

	var url = API_URL + recipe + id + '/information?includeNutrition=false';
		unirest.get(url)
		.header("X-Mashape-Key", API_KEY)
		.end(function (result) {
		if(result.body !== null && result.body !== undefined && result.body instanceof Object && results["results"] instanceof Array){	
			var ingredientsArr = [];
			result.body["extendedIngredients"].forEach(function(value) {
			ingredientsArr.push({ name: value["name"], amount: value["amount"], unit: value["unit"], unitShort: value["unitShort"]})
			});

			var recipeResult =
			{
				id : result.body["id"],
				preparationMinutes : result.body["preparationMinutes"],
				cookingMinutes : result.body["cookingMinutes"],
				ingredients : ingredientsArr
			}
			ctx.body   = JSON.stringify(recipeResult);
			ctx.status = 200;
			resolve();
		} else {
			ctx.body   = JSON.stringify([]);
			ctx.status = 200;
			reject();
		}
		});
	})
);

/*
*
*POST Body: ["apple", "banana", "coconut"]
*
*/
router.post('/api/Recipe', async (ctx, next) => new Promise((resolve, reject) => {
	var postBody = ctx.request.body;
	console.log(postBody.length);
	var ingredients ="";
	for(var i=0; i < postBody.length; i++){
		ingredients+= postBody[i];
			if(i !== postBody.length-1){
				ingredients+= "%2C";
			}
		}
	var recipe = "/recipes/findByIngredients?ingredients=";
	var id = ctx.params.id;

	var url = API_URL + recipe + ingredients + '&limitLicense=false&number=5&ranking=1';
	unirest.get(url)
	.header("X-Mashape-Key", API_KEY)
	.end(function (result) {
		if(result.body !== null && result.body !== undefined && result.body instanceof Object && results["results"] instanceof Array){	
		ctx.body   = result.body;
		ctx.status = 200;
		resolve();
			} else {
			ctx.body   = JSON.stringify([]);
			ctx.status = 200;
			reject();
		}
	});
})
);

/*
 * INITIALIZATION
 */

app.use(async (ctx, next) => {

	try {

		await next();

	} catch(err) {

		ctx.body   = { message: 'Internal error: ' + err.message };
		ctx.status = err.status || 500;

	}

});







// app.use(async (ctx, next) => {
//
// 	ctx.body = 'Hello World';
//
// });



/*
 * MODULE
 */

module.exports = {

	listen: function(port) {

		port = typeof port === 'number' ? (port | 0) : null;


		if (port !== null) {

			app.listen(port);

			console.log('Listening on null:' + port);


			return true;

		} else {

			throw "listen(Number port): port is not a Number";

		}


		return false;

	}

};

