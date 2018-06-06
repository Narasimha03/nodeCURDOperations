var express = require("express");
var config = require("../config.json");
var bodyParser = require("body-parser");
var assert = require('assert');

var mongo = require('mongodb').MongoClient;
var autoIncrement = require("mongodb-autoincrement");
var port = 8000;
var router = express.Router();

var url = 'mongodb://' + config.dbhost + ':27017/narasimha';

router.use(function (req, res, next) {
    // do logging
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/school')
    .post(function (req, res, next) {
        var status = 1;

        school = [];
        var item = {
            school_id: 'getauto',
            // section_id: section_id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        };
        mongo.connect(url, function (err, db) {
            autoIncrement.getNextSequence(db, 'school', function (err, autoIndex) {
                var collection = db.collection('school');
                collection.ensureIndex({
                    "school_id": 1,
                }, {
                        unique: true
                    }, function (err, result) {
                        if (item.name == null) {
                            res.end('null');
                        } else {
                            collection.insertOne(item, function (err, result) {
                                if (err) {
                                    if (err.code == 11000) {
                                        console.log(err);
                                        res.end('false');
                                    }
                                    res.end('false');
                                }
                                collection.update({
                                    _id: item._id
                                }, {
                                        $set: {
                                            school_id: 'SCH-' + autoIndex
                                        }
                                    }, function (err, result) {
                                        db.close();
                                        res.end('true');
                                    });
                            });
                        }
                    });
            });
        });
    })
    .get(function (req, res, next) {
        var resultArray = [];
        //var section_id = req.params.section_id;
        mongo.connect(url, function (err, db) {
            assert.equal(null, err);
            var cursor = db.collection('school').find();
            cursor.forEach(function (doc, err) {
                assert.equal(null, err);
                resultArray.push(doc);
            }, function () {
                db.close();
                res.send({
                    school: resultArray
                });
            });
        });
    });


router.route('/edit_school/:school_id')
    .put(function (req, res, next) {
        var myquery = { school_id: req.params.school_id };
        var req_name = req.body.name;
        var req_email = req.body.email;
        var req_phone = req.body.phone;
        var req_address = req.body.address

        mongo.connect(url, function (err, db) {
            db.collection('school').update(myquery, { $set: { name: req_name, email: req_email, phone: req_phone, address: req_address } }, function (err, result) {
                assert.equal(null, err);
                if (err) {
                    res.send('false');
                }
                db.close();
                res.send('true');
            });
        });
    });
router.route('/delete_school/:school_id')
    .delete(function (req, res, next) {
        var myquery = { school_id: req.params.school_id };

        mongo.connect(url, function (err, db) {
            db.collection('school').deleteOne(myquery, function (err, result) {
                assert.equal(null, err);
                if (err) {
                    res.send('false');
                }
                db.close();
                res.send('true');
            });
        });
    });

module.exports = router;