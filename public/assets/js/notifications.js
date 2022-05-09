const requestNotificationsPermissions = async () => {
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    await configurePushSub();
  }
}

const configurePushSub = async () => {
  if ('serviceWorker' in navigator) {
    const sw = await navigator.serviceWorker.ready;
    const subscription = await sw.pushManager.getSubscription();
    if (!subscription) {
      const vapidPublicKey = 'BIHTZ95HuXEQQfwWdU3cM4MlsankykMFwpoFwATDZFFwB62bg2LInK8t8e_VcGdXCdFeSvqxtaaenqP5v8ZmCgc';
      const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
      const newSubscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidPublicKey,
      });
      const id = new Date().toISOString();
      await fetch('https://igpwa-3d0a9-default-rtdb.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubscription),
      })
    }
  }
}
