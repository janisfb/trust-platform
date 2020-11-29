module.exports = {
  register (req, res) {
    res.send({
      message: `Register: ${req.body.email}!`
    })
  }
}
