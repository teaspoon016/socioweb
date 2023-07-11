const joinButton = document.querySelector(".joinBtn");
const leaveButton = document.querySelector(".leaveBtn");
const toggleMicButton = document.querySelector(".toggleMicBtn");
const micImage=document.querySelector(".toggleMicBtn img");
const videoImg= document.querySelector(".toggleWebCamBtn img")
const toggleWebCamButton = document.querySelector(".toggleWebCamBtn");
const createButton = document.querySelector(".createMeetingBtn");
const videoContainer = document.querySelector(".videoContainer");
const textDiv = document.querySelector(".textDiv");
const infoDiv = document.querySelector(".infoDiv");
const navbar = document.querySelector("nav");
const sticky = navbar.offsetTop;


// Declare Variables
let meeting = null;
let meetingId = "";
let isMicOn = false;
let isWebCamOn = false;

function initializeMeeting() {}

function createLocalParticipant() {}

function createVideoElement() {}

function createAudioElement() {}

function setTrack() {}
async function createNewMeeting() {
  textDiv.setAttribute("class", "loading");
  textDiv.textContent = "Please wait, we are joining the meeting.....";

  // API call to create meeting
  const url = `https://api.videosdk.live/v2/rooms`;
  const options = {
    method: "POST",
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3MGUzYWI1Zi1mOWI1LTQ4NDMtODhkMS1kYzhmZTI3N2E2ZDkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4Nzc5MjYwOCwiZXhwIjoxODQ1NTgwNjA4fQ.szscvJ6EoXroARfOnnoaUDvckTiGsg4OpCmKyG796SI",
      "Content-Type": "application/json",
    },
  };

  const { roomId } = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => alert("error", error));
  meetingId = roomId;

  initializeMeeting();
}
createNewMeeting();

function initializeMeeting() {
  window.VideoSDK.config(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3MGUzYWI1Zi1mOWI1LTQ4NDMtODhkMS1kYzhmZTI3N2E2ZDkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4Nzc5MjYwOCwiZXhwIjoxODQ1NTgwNjA4fQ.szscvJ6EoXroARfOnnoaUDvckTiGsg4OpCmKyG796SI"
  );
    meeting = window.VideoSDK.initMeeting({
    meetingId: meetingId, // required
    name: "Edison", // required
    micEnabled: true, // optional, default: true
    webcamEnabled: true, // optional, default: true
  });

  meeting.join();

  // Creating local participant
  createLocalParticipant();

  function setTrack(stream, audioElement, participant, isLocal) {
    if (stream.kind === "video") {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(stream.track);
      const videoElm = document.getElementById(`v-${participant.id}`);
      videoElm.srcObject = mediaStream;
      videoElm
        .play()
        .catch((error) =>
          console.error("videoElem.current.play() failed", error)
        );
    }
    if (stream.kind === "audio") {
      if (isLocal) {
        isMicOn = true;
      } else {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(stream.track);
        audioElement.srcObject = mediaStream;
        audioElement
          .play()
          .catch((error) => console.error("audioElem.play() failed", error));
      }
    }
  }
  // Setting local participant stream
  meeting.localParticipant.on("stream-enabled", (stream) => {
    setTrack(stream, null, meeting.localParticipant, true);
  });

  // meeting joined event
  meeting.on("meeting-joined", () => {
    textDiv.style.display = "none";
    document.querySelector(".grid-screen").style.display = "block";
    document.querySelector(
      ".meetingIdHeading"
    ).textContent = `Meeting Id: ${meetingId}`;
  });

  // meeting left event
  meeting.on("meeting-left", () => {
    videoContainer.innerHTML = "";
  });

  // Remote participants Event
  // participant joined
  // ...

  let myVideoArray = []; // Array to store your video element
  let streamerVideoArray = []; // Array to store video elements of other streamers

  // ...

  // Update video layout
  function updateVideoLayout() {
    if (myVideoArray.length > 0) {
      // Make the first participant's video the biggest
      participants[0].setAttribute("class", "video-frame");
    }

    if (streamerVideoArray.length > 0) {
      // Make the rest of the participants' videos smaller
      const width = 30 / streamerVideoArray.length;

      for (let i = 0; i < streamerVideoArray.length; i++) {
        streamerVideoArray[i].setAttribute("class", "video-frame");
      }
    }
  }

  // ...

  // Add click event listeners to swap videos
  for (let i = 0; i < streamerVideoArray.length; i++) {
    streamerVideoArray[i].addEventListener("click", () => {
      // Swap videos between myVideoArray and streamerVideoArray
      const clickedVideo = streamerVideoArray[i];

      if (myVideoArray.length > 0) {
        const myVideo = myVideoArray[0];

        // Remove active class from the previous active video (my video)
        myVideo.classList.remove("active");

        // Move my video from myVideoArray to streamerVideoArray
        myVideoArray = [];

        // Add active class to the clicked video (streamer's video)
        clickedVideo.classList.add("active");

        // Move the clicked video from streamerVideoArray to myVideoArray
        streamerVideoArray.splice(i, 1);
        myVideoArray.push(clickedVideo);

        // Swap videos in the DOM
        videoContainer.insertBefore(clickedVideo, myVideo);
        videoContainer.insertBefore(myVideo, streamerVideoArray[i]);

        // Update video layout
        updateVideoLayout();
      }
    });
  }

  
  // Remote participants Event
  // participant joined
  meeting.on("participant-joined", (participant) => {
    let videoElement = createVideoElement(
      participant.id,
      participant.displayName
    );
    let audioElement = createAudioElement(participant.id);
    // stream-enabled
    participant.on("stream-enabled", (stream) => {
      setTrack(stream, audioElement, participant, false);
    });

    let participantDiv = document.querySelector(".participantDiv");
    if (!participantDiv) {
      participantDiv = document.createElement("div");
      participantDiv.classList.add("participantDiv");
      videoContainer.appendChild(participantDiv);
    }

    participantDiv.appendChild(videoElement);
    participantDiv.appendChild(audioElement);

    // Update video layout when a participant is added
    updateVideoLayout();
  });

  meeting.on("participant-left", (participant) => {
    let vElement = document.getElementById(`f-${participant.id}`);
    vElement.remove();

    let aElement = document.getElementById(`a-${participant.id}`);
    aElement.remove();

    // Update video layout when a participant is removed
    updateVideoLayout();
  });

  // ...

  // creating local participant
  function createLocalParticipant() {
    let localParticipant = createVideoElement(
      meeting.localParticipant.id,
      meeting.localParticipant.displayName
    );
    videoContainer.appendChild(localParticipant);
  }

  // creating video element
  function createVideoElement(pId, name) {
    let videoFrame = document.createElement("div");
    videoFrame.setAttribute("id", `f-${pId}`);
    videoFrame.classList.add("video-frame");

    // create video
    let videoElement = document.createElement("video");
    videoElement.setAttribute("id", `v-${pId}`);
    videoElement.autoplay = true;
    videoFrame.appendChild(videoElement);

    let displayName = document.createElement("div");
    displayName.setAttribute("class", "displayName");
    displayName.innerHTML = name;
    videoFrame.appendChild(displayName);

    return videoFrame;
  }

  // ...

  // creating audio element
  function createAudioElement(pId) {
    let audioElement = document.createElement("audio");
    audioElement.setAttribute("autoPlay", "false");
    audioElement.setAttribute("playsInline", "true");
    audioElement.setAttribute("controls", "false");
    audioElement.setAttribute("id", `a-${pId}`);
    audioElement.style.display = "none";
    return audioElement;
  }

  // ...

  // creating local participant
  function createLocalParticipant() {
    let localParticipant = createVideoElement(
      meeting.localParticipant.id,
      meeting.localParticipant.displayName
    );
    videoContainer.appendChild(localParticipant);
  }

  // ...

  // Update video layout
  function updateVideoLayout() {
    const participantDiv = document.querySelector(".participantDiv");
    const participants = Array.from(participantDiv.children);
    if (participants.length > 0) {
      participants.sort((a, b) => {
        // Sort participants based on their IDs
        const idA = a.id.substring(2);
        const idB = b.id.substring(2);
        return idA.localeCompare(idB);
      });

      // Make the first participant's video the biggest

      participants[0].setAttribute("class", "video-frame");

      // Make the rest of the participants' videos smaller
      for (let i = 1; i < participants.length; i++) {
        participants[0].setAttribute("class", "video-frame");
      }

      // Add click event listeners to swapvideos
      for (let i = 0; i < participants.length; i++) {
        participants[i].addEventListener("click", () => {
          if (i !== 0) {
            // Swap videos
            const firstParticipant = participants[0];
            const clickedParticipant = participants[i];
            participantDiv.insertBefore(clickedParticipant, firstParticipant);
            participantDiv.insertBefore(firstParticipant, participants[1]);
          }
        });
      }
    }
  }
}
// leave Meeting Button Event Listener
leaveButton.addEventListener("click", async () => {
  location.href = "../../../400lvlcrs.html";
  meeting?.leave();
  
});

// Toggle Mic Button Event Listener
toggleMicButton.addEventListener("click", async () => {
  
  if (isMicOn) {
    // Disable Mic in Meeting
    meeting?.muteMic();
    micImage.setAttribute("src","./images/Mic.svg")
  } else {
    // Enable Mic in Meeting
    meeting?.unmuteMic();
    micImage.setAttribute("src","./images/Group 40.svg")
  }
  isMicOn = !isMicOn;
});

// Toggle Web Cam Button Event Listener
toggleWebCamButton.addEventListener("click", async () => {
  if (isWebCamOn) {
    // Disable Webcam in Meeting
    videoImg.setAttribute("src","./images/Video=Off.svg");
    meeting?.disableWebcam();
    let vElement = document.querySelector(`#f-${meeting.localParticipant.id} video`);
    
    vElement.style.backgroundImage= "url(./images/video-off-svgrepo-com.svg)";
    vElement.style.backgroundPosition="center";
    vElement.style.backgroundColor=" black";
    vElement.style.backgroundSize="contain";
    vElement.style.backgroundRepeat="no-repeat"
  } else {
    // Enable Webcam in Meeting
    videoImg.setAttribute("src","./images/Group 39.svg");

    meeting?.enableWebcam();
    let vElement = document.querySelector(`#f-${meeting.localParticipant.id} video`);
    vElement.style.background=" none";
    vElement.style.display = "inline";
  }
  isWebCamOn = !isWebCamOn;
});
