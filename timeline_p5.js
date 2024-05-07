let loaded = false;
let sessions = [];
let sessionX = [];
let selectedIndex = 0;
let minDate, maxDate;
let leftEdge, rightEdge;
let allWords = [];
let highlightedWord = '';

function setup() {
  // createCanvas(1280, 720);
  let myCanvas1 = createCanvas(windowWidth-75, 800);
  leftEdge = 20;
  rightEdge = windowWidth - 120;
  myCanvas1.parent('timeline');

  loadJSON("overall_timeseries.json", dataLoaded);
}

function draw() {
  // background(60, 63, 108);
  background("black");

  if (loaded) {
    drawWordList();
    drawSessions();
    drawHeadlines();
  } else {
    textAlign(CENTER, CENTER);
    text("Loading " + frameCount, width / 2, height / 2);
  }
}

function drawWordList() {
  fill(255);
  textSize(15); // Normal text size for words list
  textAlign(LEFT, TOP);
  let y = 300;
  for (let word of allWords) {
    let opacity = word === highlightedWord ? 255 : 100;
    fill(255, opacity);
    text(word, 20, y);
    y += 20;
  }
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  let words = text.split(' ');
  let line = '';
  
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let testWidth = textWidth(testLine);
    
    if (testWidth > maxWidth && i > 0) {
      text(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  
  text(line, x, y);
}

function drawSessions() {
  for (let i = 0; i < sessions.length; i++) {
    // console.log(sessionX);
    let x = sessionX[i];
    let hasHighlightedWord = highlightedWord && sessions[i].words.includes(highlightedWord);
    let opacity = hasHighlightedWord ? 255 : 100;
    stroke(255, opacity);
    strokeWeight(map(sessions[i].wordDensity, 0, getMaxDensity(), 1, 5));
    line(x, 150, x, 200); // Adjusted timeline position to make space for headlines
  }

  let sx = sessionX[selectedIndex];
  let date = sessions[selectedIndex].dateString;
  let hasHighlightedWord = highlightedWord && sessions[selectedIndex].words.includes(highlightedWord);
  let opacity = hasHighlightedWord ? 255 : 100;

  stroke(255, opacity);
  line(sx, 120, sx, 150);

  noStroke();
  fill(255, opacity);
  textSize(12); // Normal text size for dates
  textAlign(RIGHT, BOTTOM);
  text(date, sx - 6, 134);

  fill(255);
  textAlign(LEFT, TOP);
  text("Preview:", 150, 330); // Adjust preview position to avoid overlapping word list
  textSize(30);
  // textWidth(100);
  textWrap(WORD);
  let headlinePreview = sessions[selectedIndex].headlines.slice(0, 2).join("; ");
  text(headlinePreview, 150, 350, 500); //, 150, 15);
}


function drawHeadlines() {
  let headlineYPosition = 50;
  textSize(5); // Small text size for headlines

  for (let i = 0; i < sessions.length; i++) {
    let x = sessionX[i];
    let hasHighlightedWord = highlightedWord && sessions[i].words.includes(highlightedWord);
    let opacity = hasHighlightedWord ? 255 : 50;

    fill(255, opacity);
    textAlign(LEFT, TOP);
    text(sessions[i].headlines.join(", "), x, headlineYPosition);
    
    headlineYPosition += 7; // Increment y-position to prevent overlapping headlines
  }
}

function mouseMoved() {
  let closestDistance = width * 2;
  let distance;

  for (let i = 0; i < sessionX.length; i++) {
    let x = sessionX[i];
    distance = abs(mouseX - x);
    if (distance < closestDistance) {
      closestDistance = distance;
      selectedIndex = i;
    }
  }
  loop();
}

function mousePressed() {
  let mouseYPosition = mouseY;
  let wordIndex = Math.floor((mouseYPosition - 120) / 20);
  if (wordIndex >= 0 && wordIndex < allWords.length) {
    highlightedWord = allWords[wordIndex];
  }
  loop();
}

function dataLoaded(data) {
  sessions = data;

  for (let i = 0; i < sessions.length; i++) {
    sessions[i].dateString = sessions[i].date;
    sessions[i].date = new Date(sessions[i].date).getTime();
    sessions[i].wordDensity = sessions[i].words.length;

    allWords = Array.from(new Set(allWords.concat(sessions[i].words)));
  }

  minDate = sessions[0].date;
  maxDate = sessions[0].date;

  for (let i = 1; i < sessions.length; i++) {
    let d = sessions[i].date;
    if (d < minDate) {
      minDate = d;
    }
    if (d > maxDate) {
      maxDate = d;
    }
  }

  sessionX = [];
  for (let i = 0; i < sessions.length; i++) {
    let d = sessions[i].date;
    sessionX[i] = map(d, minDate, maxDate, leftEdge, rightEdge);
  }
  loaded = true;
}

function getMaxDensity() {
  return Math.max(...sessions.map(session => session.wordDensity));
}
