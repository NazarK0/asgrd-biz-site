
const postSendMail = async (req, res) => {
  const { recepientMail } = req.body;
  
  try {
    await sendEmail('Name', recepientMail);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error when try to send message' });
  }
}

module.exports = {
  postSendMail,
}
