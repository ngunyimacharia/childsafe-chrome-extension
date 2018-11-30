let imgLog = []; // Array to store images
let saveImgLimit = 10; //Max no of images before save
let postImgLimit = 100; //Max no of images before post

/*
* Function to perform POST request to server
*/
const postImgs = () => {
  console.log("Perform POST request");
}

/*
* Function to add images to storage
*/
const logImgRq = (imgRq) => {
  imgLog.push(imgRq);
  // console.log(imgLog.length);
  if(imgLog.length < saveImgLimit){
    return;
  }else{
    //create new array
    let childsafe_log = [];
    //add pre-saved images
    chrome.storage.local.get(['childsafe_log'], function(result) {
      childsafe_log = childsafe_log.concat(result.childsafe_log);

      //add new images
      childsafe_log = childsafe_log.concat(imgLog);

      //save
      chrome.storage.local.set({childsafe_log: childsafe_log}, function() {
        console.log("Saved to local storage");
        imgLog = [];
        //Check whether to do POST request
        if(childsafe_log.length > postImgLimit){
          //Do post requests
          postImgs();
        }
      });

    });

  }

}


//Check requests
chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
  //Filter to only image
  if(details.type === "image"){
    var imgRq = {
      timeStamp:details.timeStamp,
      initiator:details.initiator,
      url:details.url
    };
    //Log images in storage
    logImgRq(imgRq);

  }

},
{urls: [ "<all_urls>" ]},['requestHeaders','blocking']);

// chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
//   console.log(details);
//   //console.log(JSON.stringify(details));
//   var headers = details.requestHeaders,
//   blockingResponse = {};
//
//   // Each header parameter is stored in an array. Since Chrome
//   // makes no guarantee about the contents/order of this array,
//   // you'll have to iterate through it to find for the
//   // 'User-Agent' element
//   for( var i = 0, l = headers.length; i < l; ++i ) {
//     if( headers[i].name == 'User-Agent' ) {
//       headers[i].value = '>>> Your new user agent string here <<<';
//       console.log(headers[i].value);
//       break;
//     }
//     // If you want to modify other headers, this is the place to
//     // do it. Either remove the 'break;' statement and add in more
//     // conditionals or use a 'switch' statement on 'headers[i].name'
//   }
//
//   blockingResponse.requestHeaders = headers;
//   return blockingResponse;
// },
// {urls: [ "<all_urls>" ]},['requestHeaders','blocking']);
