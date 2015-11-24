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
	user: String,
	description: String
});


var Dataset = mongoose.model('Dataset', datasetSchema);
var User = mongoose.model('User', userSchema);

const home = (request, reply) => {
	console.log('HOME');
	reply.file(index);
}

const login = (request, reply) => {
	console.log('LOGIN HANDLER');
    if (request.auth.isAuthenticated) {
    	request.auth.session.set(request.auth.credentials);
    	return reply.redirect('/');
	}
	return reply('Not logged in...').code(401);
}

const getDataset = (request, reply) => {
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


const success = (request, reply) => {
	console.log('handler');
	// Check if user is authenticated
	if (request.auth.isAuthenticated){
		var profile = request.auth.credentials.profile;
		
        // Query the db to check if the user exists there
        User.findOne({email: profile.email}, function(err,user){
		    if (err){
		        throw err;
                return reply.redirect('/');
		    }

            // if the user exists, simply reply without doing anything
		    if (user) {
                return reply.redirect('/');
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
                    return reply.redirect('/');
                });
	    	
	    	}
		});
	} 

    // if the user isn't authenticated
    else {
    	console.log('not logged in');
        return reply.redirect('/');
	}
}

var datasets = (request, reply) => {
	reply.file(index);
}


const user = (request, reply) => {
	if (request.auth.isAuthenticated){
		console.log('is authenticated--------: ', request.auth.credentials);
		reply(request.auth.credentials);
	}else {
		reply(false);
	}
}

const logout = (request, reply) => {
    request.auth.session.clear();
    reply.redirect('/');
}


const newDataset = (request, reply) => {
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
		        new_dataset.description = d.description;
		        new_dataset.save( function(err, res){
			        if (err){
			            console.log('error when saving new member');
			            throw error;
			        }
			        console.log('registration successful, dataset: ',res);
			        reply(res);
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

const getTags = (request, reply) => {
	const tagId = request.params.param;
	console.log('tagId: ', tagId);
	Dataset.find({tags: tagId}, function(err, res){
		var profile = request.auth.credentials.profile;
		reply(res);
	});
}

module.exports = {
	user: user,
	success: success,
	login: login,
	home: home,
	logout: logout,
	getTags: getTags,
	datasets:datasets,
	newDataset: newDataset,
	getDataset: getDataset,
	featuredDatasets:featuredDatasets
}