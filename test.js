const tape = require("tape");
const jsonist = require("jsonist");
const fs = require("fs");

const port = (process.env.PORT =
  process.env.PORT || require("get-port-sync")());
const endpoint = `http://localhost:${port}`;

const server = require("./server");

tape("health", async function (t) {
  const url = `${endpoint}/health`;
  jsonist.get(url, (err, body) => {
    if (err) t.error(err);
    t.ok(body.success, "should have successful healthcheck");
    t.end();
  });
});

tape("set student", async function (t) {
  const url = `${endpoint}/test-cases/test-cases`;
  jsonist.put(url, { score: 100 }, {}, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("set student - property already exists", async function (t) {
  const url = `${endpoint}/test-cases/test-cases`;
  jsonist.put(url, {}, {}, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("set student - add new property same file", async function (t) {
  const url = `${endpoint}/test-cases/test-cases-1/test-cases-2/test-cases-3`;
  jsonist.put(url, { score: 50 }, {}, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("get student - file doesn't exist ", async function (t) {
  const url = `${endpoint}/test-cases-fail/test-cases`;
  jsonist.get(url, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("get student - Property doesn't exist ", async function (t) {
  const url = `${endpoint}/test-cases/test-fail`;
  jsonist.get(url, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("get student - success ", async function (t) {
  const url = `${endpoint}/test-cases/test-cases`;
  jsonist.get(url, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("delete student - file doesn't exist ", async function (t) {
  const url = `${endpoint}/test-cases-fail/test-cases`;
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("delete student - Property doesn't exist ", async function (t) {
  const url = `${endpoint}/test-cases/test-cases-fail`;
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("delete student - success ", async function (t) {
  const url = `${endpoint}/test-cases/test-cases`;
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err);
    t.ok(body.message, body.message);
    t.end();
  });
});

tape("cleanup", function (t) {
  server.close();
  fs.unlinkSync("data/test-cases.json");
  t.end();
});
