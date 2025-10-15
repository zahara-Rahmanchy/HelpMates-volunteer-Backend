// import {Server} from "http";
// import app from "./app";
// import moment from "moment";
// const port = 5000;

// async function main() {
//   const server: Server = app.listen(port, () => {
//     console.log("Server running on port: ", port);
//     console.log("Access the server at:", `http://${"localhost"}:${port}`);

//     // Example usage:
//     const localTimeInput = "2024-10-20T14:00:00";
//     const utcTime = moment(localTimeInput)
//       .local()
//       .utc()
//       .format("hh:mm A,\n MM/DD/YYYY");
//     console.log(moment(localTimeInput).utc().toDate());
//     console.log("Local time in UTC: ", utcTime);
//   });
// }
// main();
import { Server as HTTPServer } from "http";
import app from "./app";
import moment from "moment";
import { initSocket } from "./socket";
const port = 5000;

async function main() {
  // ✅ create the raw HTTP server from your express app
  const server = new HTTPServer(app);

  // ✅ initialize socket.io on the same server
  initSocket(server);

  // ✅ start listening
  server.listen(port, () => {
    console.log("Server running on port:", port);

    // example usage
    const localTimeInput = "2024-10-20T14:00:00";
    const utcTime = moment(localTimeInput)
      .local()
      .utc()
      .format("hh:mm A,\n MM/DD/YYYY");
    console.log(moment(localTimeInput).utc().toDate());
    console.log("Local time in UTC: ", utcTime);
  });
}
main();
