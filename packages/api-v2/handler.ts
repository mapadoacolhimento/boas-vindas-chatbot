"use strict";

module.exports.chat = (event, context, callback) => {
  // const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  // if (typeof data.text !== "string") {
  //   console.error("Validation Failed");
  //   callback(new Error("Couldn't create the todo item."));
  //   return;
  // }

  const response = {
    statusCode: 200,
    body: JSON.stringify(data),
  };

  callback(null, response);
};
