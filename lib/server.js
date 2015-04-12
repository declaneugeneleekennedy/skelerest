
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var factory         = require('./factory');
var mongoose        = require('mongoose');

mongoose.connect('need to setup db');

app.use(bodyParser.urlencode({ extended: true }));
app.use(bodyParser.json());

var api = express.Router();

api.param('model', function(req, res, next, name) {
    if(!factory.exists(name)) {
        next(new Error('Model not found'));
    }

    req.model = new (factory.get(name));
    next();
});

api.param('model_id', function(req, res, next, id) {
    if(!req.model) {
        next();
    }

    req.model.get(id).then(function(entity) {
        req.entity = entity;
        next();
    });
});

api.route('/:model')

    .get(function(req, res) {
        req.model.get().then(function(models) {
            res.json(models);
        });
    })

    .post(function(req, res) {
        req.model.save(req.body).then(function(model) {
            res.json(model);
        }, function(err) {
            res.json(err);
        });
    });

api.route('/:model/:model_id')

    .get(function(req, res) {
        res.json(req.entity);
    })

    .put(function(req, res, next) {
        req.model.update(req.entity, req.body).then(function(updated) {
            res.json(updated);
        }, function(err) {
            next(err);
        });
    })

    .delete('/:model/:model_id', function(req, res, next) {
        req.model.delete(req.entity).then(function() {
            res.writeHead(200);
            res.send();
        }, function(err) {
            next(err);
        });
    });

api.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send();
});

app.use('/api', api);

module.exports = app;
