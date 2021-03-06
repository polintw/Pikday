const nodemailer = require("nodemailer");
const winston = require('../../../config/winston.js');
const {
  smtpAccount,
  domain
} = require('../../../config/services.js');

function deliverVerifiedMail(userInfo, token){
  return new Promise((resolve, reject)=>{
    let transporter = nodemailer.createTransport({
      service: "Mailjet",
      auth: {
        user: smtpAccount.user,
        pass: smtpAccount.password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Piksight" <noreply@'+ domain.name +'>', // sender address
      to: userInfo.email, // list of receivers
      subject: "Email verification", // Subject line, notice! for unknown reason, subject "Please confirm your email address" would be blocked by mailjet so abandon
      html: _render_HtmlBody(token, userInfo)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject({status: 500, err: 'There was an error '+error});
      else{
        winston.info('Address verification %s sent: %s', info.messageId, info.response);
        resolve();
      }
    });
  })
}

const _render_HtmlBody = (token, userInfo)=>{
  return (
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0001, minimum-scale=1.0001, maximum-scale=1.0001, user-scalable=no"> <!--[if !mso]><!--> <meta http-equiv="X-UA-Compatible" content="IE=Edge"> <!--<![endif]--> <style type="text/css"> html { font-family: "Lato", "Noto Sans TC", "微軟正黑體", "Helvetica Neue", Helvetica, Futura, sans-serif, Arial; } body { margin: 0; width: 100%; } .mailMain { width: 100%; box-sizing: border-box; padding: 12.5px 5%; } .plainLinkButton { text-decoration: none; color: inherit; } .boxFooter { width: 100%; box-sizing: border-box; text-align: center; background-color: rgb(117,117,117); margin-bottom: 16px; } .boxServiceLink { padding: 10px; white-space: nowrap; } .boxLogo { display: inline-block; width: 100px; min-width: 12vw; box-sizing: border-box; cursor: pointer; } .boxLogoReverse { display: inline-block; width: 160px; max-width: 63vw; min-width: 136.6px; box-sizing: border-box; margin: 0 40% 37.625px; text-align: center; cursor: pointer; } .mailBoxContent { width: 100%; box-sizing: border-box; padding: 12.5px 5.5%; text-align: right; } .mailBoxContentGreet { padding-bottom: 40px; margin: 0; } .mailBoxContentTail { box-sizing: border-box; padding: 30px 0; } .mailBoxContentTail div { margin-bottom: 20px; } .tagServiceLink { display: inline-block; box-sizing: border-box; margin-bottom: 1px; } .fontTitleSmall { font-size: 12px; line-height: 1.5; } .fontSubtitle { font-size: 16px; } .fontSubmit { font-size: 24px; } .fontContent { font-size: 14px; line-height: 1.5; } .fontServiceLink { font-size: 12px; font-weight: bold; } .colorStandard { color: #ff8168; } .colorLightStandard { color: #fff8f7; } .colorGrey { color: #a3a3a3; } .colorEditLightBlack { color: #757575; } .colorEditBlack { color: #545454; } .colorDescripBlack { color: #444444; } </style> </head> <body><div class="mailMain"> <div style="border:solid 1px #ff8168; width: 90%; margin: 31.25px 5% 12.5px;"></div> <div class="mailBoxContent"> <a href="https://' +
    domain.name+
    '/" target="_blank" class="boxLogo plainLinkButton"> <!-- <SvgLogo/> --> <img src="https://'+
    domain.name+
    '/png/Logo.png" style= "height:auto; width: 100%; position:relative; box-sizing: border-box; "> </a> </div> <div class="mailBoxContent" style="text-align: left; min-height: 60vh; padding-bottom: 31.25px;"> <div class="colorEditBlack fontSubtitle"> <h2 class="mailBoxContentGreet fontSubmit" style="font-weight: 700;"> Welcome, '+
    userInfo.first_name +
    '. </h2> <p> We are glad to have you here on Piksight.<br/> This is the <strong>last step for the registration.</strong> </p> <p> Please <a href="https://'+
    domain.name+ '/router/register/mail/confirm?token='+token +
    '">click here</a> <span> today<br/> verifying your email address to complete your registration.</span> </p> <p style="padding: 30px 0;"> Enjoy your adventure, and nice to meet you! </p> </div> <div class="mailBoxContentTail"> <div> <span class="colorEditLightBlack fontContent"> Best Wishes,</span> </div> <div> <span class="colorEditLightBlack fontContent"> Piksight Team</span> </div> </div> </div> <div class="boxFooter"> <a href="https://' +
    domain.name+
    '/" target="_blank" class="boxLogoReverse plainLinkButton" style="margin-top: 20px; text-align: center;"> <!-- <SvgLogo/> --> <img src="https://'+
    domain.name+
    '/png/Logo_reverse.png" style= "height:auto; width: 100%; position:relative; box-sizing: border-box; "> </a> <div class="boxFooter"> <!--class="boxServiceLink">--> <!-- <ServiceLinks/> --> <div class="boxServiceLink"> <a href="https://'+
    domain.name +
    '/a/about" method="about" style="color:white" class="plainLinkButton tagServiceLink fontServiceLink colorLightStandard"> About</a> <span class="tagServiceLink fontServiceLink colorGrey">．</span> <a href="https://' +
    domain.name+
    '/a/privacy" method="privacy" style="color:white" class="plainLinkButton tagServiceLink fontServiceLink colorLightStandard"> Privacy</a> <span class="tagServiceLink fontServiceLink colorGrey">．</span> <a href="https://' +
    domain.name+
    '/a/terms" method="terms" style="color:white" class="plainLinkButton tagServiceLink fontServiceLink colorLightStandard"> Terms</a> <span class="tagServiceLink fontServiceLink colorGrey">．</span> <a href="https://'+
    domain.name +
    '/a/contact" method="contact" style="color:white" class="plainLinkButton tagServiceLink fontServiceLink colorLightStandard"> Contact</a> </div> <div class="boxServiceLink fontTitleSmall colorGrey"> <span>Cornerth., Inc. </span> <span>All Rights Reserved.</span> </div> </div> </div> </div></body></html>'
  )
}

module.exports = deliverVerifiedMail;
