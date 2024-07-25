const express = require('express');
const router = express.Router();
const { createLog, getLogs, getLog, updateLog, deleteLog } = require('../func/logbook');

router.post('/log', async (req, res) => {
    try {
       const log =  await createLog(req.body);
        res.status(201).json({message:"Log Created"});
    } catch (error) {
        res.status(500).send(error.message);
    }
}); 

router.get('/logs', async (req, res) => {
    try {
        const logs = await getLogs();
        res.json(logs);
        res.status(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/log/:log_id', async(req, res) => {
    try {
        const log = await getLog(req.params.log_id);
        res.status(200).json(log);
    } catch (error) {
        res.status(500).send(error.message);
    }
   
});

router.put('/log/:log_id',async (req, res) => {
    
    try {
        await updateLog(req.params.log_id, req.body);
        res.status(200).json({message:'Log Updated'});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/log/:log_id', async (req, res) => {
    try {
        await deleteLog(req.params.log_id);
        res.status(200).json({message:'Log Deleted'});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;