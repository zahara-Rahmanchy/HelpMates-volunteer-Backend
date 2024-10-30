import {Server} from "http";
import app from "./app";
import moment from "moment";
const port = 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log("Server running on port: ", port);
    console.log("Access the server at:", `http://${"localhost"}:${port}`);

    // Example usage:
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
