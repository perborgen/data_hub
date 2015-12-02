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
	datapoints: Number,
	upvotes: Array,
	comments: Array,
	user: String,
	scripts: Array,
	description: String,
	features: Array,
	num_upvotes: Number
});



datasetSchema.index({ "$**": 'text'});

var Dataset = mongoose.model('Dataset', datasetSchema);
var User = mongoose.model('User', userSchema);

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
	console.log('looking for dataset');
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
	Dataset.find({}).sort({num_upvotes: -1}).exec(
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

const search = (request, reply) => {
	// CONTINUE HERE - FINISH SEARCH FEATURE
	const searchQuery = request.params.searchQuery;
	console.log('searchQuery: ',searchQuery);
	Dataset.find({$text: {$search: searchQuery }})
		.limit(10)
		.exec( (err, res) => {
			if (err) {
				throw err;
				reply(false);
			}
			reply(res);
			console.log('res: ', res);
		});
}

const home = (request, reply) => {
	console.log('HOMEEEEEE')
	if (request.auth.isAuthenticated){
		const profile = request.auth.credentials.profile;
	        User.findOne({email: profile.email}, function(err, user){
		    if (err){
		        throw err;
                reply.file(index);
		    }
		    if (user) {
                reply.file(index);
			} 
            else {
            	console.log('creating new user');
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
		        new_dataset.features = d.features;
		        new_dataset.num_upvotes = 0;
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
		reply.file(index);
	}
}

const upvote = (request, reply) => {
	console.log('UPVOTE');
	if (request.auth.isAuthenticated){
		const userId = request.auth.credentials.profile.id;
		const datasetId = request.payload.id;
	    Dataset.findById(datasetId, function(err,dataset){
		    console.log('looking for dataset');
		    
		    if (err){
		    	console.log('err; ', err);
		        throw err;
		       	reply(false);
		    }

		    if (dataset) {
		    	if (dataset.upvotes.indexOf(userId) === -1) {
					dataset.upvotes.push(userId);
					dataset.num_upvotes += 1;
			    	dataset.markModified("upvotes");
			    	dataset.markModified("num_upvotes");
			    	dataset.save( function(err){
			    		reply({
			    			upvotes: dataset.upvotes
			    		});
			    	});
		    	} 
		    	else {
		    		reply(false);
		    	}
			} else {
				reply(false);
			}
		});
	} 
	// if the user isn't authenticated
	else {
		reply(false);
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
	login: login,
	search: search,
	home: home,
	upvote: upvote,
	logout: logout,
	getTags: getTags,
	datasets:datasets,
	newDataset: newDataset,
	getDataset: getDataset,
	featuredDatasets:featuredDatasets
}