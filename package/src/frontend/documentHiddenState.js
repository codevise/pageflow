
let isEventAdded = false;
let callbacks = [];

let muteInBackground = () => {  
  callbacks.forEach((cb)=>{    
    cb(document.visibilityState);
  })
};

export function documentHiddenState(callback){
  callbacks.push(callback);

  if (!isEventAdded) {
    isEventAdded = true;
    document.addEventListener('visibilitychange', muteInBackground, false);
  }

  return {
    removeCallback: () => {
      callbacks = callbacks.filter(c => c !== callback);
    }
  }
}
