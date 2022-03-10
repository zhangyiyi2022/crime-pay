const mongojs = require('mongojs');

module.exports = class Controller {

    constructor(entityName) {
        this.dataAccess = require('../db/db')[entityName];
        this.promiseHandler = (resolve, reject) => {
            return (err, data) => {
                return err ? reject(err) : resolve(data);
            }
        }
    }

    findById(_id) {
        return new Promise((resolve, reject) => {
            this.dataAccess.findOne({
                _id: mongojs.ObjectId(_id)
            }, this.promiseHandler(resolve, reject));
        });
    }

    findByIds(_ids) {
        return this.findByQuery({
            _id: { $in: _ids.map((e) => mongojs.ObjectId(e)) }
        });
    }

    findByQuery(query) {
        return new Promise((resolve, reject) => {
            this.dataAccess.find(query, this.promiseHandler(resolve, reject));
        });
    }

    all() {
        return this.findByQuery({});
    }

    modify(_id, data) {
        return new Promise((resolve, reject) => {
            this.dataAccess.findAndModify({
                query: { _id: mongojs.ObjectId(_id) },
                update: { ...data },
                new: true
            }, this.promiseHandler(resolve, reject));
        });
    }

    update(query, data, multi) {
        return new Promise((resolve, reject) => {
            this.dataAccess.update(
                query,
                data,
                { multi: multi }
                , this.promiseHandler(resolve, reject));
        });
    }

    save(instance) {
        return new Promise((resolve, reject) => {
            this.dataAccess.save(instance, this.promiseHandler(resolve, reject));
        });
    }

}

