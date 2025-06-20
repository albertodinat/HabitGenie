export async function sendPushNotification(token: string, title: string, message: string) {
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        title,
        body: message
      })
    });
  } catch (e) {
    console.error('Push notification error', e);
  }
}
