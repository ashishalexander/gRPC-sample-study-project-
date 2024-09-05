const grpc = require('@grpc/grpc-js');
const mygrpc = require('./util/grpcLoader');

const users = {
  "1": { userId: "1", userName: "John Doe" },
  "2": { userId: "2", userName: "Jane Doe" },
};

function getUser(call, callback) {
  const userId = call.request.userId;
  const user = users[userId];
  if (user) {
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "User not found"
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(mygrpc.UserService.service, { getUser: getUser });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
