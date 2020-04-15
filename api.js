const fs = require("fs");
async = require("async");

module.exports = {
  getHealth,
  setStudent,
  getStudent,
  deleteStudent,
};

async function getHealth(req, res, next) {
  res.json({ success: true });
}

async function setStudent(req, res, next) {
  async.waterfall(
    [
      function (nextCall) {
        nextCall(null, req);
      },
      function (req, nextCall) {
        var studentId = req.params.studentId;
        var propertyName = req.params.propertyName.split("/");
        var body = req.body;

        let obj = {};
        fs.exists("data/" + studentId + ".json", function (exists) {
          if (exists) {
            fs.readFile(
              "data/" + studentId + ".json",
              function readFileCallback(err, data) {
                if (err) {
                  nextCall(err);
                } else {
                  obj = JSON.parse(data);

                  let newObj = {};
                  propertyName.reverse().forEach(function (el) {
                    if (Object.keys(newObj).length == 0) {
                      newObj[el] = body;
                    } else {
                      var outer = {};
                      outer[el] = newObj;
                      newObj = outer;
                    }
                  });

                  if (
                    JSON.stringify(obj).toLowerCase() ===
                    JSON.stringify(newObj).toLowerCase()
                  ) {
                    return nextCall({
                      code: 409,
                      message: "Property already exists",
                    });
                  } else {
                    fs.writeFile(
                      "data/" + studentId + ".json",
                      JSON.stringify(Object.assign(obj, newObj)),
                      "utf8",
                      function (err) {
                        if (err) {
                          nextCall(err);
                        } else {
                          nextCall(null);
                        }
                      }
                    );
                  }
                }
              }
            );
          } else {
            propertyName.reverse().forEach(function (el) {
              if (Object.keys(obj).length == 0) {
                obj[el] = body;
              } else {
                var outer = {};
                outer[el] = obj;
                obj = outer;
              }
            });

            fs.writeFile(
              "data/" + studentId + ".json",
              JSON.stringify(obj),
              "utf8",
              function (err) {
                if (err) {
                  nextCall(err);
                } else {
                  nextCall(null);
                }
              }
            );
          }
        });
      },
    ],
    function (err, response) {
      if (err) {
        return res.json({
          status_code: err.code ? err.code : 400,
          message: (err && err.message) || "Something went wrong",
          data: {},
        });
      }
      return res.json({
        status_code: 200,
        message: "success",
        data: response,
      });
    }
  );
}

async function getStudent(req, res, next) {
  async.waterfall(
    [
      function (nextCall) {
        nextCall(null, req.params);
      },
      function (params, nextCall) {
        var studentId = params.studentId;
        var propertyName = req.params.propertyName.split("/");
        let obj = {};
        fs.exists("data/" + studentId + ".json", function (exists) {
          if (exists) {
            fs.readFile(
              "data/" + studentId + ".json",
              function readFileCallback(err, data) {
                if (err) {
                  nextCall(err);
                } else {
                  obj = JSON.parse(data);

                  if (Object.keys(obj).length === 0) {
                    return nextCall({
                      code: 404,
                      message: "Property doesn't exist",
                    });
                  } else {
                    propertyName.forEach(function (el) {
                      obj = obj[el];
                    });

                    if (obj === undefined || obj === null) {
                      return nextCall({
                        code: 404,
                        message: "Property doesn't exist",
                      });
                    } else {
                      nextCall(null, obj);
                    }
                  }
                }
              }
            );
          } else {
            return nextCall({
              code: 404,
              message: "File doesn't exist",
            });
          }
        });
      },
    ],
    function (err, response) {
      if (err) {
        return res.json({
          status_code: err.code ? err.code : 400,
          message: (err && err.message) || "Something went wrong",
          data: {},
        });
      }
      return res.json({
        status_code: 200,
        message: "success",
        data: response,
      });
    }
  );
}

async function deleteStudent(req, res, next) {
  async.waterfall(
    [
      function (nextCall) {
        nextCall(null, req.params);
      },
      function (params, nextCall) {
        var studentId = params.studentId;
        var propertyName = params.propertyName.split("/").join(".");
        let obj = {};
        fs.exists("data/" + studentId + ".json", function (exists) {
          if (exists) {
            fs.readFile(
              "data/" + studentId + ".json",
              function readFileCallback(err, data) {
                if (err) {
                  nextCall(err);
                } else {
                  obj = JSON.parse(data);

                  if (Object.keys(obj).length === 0) {
                    return nextCall({
                      code: 404,
                      message: "Property doesn't exist",
                    });
                  } else {
                    if (deletePropertyPath(obj, propertyName)) {
                      fs.writeFile(
                        "data/" + studentId + ".json",
                        JSON.stringify(obj),
                        "utf8",
                        function (err) {
                          if (err) {
                            nextCall(err);
                          } else {
                            nextCall(null);
                          }
                        }
                      );
                    } else {
                      return nextCall({
                        code: 404,
                        message: "Property doesn't exist",
                      });
                    }
                  }
                }
              }
            );
          } else {
            return nextCall({
              code: 404,
              message: "File doesn't exist",
            });
          }
        });
      },
    ],
    function (err, response) {
      if (err) {
        return res.json({
          status_code: err.code ? err.code : 400,
          message: (err && err.message) || "Something went wrong",
          data: {},
        });
      }
      return res.json({
        status_code: 200,
        message: "success",
        data: response,
      });
    }
  );
}

function deletePropertyPath(obj, path) {
  if (!obj || !path) {
    return false;
  }

  if (typeof path === "string") {
    path = path.split(".");
  }

  for (var i = 0; i < path.length - 1; i++) {
    obj = obj[path[i]];

    if (typeof obj === "undefined") {
      return false;
    }
  }

  return delete obj[path.pop()];
}
