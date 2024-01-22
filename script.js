var liveSite = false;

var hasImage = false;
var gifCapturing = false;
const svgW = 388;
const svgH = 560;
var inputTimeoutLength = 1000;

var inputTimeout = null;
var undo = [];
var gifFrames = [];
var initiated = false;
var renderedFrames = 0;
var currentRenderFrame = 0;
var get = {};
var html = "";
var ogHtml = "";
var ogArray = "";
var terrain = "";
var wait = 0;
var frameCounter = -1;
var prevCpu = 500;
var mouseDown = 0;

var drew = false;

var selectState = true;

var gridColor1 = 5;
var gridColor2 = 15;

var fps = 20;
var fullFps = 100;

var drawUndo = [];
var drawUndoIndex = 0;

var loadingRandom = "";
var linkedDream = null;

var mainFrame;

var txWaiting = false;

var movingImage = false;
var sizingImage = false;
var movingView = false;
var sizingView = false;
var lastMoveX = null;
var lastMoveY = null;
var moveMouseIncrement = 1;
var moveImgIncrement = .005;
var sizeImgIncrement = .005;

var maxId = 9904;
var maxUpdated = false;

var lastSelected = [];
var editArray = [];
var gridEls = [];

var renderSpeed = 40;
var playBackSpeed = 10;
var prevPlayBackSpeed = 10;

var connected = false;

var authAddr = "";

var tokenId,
  gifDuration,
  gifOutputWidth,
  gifFrameRate,
  gifQuality,
  gifFrameCount,
  gif,
  gifWidthResolution,
  gifResolution,

  imgX = .06,
  imgY = .19,
  imgW = .88,

  cropX = .06,
  cropY = .19,
  cropW = .88,
  cropH = 1,

  terrasOwned = [],

  sense,
  blur,
  fade,

  ethers,
  contract,
  charContract,
  dataContract,
  walletContract,
  provider,
  walletProvider,

  address,
  isAuthorizedDreamer = false,

  gridEls,
  originalMode,

  classIdsSorted,
  chars,
  MODE,
  uni,
  SEED,

  originalChars,
  charSet,
  newSet,
  mainSet,

  baseImage,
  baseCanvas,
  resultCanvas;

function getTokenMeta() {

}

const dithers = [
  null,
  "FloydSteinberg",
  "FloydSteinberg-serpentine",
  "FalseFloydSteinberg",
  "FalseFloydSteinberg-serpentine",
  "Stucki",
  "Stucki-serpentine",
  "Atkinson",
  "Atkinson-serpentine",
]

const ops = {
  random: () => {
    l(".tid").value = Math.floor(Math.random() * maxId) + 1;
    loadingRandom = "Random ";
  },
  randomMine: () => {
    l(".tid").value = terrasOwned[Math.floor(Math.random() * terrasOwned.length)];
    loadingRandom = "Your ";
  },
  links: () => {
    if (togState(l(".links"))) {
      l(".linksTile").style.display = "block";
    } else {
      l(".linksTile").style.display = "none";
    }
  },
  dreamLink: () => {
    copyDreamLink();
  },
  render3dButton: () => {
    ops.intro3d();
  },
  renderTileButton: () => {
    if (togState(l(".renderTileButton"))) {
      mainFrame.classList.add("renderMode");
    } else {
      mainFrame.classList.remove("renderMode");
    }
  },
  mineTileButton: () => {
    if (togState(l(".mineTileButton"))) {
      mainFrame.classList.add("mineMode");
    } else {
      mainFrame.classList.remove("mineMode");
    }
  },
  viewTileButton: () => {
    if (togState(l(".viewTileButton"))) {
      mainFrame.classList.add("viewMode");
    } else {
      mainFrame.classList.remove("viewMode");
    }
  },
  tokenButton: () => {
    if (togState(l(".tokenButton"))) {
      mainFrame.classList.add("tokenMode");
    } else {
      mainFrame.classList.remove("tokenMode");
    }
  },
  clear: () => {
    deselect();
  },
  replay: () => {
    wait = 0;
    l(".seek").textContent = `Seek ${wait}`;
    resetAnimation();
  },
  recenter: () => {
    imgX = .06;
    imgY = .19;
    imgW = .88;
  },
  remove: () => {
    hasImage = false;
    mainFrame.classList.remove("hasImage");
  },
  moveImage: () => {
    if (!togState(l(".moveImage"))) {
      lastMoveX = null;
      lastMoveY = null;
      movingImage = true;
      mainFrame.style.pointerEvents = "none";
    }
  },
  sizeImage: () => {
    if (!togState(l(".sizeImage"))) {
      lastMoveX = null;
      lastMoveY = null;
      sizingImage = true;
      mainFrame.style.pointerEvents = "none";
    }
  },
  moveView: () => {
    if (!togState(l(".moveView"))) {
      lastMoveX = null;
      lastMoveY = null;
      movingView = true;
      mainFrame.style.pointerEvents = "none";
    }
  },
  sizeView: () => {
    if (!togState(l(".sizeView"))) {
      lastMoveX = null;
      lastMoveY = null;
      sizingView = true;
      mainFrame.style.pointerEvents = "none";
    }
  },
  square: () => {
    if (togState(l(".square"))) {
      cropX = .05;
      cropY = .19;
      cropW = .89;
      cropH = 1;
    }
  },
  portrait: () => {
    if (togState(l(".portrait"))) {
      cropX = 0;
      cropY = 0;
      cropW = 1;
      cropH = 1.45;
    }
  },
  landscape: () => {
    if (togState(l(".landscape"))) {
      cropX = .06;
      cropY = .28;
      cropW = .88;
      cropH = .33;
    }
  },
  drawUndo: () => {
    if (!togState(l(".drawUndo"))) {
      drawUndoIndex--;
      arrayToArt(drawUndo[drawUndoIndex], true);
      if (drawUndoIndex !== 0) {
        togState(l(".drawUndo"), true);
      }
      togState(l(".drawRedo"), true);
      updateParams();
      resetAnimation();
    } else {
      togState(l(".drawUndo"), false);
    }
  },
  drawRedo: () => {
    if (!togState(l(".drawRedo"))) {
      drawUndoIndex++;
      arrayToArt(drawUndo[drawUndoIndex], true);
      if (drawUndoIndex < drawUndo.length - 1) {
        togState(l(".drawRedo"), true);
      }
      togState(l(".drawUndo"), true);
      updateParams();
      resetAnimation();
    } else {
      togState(l(".drawRedo"), false);
    }
  },
  undo: () => {
    if (undo.length > 0) {
      var ctx = baseCanvas.getContext("2d");
      var resCtx = resultCanvas.getContext("2d");
      ctx.putImageData(undo[0], 0, 0);
      resCtx.putImageData(undo[0], 0, 0);
      undo.shift();
    }
  },
  still: () => {
    if (togState(l(".still"))) {
      mainFrame.classList.add("stillMode");
      l(".svgWrapper").style.display = "block";
    } else {
      mainFrame.classList.remove("stillMode");
      // l(".svgWrapper").style.display = "none";
    }
    loadTerraform(2);
  },
  save: () => {
    var win = window.open("", "_blank");
    var dataURL = baseCanvas.toDataURL("image/png");
    win.document.write('<iframe src="' + dataURL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    win.document.title = "TerraformPfp";
  },
  connect: () => {
    connect(true);
  },
  mineButton: (e) => {
    loadingRandom = "Your ";
    l(".tid").value = e.textContent;
  },
  mineGroup: (e) => {
    showMineGroup(e.dataset.group);
  },
  commit: (e) => {
    if (togState(e)) {
      // show commit tile
      mainFrame.classList.add("commitMode");
      // hide grid
      togState(l(".grid"), false);
      ops.grid();
    } else {
      mainFrame.classList.remove("commitMode");
      togState("enterDream", false);
      mainFrame.classList.remove("enterDreamMode");
      togState("commitDream", false);
      mainFrame.classList.remove("commitDreamMode");
      togState("authorize", false);
      mainFrame.classList.remove("authorizeMode");
    }
  },
  authorize: (e) => {
    if (togState(e)) {
      mainFrame.classList.add("authorizeMode");
      togState(l(".grid"), false);
    } else {
      togState(e, true);
      if (authAddr !== "") {
        awaitTxResult(1);
        walletContract.authorizeDreamer(tokenId, authAddr).then(handleTx).catch((err) => {
          awaitTxResult(4);
        });
      }
    }
    togState("enterDream", false);
    mainFrame.classList.remove("enterDreamMode");
    togState("commitDream", false);
    mainFrame.classList.remove("commitDreamMode");
  },
  enterDream: (e) => {
    if (togState(e)) {
      mainFrame.classList.add("enterDreamMode");
      togState(l(".grid"), false);
    } else {
      togState(e, true);
      awaitTxResult(1);
      walletContract.enterDream(tokenId).then(handleTx).catch((err) => {
        awaitTxResult(4);
      });

    }
    togState("authorize", false);
    mainFrame.classList.remove("authorizeMode");
    togState("commitDream", false);
    mainFrame.classList.remove("commitDreamMode");
  },
  commitDream: (e) => {
    if (togState(e)) {
      mainFrame.classList.add("commitDreamMode");
      togState(l(".grid"), false);
    } else {
      togState(e, true);
      // second click for confirm
      let dream = gridToCommit();
      awaitTxResult(1);
      walletContract.commitDreamToCanvas(tokenId, dream).then(handleTx).catch((err) => {
        awaitTxResult(4);
      });
    }
    togState("authorize", false);
    mainFrame.classList.remove("authorizeMode");
    togState("enterDream", false);
    mainFrame.classList.remove("enterDreamMode");
  },
  txSuccessButton: () => {
    // hide tx waiting
    awaitTxResult(0);
    // reload of current terraform
    tokenId = 0;
    updateParams();
  },
  txOkButton: () => {
    // hide tx waiting
    awaitTxResult(0);
  },
  render: () => {
    updateParams();
    playBackSpeed = renderSpeed;
    if (togState(l(".seek"))) {
      togState(l(".seek"), false);
      wait = frameCounter;
      l(".seek").textContent = `Seek ${wait}`;
    }
    if (wait !== 0) {
      resetAnimation();
    }
    mainFrame.classList.add("renderingMode");
    updateParams();
    startGifCapture();
  },
  snapshot: async () => {
    updateParams();
    let newHTML = l(".svgWrapper").innerHTML;

    let classStr = "";
    for (let cl of classIds) {
      var el = l("." + cl);
      if (el) {
        let color = getComputedStyle(el).getPropertyValue('color');
        classStr += `.${cl} { color: ${color} }`;
      }
    }

    newHTML = newHTML.replace(/\.[abcdefghi]\{.*?\.r/, classStr + ".r");
    newHTML = newHTML.replace(/\<\/foreignObject\>\<style\>(.*?)\.[abcdefghi]\{.*?keyframes/, "</foreignObject><style>$1 @keyframes");

    let newDiv = document.createElement("div");
    newDiv.innerHTML = newHTML;

    var b64 = new XMLSerializer().serializeToString(l("svg", newDiv));
    let dataURL = await svgToPng("data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(b64))), gifOutputWidth * 3);
    var win = window.open("", "_blank");
    win.document.write('<iframe src="' + dataURL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    win.document.title = "TerraformSnapshot";

  },
  current: () => {
    if (togState(l(".current"))) {

      // hide draw tile
      mainFrame.classList.remove("terraformMode");
      // hide grid
      togState(l(".grid"), false);
      ops.grid();
      // turn off still mode
      togState(l(".still"), false);
      ops.still();
      // save drawing from grid
      // resetting this flag will load original terrain in 

      arrayToArt(ogArray);
      changeMode(0);

      togState(l(".drawButton"), false);

      togState(l(".terrain"), false);

    } else {
      togState(l(".current"), true);
    }
  },
  terrain: () => {
    if (togState(l(".terrain"))) {
      // hide drawing tools
      mainFrame.classList.remove("terraformMode");
      // hide grid
      togState(l(".grid"), false);
      ops.grid();
      // turn off still mode
      togState(l(".still"), false);
      ops.still();

      // resetting this flag will load original terrain in 
      arrayToArt(terrain);
      changeMode(1);

      togState(l(".drawButton"), false);

      togState(l(".current"), false);
    } else {
      togState(l(".terrain"), true);
    }
  },
  imageTileButton: () => {
    if (togState(l(".imageTileButton"))) {
      mainFrame.classList.add("showImage");
    } else {
      mainFrame.classList.remove("showImage");
    }
  },
  introDraw: () => {
    document.body.classList.remove("introMode");
    togState(l(".drawButton"), true);
    ops.drawButton();
  },
  introPfp: () => {
    document.body.classList.remove("introMode");
  },
  introRender: () => {
    // turn off still mode
    togState(l(".still"), false);
    ops.still();
    document.body.classList.remove("introMode");
    // hide image
    mainFrame.classList.remove("showImage");
    togState(l(".imageTileButton"), false);
    // hide view
    mainFrame.classList.remove("viewMode");
    togState(l(".viewTileButton"), false);
    togState(l(".portrait"), true);
    ops.portrait();
    // cropX = 0;
    // cropY = 0;
    // cropW = 1;
    // cropH = 1.44;
  },
  intro3d: () => {
    let host = (liveSite ? "https://" : "http://");
    window.location.href = `${host}${window.location.host}/3d/index.html?id=${tokenId}`;
  },
  drawButton: () => {
    // if terraform mode requested
    if (togState(l(".drawButton"))) {
      // show drawing tools
      mainFrame.classList.add("terraformMode");
      // show grid
      togState(l(".grid"), true);
      ops.grid();
      // turn off still mode
      togState(l(".still"), false);
      ops.still();

      // hide image
      mainFrame.classList.remove("showImage");
      togState(l(".imageTileButton"), false);
      // hide view
      mainFrame.classList.remove("viewMode");
      togState(l(".viewTileButton"), false);
      // hide render
      mainFrame.classList.remove("renderMode");
      togState(l(".renderTileButton"), false);

      // reload existing terraform
      // daydream mode
      changeMode(2);

      togState(l(".terrain"), false);

      togState(l(".current"), false);

    }
    // if daydream/draw mode requested
    else {
      togState(l(".current"), true);
      ops.current();
    }
  },
  fps: () => {
    if (!togState(l(".fps"))) {
      renderSpeed = 100;
    }
  },
  seek: () => {
    if (!togState(l(".seek"))) {
      playBackSpeed = 10;
      wait = frameCounter;
      l(".seek").textContent = `Seek ${wait}`;

    } else {
      if (wait !== 0) {
        wait = 0;
        l(".seek").textContent = `Seek ${wait}`;
        togState(l(".seek"), false);
      } else {
        playBackSpeed = 30;
        resetAnimation();
      }
    }
  },
  grid: () => {
    if (togState(l(".grid"))) {
      if (mainFrame.classList.contains("commitMode")) {
        togState(l(".grid"), false);
        return;
      }
      l(".svgWrapper").style.display = "none";
      if (togState(l(".still"))) {
        l(".svgWrapper").style.display = "block";
      }
      l(".editGrid").style.display = "block";
      resetAnimation();
    } else {
      l(".editGrid").style.display = "none";
      l(".svgWrapper").style.display = "block";
    }
  },
  export: () => {
    copyToClip(gridToDream());
  },
  cancel: () => {
    playBackSpeed = 10;
    stopCapture();
    updateParams();

  },
}

async function handleTx(tx) {
  try {
    awaitTxResult(2);
    await tx.wait();
    awaitTxResult(3);
  } catch (err) {
    awaitTxResult(5);
  }
}

function awaitTxResult(state) {
  // 0 close tx waiting mode
  // 1 waiting for confirmation
  // 2 waiting for tx
  // 3 succes
  // 4 denied
  // 5 failed
  if (state === 0) {
    if (txWaiting) {
      mainFrame.classList.remove("txWaitingMode");
    }
    txWaiting = false;
  } else {
    mainFrame.classList.add("txWaitingMode");
    txWaiting = true;
    let func = l(".commitTile .togBox.on").textContent;
    let text = l(".txWaitingTile .info");
    let ok = l(".txWaitingTile .txOkButton").style;
    let success = l(".txWaitingTile .txSuccessButton").style;
    ok.display = "none";
    success.display = "none";
    if (state === 1) {
      text.textContent = `Waiting for ${func} confirmation in your wallet.`;
    } else if (state === 2) {
      text.textContent = `Transaction for ${func} submitted. Waiting for reciept.`;
    } else if (state === 3) {
      text.textContent = `Transaction for ${func} success.`;
      success.display = "block";
    } else if (state === 4) {
      text.textContent = `User denied ${func} transaction.`;
      ok.display = "block";
    } else if (state === 5) {
      text.textContent = `Transaction for ${func} failed.`;
      ok.style.display = "block";
    }
  }
}

function gridToCommit() {
  let map = [];
  let array = gridToArray();
  let str = "";
  for (let i = 0; i < 1024; i++) {
    // if next y row, add it
    if (i % 64 === 0) {
      map.push([]);
      str = "";
    }
    str += array.charAt(i);
    map[Math.floor(i / 64)] = str;
  }
  let raw = JSON.stringify(map);
  // raw = raw.replace(/\"/g, "");
  raw = JSON.parse(raw);
  console.log(raw);
  return raw;
}

function gridToDream() {
  let map = [];
  let array = gridToArray();
  let str = "";
  for (let i = 0; i < 1024; i++) {
    // if next y row, add it
    if (i % 64 === 0) {
      map.push([]);
      str = "";
    }
    str += array.charAt(i);
    map[Math.floor(i / 64)] = str;
  }
  let raw = JSON.stringify(map);
  return raw.replace(/\"/g, "");
}

function showEditButtons(e) {
  let context = l(".editTile");
  context.style.display = "block";
  let width = parseInt(getComputedStyle(context).getPropertyValue('width').replace(/(\d+)[\.p].*/, "$1"));
  let height = parseInt(getComputedStyle(context).getPropertyValue('height').replace(/(\d+)[\.p].*/, "$1"));
  context.style.top = (e.clientY - height / 2) + "px";
  context.style.left = (e.clientX - width / 2) + "px";
}

function hideEditButtons() {
  l(".editTile").style.display = "none";
}

function gridToMap() {
  let map = [];
  let array = gridToArray();
  for (let i = 0; i < 1024; i++) {
    // if next y row, add it
    if (i % 32 === 0) {
      map.push([]);
    }
    map[Math.floor(i / 32)].push(parseInt(array.charAt(i)));
  }
  return JSON.stringify(map);
}

function updateLinks() {
  let links = ls(".link");
  for (let link of links) {
    link.href = link.dataset.href1 + tokenId + link.dataset.href2;
  }
}

function show(el) {
  let els = ls(el);
  for (let el of els) {
    el.style.display = "block";
  }
}

function hide(el) {
  let els = ls(el);
  for (let el of els) {
    el.style.display = "none";
  }
}

function changeMode(mode) {
  if (mode === 2) {
    MODE = (originalMode > 2 ? 3 : 1);
  } else if (mode === 1) {
    MODE = 0;
  } else {
    MODE = originalMode;
  }
  isDaydream = 1 == MODE || 3 == MODE,
    isTerraformed = 2 == MODE || 4 == MODE,
    isOrigin = 3 == MODE || 4 == MODE;
}

async function updateParams(onlyIfNeed) {
  // onlyIfNeed for text input setTimeouts
  if (onlyIfNeed) {
    if (inputTimeout !== null) {
      clearTimeout(inputTimeout);
      inputTimeout = null;
    } else {
      return;
    }
  }
  let inputs = ls(".input");
  for (let input of inputs) {
    let val = input.value;
    if (val !== "") {
      val = (input.dataset.min ? Math.max(input.dataset.min, parseInt(val)) : val);
      val = (input.dataset.max ? Math.min(input.dataset.max, parseInt(val)) : val);
    }
    input.value = val;
  }

  authAddr = l(".authorizeAddress").value;
  if (authAddr !== "") {
    if (!isAddress(authAddr)) {
      l(".authorizeAddress").placeholder = "Invalid Address Pasted";
      l(".authorizeAddress").value = "";
      authAddr = "";
    }
  }
  let reloadType = 0;
  if (l(".importArray").value !== "") {
    let importedArray = l(".importArray").value.replace(/[^\d]/g, "");
    arrayToArt(importedArray);
    // arrayToArt(importedArray);
    l(".importArray").value = "";
    // reloadType = 2;
  }
  // reloadType 0 = no svg reconstruction
  // reloadType 1 = contract call and full svg contstruction, for changed id
  // reloadType 2 = animation speed reconstruction, for render
  if (prevPlayBackSpeed !== playBackSpeed) {
    prevPlayBackSpeed = playBackSpeed;
    reloadType = 2;
  }
  let tid = (l(".tid").value !== "" ? parseInt(l(".tid").value) : "");
  if (tokenId !== tid && tid !== "") {
    tokenId = tid;
    reloadType = 1;
    window.history.pushState('', 'enterDream.xyz', "index.html?id=" + tokenId);
  }
  if (reloadType !== 0) {
    await loadTerraform(reloadType);
  }
  sense = getSliderVal(".sense");
  blur = getSliderVal(".blur");
  fade = (100 - getSliderVal(".fade")) / 100;
  if (hasImage) {
    updateImagePosition();
    // bug fix, opacity not updating on return to 1
    baseCanvas.style.opacity = (fade === 1 ? 0.999999 : fade);
  }
  if (cropW + cropX > 1) {
    cropW = 1 - cropX;
  }
  if ((cropW * svgW * cropH) + (cropY * svgH) > svgH) {
    cropH = ((1 - cropY) * svgH) / (cropW * svgW);
  }

  if (cropH === 1) {
    togState(l(".square"), true);
    togState(l(".portrait"), false);
    togState(l(".landscape"), false);
  } else if (cropH === 1.44) {
    togState(l(".square"), false);
    togState(l(".portrait"), true);
    togState(l(".landscape"), false);
  } else if (cropH === 0.69) {
    togState(l(".square"), false);
    togState(l(".portrait"), false);
    togState(l(".landscape"), true);
  } else {
    togState(l(".square"), false);
    togState(l(".portrait"), false);
    togState(l(".landscape"), false);
  }

  updateSvgView();

  gifDuration = getSliderVal(".duration") * 1000;
  gifOutputWidth = getSliderVal(".outW");
  let useFps = (togState(l(".fps")) ? fullFps : fps);

  gifFrameRate = Math.round(100 / useFps);
  gifQuality = (togState(l(".quality")) ? 30 : 0);

  let rebound = (togState(l(".bounce")) ? 2 : 1);
  gifFrameCount = Math.ceil(Math.ceil(gifDuration / rebound) / (gifFrameRate * 10));

  let timing = milliMinutes(gifFrameCount * gifFrameRate * renderSpeed + wait * renderSpeed);
  l(".render").textContent = `Render Gif ${timing}`;

  gifWidthResolution = gifOutputWidth / (cropW * svgW);
  gifResolution = gifOutputWidth / svgW;

}

function getSliderVal(query) {
  return parseInt(l(query).dataset.val);
}

function deselect() {
  editArray = [];
  lastSelected = [];
  for (let gridButton of ls(".rE p")) {
    gridButton.className = "";
  }
}

function selectGridEl(el, index, selectState) {
  if (index !== undefined && index !== null) {
    el = ls(".rE p")[index];
  }
  if (selectState === false) {
    el.className = ("");
    // find el in grid and remove it
    for (let i = 0; i < editArray.length; i++) {
      if (editArray[i] === el.elsIndex) {
        editArray.splice(i, 1);
        i--;
      }
    }
  } else {
    el.className = ("gridSelected");
    editArray.push(el.elsIndex);
  }
}

function addToUndo(ar) {
  if (drawUndo.length - 1 > drawUndoIndex) {
    drawUndo.splice(drawUndoIndex + 1);
  }
  drawUndo.push(ar + "");
  drawUndoIndex = drawUndo.length - 1;
  if (drawUndo.length > 1) {
    togState(l(".drawUndo"), true);
  }
  togState(l(".drawRedo"), false);
}

function addMineListeners() {
  let togBoxes = ls(".mineButton, .mineGroup");
  for (let tog of togBoxes) {
    tog.addEventListener('click', (e) => {
      updateParams(true);
      toggle(tog);
      let classList = tog.className.split(' ');
      for (let c of classList) {
        if (ops[c]) {
          ops[c](tog);
        }
      }
      updateParams();
    });
  }
  l(".randomMine").addEventListener('click', (e) => {
    updateParams(true);
    ops.randomMine();
    updateParams();
  });
}

function handlePalleteKey(e) {
  showEditButtons(e);
  l(".rE").removeEventListener('mousemove', handlePalleteKey);
}

function addListeners() {
  document.addEventListener('keyup', (e) => {
    if (e.target.classList.contains("input")) {
      return;
    }
    if (mainFrame.classList.contains("terraformMode")) {
      if (e.key.match(/[0-9]/) !== null) {
        ls(".heightButtons>div")[parseInt(e.key)].click();
      } else if (e.key === 'g') {
        togState(l(".grid"), !togState(l(".grid")));
        ops.grid();
      } else if (e.key === 's') {
        togState(l(".still"), !togState(l(".still")));
        ops.still();
      } else if (e.key === 'l') {
        // for paste into animation tool prototype
        var dr = gridToDream();
        dr = 'map: "' + dr + '",';
        copyToClip(dr);
      } else if (e.key === 'd') {
        let listener = l(".rE").addEventListener('mousemove', handlePalleteKey);
      }
    }
  });
  l(".tid").addEventListener('click', (e) => {
    l(".tid").value = "";
  });
  l(".authorizeAddress").addEventListener('click', (e) => {
    l(".authorizeAddress").value = "";
  });
  l(".tid").addEventListener('focusout', (e) => {
    if (l(".tid").value === "") {
      l(".tid").value = tokenId;
    }
  });
  l(".authorizeAddress").addEventListener('focusout', (e) => {
    if (l(".authorizeAddress").value === "") {
      l(".authorizeAddress").placeholder = "Address to Authorize";
    }
  });
  l(".left").addEventListener('contextmenu', (e) => {
    if (getComputedStyle(mainFrame).getPropertyValue('flex-direction') == "row") {
      mainFrame.style.flexDirection = "row-reverse";
      l(".right").style.flexDirection = "row-reverse";
    } else {
      mainFrame.style.flexDirection = "row";
      l(".right").style.flexDirection = "row";
    }
    e.preventDefault();
    return false;
  });
  l(".center").addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
  // l(".right").addEventListener('contextmenu', (e) => {
  //   e.preventDefault();
  //   return false;
  // });
  l(".right").addEventListener('click', (e) => {
    // await updateParams();
  });
  for (let heightButton of ls(".heightButtons>div")) {
    heightButton.addEventListener('click', async (e) => {
      let gridButtons = ls(".rE p");
      if (editArray.length > 0) {
        for (let elIndex of editArray) {
          gridButtons[elIndex].textContent = e.target.elsIndex;
        }
        arrayToArt(gridToArray());
        if (togState(l(".auto"))) {
          deselect();
        }
      }
    });
    heightButton.addEventListener('contextmenu', async (e) => {
      let gridButtons = ls(".rE p");
      for (let gridButton of ls(".rE p")) {
        if (gridButton.textContent === e.target.elsIndex.toString()) {
          // change this to right click
          selectGridEl(gridButton);
        }
      }
      e.preventDefault();
      return false;
    });
  }
  l(".rE").addEventListener('contextmenu', (e) => {
    showEditButtons(e)
    e.preventDefault();
    return false;
  });
  l(".editTile").addEventListener('mouseleave', (e) => {
    hideEditButtons();
  });
  for (let gridButton of ls(".rE p")) {
    gridButton.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        lastSelected.unshift(e.target.elsIndex);
        // if already selected, deselect mode
        if (e.target.classList.contains("gridSelected")) {
          selectState = false;
          selectGridEl(e.target, null, false);
        } else {
          selectState = true;
          selectGridEl(e.target);
        }
        if (e.shiftKey) {
          if (lastSelected.length > 1) {
            let last = lastSelected[1];
            // selectState = !selectState;
            if (last === e.target.elsIndex) {} else {
              // ctrl click fix
              let lastx = last % 32;
              let lasty = Math.floor(last / 32);
              curx = e.target.elsIndex % 32;
              cury = Math.floor(e.target.elsIndex / 32);
              if (lastx > curx) {
                let cur = curx;
                curx = lastx;
                lastx = cur;
              }
              if (lasty > cury) {
                let cur = cury;
                cury = lasty;
                lasty = cur;
              }
              for (let i = 0; i < 1024; i++) {
                ix = i % 32;
                iy = Math.floor(i / 32);
                if (ix >= lastx && ix <= curx && iy >= lasty && iy <= cury) {
                  selectGridEl(null, i, selectState);
                }
              }
            }
          }
        }
      }
    });
    gridButton.addEventListener('mouseenter', (e) => {
      if (mouseDown) {
        selectGridEl(e.target, null, selectState);
      }
    });

    gridButton.addEventListener('dblclick', (e) => {
      if (lastSelected.length > 2) {
        let last = lastSelected[2];
        selectState = !selectState;
        if (last === e.target.elsIndex) {} else {
          // ctrl click fix
          let lastx = last % 32;
          let lasty = Math.floor(last / 32);
          curx = e.target.elsIndex % 32;
          cury = Math.floor(e.target.elsIndex / 32);
          if (lastx > curx) {
            let cur = curx;
            curx = lastx;
            lastx = cur;
          }
          if (lasty > cury) {
            let cur = cury;
            cury = lasty;
            lasty = cur;
          }
          for (let i = 0; i < 1024; i++) {
            ix = i % 32;
            iy = Math.floor(i / 32);
            if (ix >= lastx && ix <= curx && iy >= lasty && iy <= cury) {
              selectGridEl(null, i, selectState);
            }
          }
        }
      }
      e.preventDefault();
      return false;
    });
  }

  document.addEventListener('mousedown', (e) => {
    mouseDown = true;
    if (e.target === l(".rE") || e.target === l(".r") || e.target === l(".centerInner") || e.target === l(".left") || e.target === l(".menu") || e.target === l(".gutter")) {
      if (togState(l(".drawButton"))) {
        togState(l(".grid"), !togState(l(".grid")));
        ops.grid();
      }
    }
  });
  document.addEventListener('mousemove', (e) => {
    if (movingImage || sizingImage || movingView || sizingView) {
      let moveIt = false;
      if (lastMoveX === null) {
        lastMoveX = e.clientX;
      }
      if (lastMoveY === null) {
        lastMoveY = e.clientY;
      }
      let dX = e.clientX - lastMoveX;
      let dY = e.clientY - lastMoveY;
      let adX = Math.abs(dX) * moveImgIncrement;
      let adY = Math.abs(dY) * moveImgIncrement;
      if (Math.abs(dX) > moveMouseIncrement) {
        lastMoveX = e.clientX;
        moveIt = true;
      }
      if (Math.abs(dY) > moveMouseIncrement) {
        lastMoveY = e.clientY;
        moveIt = true;
      }
      if (moveIt) {
        if (movingImage) {
          imgX += (dX > 0 ? adX : -adX);
          imgY += (dY > 0 ? adY * .69 : adY * -.69);
        } else if (sizingImage) {
          imgW += (dY > 0 ? adY : -adY);
        } else if (movingView) {
          cropX += (dX > 0 ? adX : -adX);
          cropX = Math.max(0, cropX);
          cropX = Math.min(1, cropX);
          cropY += (dY > 0 ? adY * .69 : adY * -.69);
          cropY = Math.max(0, cropY);
          cropY = Math.min(1, cropY);
        } else if (sizingView) {
          cropW += (dX > 0 ? adX : -adX);
          cropW = Math.max(0.01, cropW);
          cropW = Math.min(1, cropW);
          cropH += (dY > 0 ? adY * .69 : adY * -.69);
          cropH = Math.max(0.01, cropH);
          cropH = Math.min(10, cropH);
        }
        updateParams();
      }
    }
  });
  document.addEventListener('mouseup', (e) => {
    mouseDown = false;
    if (movingImage || sizingImage || movingView || sizingView) {
      movingImage = sizingImage = movingView = sizingView = false;
      mainFrame.style.pointerEvents = "auto";
      togState(l(".moveImage"), true);
      togState(l(".sizeImage"), true);
      togState(l(".moveView"), true);
      togState(l(".sizeView"), true);
    }
  });
  document.addEventListener('click', (e) => {
    if (initiated) {
      l(".drawButton").textContent = "DRAW";
      return;
    }
    if (!document.body.classList.contains("introMode")) {
      initiated = true;
    }
  });
  let buttons = ls(".button");
  for (let button of buttons) {
    button.addEventListener('click', (e) => {
      updateParams(true);
      let classList = button.className.split(' ');
      for (let c of classList) {
        if (ops[c]) {
          ops[c](button);
        }
      }
      updateParams();
    });
  }
  let togBoxes = ls(".togBox:not(.mineButton):not(.mineGroup)");
  for (let tog of togBoxes) {
    tog.addEventListener('mousedown', (e) => {
      if (e.button !== 0)
        return;
      updateParams(true);
      toggle(tog);
      let classList = tog.className.split(' ');
      for (let c of classList) {
        if (ops[c]) {
          ops[c](tog);
        }
      }
      updateParams();
    });
  }
  let inputs = ls(".input");
  for (let input of inputs) {
    input.addEventListener('change', (e) => {
      updateParams();
      // if (inputTimeout !== null) {
      //   clearTimeout(inputTimeout);
      //   inputTimeout = null;
      // }
      // inputTimeout = setTimeout(() => {
      //   updateParams();
      // }, inputTimeoutLength)
    });
  }
  l('.importArray').addEventListener('input', (e) => {
    // if (inputTimeout !== null) {
    //   clearTimeout(inputTimeout);
    //   inputTimeout = null;
    // }
    updateParams();
  });
  l('.inputFile').onchange = function() {
    imgChange(this);
  };
  l('.inputFile').onclick = function() {
    this.value = null;
  };
}

function toggle(tog) {
  let className = tog.className;
  if (tog.classList.contains("on")) {
    togState(tog, false);
  } else {
    togState(tog, true);
  }
}

function togState(tog, set) {
  tog = (typeof tog === "string" ? l("." + tog) : tog);
  if (set === true) {
    tog.classList.remove("off");
    tog.classList.add("on");
  } else if (set === false) {
    tog.classList.remove("on");
    tog.classList.add("off");
  }
  return tog.classList.contains("on");
}

function imgChange(inp) {
  if (inp.files && inp.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      baseImage = l(".baseImg");
      baseImage.setAttribute('src', e.target.result);
      baseImage.onload = function() {
        initCanvas(baseImage);
        l(".inputFile").value = "";
      };
    }
    reader.readAsDataURL(inp.files[0]);
    mainFrame.classList.add("viewMode");
    togState("viewTileButton", true);
  }
}

function updateImagePosition() {
  resultCanvas.style.width = (imgW * 100) + "%";
  resultCanvas.style.left = (imgX * 100) + "%";
  resultCanvas.style.top = (imgY * 100) + "%";
  baseCanvas.style.width = (imgW * 100) + "%";
  baseCanvas.style.left = (imgX * 100) + "%";
  baseCanvas.style.top = (imgY * 100) + "%";
}

async function initCanvas(img) {
  resultCanvas = l(".resultCanvas");
  resultCanvas.width = baseImage.width;
  resultCanvas.height = baseImage.height;
  baseCanvas = l(".baseCanvas");
  baseCanvas.width = baseImage.width;
  baseCanvas.height = baseImage.height;
  updateImagePosition();
  await updateParams();
  var baseCtx = baseCanvas.getContext("2d");
  baseCtx.drawImage(img, 0, 0);
  hasImage = true;
  mainFrame.classList.add("hasImage");
  mainFrame.classList.add("showImage");
  mask = null;
  undo = [];
  togState(l(".imageTileButton"), true);
  ops.imageTileButton();
}

function paint(color, alpha) {

  if (!mask) return;

  var rgba = hexToRgb(color, alpha);

  var x, y,
    data = mask.data,
    bounds = mask.bounds,
    maskW = mask.width,
    w = baseImage.width,
    h = baseImage.height,
    ctx = resultCanvas.getContext("2d"),
    baseCtx = baseCanvas.getContext('2d'),
    imgData = ctx.createImageData(w, h),
    res = imgData.data;


  for (y = bounds.minY; y <= bounds.maxY; y++) {
    for (x = bounds.minX; x <= bounds.maxX; x++) {
      if (data[y * maskW + x] == 0) continue;
      k = (y * w + x) * 4;
      res[k] = rgba[0];
      res[k + 1] = rgba[1];
      res[k + 2] = rgba[2];
      res[k + 3] = rgba[3];
    }
  }

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
        k = (y * w + x) * 4;
        res[k] = rgba[0];
        res[k + 1] = rgba[1];
        res[k + 2] = rgba[2];
        res[k + 3] = 255;
      }
    }
  }

  mask = null;

  undo.unshift(baseCtx.getImageData(0, 0, baseImage.width, baseImage.height));

  ctx.clearRect(0, 0, w, h);

  ctx.putImageData(imgData, 0, 0);
  ctx.globalCompositeOperation = 'source-out';
  ctx.drawImage(baseCanvas, 0, 0, w, h);

  baseCtx.clearRect(0, 0, w, h);
  baseCtx.drawImage(ctx.canvas, 0, 0);

}
// deprecated download of image, now opening in new window
/*
function downloadFile(fileUrl, name) {
  const link = document.createElement('a');
  link.target = "_blank";
  link.style.display = 'none';
  link.href = fileUrl;
  // link.download = name;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode.removeChild(link);
  }, 0);
};
*/

function updateSvgView() {
  var vb = {
    x: Math.round(cropX * svgW),
    y: Math.round(cropY * svgH),
    w: Math.round(cropW * svgW),
    h: Math.round((cropW * svgW) * cropH)
  }
  let cropBoxStr = `
    <rect x="0" y="0" width="${svgW}" height="${vb.y}" style="fill:rgb(0,0,0); fill-opacity:0.43" />
    <rect x="0" y="${vb.y}" width="${vb.x}" height="${vb.h}" style="fill:rgb(0,0,0); fill-opacity:0.43" />
    <rect x="${vb.x + vb.w}" y="${vb.y}" width="${svgW - vb.x - vb.w}" height="${vb.h}" style="fill:rgb(0,0,0); fill-opacity:0.43" />
    <rect x="0" y="${vb.y + vb.h}" width="${svgW}" height="${svgH - vb.y - vb.h}" style="fill:rgb(0,0,0); fill-opacity:0.43" />`;
  let cropMask = l(".cropMask");
  cropMask.innerHTML = cropBoxStr;
}

async function loadTerraform(reloadType) {
  if (reloadType == 1) {

    togState("enterDream", false);
    mainFrame.classList.remove("enterDreamMode");
    togState("authorize", false);
    mainFrame.classList.remove("authorizeMode");
    togState("commitDream", false);
    mainFrame.classList.remove("commitDreamMode");

    mainFrame.classList.add("loadingMode");

    l(".loadingInfo").textContent = `Loading ${loadingRandom}Terraform ${tokenId}...`;
    if (!maxUpdated) {
      maxId = await contractCall(async () => {
        return contract.totalSupply();
      });
      maxId = parseInt(maxId.toString());
      maxUpdated = true;
      l(".tid").dataset.max = maxId;
    }



    html = await contractCall(async () => {
      return contract.tokenHTML(tokenId);
    });
    // get tokenURI data
    let tokenURI = await contractCall(async () => {
      return contract.tokenURI(tokenId);
    });
    // decode tokenURI
    tokenURI = JSON.parse(atob(tokenURI.substring(29)));
    let tokenAttrs = tokenURI.attributes.reduce((obj, item) => {
        obj[item.trait_type] = item.value;
        return obj;
    }, {});
    // biome from tokenURI
    let biome = tokenAttrs["Biome"];
    let tempMode = tokenAttrs["Mode"];

    // get original terrain data
    terrain = "";
    if (tempMode === "Terraform" || tempMode === "Daydream") {
      var placement = await contractCall(async () => {
        return contract.tokenToPlacement(tokenId);
      });
      let terrainResult = await contractCall(async () => {
        return dataContract.tokenHeightmapIndices(0, placement, 10196, 0, [0]);
      });
      terrain = formatArray(terrainResult);
    }

    // get chars with biome number
    let charsData = await contractCall(async () => {
      return charContract.characterSet(biome);
    });
    // chars[0] is char array, chars[1] is font number
    chars = clone(charsData[0]);
    chars.push(" ");
    mainFrame.classList.remove("loadingMode");
    if (!initiated && linkedDream === null) {
      document.body.classList.add("introMode");
    }
    loadingRandom = "";
    ogHtml = html;
    updateLinks();
    await updateMineSelected();

  } else {
    html = ogHtml;
    resetAnimation();
  }

  let fontFace = html.match(/\@font\-face.*?}/)[0];

  html = html.replace(/\<html\>.*?\<body\>/, "");
  html = html.replace(/\<\/body\>\<\/html\>/, "");
  html = html.replace(/loopLength\=10/, `loopLength=${playBackSpeed}`);

  html = html.replace(/let newSet/, `newSet`);
  html = html.replace(/let mainSet/, `mainSet`);
  html = html.replace(/let gridEls/, `gridEls`);
  html = html.replace(/let classIds/, `classIds`);
  html = html.replace(/let isOrigin/, `isOrigin`);
  html = html.replace(/let isDaydream/, `isDaydream`);
  html = html.replace(/const SEED/, `SEED`);
  html = html.replace(/let MODE/, `MODE`);

  html = html.replace(/All\(\'p\'\)/, "All('.r p')");

  html = html.replace(/draw\(e\)\{.*?\}/, `draw(e){}`);

  originalMode = parseInt(html.match(/MODE\=(\d)/)[1]);

  mainFrame.className = mainFrame.className.replace(/mode\d/, "mode" + originalMode);

  l(".current").textContent = `Current Mode ${originalMode}`;

  if (originalMode !== 0 && !togState(l(".drawButton"))) {
    togState(l(".grid"), false);
    ops.grid();
  }

  html = html.replace(/(\d+)ms/g, (match, p1) => {
    let newMs = parseInt(p1) * (playBackSpeed / 10);
    return newMs + "ms";
  });

  let script = unEscape(html.match(/\<script\>(.*?)\<\/script\>/s)[1]);

  script = script.replace(/terraLoop\(\)\{/, 'terraLoop(){capture();');
  for (var i = 1; i < 99999; i++)
    window.clearInterval(i);
  script = new Function(script);

  l(".svgWrapper").innerHTML = html;
  script();
  if (togState(l(".still"))) {
    stopAnimation();
  }
  if (togState(l(".drawButton"))) {
    changeMode(2);
  }

  // changeMode(togState(l(".drawButton")) ? );
  if (isDaydream) {
    l(".svgWrapper").style.userSelect = "none";
    l(".svgWrapper").style.pointerEvents = "auto";
  } else {
    l(".svgWrapper").style.userSelect = "none";
    l(".svgWrapper").style.pointerEvents = "none";
  }
  // terraforming grid
  classIdsSorted = clone(classIds);
  classIdsSorted.push('j');

  // l(".editGrid").style.backgroundColor = getComputedStyle(l(".r")).getPropertyValue('background-color');
  let gridPs = ls(".rE p");
  let ps = ls(".r p");
  for (let i = 0; i < ps.length; i++) {
    let height = classIdsSorted
      .indexOf(ps[i].className);
    gridPs[i].textContent = height;
  }
  ogArray = gridToArray();
  let editChars = ls(".heightButtons>div");
  for (let i = 0; i < 9; i++) {
    if (chars[i] !== " ") {
      editChars[i].firstChild.textContent = chars[i];
    } else {
      editChars[i].firstChild.innerHTML = "&nbsp;";
    }
  }

  let styleId = "fontStyleSheet";
  let fontStyleSheet = document.getElementById(styleId);
  let newFontStyleSheet = document.createElement("style");
  newFontStyleSheet.id = styleId;
  newFontStyleSheet.textContent = fontFace;
  document.head.appendChild(newFontStyleSheet);
  // if not terraform mode, use current drawing
  if (!togState(l(".drawButton"))) {
    arrayToArt(ogArray);
  } else {
    arrayToArt(drawUndo[drawUndoIndex]);
  }
}

function updatePallete() {
  let heights = ls(".heightButtons>div");
  let bgColor = getComputedStyle(l(".r")).getPropertyValue('background-color');
  for (let i = 0; i < classIdsSorted.length - 1; i++) {
    var el = l("." + classIdsSorted[i]);
    if (el) {
      let color = getComputedStyle(el).getPropertyValue('color');
      heights[i].style.backgroundColor = bgColor;
      heights[i].style.color = color;
    }
  }
}

function gridToArray() {
  let str = "";
  for (let el of ls(".rE p")) {
    str += el.textContent;
  }
  return str;
}

function arrayToArt(ar, undo) {
  if (undo === undefined) {
    addToUndo(ar);
  }
  if (ar === undefined) {
    ar = drawUndo[drawUndoIndex];
  }
  let els = ls(".rE p");
  let artEls = ls(".r p");
  for (let i = 0; i < ar.length; i++) {
    let height = parseInt(ar.charAt(i));
    artEls[i].activeClass = classIdsSorted[height];
    artEls[i].setAttribute('class', classIdsSorted[height]);
    artEls[i].h = height;
    artEls[i].originalClass = "";
    artEls[i].textContent = chars[height];
    els[i].textContent = height;
    if (togState(l(".still"))) {
      // els[i].style.background = "hsl(255, 0%, 50%)";
      // els[i].textContent = " ";
    } else {
      let bgStr = (height === 9 ? 0 : (height + 1) * 5);
      els[i].style.background = `linear-gradient(-45deg, hsl(255, 0%, ${bgStr + gridColor1}%), hsl(255, 0%, ${bgStr + gridColor2}%))`;
    }
  }
  updateCharset();
  resetAnimation();

}

function loadGetVars() {
  var parts = window.location.search.substr(1).split("&");
  for (let part of parts) {
    var temp = part.split("=");
    get[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
  }
}

async function connect(requestConnect) {
  if (window.ethereum === undefined) {
    mainFrame.classList.add("noWalletMode");
    return;
  }
  walletProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
  if (requestConnect) {
    await walletProvider.send("eth_requestAccounts", []);
  } else {
    let accounts = await walletProvider.listAccounts();
    await getMineList(accounts);
  }

}

async function getMineList(accounts) {
  terrasOwned = [];
  if (accounts[0]) {
    address = accounts[0];
    connected = true;
    walletContract = new ethers.Contract('0x4E1f41613c9084FdB9E34E11fAE9412427480e56', abi, walletProvider.getSigner());
    mainFrame.classList.remove("notConnectedMode");
  } else {
    address = null;
    connected = false;
    mainFrame.classList.add("notConnectedMode");
    l(".mineGroups").innerHTML = "";
    l(".mineIds").innerHTML = "";
    return;
  }
  let numTokens = await contractCall(async () => {
    return contract.balanceOf(address);
  });
  for (let i = 0; i < numTokens; i++) {
    let id = await contractCall(async () => {
      return contract.tokenOfOwnerByIndex(address, i);
    });
    terrasOwned.push(parseInt(id.toString()));
  }


  if (terrasOwned.length === 0) {
    l(".mineIds").innerHTML = `<div class="info">No Terraforms for connected address.</div>`;
    return;
  }
  let str = `<div title="* will load a random Terraform of yours." class="button randomMine">*</div>`;
  // create mine list elements
  // create group header if needed
  if (terrasOwned.length > 10) {
    let alphaNum = 65;
    for (let i = 0; i < terrasOwned.length; i += 10) {
      let g = String.fromCharCode(alphaNum);
      str += `<div title="These letters group your Terraforms by 10 in the order they were acquired." class="togBox off mineGroup${g} mineGroup" data-group="${g}">${g}</div>`;
      alphaNum++;
    }
  }
  l(".mineGroups").innerHTML = str;
  // add buttons to owned terraforms
  str = "";
  for (let i = 0; i < terrasOwned.length; i++) {
    let g = String.fromCharCode(65 + (Math.floor(i / 10)));
    str += `<div title="Click to load your Terraform ${terrasOwned[i]}." class="togBox off mineButtonG${g} mineButton" data-group="${g}">${terrasOwned[i]}</div>`;
  }
  l(".mineIds").innerHTML = str;
  addMineListeners();
  if (tokenId && tokenId !== "") {
    await updateMineSelected();
  }

}

async function updateMineSelected() {
  if (terrasOwned.length > 10) {
    showMineGroup("A");
  }
  isMine = false;
  for (let i of ls(".mineButton")) {
    togState(i, i.textContent === tokenId.toString());
    if (i.textContent === tokenId.toString()) {
      isMine = true;
    }
    if (i.textContent === tokenId.toString() && terrasOwned.length > 10) {
      showMineGroup(i.dataset.group);
    }
  }
  isAuthorizedDreamer = false;
  if (!isMine && connected) {
    let authOfThisToken = await contractCall(async () => {
      return contract.tokenToAuthorizedDreamer(tokenId);
    });
    if (authOfThisToken === address) {
      isAuthorizedDreamer = true;
    }
  }
  if (isAuthorizedDreamer) {
    mainFrame.classList.add("authorizedMode");
  } else {
    mainFrame.classList.remove("authorizedMode");
  }
  if (!isMine) {
    mainFrame.classList.add("notMineMode");
  } else {
    mainFrame.classList.remove("notMineMode");
  }
}

function showMineGroup(g) {
  if (terrasOwned.length <= 10) {
    return;
  }
  for (let i of ls(".mineGroup")) {
    togState(i, false);
  }
  togState(`mineGroup${g}`, true);
  let group = ls(`.mineButtonG${g}`);
  for (let i of group) {
    i.style.display = "block";
  }
  group = ls(`.mineButton:not(.mineButtonG${g})`);
  for (let i of group) {
    i.style.display = "none";
  }
}

async function init() {
  mainFrame = l(".mainFrame");

  liveSite = !window.location.host.includes("127.0.0.1");

  ethers = await
  import('./ethers-5.2.esm.min.js');
  let provider;
  if (liveSite) {
    provider = ethers.getDefaultProvider("homestead", {
      etherscan: "NJ34AW18QZCMV1UCCK634Z6I9NQDNHNRNW",
      infura: "7da665ceb38844f190b6bf057cd1f2ba",
      alchemy: "nKLbFxL3N2M1_oDB5nZYtmH9U7Xdlkq5",
      pocket: "61faf51a928807003ad401b3"
    });
  } else {
    provider = ethers.getDefaultProvider("homestead", {
      etherscan: "NJ34AW18QZCMV1UCCK634Z6I9NQDNHNRNW",
    });
  }
  contract = new ethers.Contract('0x4E1f41613c9084FdB9E34E11fAE9412427480e56', abi, provider);
  charContract = new ethers.Contract('0xC9e417B7e67E387026161E50875D512f29630D7B', charAbi, provider);
  dataContract = new ethers.Contract('0xA5aFC9fE76a28fB12C60954Ed6e2e5f8ceF64Ff2', dataAbi, provider);

  await connect();

  if (window.ethereum) {
    ethereum.on('accountsChanged', getMineList);
  }

  loadGetVars();

  l(".rE").innerHTML = "<p>0</p>".repeat(1024);
  let gridButtons = ls(".rE p");

  for (let i = 0; i < 1024; i++) {
    gridButtons[i].elsIndex = i;
  }
  let heightButtons = ls(".heightButtons>div");
  for (let i = 0; i < 10; i++) {
    heightButtons[i].elsIndex = i;
  }
  // create sliders
  let sliders = ls(".slider");
  for (let sl of sliders) {
    // loop data values and add them
    let str = `<div class="sliderButtonsGroup">`;
    let totalRows = parseInt(sl.dataset.num);
    for (let i = 0; i < totalRows; i++) {
      let min = (sl.dataset["min" + i] ? parseInt(sl.dataset["min" + i]) : 0);
      let max = parseInt(sl.dataset["max" + i]);
      let inc = parseInt(sl.dataset["inc" + i]);
      let val = parseInt(sl.dataset["val" + i]);
      str += `<div class="sliderButtons"  data-val="${val}" style="height:${100 / totalRows}%;top:${i * (100 / totalRows)}%">`;
      for (let j = min; j <= max; j += inc) {
        str += `<div data-sl="${j}"></div>`;
      }
      str += "</div>";
    }
    str += `</div><div class="sliderLabel">${sl.dataset.label}</div>`;
    sl.innerHTML = str;
  }
  // loop sliders again and add listeners
  for (let sl of sliders) {
    let buttons = ls(".sliderButtons>div", sl);
    for (let button of buttons) {
      button.addEventListener('mousedown', (e) => {
        setSlider(e.target);
      });
      if (button.parentNode.dataset.val === button.dataset.sl) {
        setSlider(button);
      }
    }

  }



  if (get.id !== undefined) {
    l(".tid").value = get.id;
  } else {
    if (terrasOwned.length === 0) {
      ops.random();
    } else {
      ops.randomMine();
    }
    let forceUpdate = parseInt(l(".tid").value);
  }
  if (get.dream !== undefined) {
    linkedDream = atob(get.dream).replace(/[^\d]/, "");
    if (linkedDream.length !== 1024) {
      linkedDream = null;
    } else {
      // hide view
      mainFrame.classList.remove("viewMode");
      togState(l(".viewTileButton"), false);
    }
  }

  mainFrame.classList.remove("initMode");
  await updateParams();


  if (linkedDream !== null) {
    arrayToArt(linkedDream);
    togState(l(".drawButton"), true);
    ops.drawButton();
    togState("grid", false);
    ops.grid();
  }

  addListeners();

  updateSvgView();

}

function setSlider(el) {
  // set value, loop all elements and set active class
  let sl = el.parentNode.parentNode.parentNode;
  let val = el.dataset.sl;
  el.parentNode.dataset.val = val;
  // loop other button groups
  let totalVal = 0;
  for (let buttonGroup of ls(".sliderButtons", el.parentNode.parentNode)) {
    totalVal += parseInt(buttonGroup.dataset.val);
  }
  sl.dataset.val = totalVal;
  l(".sliderLabel", sl).textContent = sl.dataset.label + " " + parseInt(sl.dataset.val);
  let active = true;
  for (let but of ls("div", el.parentNode)) {
    but.classList.remove("active");
    but.classList.remove("activeEnd");
    if (active) {
      if (but === el) {
        but.classList.add("activeEnd");
        active = false;
      } else {
        but.classList.add("active");
      }
    }
  }
}

function copyDreamLink() {
  let drawing = btoa(drawUndo[drawUndoIndex]);
  let host = (liveSite ? "https://" : "http://");
  let url = `${host}${window.location.host}${window.location.pathname}?id=${tokenId}&dream=${drawing}`;
  copyToClip(url);
}

function updateRenderStats() {
  if (frameCounter > 0 && frameCounter < wait) {
    l(".renderInfo").textContent = `Waiting for Frame ${wait}`;
  } else if (renderedFrames < 5) {
    l(".renderInfo").textContent = `Finding Render Speed -${renderSpeed}`;
  } else {
    let remaining = milliMinutes((gifFrameCount * gifFrameRate * renderSpeed + wait * renderSpeed) - frameCounter * renderSpeed);
    l(".renderInfo").textContent = `Rendering Frame ${gifFrames.length} of ${gifFrameCount}`;
    l(".renderTime").textContent = `${remaining} Remaining`;
  }
}

async function startGifCapture() {
  gifFrames = [];
  renderedFrames = 0;
  currentRenderFrame = 0;
  updateRenderStats();
  frameCounter = -1;
  gifCapturing = true;
}

function formatArray(obj) {
  obj = obj.flat();
  let str = "";
  for (let i of obj) {
    str += i.toString();
  }
  return str;
  // return JSON.stringify(obj).replace(/[^\d]/, "");
}

function stopCapture(dontClear) {
  gifCapturing = false;
  if (dontClear === undefined) {
    gifFrames = [];
  }
  mainFrame.classList.remove("renderingMode");
}

async function capture() {
  frameCounter++;
  let seekButton = l(".seek");
  if (togState(seekButton)) {
    seekButton.textContent = `Seek ${frameCounter}`;
  }
  if (!gifCapturing) {
    return;
  }
  updateRenderStats();
  if (frameCounter < wait) {
    return;
  }

  if (frameCounter % gifFrameRate !== 0) {
    return;
  }

  if (renderedFrames !== currentRenderFrame) {
    currentRenderFrame++;
    stopCapture();
    renderSpeed += 30;
    ops.render();
    return;
    // code to display abort status
  }
  // increase current render frame if caught up
  currentRenderFrame++;
  let stopFlag = false;
  if (gifFrames.length >= (gifFrameCount - 1)) {
    stopFlag = true;
  }
  // await sleep(300);
  var classStr = "";
  for (let cl of classIds) {
    var el = l("." + cl);
    if (el) {
      let color = getComputedStyle(el).getPropertyValue('color');
      classStr += `.${cl} { color: ${color} }`;
    }
  }

  const svg = l("svg");
  const img = new Image;
  let svgRawHtml = svg.outerHTML;
  var vb = {
    x: Math.round(cropX * svgW),
    y: Math.round(cropY * svgH),
    w: Math.round(cropW * svgW),
    h: Math.round((cropW * svgW) * cropH)
  }
  svgRawHtml = svgRawHtml.replace(/viewBox\=\".*?\"/, `viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}"`);
  svgRawHtml = svgRawHtml.replace(/\.[abcdefghi]\{.*?\.r/, classStr + ".r");
  svgRawHtml = svgRawHtml.replace(/\<\/foreignObject\>\<style\>(.*?)\.[abcdefghi]\{.*?keyframes/, "</foreignObject><style>$1 @keyframes");

  const svgHtml = (encodeURIComponent(svgRawHtml));
  img.src = `data:image/svg+xml;utf8,${svgHtml}`;
  const canvas = document.createElement('canvas');
  gifFrames.push(canvas);
  canvas.width = gifOutputWidth;
  canvas.height = Math.floor(gifOutputWidth * cropH);
  const ctx = canvas.getContext('2d');
  await img.decode();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (hasImage) {
    var x = Math.round(((imgX * svgW) - (cropX * svgW)) * gifWidthResolution);
    var y = Math.round(((imgY * svgH) - (cropY * svgH)) * gifWidthResolution);
    var w = Math.round((imgW * svgW) * gifWidthResolution);
    var h = Math.round(w * (baseImage.height / baseImage.width));
    ctx.globalAlpha = fade;
    ctx.drawImage(baseCanvas, x, y, w, h);
  }

  if (stopFlag) {
    stopCapture(true);
    gifMake();
  }
  renderedFrames = gifFrames.length;
}

function getMousePosition(e) {
  var p = e.target.getBoundingClientRect();
  var scale = e.target.width / parseFloat(p.width);
  var x = Math.round(((e.clientX || e.pageX) - p.left) * scale);
  var y = Math.round(((e.clientY || e.pageY) - p.top) * scale);
  return {
    x: x,
    y: y
  };
}

function updateCharset() {
  originalChars = [];
  charSet = [];
  let drawing = drawUndo[drawUndoIndex];
  for (const e of classIds) {
    for (let i = 0; i < drawing.length; i++) {
      if (classIdsSorted[parseInt(drawing.charAt(i))] === e) {
        originalChars.push(chars[parseInt(drawing.charAt(i))]);
        break;
      }
    }
  }
  charSet.push(originalChars);

  if (isOrigin) {
    if (SEED > 9000) {
      for (const e of uni) {
        charSet.push(makeSet(e));
      }
    } else {
      charSet.push(makeSet(uni[Math.floor(SEED) % uni.length]));
    }
  } else if (SEED > 9970) {
    for (const e of uni) {
      charSet.push(makeSet(e));
    }
  } else {
    SEED > 5e3 && charSet.push(makeSet(uni[Math.floor(SEED) % 3]));
  }

  charSet = charSet.flat();
  mainSet = originalChars.reverse();

  if (SEED > 9950) {
    mainSet = charSet;
  }
}

function onMouseDown(e) {
  let downPoint = getMousePosition(e);
  drawMask(downPoint.x, downPoint.y);
}

function drawMask(x, y) {

  updateParams();

  var ctx = baseCanvas.getContext("2d");

  var image = {
    data: ctx.getImageData(0, 0, baseImage.width, baseImage.height).data,
    width: baseImage.width,
    height: baseImage.height,
    bytes: 4
  };


  mask = MagicWand.floodFill(image, x, y, sense, null, true);
  if (mask) {
    mask = MagicWand.gaussBlurOnlyBorder(mask, blur, null);
  }

  paint("000000", 1);

}

function hexToRgb(hex, alpha) {
  var int = parseInt(hex, 16);
  var r = (int >> 16) & 255;
  var g = (int >> 8) & 255;
  var b = int & 255;

  return [r, g, b, Math.round(alpha * 255)];
}

function stopAnimation() {
  for (var i = 1; i < 99999; i++)
    window.clearInterval(i);
}

function resetAnimation() {
  let fontSize = getComputedStyle(l(".r")).getPropertyValue('font-size');
  for (let el of gridEls) {
    el.style.animation = 'none';
    el.offsetHeight; /* trigger reflow */
    el.style.animation = null;
    el.style.fontSize = fontSize;
  }
  frameCounter = -1;
  airship = 0;
  updatePallete();
}

async function contractCall(func, lockTime = now() + 60) {
  var resolved = null;
  var res = null;
  func().then((r) => {
    resolved = true;
    res = r;
  }).catch((err) => {
    console.log("contractCall() ERROR");
    console.log(err);
    resolved = false;
  });
  while (true) {
    await sleep(1000);
    if (resolved === true) {
      mainFrame.classList.remove("netWorkError");
      return res;
    } else if (lockTime - now() < 0) {
      mainFrame.classList.add("netWorkError");
      console.log('contractCall() FULL TIMEOUT');
      await sleep(10000);
      lockTime = now() + 60;
    } else if ((lockTime - now()) % 10 === 0) {
      console.log("10 second contractCall() timeout");
      var nr = await contractCall(func, lockTime);
      return nr;
    } else if (resolved === false) {
      console.log("contractCall() promise returned false");
      var nr = await contractCall(func, lockTime);
      return nr;
    }
  }
}

function svgToPng(originalBase64, width) {
  return new Promise(resolve => {
    let img = document.createElement('img');
    img.onload = function() {
      document.body.appendChild(img);
      let canvas = document.createElement("canvas");
      let ratio = (img.clientWidth / img.clientHeight) || 1;
      document.body.removeChild(img);
      canvas.width = width;
      canvas.height = width / ratio;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        let data = canvas.toDataURL('image/png');
        resolve(data);
      } catch (e) {
        resolve(null);
      }
    };
    img.src = originalBase64;
  });
}

async function gifMake() {
  gif = new GIF({
    workers: 2,
    quality: gifQuality,
    width: gifOutputWidth,
    height: gifOutputWidth * cropH,
    dither: dithers[getSliderVal(".algo")],
  });
  for (let c of gifFrames) {
    gif.addFrame(c, {
      delay: gifFrameRate * 10
    });
  }
  if (togState(l(".bounce"))) {
    for (let i = gifFrames.length - 2; i > 0; i--) {
      gif.addFrame(gifFrames[i], {
        delay: gifFrameRate * 10
      });
    }
  }
  gif.on('finished', function(gifData) {
    mainFrame.classList.remove("buildingMode");
    playBackSpeed = 10;
    updateParams();
    let gifUrl = URL.createObjectURL(gifData);
    // var win = window.open(URL.createObjectURL(gifData), "_blank"); // old way of no wrapper
    var win = window.open("", "_blank");
    win.document.write('<iframe src="' + gifUrl + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    win.document.title = "TerraformGif";


  });

  mainFrame.classList.add("buildingMode");
  gif.render();
}

function makeSet(e) {
  const t = [];
  for (let r = e; r < e + 10; r++) {
    t.push(String.fromCharCode(r));
  }
  return t;
}

function isAddress(address) {
  try {
    ethers.utils.getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
}

function unEscape(htmlStr) {
  htmlStr = htmlStr.replace(/&lt;/g, "<");
  htmlStr = htmlStr.replace(/&gt;/g, ">");
  htmlStr = htmlStr.replace(/&quot;/g, "\"");
  htmlStr = htmlStr.replace(/&#39;/g, "\'");
  htmlStr = htmlStr.replace(/&amp;/g, "&");
  return htmlStr;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function copyToClip(str) {
  var cb = document.createElement("input");
  cb.className = 'clipboard'
  document.body.appendChild(cb);
  cb.value = str;
  cb.select();
  document.execCommand("copy");
  document.body.removeChild(cb);
};

function milliMinutes(millis) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function now() {
  return Math.floor(Date.now() / 1000);
}

function l(selector, parent) {
  return (parent ? parent.querySelector(selector) : document.querySelector(selector));
}

function ls(selector, parent) {
  return (parent ? parent.querySelectorAll(selector) : document.querySelectorAll(selector));
}

window.onload = init;