function getDatasetById(Dataset, id, callback){
	Dataset.findById(id, function(err, dataset){
	    if (err){
	    	throw err;
	        callback(false);
	    }

	    if (dataset) {
	       	callback(dataset);
		}

		else {
			callback(false);
		}
	});
}

module.exports = {
	getDatasetById: getDatasetById
};
