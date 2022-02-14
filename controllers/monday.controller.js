exports.challenge = async (req, res) => {
  // Validation
  if (!req.body.challenge) {
    res.status(400).send({
      message: "Challenge mandatory"
    });
    return;
  }

console.log(JSON.stringify(req.body));
    res.status(200).send(req.body);

}
