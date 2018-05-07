/* 
TO DO:
• add middlewares in options
• add choice for automatic update (dafault true) 
*/

function mongooseAutomaticTimestamp(schema, options) {

    options = options || {};

    var timestampsOnCreate;
    var timestampsOnUpdate;

    if(options.timestampsOnCreate) {
        timestampsOnCreate = new Set(options.timestampsOnCreate);
    }
    else {

        timestampsOnCreate = new Set([
            'createdAt'
        ]);

        if(options.extraTimestampsOnCreate) {

            options.extraTimestampsOnCreate.forEach(function(extraTimestampOnCreate) {
                timestampsOnCreate.add(extraTimestampOnCreate);
            });

        }

    }
    
    if(options.timestampsOnUpdate) {
        timestampsOnUpdate = new Set(options.timestampsOnUpdate);
    }
    else {

        timestampsOnUpdate = new Set([
            'updatedAt'
        ]);

        if(options.extraTimestampsOnUpdate) {

            options.extraTimestampsOnUpdate.forEach(function(extraTimestampOnUpdate) {
                timestampsOnUpdate.add(extraTimestampOnUpdate);
            });

        }

    }

    var aggregate     = (options.aggregate === false) ? false : true;
    var aggregateName = (options.aggregateName && (typeof options.aggregateName === 'string') ) ? options.aggregateName : 'timestamps';

    var fields = {};

    if(aggregate) {
        fields[aggregateName] = {};
    }

    timestampsOnCreate.forEach(function(timestampOnCreate) {
        (aggregate) ? fields[aggregateName][timestampOnCreate] = Date : fields[timestampOnCreate] = Date;
    });

    timestampsOnUpdate.forEach(function(timestampOnUpdate) {
        (aggregate) ? fields[aggregateName][timestampOnUpdate] = Date : fields[timestampOnUpdate] = Date;
    });

    schema.add(fields);

    function preSave(next) {

        var document = this;

        console.log(document);
        
        timestampsOnCreate.forEach(function(timestampOnCreate) {
            (aggregate) ? document[aggregateName][timestampOnCreate] = new Date() : document[timestampOnCreate] = new Date();
        });

        next();

    }

    function preUpdate(next) {

        var document = this._update;
        
        timestampsOnUpdate.forEach(function(timestampOnUpdate) {
            (aggregate) ? document[aggregateName][timestampOnUpdate] = new Date() : document[timestampOnUpdate] = new Date();
        });

        next();

    }

    schema.pre('save', preSave);
    schema.pre('update', preUpdate);
    schema.pre('findOneAndUpdate', preUpdate);

}

module.exports = mongooseAutomaticTimestamp;