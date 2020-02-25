const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Technology } = require('../model');
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname,'/../public')));
server.use(cors());

server.get('/api/technologies', async (req, res) => {
    let technologies = await Technology.find();
    technologies = technologies.map( (technology) => {
        technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;
        return technology;
    });

    return res.send({ error: false, data: technologies });
});

server.get('/api/technology/:id', async (req, res) => {
    const { id } = req.params;
    let technology = await Technology.findById(id);
    technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;
    
    return res.send({ error: false, data: technology });
});

server.get('/api/technology/search/:name', async (req, res) => {
    const { name } = req.params;
    let technologies = await Technology.find({ name: { $regex: new RegExp(name, 'i')}});
    technologies = technologies.map( (technology) => {
        technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;
        return technology;
    });

    return res.send({ error: false, data: technologies });
});

module.exports = server;