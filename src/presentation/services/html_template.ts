export const createHTMLValdationEmailTemplate = (
  link: string,
  email: string
) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Validation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #5D9CEC;
        }
        p {
            font-size: 16px;
        }
        a {
            display: inline-block;
            background-color: #5D9CEC;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        a:hover {
            background-color: #4a8ed4;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Validate your email</h1>
        <p>Thank you for signing up! To complete your registration, please click the link below to validate your email address.</p>
        <p>If you did not request this email, please ignore it.</p>
        <a href="${link}">Validate your email: ${email}</a>
        <p>Regards,<br>Yamil Aguilar</p>
    </div>
</body>
</html>
`;
  return html;
};
