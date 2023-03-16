'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const network = require('./fabric/network');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    console.log('GET called');
    res.send('Hello world!');
});

app.get('/getProduct', network.connectToNetwork, async (req, res) => {
    try{
        const contract = req.contract;
        const productId = req.query.id.toString();
        
        const result = await contract.evaluateTransaction('getProduct', productId);
        const response = JSON.parse(result.toString());
        console.log(response);
        res.json({ result: response });
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.post('/createProduct', network.connectToNetwork, async (req, res) => {
    try{
        const contract = req.contract;
        const productJson = JSON.stringify(req.body);

        console.log(productJson);

        const result = await contract.submitTransaction('createProduct', productJson);
        console.log(result.toString());
        res.json( {result: result} );
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.get('/getProductWithHistory', network.connectToNetwork, async (req, res) => {
    try{
        const contract = req.contract;
        const productId = req.query.id.toString();

        console.log("productId", productId)
        
        const result = await contract.evaluateTransaction('getProductWithHistory', productId);
        console.log("result: ",result);
        const response = JSON.parse(result.toString());
        console.log(response);
        res.json({ result: response });
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.get('/productExists', network.connectToNetwork, async (req, res) => {
    try{
        const contract = req.contract;
        const productId = req.query.id.toString();
        console.log(productId);

        const result = await contract.evaluateTransaction('productExists', productId);
        console.log(result.toString());
        res.json({ exists: result.toString() });
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.post('/shipProduct', network.connectToNetwork, async (req, res) => {
    console.log(req.body);
    try{
        const contract = req.contract;
        const shipDetails = req.body;
        shipDetails.arrivalDate = "2023-03-20T18:25:43.511Z"
        // const productId = req.query.id.toString();

        //Modal of shipDetails
        // shipDetails = {
        //     productId,
        //     newLocation,
        //     arrivalDate
        // };

        console.log("error b4")

        const result = await contract.submitTransaction('shipProductTo', 
            shipDetails.id, 
            shipDetails.locationData.current.location,
            shipDetails.arrivalDate);

            // shipDetails.arrivalDate
        console.log("error after")
        
        console.log("result done",result);
        res.json({ status: 'Transaction submitted.', txId: result.toString()});
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.listen(3003, () => {
    console.log('Listening on port 3003');
});