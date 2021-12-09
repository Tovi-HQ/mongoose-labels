var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Model = mongoose.Model;

const rearrange = require('./lib/rearrange');

module.exports = exports = function(schema, options) {
	options = options || {};
	// console.log(options);

	const resource_types = (options.resource_types) ? options.resource_types : [];
	const colors = (options.colors) ? options.colors : ['black', 'light_gray', 'gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

	schema.add({
		labels: [
			{
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Label',
				},
				position: {
					type: Number,
					default: 0,
				}
			}
		]
	});


	/**
	 * Label storage table
	 */
	const LabelSchema = new Schema({
		name: {
			type: String,
			required: true,
			trim: true,
		},
		resource_type: {
			type: String,
			enum: resource_types,
			required: true,
		},
		resourceId:{
			type: mongoose.Schema.Types.ObjectId,
			refPath: 'resource_type',
			required: true,
		},
		color: {
			type: String,
			enum: colors,
			default: 'black',
		}
	}, {versionKey: false});
	const Label = mongoose.model('Labels', LabelSchema);


	/**
	 * Methods
	 */

	schema.methods.createLabel = async function (query) {
		if(await this.labelExist({name: query.name, resource_type: query.resource_type, resourceId: query.resourceId})){
			return {message: 'This label already exist'};
		}

		const data = {
			name: query.name,
			color: (query.color) ? query.color : 'black' ,
			resource_type: query.resource_type,
			resourceId: query.resourceId
		};

		const label = Label.create(data);
		return label;
	};

	schema.methods.deleteLabel = async function (labelId) {
		if(!labelId){
			return {message: 'Missing arguments'};
		}
		
		const FOUND = await Label.findById(mongoose.Types.ObjectId(labelId));
		if(FOUND){
			FOUND.delete();
		}
		
		return this;
	};

	schema.methods.labelExist = async function (query) {
		if(!query.name || !query.resource_type || !query.resourceId){
			return {message: 'Missing arguments'};
		}

		if((resource_types && !resource_types.includes(query.resource_type)) || !query.resource_type){
			return {message: 'This resouce_type is not allowed on this document'};
		}

		const data = {
			name: query.name,
			resource_type: query.resource_type,
			resourceId: query.resourceId
		};

		const FOUND = await Label.findOne({name: query.name, resource_type: query.resource_type, resourceId: query.resourceId});
		return (FOUND) ? true : false;
	};

	schema.methods.getLabels = async function (query) {
		const list = await Label.find({resource_type: query.resource_type, resourceId: query.resourceId});
		return list
	};



	schema.methods.addLabel = async function (labelId) {
		const newLabel = {
			id: labelId,
			position: this.labels.length + 1
		};

		const FOUND = this.labels.find(x => x.id.toString() === labelId.toString());
		if(!FOUND){
			this.labels = this.labels.concat([newLabel]);
			return this.save();
		}

		return this;
	};

	schema.methods.removeLabel = async function (labelId) {
		for (let i = 0; i < this.labels.length; i++) {
			let r = this.labels[i];

			if (r.id && r.id.toString() === labelId.toString()) {
				const newlabels = this.labels.pull({_id: r._id});
				this.labels = await rearrange(newlabels, 0, 0);
				
				return this.save();
			}
		}

		return this;
	};

	schema.methods.toggleLabel = async function (labelId) {
		for (let i = 0; i < this.labels.length; i++) {
			let r = this.labels[i];

			if (r.id && r.id.toString() === labelId.toString()) {
				const newlabels = this.labels.pull({_id: r._id});
				this.labels = await rearrange(newlabels, 0, 0);
				
				return this.save();
			}
		}

		const newLabel = {
			id: labelId,
			position: this.labels.length + 1
		};

		const FOUND = this.labels.find(x => x.id.toString() === labelId.toString());
		if(!FOUND){
			this.labels = this.labels.concat([newLabel]);
			return this.save();
		}

		return this;
	};

	schema.methods.moveLabel = async function (labelId, destination) {
		this.labels = await rearrange(this.labels, labelId.toString(), destination);
		return this.save();
	};

	schema.methods.hasLabel = async function (labelId) {
		const FOUND = this.labels.find(x => x.id.toString() === labelId.toString());
		return (FOUND) ? true : false;
	};

};
