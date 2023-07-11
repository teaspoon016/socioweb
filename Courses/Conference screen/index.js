// Getting Elements from DOM
const joinButton = document.querySelector(".joinBtn");
const createButton = document.querySelector(".createMeetingBtn");
const conference =document.querySelectorAll(".conference");
const dialog = document.querySelector(".Dialog");
const form =document.querySelector(".infoDiv");
const input = document.querySelector(".meetingIdTxt")
//show conference call modal
function showModal(){
  console.log("wait")
  dialog.setAttribute("open",true);
  dialog.setAttribute("class","modalOpen")
  document.body.style.overflowY="hidden"
}
dialog.addEventListener("click",()=>{
  dialog.removeAttribute("class","modalOpen")
  document.body.style.overflowY="auto"
})
form.addEventListener("click",(e)=>{
  e.stopPropagation()
})
conference.forEach((button)=>{
  button.addEventListener("click",showModal)
})

// Join Meeting Button Event Listener
joinButton.addEventListener("click", joinMeeting);
input.addEventListener("keypress",(event)=>{
  roomId=input.value;
  if(event.keyCode===13 && roomId.length>1){
  localStorage.setItem("meetingId", roomId);
  location.href='/Courses/Conference screen/joinMeeting.html'
}
})

function joinMeeting(){
  roomId=input.value
  localStorage.setItem("meetingId", roomId);
  location.href='/Courses/Conference screen/joinMeeting.html'
}

createButton.addEventListener("click",()=>{
  location.href='/Courses/Conference screen/NewMeeting.html'
})