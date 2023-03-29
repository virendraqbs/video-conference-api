const { db } = require("../db/db");

exports.getContent = (req, res) => {
  // res.json({ data: "content" });
  let q = req.query.q
    ? "SELECT * FROM content WHERE q like '%?%'"
    : "SELECT * FROM content";

  db.query(q, [req.query.q], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

exports.createContent = (req, res) => {
  const { result, date, title } = req.body;
  const q = "INSERT INTO content(`result`,`date`, `title`) VALUES (?)";
  const values = [result, date, title];
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json({ result, date, message: "Content has been saved." });
  });
};
