import {initializeApp} from 'firebase/app'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_APIKEY,
    authDomain: process.env.REACT_APP_FB_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FB_PROJECTID,
    storageBucket: 'react-wegram.appspot.com',
    messagingSenderId: process.env.REACT_APP_FB_MESSAGESENDRID,
    appId: process.env.REACT_APP_FB_APPID
  };

  const app = initializeApp(firebaseConfig)

  const storage = getStorage(app)

  export{
    storage
  }