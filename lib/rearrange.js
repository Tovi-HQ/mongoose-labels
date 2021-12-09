/**
 * Rearrange a set of objects based by a position
 * @param {Object} object
 * @param {string[]} move_id
 * @param {string[]} destination
 * @returns {Object}
 */
const rearrange = (object, move_id, destination) => {
  let bulkUpdate = [];

  if(move_id == 0 && destination == 0){
    let i = 1;
    object.forEach(element => {
    if(element.id !== move_id){
        i = (i == destination) ? i + 1 : i ;
        let up = element
        up.position = i

        bulkUpdate.push(up);
    }
    i ++
    });

  }else{
    // On sépare celui qui doit move du reste
    var index = object.findIndex(x => x.id == move_id);
    let movedItem = object[index];
    movedItem.position = destination
    bulkUpdate.push(movedItem);

    // On récupére les autres
    let i = 1;
    object.forEach(element => {
        if(element.id.toString() !== move_id.toString()){
            i = (i == destination) ? i + 1 : i ;
            let up = element
            up.position = i

            bulkUpdate.push(up);
            i ++
        }
    });

  }


  return bulkUpdate
};

module.exports = rearrange;
