var config = require('../config');
var index = "./public/index.html";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.connect(process.env.MONGOOSE || config.mongoose);

var userSchema = new Schema({
    email: String,
    username: String,
    img: String,
    displayName: String,
    raw: Object,
    token: String,
    upvotes: Array,
    github_id: Number
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
	num_upvotes: Number,
	articles: Array,
	papers: Array
});

var requestSchema = new Schema({
	title: String,
	tags: Array,
	upvotes: Array,
	comments: Array,
	user: String,
	description: String,
	features: Array,
	num_upvotes: Number,
	paymentAmount: Number
});


datasetSchema.index({ "$**": 'text'});

const Request = mongoose.model('Request', requestSchema);
const Dataset = mongoose.model('Dataset', datasetSchema);
const User = mongoose.model('User', userSchema);


const home = (request, reply) => {
	console.log('HOME');
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
                let new_user = new User();
                new_user.email = profile.email;
                new_user.username = profile.username;
                new_user.name = profile.displayName;
                new_user.img = profile.raw.avatar_url;
                new_user.raw = profile.raw;
                new_user.github_id = profile.id;
                // save the user to the db
                new_user.save( function(err){
                    if (err){
                        throw error;
                    }
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

const login = (request, reply) => {
	console.log('LOGIN HANDLER');
    if (request.auth.isAuthenticated) {
    	console.log('----------about to set!!!!!')
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
		} 
		else {
			reply(false);
		}
	});
}

const getRequest = (request, reply) => {
	const requestId = request.params.requestId;
	Request.findById(requestId, (err, request) => {
	    if (err){
	        throw err;
	       	reply.file(index);
	    }
	    if (request) {
	    	reply(request);
	    }
	    else {
	    	reply(false);
	    }
	});
}

const featuredDatasets = (request, reply) => {
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

const featuredRequests = (request, reply) => {
	Request.find({}).sort({num_upvotes: -1})
		.limit(3)
		.exec(
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
	const searchQuery = request.params.searchQuery;
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

var datasets = (request, reply) => {
	reply.file(index);
}


const user = (request, reply) => {
	if (request.auth.isAuthenticated){
		let github_id = request.auth.credentials.profile.id;	
		User.findOne({github_id: github_id}, (err, user) => {
			reply(user);
		});
	}else {
		reply(false);
	}
}

const logout = (request, reply) => {
    request.auth.session.clear();
    reply.redirect('/');
}


const newDataset = (request, reply) => {
		const d = request.payload;
	    Dataset.findOne({url: d.url}, function(err, dataset){
		    if (err){
		        throw err;
		       	reply.file(index);
		    }

		    if (dataset) {
		    	console.log('found dataset')
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
		        new_dataset.articles = d.articles;
		        new_dataset.save( function(err, res){
		        if (err){
		            throw error;
		        }
		        console.log('registration successful, dataset: ',res);
		        reply(res);
		        });
			}
		});
}

const newRequest = (request, reply) => {
	if (request.auth.isAuthenticated){
		console.log('d: ', d);
		const d = request.payload;
	    let new_request = new Request();
        new_request.title = d.title;
        new_request.url = d.url;
        new_request.tags = d.tags;
        new_request.user = d.user;
        new_request.description = d.description;
        new_request.features = d.features;
        new_request.num_upvotes = 0;
        new_request.paymentAmount = d.paymentAmount;
        new_request.save( function(err, res){
	        if (err){
	            console.log('ERROR')
	            throw error;
	        }
	        console.log('registration successful, rewuest: ',res);
	        reply(res);
        });
	} 
	// if the user isn't authenticated
	else {
		reply.file(index);
	}
}


const upvoteRequest = (request, reply) => {
		const userId = request.auth.credentials.profile.id;
		const requestId = request.payload.id;
	    Request.findById(requestId, function(err, request){
		    console.log('looking for request');
		    
		    if (err){
		    	console.log('err; ', err);
		        throw err;
		       	reply(false);
		    }

		    if (request) {
		    	console.log('found request');
		    	if (request.upvotes.indexOf(userId) === -1) {
					request.upvotes.push(userId);
					request.num_upvotes += 1;
			    	request.markModified("upvotes");
			    	request.markModified("num_upvotes");
			    	request.save( function(err){
			    		reply({
			    			upvotes: request.upvotes
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


const upvoteDataset = (request, reply) => {
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

const commentDataset = (request, reply) => {
	if (request.auth.isAuthenticated){
		const github_id = request.auth.credentials.profile.id;
		const dataset_id = request.payload.dataset_id;
		const comment = request.payload.comment;
	    Dataset.findById(dataset_id, function(err,dataset){
	    	console.log('dataset: ', dataset);	    
		    if (err){
		    	console.log('err; ', err);
		        throw err;
		       	reply(false);
		    }

		    if (dataset) {
				dataset.comments.push({
					text: comment,
					github_id: github_id
				});
		    	dataset.markModified("comments");
		    	dataset.save( function(err){
		    		reply({
		    			comments: dataset.comments
		    		});
		    	});
		    }
			else {
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
	upvoteDataset: upvoteDataset,
	upvoteRequest: upvoteRequest,
	commentDataset: commentDataset,
	logout: logout,
	getTags: getTags,
	newRequest: newRequest,
	getRequest: getRequest,
	datasets:datasets,
	newDataset: newDataset,
	getDataset: getDataset,
	featuredRequests: featuredRequests,
	featuredDatasets:featuredDatasets
}