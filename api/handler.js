var index = "./public/index.html";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multer = require('multer');//for handling multipart/form-data
var fs = require('fs');
var AWS = require('aws-sdk');
var models = require('./models');

if (process.env.ISPRODUCTION === undefined) {
    var config  = require('../config');
}

mongoose.connect(process.env.MONGOLAB || config.mongolab);

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
	title: { type: String, index: { unique: true }},
	s3_url: String,
	url: String,
	img_url: String,
	s3_img_url: String, 
	tags: Array,
	datapoints: Number,
	upvotes: Array,
	comments: Array,
	user: String,
	scripts: Array,
	description: String,
	features: Array,
	num_features: Number,
	num_instances: Number,
	num_upvotes: Number,
	articles: Array,
	papers: Array
});

var requestSchema = new Schema({
	title: { type: String, index: { unique: true }},
	tags: Array,
	upvotes: Array,
	comments: Array,
	user: String,
	description: String,
	features: Array,
	num_upvotes: Number,
	paymentAmount: Number
});

var feedbackSchema = new Schema({
	text: String
})

datasetSchema.index({ "$**": 'text'});

const Request = mongoose.model('Request', requestSchema);
const Dataset = mongoose.model('Dataset', datasetSchema);
const User = mongoose.model('User', userSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

var AWS = require('aws-sdk');
AWS.config.region = 'eu-central-1';



const signedurl = (request, reply) => {
	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY || config.AWS.accessKeyId, 
		secretAccessKey: process.env.AWS_SECRET_KEY || config.AWS.secretAccessKey
	});

    var s3 = new AWS.S3(),
	params = {
		Bucket: request.query.bucket,
		Key: request.query.file_name,
		Expires: 60,
        ContentType: request.query.file_type,
        ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', params, (err, data) => {
		if (err) {
			throw err;
			reply(false);
		}
		else {
			reply({
				signed_request: data,
				url: 'https://' + request.query.bucket + '.s3.amazonaws.com/' + request.query.file_name
			});

		}
	});

}

const home = (request, reply) => {
	console.log('HOME')
	if (request.auth.isAuthenticated){
		console.log('IS AUTHENTICATED');
	    reply.file(index);
	} 

    // if the user isn't authenticated
    else {
    	console.log('NOT AUTHENTICATED');
        reply.file(index);
	}
}

const login = (request, reply) => {
    if (request.auth.isAuthenticated) {
		const profile = request.auth.credentials.profile;
    	User.findOne({username: profile.username}, function(err, user){
		    
		    if (err){
		        throw err;
                reply.file(index);
		    }
		    
		    if (user) {
                reply.file(index);
			} 
            
            else {
                
                //create new user object
                var new_user = new User();
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
                    request.auth.session.set(new_user);
                	reply.file(index);
                });
	    	
	    	}
		});
	} else {
		return reply('Not logged in...').code(401);
	}
}

const getDataset = (request, reply) => {
	const title = request.params.datasetTitle.split('-').join(' ');
	Dataset.findOne({title: title}, function(err, dataset){
	    
	    if (err){
	        throw err;
	       	reply(false);
	    }

	    if (dataset) {
	       	reply(dataset);
		} 
		else {
			models.getDatasetById(Dataset, title, function(dataset){
				reply(dataset);
			});
		}
	});
}

const getRequest = (request, reply) => {
	const title = request.params.requestTitle.split('-').join(' ');
	Request.findOne({title: title}, (err, request) => {
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

const postFeedback = (request, reply) => {
	console.log('postFeedback');
	var userFeedback = request.payload.text;
	var new_feedback = new Feedback();
	new_feedback.text = userFeedback;
	new_feedback.save( function(err){
	    if (err){
	        throw error;
	        reply(false);
	    }
		reply(true);
	});
}

const featuredDatasets = (request, reply) => {
	Dataset.find({}).sort({num_upvotes: -1})
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

const featuredRequests = (request, reply) => {
	Request.find({}).sort({num_upvotes: -1})
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
		console.log('request.auth.credentials: ', request.auth.credentials);
		var username = request.auth.credentials.raw.username;	
		User.findOne({username: username}, (err, user) => {
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
		       	reply(dataset);
			}
		    else {
		        var new_dataset = new Dataset();
		        new_dataset.title = d.title;
		        new_dataset.url = d.url;
		        new_dataset.img_url = d.img_url;
		        new_dataset.tags = d.tags.split(',');
		        new_dataset.user = d.displayName;
		        new_dataset.description = d.description;
		        new_dataset.features = d.features;
		        new_dataset.num_upvotes = 100;
		        new_dataset.articles = d.articles;
		        new_dataset.s3_url = d.s3_dataset_url;
		        new_dataset.s3_img_url = d.s3_img_url;
		        new_dataset.num_instances = d.num_instances;
		        new_dataset.num_features = d.num_features;
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
	console.log('new request!');
	const d = request.payload;
	console.log('d: ', d);
    var new_request = new Request();
    new_request.title = d.title;
    new_request.tags = d.tags.split(',');
    new_request.description = d.description;
    new_request.save( function(err, res){
        if (err){
            throw error;
        }
        reply(res);
    });

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
		    if (err){
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
		reply(res);
	});
}

module.exports = {
	signedurl: signedurl,
	postFeedback: postFeedback,
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
	featuredDatasets:featuredDatasets,
	Dataset: Dataset
}