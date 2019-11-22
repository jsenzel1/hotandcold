var _lat = 0;
var _lon = 0;
var previousD = 0;

var targetLat = 34.4;
var targetLon = -118.0;

var initD;

var pitch;

var d;

var initChecked; // bool

var blip;

var timer, timeMax;

var latWord, lonWord;

var pinDropRange;

var calcDist, oldCalcDist;

var tutorial, testing; // bools

var voxClips;

var percent;

var goodClips, badClips;

var winClipPlayed;

var winClip, updateClip;

var checkCounter;

function preload() {

  blip = loadSound("assets/blipLoud.mp3");
  winClip = loadSound("assets/winClip.mp3");
  updateClip = loadSound("assets/updateSound.mp3");

  voxClips = [];

  goodClips = [];
  badClips = [];

  for (var i = 0; i < 19; i++) {
    goodClips.push(loadSound("vox/good-" + (i + 1) + ".mp3"));
  }

  for (var i = 0; i < 22; i++) {
    badClips.push(loadSound("vox/bad-" + (i + 1) + ".mp3"));
  }




}

function setup() {


  tutorial = true;
  testing = false;

  frameRate(30);

  timer = 0;

  // pinDropRange = .00035;
  pinDropRange = .0035 / 2;

  randomSeed(month() + day() + year()+2);

  createCanvas(windowWidth, windowHeight);

  if (geoCheck() === false) {
    alert("geolocation is not supported on this device");
  } else {
    intervalCurrentPosition(positionUpdated, 2000);
  }


  //set targdistances with random function



  textAlign(CENTER);
  textSize(windowWidth * 0.03);


}



function draw() {

  if (calcDist > 94) {

    //newDestination();
    calcDist = 100;

    if (!winClipPlayed) {
      winClip.play();
      winClipPlayed = true;
    } else {

    }

  }



  if (tutorial) {
    tutorialText();
  }

  if (!tutorial) {

    if (testing) {
      testingText();
    } else {
      mainText();
    }

  }


  if (initChecked) {

    //print(targetLat + targetLon + _lat + _lon + "VARS");

    //old calcD
    //calcDist = map(d, 0, initD, 100, 0, true);


    if(millis() > 4000){
      calcDist = map(d, initD * 2, 0, -100, 100, true);
    } else {
      calcDist = 0;
    }



    //calcDist = (millis()/300);

    if (calcDist < -100) {
      calcDist = -100;
    }

    if (calcDist > 100) {
      caclDist = 100;
    }

    pitch = map(d, initD + (initD / 4), 0, 0.3, 13, true);

    if (pitch < .3) {
      pitch = .3;
    }

    if (pitch > 13) {
      pitch = 13;
    }
    //print("lat: " + _lat + " tLat: " + targetLat);

    //print(d);

    //constrain(pitch,.1,10);

    blip.rate(pitch);
  }

  //print("dist " + d);

  if (millis() > timer && initChecked) {



    timeMax = map(d, initD, 0, 250, 10, true);

    if (timeMax < 10) {
      timeMax = 10;
    }

    if (timeMax > 250) {
      timeMax = 250;
    }

    timer += timeMax

    //print("timeMax" + timeMax);

    timer += 500;

    //print("curtime" +millis + "timer " + timer);

    blip.play();

  }


  if (d - previousD > 0) {
    // colder 

  } else {
    // hotter 
  }

  previousD = d;





}


function positionUpdated(position) {
  //print("CUR DIST: " + d);

  _lat = position.latitude;
  _lon = position.longitude;


  latWord = nfc(_lat, 8);
  lonWord = nfc(_lon, 8);

  //print(_lon);

  
  d = dist(_lat, _lon, targetLat, targetLon);
  

  checkCounter++;


  //updateClip.play();

  if (!initChecked) {



    _lat = position.latitude;
    _lon = position.longitude;


    targetLat = (_lat + (random(-pinDropRange, pinDropRange)));
    targetLon = (_lon + (random(-pinDropRange, pinDropRange)));

    print(targetLat + " TARGET LAT");


    //targetLon = nfc((_lon +  (random(-0.00035, 0.00035))) * 0.7,8);


    print("TESTERS");
    print(_lat);
    print(_lon);
    print(targetLat);

    print(targetLon);

    initD = dist(_lat, _lon, targetLat, targetLon);


    print("INITIAL DISTANCE: " + initD);

    oldCalcDist = 0;


    initChecked = true;




  }

  if (initChecked) {
    posCheckAudio();
  }
}

function posCheckAudio() {

  var curArr = [];

  print(calcDist - oldCalcDist);
  //print("OCD: " +oldCalcDist);

  //if (millis > 5) {

    if ((calcDist - oldCalcDist) > 7) {

      curArr = badClips;

      randomSeed(millis());
      curArr[int(random(0, curArr.length))].play();
      randomSeed(month() + day() + year());

      oldCalcDist = calcDist;

    }

    if ((calcDist - oldCalcDist) < -7) {

      curArr = goodClips;

      randomSeed(millis());

      curArr[int(random(0, curArr.length))].play();
      randomSeed(month() + day() + year());


      oldCalcDist = calcDist;

    }
  //}


}

function mainText() {

  background(240);

  textSize(windowWidth * .1);

  text("PROGRESS ", width / 2, height * .3);
  text("TO DESTINATION", width / 2, height * .4);

  if (initChecked && calcDist != null) {
    text(nfc(calcDist, 0) + " %", width / 2, height * .6);
  }

}

function tutorialText() {

  textSize(windowWidth * 0.08);

  background(240);

  fill(0);
  text("FIND YOUR PLACE ", width / 2, 0.30 * height);
  text("BY LISTENING", width / 2, 0.40 * height);


  fill(255);
  rectMode(CENTER);
  noStroke();

  fill(0);

  text("PRESS ANYHWHERE", width / 2, 0.70 * height);
  text("TO START", width / 2, 0.80 * height);


}

function testingText() {

  textSize(windowWidth * 0.03);

  background(240);
  text("LAT\n" + latWord, width / 2, 0.20 * height);
  text("LON\n" + lonWord, width / 2, 0.3 * height);

  text("TargLAT\n" + targetLat, width / 2, 0.40 * height);
  text("TargLON\n" + targetLon, width / 2, 0.5 * height);


  text("DIST\n" + d, width / 2, 0.6 * height);
  text("INITDIST\n" + initD, width / 2, 0.8 * height);


  text("LERPDIST\n" + calcDist, width / 2, 0.7 * height);

  text("PITCH\n" + pitch, width / 2, 0.9 * height);

}

function newDestination() {

  //play congratulations

  targetLat = (_lat + (random(-pinDropRange, pinDropRange)));
  targetLon = (_lon + (random(-pinDropRange, pinDropRange)));



  initD = dist(_lat, _lon, targetLat, targetLon);


}

function mousePressed() {

  tutorial = false;

}