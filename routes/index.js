/**
 *@author xyx   <kwin.xu@semioe.com>
 *        date: 2016.12.30
 *@description 
 */
/* jshint ignore: start */
'use strict';
/* jshint ignore: end   */


const express = require('express');
const router = express.Router();
const fs = require('fs');
const _ = require('lodash');


router.get('/', clearCache, (req, res) => {
    let dataArr = _.map(require('../data_source/data.json').flowList, (flow) => {
        return { id: flow.id, name: flow.name, desc: flow.desc };
    })
    res.render('index', { flowList: dataArr });
});

router.get('/flow_page', clearCache, (req, res) => {
    let id = req.query.id;
    let dataSource = require('../data_source/data.json');
    if (!id) {
        id = require('uuid/v1')();
        let name = req.query.name;
        let flow = {
            id: id,
            name: name,
            desc: '',
            content: require('../data_source/data.json').default
        };
        dataSource.flowList.push(flow)
    }
    updateJSONFile(dataSource, (error) => {
        console.log(error);
        res.render('flow', { id: id });
    });
});

router.get('/flow/:id', clearCache, (req, res) => {
    let id = req.params.id;
    let flow = _.find(require('../data_source/data.json').flowList, (flow) => {
        return flow.id === id;
    });
    res.json({ error_code: 0, message: 'getting successfully.', result: flow });
});

router.delete('/flow/:id', clearCache, (req, res) => {
    let id = req.params.id;
    let dataSource = require('../data_source/data.json');
    let index = _.findIndex(dataSource.flowList, (flow) => {
        return flow.id === id;
    });
    dataSource.flowList.splice(index, 1);
    updateJSONFile(dataSource, (error) => {
        if (error) {
            return res.json({ error_code: -1, message: 'deleted failed.' });
        }
        res.json({ error_code: 0, message: 'deleted successfully.' });
    })
});

router.put('/flow/:id', clearCache, (req, res) => {
    let flow = req.body;
    console.log(JSON.stringify(flow))
    let dataSource = require('../data_source/data.json');
    let index = _.findIndex(dataSource.flowList, (flow) => {
        return flow.id === req.params.id;
    });
    dataSource.flowList[index] = flow;
    res.json({ error_code: 0, message: 'updated successfully.' });
});

router.post('/flow', clearCache, (req, res) => {
    let dataSource = require('../data_source/data.json');
    let name = req.query.name;
    id = require('uuid/v1')();
    let flow = {
        id: id,
        name: name,
        desc: '',
        content: dataSource.default
    };
    dataSource.flowList.push(flow);
    updateJSONFile(dataSource, (error) => {
        res.json({ error_code: 0, message: 'save successfully.', result: { id: id } });
    });
});


function updateJSONFile(flowList, callback) {   // jshint ignore:line
    fs.writeFile('./data_source/data.json', JSON.stringify(flowList), (error) => {
        callback(error);
    });
}

function clearCache(req, res, next) {   // jshint ignore:line
    delete require.cache[require.resolve('../data_source/data.json')];
    next();
}


module.exports = router;