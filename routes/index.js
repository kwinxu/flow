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


router.get('/', (req, res) => {
    let dataArr = _.map(require('../data_source/data.json').flowList, (flow) => {
        return { id: flow.id, name: flow.name, desc: flow.desc };
    })
    res.render('index', { flowList: dataArr });
});

router.get('/flow/:id', (req, res) => {
    let id = req.params.id;
    let flow = _.find(require('../data_source/data.json').flowList, (flow) => {
        return flow.id === id;
    })
    res.render('flow', { flow: flow });
});

router.delete('/flow/:id', (req, res) => {
    let id = req.params.id;
    let dataSource = require('../data_source/data.json');
    let index = _.findIndex(dataSource.flowList, (flow) => {
        return flow.id === id;
    });
    dataSource.flowList.splice(index, 1);
    fs.writeFile('./data_source/data.json', JSON.stringify(dataSource), (error) => {
        console.log(error)
        console.log(__dirname)
        delete require.cache[require.resolve('../data_source/data.json')];
        if (error) {
            return res.json({ error_code: -1, message: 'deleted failed.' });
        }
        res.json({ error_code: 0, message: 'deleted successfully.' });
    });
});

module.exports = router;
