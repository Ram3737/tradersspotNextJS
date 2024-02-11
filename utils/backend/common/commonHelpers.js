const nodemailer = require("nodemailer");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
  service: "gmail", // use your email service provider
  auth: {
    user: "tradersspot.in@gmail.com", // replace with your email
    pass: "mywu lutg khan bwil", // replace with your email password
  },
});

const getMonthName = (monthIndex) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthIndex];
};

export { generateOTP, transporter, getMonthName };
