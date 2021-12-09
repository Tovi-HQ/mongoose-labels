var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = mongoose.Model;

const labelsPlugin = require('./index.js')

let mongoDB = 'mongodb://localhost:27017/mongoose-labels';
mongoose.connect(mongoDB, { useNewUrlParser: true });



// Set up a simple schema for testing
const taskSchema = mongoose.Schema({
    name: String
});

taskSchema.plugin(labelsPlugin, {resource_types: ['Task']});
const Task = mongoose.model('Task', taskSchema);

   
async function test() {
    const task = await Task.findById(mongoose.Types.ObjectId("61b1218fb62a25c096e98a24"));

    // task.createLabel({name: "New label 4", color: 'red', resource_type: 'Task', resourceId: '61b1218fb62a25c096e98a24'})
    // task.deleteLabel({id: '61b13129d7ef6ff5c68c1e8e'})

    // task.addLabel(mongoose.Types.ObjectId("61b16d45cf72305c47c97c6e"))
    // task.removeLabel(mongoose.Types.ObjectId("61b16b5257c9c917a14ed63d"))
    // task.toggleLabel(mongoose.Types.ObjectId("61b16b5257c9c917a14ed63d"))
    // task.moveLabel(mongoose.Types.ObjectId("61b13129d7ef6ff5c68c1e8e"), 1)

    // const labels = await task.getLabels({resource_type: 'Task', resourceId: '61b1218fb62a25c096e98a24'})
    // console.log(labels);

    // const labels = await task.hasLabel(mongoose.Types.ObjectId("61b13129d7ef6ff5c68c1e8e"))
    // console.log(labels);

}
test();