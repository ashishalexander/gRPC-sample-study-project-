const grpc = require('@grpc/grpc-js');
const mygrpc = require('./utils/grpcLoader');

const products = {
  "101": { productId: "101", productName: "Laptop" },
  "102": { productId: "102", productName: "Smartphone" },
};

function getProduct(call, callback) {
  const productId = call.request.productId;
  const product = products[productId];
  if (product) {
    callback(null, product);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Product not found"
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(mygrpc.ProductService.service, { getProduct: getProduct });
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
