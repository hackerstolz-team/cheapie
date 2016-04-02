
var polyfill   = require('babel-polyfill');
var Koa        = require('koa');
var BodyParser = require('koa-bodyparser');
var Router     = require('koa-router');



const app    = new Koa();
const router = new Router();



/*
 * ROUTES
 */

router.get('/api/Status', async (ctx, next) => {

	var data = null;
	if (data !== null) {

		ctx.body   = JSON.stringify(data, null, '\t');
		ctx.status = 200;

	} else {

		ctx.body   = { message: 'Status/ not found.' };
		ctx.status = 404;

	}

});

router.post('/api/Status', async (ctx, next) => {

	var result = false;
	if (result === true) {

		ctx.body   = { message: 'OK' };
		ctx.status = 200;

	} else {

		ctx.body   = { message: 'Not OK' };
		ctx.status = 400;

	}


});



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


app.use(BodyParser());
app.use(router.routes());
app.use(router.allowedMethods());




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

