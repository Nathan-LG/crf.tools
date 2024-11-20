"use server";

import Twilio from "twilio";

export default async function sendSMS(startAt, endAt, code, phoneNumber) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = Twilio(accountSid, authToken);

  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const firstMessage = await client.messages.create({
    from: messagingServiceSid,
    to: phoneNumber,
    body: "Petit rappel que tu es responsable matériel sur ta mission CRf actuelle. N'oublie pas de noter le matériel utilisé et de le remonter une fois ta mission terminée.\nNous te souhaitons une bonne mission !\n - L'équipe logisitique de Paris 15.",
    scheduleType: "fixed",
    sendAt: startAt.toISOString(),
  });

  const secondMessage = await client.messages.create({
    from: messagingServiceSid,
    to: phoneNumber,
    body:
      "Nous espérons que ta mission s'est bien passée. N'oublie pas de remonter le matériel utilisé sur https://stock.paris15.crf.tools/. Le code de ta mission est : " +
      code +
      ".\n - L'équipe logisitique de Paris 15.",
    scheduleType: "fixed",
    sendAt: endAt.toISOString(),
  });

  const sid = firstMessage.sid;
  const sid2 = secondMessage.sid;

  return { sid, sid2 };
}
