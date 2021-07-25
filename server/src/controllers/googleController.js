const { sendMail } = require('../helperFunctions/gmail');

const postSendMail = async (req, res) => {
  const { recepientMail } = req.body;
  
  try {
    await sendMail('staticman999@gmail.com', 'staticman999@gmail.com')
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error when try to send message' });
  }
}

module.exports = {
  postSendMail,
}
