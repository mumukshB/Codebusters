
// Bookmarks Bar

chrome.runtime.onMessage.addListener(function(request){
});
function createBookmark(){
  chrome.bookmarks.getChildren('1',function(children){
    var folderId;
    for(folder of children){
      if(folder.title=='Unsolved Problems')
      {
        folderId=folder.id;
        break;
      }
    }

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        chrome.bookmarks.create({
        'parentId':folderId,
        'title':tabs[0].title,
        'url':tabs[0].url
      });
    });
  })
}




chrome.storage.sync.get(['count'],function(result){
  var x=document.querySelector('.sol');
  x.innerHTML=result.count;
});


document.querySelector('#check').addEventListener('change',function(){
  if(this.checked)
  {
    createBookmark();
  }
})



//alarms

function setAlarm(){
  chrome.browserAction.setBadgeText({text:'ON'});
  chrome.alarms.create({delayInMinutes:15});
}

document.querySelector('#set').addEventListener('click',setAlarm);

document.querySelector('#reset').addEventListener('click',function(){
  chrome.browserAction.setBadgeText({'text':''});
  chrome.alarms.clearAll();
});

function problemSolved(){
  chrome.browserAction.setBadgeText({'text':''});
  chrome.alarms.clearAll();
  chrome.storage.sync.get('count',function(result){
  chrome.storage.sync.set({count: result.count+1});
  var x=document.querySelector('.sol');
  x.innerHTML=result.count+1;
  });
}
document.querySelector('#complete').addEventListener('click',problemSolved);

//Links to coding platforms

document.querySelector('#hackerrank').addEventListener('click',function(){
  window.open("https://www.hackerrank.com");
})

document.querySelector('#codeforces').addEventListener('click',function(){
  window.open("https://www.codeforces.com");
})

document.querySelector('#hackerearth').addEventListener('click',function(){
  window.open("https://www.hackerearth.com");
})

document.querySelector('#topcoder').addEventListener('click',function(){
  window.open("https://www.topcoder.com");
})

//Google Search

var search=document.querySelector('#query');
search.addEventListener('keydown',(event)=>{
  if(event.key == 'Enter' && search.value!=""){
    var win = window.open("https://www.google.com/search?q=" + search.value.replace(' ', '+'), '_blank');
    win.focus();
  }
});

chrome.alarms.onAlarm.addListener(function(){
  chrome.browserAction.setBadgeText({text:''});
  chrome.notifications.create({
    type:'basic',
    iconUrl:'images/zero.png',
    title:'Time Over!',
    message:'Did you solve the problem?',
    buttons:[
      {title:'Yes'},
      {title:'No,extend timer'}
    ],
    priority:0});
  });

  chrome.notifications.onButtonClicked.addListener(function test(notificationId,buttonIndex){
       if(buttonIndex==0)
       problemSolved();
       else{
         setAlarm();
       }
  });
