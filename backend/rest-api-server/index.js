const express = require('express');
const cors = require('cors')
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto/service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const mygrpc = grpc.loadPackageDefinition(packageDefinition).mygrpc;

const userClient = new mygrpc.UserService('localhost:50051', grpc.credentials.createInsecure());
const productClient = new mygrpc.ProductService('localhost:50052', grpc.credentials.createInsecure());

const app = express();
app.use(express.json());
app.use(cors())

app.get('/api/user/:id', (req, res) => {
    console.log("hi")
  userClient.getUser({ userId: req.params.id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response);
    }
  });
});

app.get('/api/product/:id', (req, res) => {
  productClient.getProduct({ productId: req.params.id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response);
    }
  });
});

app.listen(3001, () => {
  console.log('REST API server running on http://localhost:3001');
});
