console.log('HHHHHHHHANDLER');
var config = require('../config');
var index = "./public/index.html";
var mongoose = require('mongoose');
console.log('config.mongoose: ', config.mongoose);
var Schema = mongoose.Schema;
mongoose.connect(process.env.MONGOOSE || config.mongoose);

var userSchema = new Schema({
    email: String,
    username: String
});
var datasetSchema = new Schema({
	title: String,
	url: String,
	img_url: String,
	tags: Array,
	features: Number,
	datapoints: Number,
	rating: Number,
	comments: Array,
	user: String
});


var Dataset = mongoose.model('Dataset', datasetSchema);
var User = mongoose.model('User', userSchema);


const login = (request, reply) => {
	console.log('login handler');
    if (request.auth.isAuthenticated) {
    	request.auth.session.set(request.auth.credentials);
    	return reply.redirect('/');
	}
	reply('Not logged in...').code(401);
}

const getDataset = (request, reply) => {
	console.log('getDataset handler');
	const dataset = request.params.datasetId;
	Dataset.findById(dataset, function(err,dataset){
	    if (err){
	        throw err;
	       	reply.file(index);
	    }

	    if (dataset) {
	       	reply(dataset);
		} else {
			reply(false);
		}
	});
}

var featuredDatasets = (request, reply) => {
	console.log('featuredDatasets handler');

	Dataset.find({}).sort({rating: -1}).limit(6).exec(
		function(err,datasets){
	    if (err){
	        throw err;
	       	reply.file(index);
	    }

	    if (datasets) {
	       	reply(datasets);
		} else {
			reply(false);
		}
	});
}


var home = (request, reply) => {
	console.log('home handler');
	// Check if user is authenticated
	if (request.auth.isAuthenticated){
		var profile = request.auth.credentials.profile;
		
        // Query the db to check if the user exists there
        User.findOne({email: profile.email}, function(err,user){
		    if (err){
		        throw err;
		       	reply.file(index);
		    }

            // if the user exists, simply reply without doing anything
		    if (user) {
		       	reply.file(index);
			} 

            // if the user doesn't exist
            else {
                //create new user object
                var new_user = new User();
                new_user.email = profile.email;
                new_user.username = profile.username;
                new_user.name = profile.displayName;
                new_user.img = profile.raw.avatar_url;

                // save the user to the db
                new_user.save( function(err){
                    if (err){
                        console.log('error when saving new member');
                        throw error;
                    }
                    console.log('registration successful');
                    reply.file(index);
                });
	    	
	    	}
		});
	} 

    // if the user isn't authenticated
    else {
    	console.log('not logged in');
		reply.file(index);
	}
}


const user = (request, reply) => {
	console.log('USER HANDLER');
	if (request.auth.isAuthenticated){
		console.log('is authenticated-------');
		reply(request.auth.credentials);
	}else {
		reply('123');
	}
}

const logout = (request, reply) => {
	console.log('logout HANDLER');

    request.auth.session.clear();
    reply.redirect('/');
}

const newDataset = (request, reply) => {
	console.log('newDataset HANDLER');
	if (request.auth.isAuthenticated){
		const d = request.payload;
	    Dataset.findOne({url: d.url}, function(err,dataset){
		    
		    if (err){
		        throw err;
		       	reply.file(index);
		    }

		    if (dataset) {
		       	reply(dataset);
			}
		    else {
		        var new_dataset = new Dataset();
		        new_dataset.title = d.title;
		        new_dataset.url = d.url;
		        new_dataset.img_url = d.img_url;
		        new_dataset.tags = d.tags;
		        new_dataset.user = d.displayName;
		        new_dataset.save( function(err, res){
			        if (err){
			            console.log('error when saving new member');
			            throw error;
			        }
			        console.log('registration successful');
			        reply(res);
		        });
			}
		});
	} 
	// if the user isn't authenticated
	else {
		reply.file(index);
	}
}


module.exports = {
	user: user,
	login: login,
	logout: logout,
	home: home,
	newDataset: newDataset,
	getDataset: getDataset,
	featuredDatasets:featuredDatasets
}

/*var index = "./public/index.html";
var mongoose = require('mongoose');


var home = function (request, reply) {
    reply.file('./public/index.html');
};

module.exports = {
	home: home
};*/