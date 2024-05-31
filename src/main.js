import { GUI } from "./Library/dat.gui.module.js";
/////////////////////////////////////////////
// Enlace
/////////////////////////////////////////////
// Aranda\Lasch
// Jesse Bassett
// Chris Lasch
// 2/5/2024

// replacement searches:
// UPLOAD   -- for minify step
// FEATURES -- for features step
// AB SEED   - for seed refactor


let credits = shuffleArrayRandom(["Benjamin Aranda", "Chris Lasch", "Jesse Bassett", "Joaquin Bonifaz"])
console.log("Enlace by ArandaLasch")
// console.log("Benjamin Aranda, Chris Lasch, Jesse Bassett, Joaquin Bonifaz")
console.log(`${credits[0]}, ${credits[1]}, ${credits[2]}, ${credits[3]}`)
console.log("In collaboration with Trame and Maison Louis Drucker ")
console.log("")

/////////////////////////////////////////////
// Random_JB
/////////////////////////////////////////////

class Random {
  constructor(startingHash) {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substring(0, 8), 16);
      let b = parseInt(uint128Hex.substring(8, 16), 16);
      let c = parseInt(uint128Hex.substring(16, 24), 16);
      let d = parseInt(uint128Hex.substring(24, 32), 16);
      return function () {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    if (startingHash) {
      // seed prngA with first half of tokenData.hash
      this.prngA = new sfc32(startingHash.substring(2, 34));
      // seed prngB with second half of tokenData.hash
      this.prngB = new sfc32(startingHash.substring(34, 66));
    } else {
      // seed prngA with first half of tokenData.hash
      this.prngA = new sfc32(tokenData.hash.substring(2, 34));
      // seed prngB with second half of tokenData.hash
      this.prngB = new sfc32(tokenData.hash.substring(34, 66));
    }
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
  // random number between a (inclusive) and b (exclusive)
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
  // random boolean with p as percent liklihood of true
  random_bool(p) {
    return this.random_dec() < p;
  }
  // random value in an array of items
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)];
  }
  rand(a = 0, b = 1) {
    // random number between a (inclusive) and b (exclusive)
    return a + (b - a) * this.random_dec();
  }
}

/////////////////////////////////////////////
// Stub
/////////////////////////////////////////////
let R;

/////////////////////////////////////////////
// Server
/////////////////////////////////////////////
let baseSeed = Math.floor(Math.random() * 89999 + 10000); // 10;
let seed;
let nodeOverWriteData = undefined;
let presets = [];
if (typeof nodeOverWriteData === "undefined") {
  if (nodeOverWriteData === undefined) {
    nodeOverWriteData =
      presets[Math.floor(Math.random() * presets.length - 0 + 0)];
  }
}
class serverListener {
  constructor() {
    this.overWrite;
    this.exportImg = false;
    this.injected = false;
    this.checkForInjection();
    this.exported = false;
  }
  checkForInjection() {
    if (typeof nodeOverWriteData === "undefined") {
      //nodeOverWriteData from server
      this.injected = false;
      this.overWrite = null;
    } else {
      this.injected = true;
      this.overWrite = nodeOverWriteData;
      console.log(this.overWrite);
    }
    console.log(`injected: ${this.injected}`);
  }
  logInjection() {
    console.log(`injected: ${server.injected}`);
  }
  injectSeed() {
    if (this.injected) {
      if (this.overWrite.seed !== undefined) {
        baseSeed = this.overWrite.seed;
      }
    }
  }
  injectExport() {
    if (this.injected) {
      if (this.overWrite.export !== undefined) {
        if (this.overWrite.export == true) {
          return true;
        } else if (this.overWrite.export == false) {
          return false;
        } else {
          return false;
        }
      }
    }
  }
  injectVars() {
    if (this.injected) {
      // console.log("HERE")
      // console.log(this.overWrite.var)
      for (let key in this.overWrite.var) {
        // console.log(key)
        // console.log(this.overWrite[key])
        // console.log(`${key}:${this.overWrite.var[key]}  `)
        this.injectKey(key);
      }
    }
  }
  injectKey(key) {
    // console.log( `KEY`)
    // console.log( `original ${key} val :${M.var[key]}`)
    if (this.injected) {
      if (this.overWrite.var[key] !== undefined) {
        if (typeof this.overWrite.var[key] === "function") {
          M.var[key] = this.overWrite.var[key]();
        } else {
          M.var[key] = this.overWrite.var[key];
        }
        // console.log(M.var[key])
        // console.log( M.var[key])
      } else {
        // console.log(`DNE, ${M.var[key]}`)
      }
      //   console.log("")
    }
  }
  injectTitle() {
    if (this.injected) {
      if (this.overWrite.title !== undefined) {
        if (this.overWrite.title != 0) {
          return this.overWrite.title + " ";
        } else {
          return "";
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
  injectIndex() {
    if (this.injected) {
      M.title = this.overWrite.title;
      M.index = this.overWrite.index;
    }
  }
  print() {
    console.log((this.overWrite = nodeOverWriteData));
  }
  timedExport(t = 0, delay = 30) {
    if (t > delay && this.exported == false && this.exportImg) {
      if (this.injected) {
        this.triggerExport();
      }
    }
  }
  triggerExport(timeout = 5) {
    this.exported = true;
    let bulkFileName = `${M.index} ${M.title} ${M.seed}`;
    bulkFileName = M.seed;
    // saveCanvas(bulkFileName);
    saveLargeCanvas(bulkFileName);
    formatJson();
    saveJson(bulkFileName);
    setTimeout(function () {
      console.log("re-load");
      window.location.href = window.location.href;
    }, timeout * 1000);
  }
}
let server = new serverListener();
server.injectSeed();

/////////////////////////////////////////////
// Seed
/////////////////////////////////////////////
let seedTemp = cyrb128(baseSeed.toString());
let seedRand = sfc32(seedTemp[0], seedTemp[1], seedTemp[2], seedTemp[3]);
seed = genTokenData().hash;
R = new Random(seed);

// Create a new div element // AB SEED
let newDiv = document.createElement("div");
newDiv.id = "container";
newDiv.style.display = "inline-block";
newDiv.style.margin = "0";
newDiv.style.width = "100%";
newDiv.style.height = "100%";
document.body.appendChild(newDiv);

// Access the <html> element and modify its style
document.documentElement.style.overflow = "hidden";
// Access the <body> element and modify its style
document.body.style.overflow = "hidden";

/////////////////////////////////////////////
// gui
/////////////////////////////////////////////
let gui;

/////////////////////////////////////////////
// global
/////////////////////////////////////////////
// window.devicePixelRatio = 1
let devicePixelRatio = window.devicePixelRatio || 1;
let renderer, camera, scene, raycaster, mouse;
let myCa;
let wPat = "";
let wPat_print = "";
let DIM = { x: Math.min(window.innerWidth, window.innerHeight) };
DIM.y = DIM.x;
// let viewportWidth = window.innerWidth;
// let viewportHeight = window.innerHeight;

// TEXT OVERLAY
let tabelCells = [];
let squareDiv = document.createElement("div");
let innerDiv = document.createElement("div");
squareDiv.appendChild(innerDiv);

newDiv.appendChild(squareDiv);
// document.body.appendChild(squareDiv)

let displayColors = {
  treadling: {
    active: { cell: 0xffffff, edge: 0x000000 },
    inactive: { cell: 0xffffff, edge: 0x000000 },
  },
  tieUp: {
    active: { cell: 0xffffff, edge: 0x000000 },
    inactive: { cell: 0xffffff, edge: 0x000000 },
  },
  threading: {
    active: { cell: 0xffffff, edge: 0x000000 },
    inactive: { cell: 0xffffff, edge: 0x000000 },
  },
  background: 0x000000,
  backgroundName: "White",
};
let druckerSatinColors = {
  oliveGreen: 0x384040,
  tenderGreen: 0x516957,
  appleGreen: 0x9abe7d,
  emeraldGreen: 0x12676e,
  purpleMaroon: 0x4a273b,
  carminRed: 0x5c2e2e,
  scarletRed: 0xa2223d,
  rubyRed: 0x5b2d39,
  terracotta: 0x884135,
  pink: 0xa75561,
  lightPink: 0xb76571,
  black: 0x212429,
  grey: 0x696c69,
  blueGrey: 0xbfc0b7,
  white: 0xe2e8e4,
  royalBlue: 0x223c75,
  ultraMarine: 0x19283b,
  lavenderBlue: 0x353d4c,
  lagoonBlue: 0x0076c9,
  softBlue: 0x55838e,
  waterGreen: 0xa2b5af,
  chocolate: 0x3b3738,
  weatheredGold: 0x5f5045,
  beige: 0x998366,
  taupe: 0x9e8d7e,
  ivory: 0xdacea3,
  orange: 0xc85430,
  peach: 0xddad6e,
  yellowTumeric: 0xc7982a,
  brightYellow: 0xdfb500,
};

let colorNames = {
  oliveGreen: { eng: "Olive Green", fr: "Vert Olive" },
  tenderGreen: { eng: "Tender Green", fr: "Vert Tendre" },
  appleGreen: { eng: "Apple Green", fr: "Vert Pomme" },
  emeraldGreen: { eng: "Emerald Green", fr: "Vert Emeraude" }, // UTF8 // No Match
  purpleMaroon: { eng: "Purple Maroon", fr: "Bordeaux Violet" },
  carminRed: { eng: "Carmin Red", fr: "Rouge Carmin" },
  scarletRed: { eng: "Scarlet Red", fr: "Rouge Ecarlate" },
  rubyRed: { eng: "Ruby Red", fr: "Rouge Rubis" },
  terracotta: { eng: "Terracotta", fr: "Terracotta" },
  pink: { eng: "Pink", fr: "Rose" },
  lightPink: { eng: "Light Pink", fr: "Rose Pastel" },
  black: { eng: "Black", fr: "Noir" },
  grey: { eng: "Grey", fr: "Gris" },
  blueGrey: { eng: "Blue Grey", fr: "Gris Bleute" }, // UTF8
  white: { eng: "White", fr: "Blanc" },
  royalBlue: { eng: "Royal Blue", fr: "Bleu Royal" },
  ultraMarine: { eng: "Ultra Marine", fr: "Bleu Outrener" },
  lavenderBlue: { eng: "Lavender Blue", fr: "Bleu Lavande" },
  lagoonBlue: { eng: "Lagoon Blue", fr: "Bleu Lagon" },
  softBlue: { eng: "Soft Blue", fr: "Bleu Doux" },
  waterGreen: { eng: "Water Green", fr: "Vert D'Eau" }, // UTF8
  chocolate: { eng: "Chocolate", fr: "Chocolat" },
  weatheredGold: { eng: "Weathered Gold", fr: "Or Patine" }, // UTF8
  beige: { eng: "Beige", fr: "Beige" },
  taupe: { eng: "Taupe", fr: "Taupe" },
  ivory: { eng: "Ivory", fr: "Ivoire" },
  orange: { eng: "Orange", fr: "Orange" }, // UTF8
  peach: { eng: "Peach", fr: "Peche" }, // UTF8
  yellowTumeric: { eng: "Yellow Tumeric", fr: "Jaune Curcuma" },
  brightYellow: { eng: "BrightYellow", fr: "Jaune Vif" },
};
function getColorFromLang(col) {
  // Iterate over the keys of the colorNames object
  for (let key in colorNames) {
    // Check if the current object's eng property matches the provided color
    if (colorNames[key].eng === col) {
      // If a match is found, return the key
      return key;
    }
  }
  // If no match is found, return undefined or any other suitable value
  return undefined;
}
let colorCull = [
  ["peach","brightYellow"],
  ["rubyRed","purpleMaroon"],
  ["tenderGreen","weatheredGold"],
  ["royalBlue","lavenderBlue"],
  ["oliveGreen","lavenderBlue"],
  ["chocolate","oliveGreen"],
  ["carminRed", "rubyRed"],
]

let palettes = {
  2: [
    {
      name: "Light",
      p: 1,
      arr: ["white", "scarletRed"],
    },
    {
      name: "Dark",
      p: 1,
      arr: ["black", "purpleMaroon"],
    },
    {
      name: "Warm",
      p: 1, //Yellow
      arr: ["yellowTumeric", "lagoonBlue"],
    },
    {
      name: "Warm",
      p: 1,
      arr: ["scarletRed", "softBlue"],
    },
    {
      name: "Warm",
      p: 1,
      arr: ["terracotta", "beige"],
    },
    {
      name: "Cool",
      p: 1,
      arr: ["waterGreen", "black"],
    },
    {
      name: "Cool",
      p: 1,
      arr: ["waterGreen", "royalBlue"],
    },
    {
      name: "Cool",
      p: 1,
      arr: ["emeraldGreen", "waterGreen"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["oliveGreen", "taupe"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["white", "black"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["softBlue", "rubyRed"],
    },
    {
      //NEW
      name: "Cool",
      p: 1,
      arr: ["tenderGreen", "white"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["black", "ivory"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["ultraMarine", "ivory"],
    },
    {
      name: "Dark",
      p: 1,
      arr: ["black", "weatheredGold"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["oliveGreen", "lightPink"],
    },
    {
      name: "Warm",
      p: 1,
      arr: ["orange", "peach"],
    },
    {
      name: "Cool",
      p: 1,
      arr: ["lagoonBlue", "orange"],
    },
    {
      name: "Cool",
      p: 1,
      arr: ["waterGreen", "softBlue"],
    },
    {
      name: "Light",
      p: 1,
      arr: ["grey", "ivory"],
    },
    {
      name: "Light",
      p: 1,
      arr: ["pink", "ivory"],
    },
    {
      name: "Light",
      p: 1,
      arr: ["white", "grey"],
    },
  ],
  3: [
    {
      name: "Light",
      p: 1,
      arr: ["white", "weatheredGold", "grey"],
    },
    {
      name: "Dark",
      p: 1,
      arr: ["carminRed", "lavenderBlue", "emeraldGreen"],
    },
    {
      name: "Warm",
      p: 1, // Yello
      arr: ["brightYellow", "waterGreen", "black"],
    },
    // {
      // name: "Warm",
      // p: 1, // Yello
      // arr: ["brightYellow", "ultraMarine", "peach"],
    // },
    {
      name: "Warm",
      p: 1,
      arr: ["ultraMarine", "orange", "tenderGreen"],
    },
    {
      name: "Cool",
      p: 1,
      arr: ["royalBlue", "taupe", "blueGrey"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["terracotta", "appleGreen", "black"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["taupe", "pink", "emeraldGreen"],
    },
    {
      // NEW
      name: "Mix",
      p: 1,
      arr: ["oliveGreen", "ivory", "grey"],
    },
    //{
    //  name: "Warm",
    //  p: 1,
    //  arr: ["orange", "peach", "brightYellow"],
    //},
    {
      name: "Mix",
      p: 1,
      arr: ["oliveGreen", "lightPink", "appleGreen"],
    },
    {
      name: "Warm",
      p: 1,
      arr: ["oliveGreen", "yellowTumeric", "beige"],
    },
  ],
  4: [
    {
      name: "Light",
      p: 1,
      arr: ["white", "softBlue", "emeraldGreen", "scarletRed"],
    },
    {
      name: "Light",
      p: 1,
      arr: ["lagoonBlue", "royalBlue", "orange", "white"],
    },
    {
      name: "Light",
      p: 1,
      arr: ["terracotta", "ultraMarine", "lightPink", "lagoonBlue"],
    },
    {
      name: "Dark",
      p: 1,
      arr: ["weatheredGold", "rubyRed", "ultraMarine", "lagoonBlue"],
    },
    {
      name: "Warm",
      p: 1, // Yellow
      arr: ["ivory", "taupe", "blueGrey", "appleGreen"],
    },
    {
      name: "Warm",
      p: 1,
      arr: ["scarletRed", "rubyRed", "purpleMaroon", "white"],
    },
    {
      name: "Cool",
      p: 1,
      arr: ["waterGreen", "tenderGreen", "lightPink", "purpleMaroon"],
    },
    {
      name: "Cool",
      p: 1,
      arr: ["lagoonBlue", "ivory", "brightYellow", "purpleMaroon"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["black", "weatheredGold", "grey", "appleGreen"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["emeraldGreen", "scarletRed", "taupe", "chocolate"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["oliveGreen", "waterGreen", "beige", "scarletRed"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["grey", "carminRed", "rubyRed", "peach"],
    },
    {
      //NEW
      name: "Cool",
      p: 1,
      arr: ["tenderGreen", "ivory", "weatheredGold", "oliveGreen"],
    },
    {
      name: "Warm",
      p: 1,
      arr: ["rubyRed", "terracotta", "yellowTumeric", "peach"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["tenderGreen", "terracotta", "ivory", "taupe"],
    },
  ],
  5: [
    {
      name: "Light",
      p: 1,
      arr: ["waterGreen", "white", "beige", "terracotta", "ultraMarine"],
    },
    {
      name: "Dark",
      p: 1,
      arr: ["chocolate", "grey", "blueGrey", "ivory", "weatheredGold"],
    },
    {
      name: "Warm",
      p: 1, // Yellow
      arr: ["peach", "orange", "tenderGreen", "scarletRed", "waterGreen"],
    },
    {
      name: "Warm",
      p: 1, // Yellow
      arr: ["terracotta", "pink", "scarletRed", "ivory", "grey"],
    },
    {
      name: "Red",
      p: 1,
      arr: ["grey", "orange", "beige", "ultraMarine", "weatheredGold"],
    },
    {
      name: "Cool",
      p: 1,
      arr: [
        "royalBlue",
        "ultraMarine",
        "lavenderBlue",
        "softBlue",
        "waterGreen",
      ],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["emeraldGreen", "scarletRed", "taupe", "chocolate", "oliveGreen"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["oliveGreen", "waterGreen", "beige", "scarletRed", "lightPink"],
    },
    {
      //NEW
      name: "Cool",
      p: 1,
      arr: [
        "tenderGreen",
        "ivory",
        "weatheredGold",
        "oliveGreen",
        "lavenderBlue",
      ],
    },
    {
      name: "Warm",
      p: 1,
      arr: ["rubyRed", "terracotta", "yellowTumeric", "peach", "pink"],
    },
    {
      name: "Mix",
      p: 1,
      arr: ["tenderGreen", "terracotta", "ivory", "taupe", "weatheredGold"],
    },
  ],
  // "6":[ // removed from possibilites? only here for debug
  // {
  // name:"Light",p:1,
  // arr:["waterGreen","white","beige","terracotta","ultraMarine","lightPink"],
  // },
  // ]
};

//////////////////////////////////////
//            VARIABLES
//////////////////////////////////////
let spacingTypes = ["Standard", "Tight", "Close"];
let threadingPatternTypes = ["twill", "triWave", "vPattern", "rand"];
let treadlingPatternTypes = ["twill", "triWave", "vPattern", "rand"];
let colorPalettes = ["random", "analogous", "fromArray", "fromSelected"];
let presetTypes = ["None", "Duochrome", "Figure", "Linear", "Field"];
let colorArrayNames = ["Red", "Yellow", "Blue", "Mix", "Light", "Dark"];
let colorSelectNames = ["Warm", "Cool", "Mix", "Light", "Dark"];
let layouts = ["Original", "Tight"];
let displayModes = ["Original", "Inverse", "Grid", "Weave Colors"];
let weave;
let M = { var: {} };
M.seed = seed;
M.baseSeed = baseSeed;
server.injectIndex();
M.var = {
  zoom: 30,
  cellSize: 1,
  activeColor: new THREE.Color(0x959595),
  inactiveColor: new THREE.Color(0xeeeeee),
  backgroundColor: new THREE.Color(0xeeeeee),
  warpColors: [],
  weftColors: [],
  //ca vars
  theRules: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  maxGen: 2,
  // Grid Vars
  NUM_SHAFTS: 8,
  NUM_THREADS: 50,
  NUM_TREADLES: 0,
  NUM_PICKS: 0,
  startX: -27,
  startY: 22,
  // spacing
  verticalSpacingType: rWeightedItems(spacingTypes, [1, 2, 0]),
  verticalSpacing: rWeightedItems([1.25, 1, 1], [1, 2, 0]),
  // threading
  threadingPattern: rWeightedItems(threadingPatternTypes, [1, 1, 0, 1 / 10]), //"triWave",// "twill", // rWeightedItems(threadingPatternTypes,[1,1,0,0.25]), // "twill",//
  threadingSlope: rWeightedItems([0.5, 1, 2], [1, 1, 1]), //0.5,//8/(50/35), // rWeightedItems([0.5, 1, 2],[1,1,1]), //2,
  threadingOffset: 1,
  threadingTranslate: 0,
  threadingMirrorPattern: false,
  threadingMirrorColor: false,
  // treadling
  treadlingPattern: rWeightedItems(treadlingPatternTypes, [1, 1, 0, 1 / 10]), // "twill",//
  treadlingSlope: rWeightedItems([0.5, 1, 2], [1, 1, 1]), //2,
  treadlingOffset: 1,
  treadlingTranslate: 0,
  treadlingMirrorPattern: false,
  treadlingMirrorColor: false,
  //Color
  colorSelectName: rWeightedItems(colorSelectNames, [1, 1, 1, 1, 1]),
  colorArrayName: rWeightedItems(colorArrayNames, [1, 1, 1, 1, 1, 1]),
  colorPalette: rWeightedItems(colorPalettes, [0, 0, 0, 1]),
  colorWeftCount: rWeightedItems([1, 2, 3], [1, 1, 1]),
  colorWarpCount: rWeightedItems([1, 2, 3], [1, 1, 1]),
  colorWarp: [],
  colorWeft: [],
  colorWarpNames: [],
  colorWeftNames: [],
  colorMaterial: rWeightedItems(["Satin", "Glossy"], [1, 0]), // we only use Satin Now
  //geo
  drawEdges: false,
  //checks
  passedLengthTest: true,
  maxRun: 8,
  preset: rWeightedItems(presetTypes, [0, 30, 15, 20, 35]), //[0,1,1,1,0.5]
  //Layout
  displayMode: rWeightedItems(displayModes, [0, 35, 55, 10]),
  layout: rWeightedItems(layouts, [0, 1]),
  threadingPosX: 0,
  threadingPosY: 0,
  tieUpPosX: 0,
  tieUpPosY: 0,
  treadlingPosX: 0,
  treadlingPosY: 0,
  colorWarpPosX: 0,
  colorWarpPosY: 0,
  colorWeftPosX: 0,
  colorWeftPosY: 0,
  drawdownPosX: 0,
  drawdownPosY: 0,
  colorWarpVisible: true,
  colorWeftVisible: false,
  //
  textVisible: false,
};

// overrides
M.var.NUM_TREADLES = M.var.NUM_SHAFTS;
M.var.NUM_PICKS = M.var.NUM_THREADS;
// M.var.verticalSpacingType = "Close"
// M.var.verticalSpacing =1

// server inject
server.injectVars();
// console.log(M.var.preset)
if (M.var.preset == "Duochrome") {
  // 2 colors
  M.var.colorWeftCount = 1;
  M.var.colorWarpCount = 1;
} else if (M.var.preset == "Figure") {
  // 1 x (2-3) colors
  // ca pattern with large gaps (can we control that?)
  if (R.random_bool(-1)) {
    M.var.colorWeftCount = 1;
    M.var.colorWarpCount = rWeightedItems([2, 3], [1.25, 1]);
  } else {
    M.var.colorWeftCount = rWeightedItems([2, 3], [1, 0]);
    M.var.colorWarpCount = 1;
  }
  M.var.threadingPattern = rWeightedItems(["twill", "triWave"], [1, 3]);
  M.var.threadingSlope = rWeightedItems([0.5, 1], [1.5, 0.8]);
  M.var.treadlingPattern = rWeightedItems(["twill", "triWave"], [1, 3]);
  M.var.treadlingSlope = rWeightedItems([0.5, 1], [1.5, 0.8]);
} else if (M.var.preset == "Linear") {
  // 1 x (2-3) colors
  // vertical spacing
  // ca pattern with large gaps (can we control that?)
  if (R.random_bool(-1)) {
    M.var.colorWeftCount = 1;
    M.var.colorWarpCount = rWeightedItems([2, 3], [1.25, 1]);
    M.var.treadlingPattern = rWeightedItems(["twill", "triWave"], [1, 1]);
    M.var.treadlingSlope = rWeightedItems([1, 2], [0.5, 1.5]);
    M.var.verticalSpacingType = rWeightedItems(spacingTypes, [1.1, 0.5, 0]);
  } else {
    M.var.colorWeftCount = rWeightedItems([2, 3], [1, 1.5]);
    M.var.colorWarpCount = 1;
    M.var.verticalSpacingType = rWeightedItems(spacingTypes, [1.2, 0.5, 0]);

    M.var.threadingPattern = rWeightedItems(["twill", "triWave"], [1, 1]);
    M.var.threadingSlope = 2;

    M.var.treadlingPattern = rWeightedItems(["twill", "triWave"], [1, 1]);
    M.var.treadlingSlope = rWeightedItems([1, 2], [0.5, 1.5]);
  }
} else if (M.var.preset == "Field") {
  // more than 4 colors
  M.var.colorWarpCount = rWeightedItems([2, 3], [1.25, 1]);
  M.var.colorWeftCount = rWeightedItems([2, 3], [1.25, 1]);
  M.var.threadingPattern = rWeightedItems(
    ["twill", "triWave", "rand"],
    [1, 1, 1]
  );
  M.var.threadingSlope = rWeightedItems([0.5, 1, 2], [1, 1, 1]);
  M.var.treadlingPattern = rWeightedItems(
    ["twill", "triWave", "rand"],
    [1, 1, 1]
  );
  M.var.treadlingSlope = rWeightedItems([0.5, 1, 2], [1, 1, 1]);

  if (M.var.colorWarpCount + M.var.colorWeftCount == 6) {
    M.var.colorWeftCount--;
  }
}

// dependent functions
if (M.var.verticalSpacingType == "Close") {
  M.var.verticalSpacing = 1;
} else if (M.var.verticalSpacingType == "Tight") {
  M.var.verticalSpacing = 1.25;
} else if (M.var.verticalSpacingType == "Standard") {
  M.var.verticalSpacing = 1.5;
}

if (M.var.layout == "Original") {
  M.var.threadingPosX = 0;
  M.var.threadingPosY = 0;
  M.var.tieUpPosX = 0;
  M.var.tieUpPosY = 0;
  M.var.treadlingPosX = 0;
  M.var.treadlingPosY = 0;
  M.var.colorWarpPosX = 0;
  M.var.colorWarpPosY = 0;
  M.var.colorWeftPosX = 0;
  M.var.colorWeftPosY = 0;
  M.var.drawdownPosX = 0;
  M.var.drawdownPosY = 0;
  M.var.colorWarpVisible = true;
  M.var.colorWeftVisible = true;
} else if (M.var.layout == "Tight") {
  let s = 2;
  let f = 0.0;
  M.var.threadingPosX = 0;
  M.var.threadingPosY = -s;
  M.var.tieUpPosX = -s;
  M.var.tieUpPosY = -s;
  M.var.treadlingPosX = -s + f;
  M.var.treadlingPosY = 0;
  M.var.colorWarpPosX = 0;
  M.var.colorWarpPosY = -s - 1;
  M.var.colorWeftPosX = -s - 2 + f;
  M.var.colorWeftPosY = 0;
  M.var.drawdownPosX = f;
  M.var.drawdownPosY = 0;
  M.var.colorWarpVisible = false;
  M.var.colorWeftVisible = false;
}

// console.log(displayColors)
console.log("M", M);
// console.log("");
////////////////////////////////////////////////////////
//  classes
////////////////////////////////////////////////////////
class squareGrid {
  constructor(name, x, y, w, h, ox, oy) {
    this.name = name;
    this.position = new THREE.Vector2(x, y);
    this.size = new THREE.Vector2(w, h);
    this.length = w * h;
    this.pattern = [[]]; // values for compute
    this.mesh = [[]]; // holds meshes
    this.posOffset = [[]];
    this.offSet = { x: ox, y: oy };
  }
}

class weavedraft {
  constructor() {
    this.threading = new squareGrid(
      "threading",
      M.var.startX + M.var.threadingPosX,
      M.var.startY + M.var.threadingPosY,
      M.var.NUM_SHAFTS,
      M.var.NUM_THREADS,
      1,
      1
    );
    this.tieUp = new squareGrid(
      "tieUp",
      M.var.NUM_THREADS * M.var.cellSize + 2 + M.var.startX + M.var.tieUpPosX,
      M.var.startY + M.var.tieUpPosY,
      M.var.NUM_SHAFTS,
      M.var.NUM_TREADLES,
      1,
      1
    );
    this.treadling = new squareGrid(
      "treadling",
      M.var.NUM_THREADS * M.var.cellSize +
        2 +
        M.var.startX +
        M.var.treadlingPosX,
      -M.var.NUM_SHAFTS * M.var.cellSize -
        2 +
        M.var.startY +
        M.var.treadlingPosY,
      M.var.NUM_PICKS,
      M.var.NUM_TREADLES,
      1,
      M.var.verticalSpacing
    );
    this.colorWarp = new squareGrid(
      "colorWarp",
      M.var.startX + M.var.colorWarpPosX,
      M.var.startY + 2 + M.var.colorWarpPosY,
      1,
      M.var.NUM_THREADS,
      1,
      1
    );
    this.colorWeft = new squareGrid(
      "colorWeft",
      M.var.NUM_THREADS +
        2 +
        M.var.NUM_TREADLES +
        2 +
        M.var.startX +
        M.var.colorWeftPosX,
      -M.var.NUM_SHAFTS * M.var.cellSize -
        2 +
        M.var.startY +
        M.var.colorWeftPosY,
      M.var.NUM_PICKS,
      1,
      1,
      M.var.verticalSpacing
    );
    this.drawdownWarp = new squareGrid(
      "drawdownWarp",
      M.var.startX + M.var.drawdownPosX,
      -M.var.NUM_SHAFTS * M.var.cellSize -
        2 +
        M.var.startY +
        M.var.drawdownPosY,
      M.var.NUM_PICKS,
      M.var.NUM_PICKS,
      1,
      M.var.verticalSpacing
    );
    this.drawdownWeft = new squareGrid(
      "drawdownWeft",
      M.var.startX + M.var.drawdownPosX,
      -M.var.NUM_SHAFTS * M.var.cellSize -
        2 +
        M.var.startY +
        M.var.drawdownPosY,
      M.var.NUM_PICKS,
      M.var.NUM_PICKS,
      1,
      M.var.verticalSpacing
    );

    this.drawdownCheckCount = 0;
    // reset pattern
    this.resetPattern(this.threading);
    this.resetPattern(this.tieUp);
    this.resetPattern(this.treadling);

    // console.log([...this.threading.pattern]);
    // console.log([...this.treadling.pattern]);

    this.managePattern();

    // console.log([...this.threading.pattern]);
    // console.log([...this.treadling.pattern]);
    // debugger

    // this.twillPattern(this.treadling);

    //set thread colors
    this.getColorGridS();
    // this.getdisplayColors();
    this.getGoodDisplayColors();
    //position offsets
    this.offsetPattern(this.threading);
    this.offsetPattern(this.tieUp);
    this.offsetPattern(this.treadling);
    this.offsetPattern(this.colorWarp);
    this.offsetPattern(this.colorWeft);
    this.offsetPattern(this.drawdownWarp);
    this.offsetPattern(this.drawdownWeft);

    //ca
    this.theRules = M.var.theRules;
    this.caTieUpGrid();

    // Visualize grids
    this.visualizeGrid(this.threading);
    this.visualizeGrid(this.tieUp);
    this.visualizeGrid(this.treadling);

    this.visualizeColorGrids();

    // Compute and visualize drawdown
    this.computeDrawdown();

    //console.log(this.drawdownWarp);
    // console.log(this.drawdownWeft);
    this.visualizeDrawdown();

    // console.log(wPat);
    // this.addDrawdownText();
  }
  managePattern() {
    if (M.var.threadingPattern == "twill") {
      this.twillPattern(this.threading);
    } else if (M.var.threadingPattern == "triWave") {
      this.triWavePattern(this.threading);
    } else if (M.var.threadingPattern == "vPattern") {
      this.vPattern(this.threading);
    } else if (M.var.threadingPattern == "rand") {
      this.randPattern(this.threading);
    }
    if (M.var.treadlingPattern == "twill") {
      this.twillPattern(this.treadling);
    } else if (M.var.treadlingPattern == "triWave") {
      this.triWavePattern(this.treadling);
    } else if (M.var.treadlingPattern == "vPattern") {
      this.vPattern(this.treadling);
    } else if (M.var.treadlingPattern == "rand") {
      this.randPattern(this.treadling);
    }
  }
  resetPattern(grid) {
    const rows = grid.size.x;
    const cols = grid.size.y;
    let pattern = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push(0);
      }
      pattern.push(row);
    }
    grid.pattern = pattern;
    grid.mesh = [...pattern];
  }
  getColorGridS(
    warpR = M.var.colorWarpCount,
    wefR = M.var.colorWeftCount,
    colorPalette = M.var.colorPalette,
    lang = "eng"
  ) {
    this.colorWarp.palette = [];
    this.colorWarp.pattern = [];
    this.colorWarp.count = warpR;
    this.colorWeft.palette = [];
    this.colorWeft.pattern = [];
    this.colorWeft.count = wefR;

    //pick color library
    // let materialSelect = M.var.colorMaterial;
    // if(materialSelect == "Satin"){
    // materialSelect = druckerSatinColors
    // }else if(materialSelect == "Glossy"){
    // materialSelect = druckerGlossyColors
    // }
    let materialSelect = druckerSatinColors;

    let selectedColors = [];
    let colorCount = warpR + wefR;
    // if(colorPalette =="random"){
    // selectedColors = this.pickRandomColors(materialSelect, colorCount)
    // }else if(colorPalette =="analogous"){
    // selectedColors = this.pickAnalogousColors(materialSelect, colorCount)
    // }else if(colorPalette =="fromArray"){
    // selectedColors = this.pickArrayColors(materialSelect, colorCount, M.var.colorArrayName )
    // }else if(colorPalette =="fromSelected"){
    // selectedColors = this.pickSelectedColors(materialSelect, colorCount)
    // }
    selectedColors = this.pickSelectedColors(materialSelect, colorCount);

    // console.log( colorPalette )
    // debugger
    console.log("selectedColors", selectedColors); // JB UNCOMMENT
    let idx = 0;
    let pick;
    for (let i = 0; i < this.colorWarp.count; i++) {
      pick = selectedColors[idx];
      this.colorWarp.palette.push(pick.color);
      M.var.colorWarpNames.push(colorNames[pick.name][lang]);
      idx++;
    }
    for (let i = 0; i < this.colorWeft.count; i++) {
      pick = selectedColors[idx];
      this.colorWeft.palette.push(pick.color);
      M.var.colorWeftNames.push(colorNames[pick.name][lang]);
      idx++;
    }
    M.var.colorWarp = this.colorWarp.palette;
    M.var.colorWeft = this.colorWeft.palette;
    //warp colors
    let myWarpColor = 0;
    for (let i = 0; i < this.colorWarp.length; i++) {
      this.colorWarp.pattern.push(this.colorWarp.palette[myWarpColor]);
      myWarpColor++;
      if (myWarpColor == this.colorWarp.palette.length) {
        myWarpColor = 0;
      }
    }
    //weft colors
    let myWeftColor = 0;
    for (let i = 0; i < this.colorWeft.length; i++) {
      this.colorWeft.pattern.push(this.colorWeft.palette[myWeftColor]);
      myWeftColor++;
      if (myWeftColor == this.colorWeft.palette.length) {
        myWeftColor = 0;
      }
    }
  }
  getGoodDisplayColors(){
    let cnt = 0;
    let c = true; 
    // let storageCnt = localStorage.getItem('storageCnt') || 0;
    while(c){
      this.getdisplayColors()
      c = this.checkDisplayColors()
      // console.error(cnt)
      cnt ++ 
      // console.log( colorCull)
      // console.log( this.colorWarp.palette)
      // console.log(M.var.colorWarpNames)
      // console.log( this.colorWeft.palette)
      // console.log(M.var.colorWeftNames)
      // console.log( colorCull)
      // console.log( getColorFromLang(displayColors.solidName), getColorFromLang(displayColors.groundName))
      // console.log( getColorFromLang(displayColors.solidName), getColorFromLang(displayColors.groundName))
      // console.log( displayColors.solid, displayColors.ground)
      if(cnt>1000){
        debugger
        c = false
        break
      }
 
    }
    /*
    if(cnt == 1){
      storageCnt++ 
      localStorage.setItem('storageCnt', storageCnt);
      console.log("storageCnt: ",storageCnt)
      window.location.href = window.location.href;
    }else{
      console.log("storageCnt: ",storageCnt)
      localStorage.setItem('storageCnt', 0);
      // debugger
    }
    */

  }
  checkDisplayColors(){
    for(let i =0; i < colorCull.length; i ++){
      // if(displayColors.solid in colorCull[i]  && displayColors.ground in colorCull[i] ){
        // console.log(colorCull[i])
        // console.log( getColorFromLang(displayColors.groundName)   )
        // console.log( colorCull[i].includes( getColorFromLang(displayColors.solidName)  ))
        // console.log( getColorFromLang(displayColors.solidName)    )
        // console.log( colorCull[i].includes( getColorFromLang(displayColors.groundName)    ))
      if( colorCull[i].includes( getColorFromLang(displayColors.solidName) )  && colorCull[i].includes( getColorFromLang(displayColors.groundName) ) ){
        return true
      }
    } 
    return false
  }
  getdisplayColors() {
    if (M.var.displayMode == "Original") {
      displayColors.treadling.active.cell = M.var.activeColor;
      displayColors.treadling.active.edge = M.var.activeColor;
      (displayColors.treadling.inactive.cell = M.var.inactiveColor),
        (displayColors.treadling.inactive.edge = M.var.activeColor);
      displayColors.tieUp.active.cell = M.var.activeColor;
      displayColors.tieUp.active.edge = M.var.activeColor;
      (displayColors.tieUp.inactive.cell = M.var.inactiveColor),
        (displayColors.tieUp.inactive.edge = M.var.activeColor);
      displayColors.threading.active.cell = M.var.activeColor;
      displayColors.threading.active.edge = M.var.activeColor;
      (displayColors.threading.inactive.cell = M.var.inactiveColor),
        (displayColors.threading.inactive.edge = M.var.activeColor);
      displayColors.background = M.var.backgroundColor;

      displayColors.solid = M.var.activeColor;
      displayColors.ground = M.var.inactiveColor;
    } else if (M.var.displayMode == "Inverse") {
      // console.log(this.colorWarp.palette)
      // console.log(this.colorWeft.palette)
      /*
      let solid = 0xFF00FF
      let ground = 0xFF0000
      if(this.colorWeft.palette.length == 1 && this.colorWarp.palette.length >= 2){
        solid  = this.colorWarp.palette[0]
        ground = randChoice(this.colorWeft.palette)
      }else{
        solid  = this.colorWeft.palette[0]
        ground = randChoice(this.colorWarp.palette)
      }*/

      let solid = 0xff00ff;
      let ground = 0xff0000;
      let groundIdx, solidIdx;
      if ( this.colorWeft.palette.length == 1 && this.colorWarp.palette.length >= 2) {
        solidIdx = 0;
        groundIdx = randChoice(Array.from({ length: this.colorWeft.palette.length },(_, index) => index));
        solid = this.colorWarp.palette[solidIdx];
        ground = this.colorWeft.palette[groundIdx];
        // console.warn(groundIdx);
        // console.warn(ground);
        // console.warn(this.colorWarp.palette);
        // console.warn("solid");
        // console.warn(solidIdx);
        // console.warn(solid);
        // console.warn(this.colorWeft.palette);
        displayColors.backgroundName = M.var.colorWarpNames[solidIdx];
        displayColors.solidName = M.var.colorWarpNames[solidIdx];
        displayColors.groundName= M.var.colorWeftNames[groundIdx];
        // console.warn(displayColors.backgroundName);
      } else {
        solidIdx = 0;
        groundIdx = randChoice(Array.from({ length: this.colorWarp.palette.length },(_, index) => index)
        );
        solid = this.colorWeft.palette[solidIdx];
        ground = this.colorWarp.palette[groundIdx];
        // console.warn(groundIdx);
        // console.warn(ground);
        // console.warn(this.colorWarp.palette);
        // console.warn("solid");
        // console.warn(solidIdx);
        // console.warn(solid);
        // console.warn(this.colorWeft.palette);
        displayColors.backgroundName = M.var.colorWeftNames[solidIdx];
        displayColors.solidName = M.var.colorWeftNames[solidIdx];
        displayColors.groundName= M.var.colorWarpNames[groundIdx];
        // console.warn(displayColors.backgroundName);
      }

      displayColors.treadling.active.cell = ground;
      displayColors.treadling.active.edge = false;
      displayColors.treadling.inactive.cell = solid;
      displayColors.treadling.inactive.edge = false;
      displayColors.tieUp.active.cell = ground;
      displayColors.tieUp.active.edge = false;
      displayColors.tieUp.inactive.cell = solid;
      displayColors.tieUp.inactive.edge = false;
      displayColors.threading.active.cell = ground;
      displayColors.threading.active.edge = false;
      displayColors.threading.inactive.cell = solid;
      displayColors.threading.inactive.edge = false;
      displayColors.background = solid;
      displayColors.solid = solid;
      displayColors.ground = ground;
      // displayColors.backgroundName =
    } else if (M.var.displayMode == "Grid") {
      // console.log(this.colorWarp.palette)
      // console.log(this.colorWeft.palette)
      /*
      let solid = 0xFF00FF
      let ground = 0xFF0000
      if(this.colorWeft.palette.length == 1 && this.colorWarp.palette.length >= 2){
        solid  = randChoice(this.colorWarp.palette) // this.colorWarp.palette[0]
        ground = randChoice(this.colorWeft.palette)
      }else{
        solid  = randChoice(this.colorWeft.palette) // this.colorWeft.palette[0]
        ground = randChoice(this.colorWarp.palette)
      }*/
      let solid = 0xff00ff;
      let ground = 0xff0000;
      let groundIdx, solidIdx;
      if (
        this.colorWeft.palette.length == 1 &&
        this.colorWarp.palette.length >= 2
      ) {
        solidIdx = randChoice(
          Array.from(
            { length: this.colorWarp.palette.length },
            (_, index) => index
          )
        );
        groundIdx = randChoice(
          Array.from(
            { length: this.colorWeft.palette.length },
            (_, index) => index
          )
        );
        solid = this.colorWarp.palette[solidIdx];
        ground = this.colorWeft.palette[groundIdx];
        // console.warn("ground");
        // console.warn(groundIdx);
        // console.warn(ground);
        // console.warn(this.colorWeft.palette);
        // console.warn("solid");
        // console.warn(solidIdx);
        // console.warn(solid);
        // console.warn(this.colorWarp.palette);
        displayColors.backgroundName = M.var.colorWarpNames[solidIdx];
        displayColors.solidName = M.var.colorWarpNames[solidIdx];
        displayColors.groundName = M.var.colorWeftNames[groundIdx];
        // console.warn(displayColors.backgroundName);
      } else {
        solidIdx = randChoice(Array.from({ length: this.colorWeft.palette.length },(_, index) => index));
        groundIdx = randChoice(
          Array.from(
            { length: this.colorWarp.palette.length },
            (_, index) => index
          )
        );
        solid = this.colorWeft.palette[solidIdx];
        ground = this.colorWarp.palette[groundIdx];
        // console.warn("ground");
        // console.warn(groundIdx);
        // console.warn(ground);
        // console.warn(this.colorWarp.palette);
        // console.warn("solid");
        // console.warn(solidIdx);
        // console.warn(solid);
        // console.warn(this.colorWeft.palette);
        displayColors.backgroundName = M.var.colorWeftNames[solidIdx];
        displayColors.solidName = M.var.colorWeftNames[solidIdx];
        displayColors.groundName= M.var.colorWarpNames[groundIdx];
        // console.warn(displayColors.backgroundName);
      }
      displayColors.treadling.active.cell = solid;
      displayColors.treadling.active.edge = solid; //false
      displayColors.treadling.inactive.cell = ground;
      displayColors.treadling.inactive.edge = solid;
      displayColors.tieUp.active.cell = solid;
      displayColors.tieUp.active.edge = solid; //false
      displayColors.tieUp.inactive.cell = ground;
      displayColors.tieUp.inactive.edge = solid;
      displayColors.threading.active.cell = solid;
      displayColors.threading.active.edge = solid; //false
      displayColors.threading.inactive.cell = ground;
      displayColors.threading.inactive.edge = solid;
      displayColors.background = solid;
      displayColors.solid = solid;
      displayColors.ground = ground;
    } else if (M.var.displayMode == "Weave Colors") {
      // console.log(this.colorWarp.palette)
      // console.log(this.colorWeft.palette)
      let solid = 0xff00ff;
      let ground = 0xff0000;
      let groundIdx, solidIdx;
      if (this.colorWeft.palette.length == 1 &&this.colorWarp.palette.length >= 2) {
        solidIdx = randChoice(Array.from({ length: this.colorWarp.palette.length },(_, index) => index));
        groundIdx = randChoice(Array.from({ length: this.colorWeft.palette.length },(_, index) => index));
        solid = this.colorWarp.palette[solidIdx];
        ground = this.colorWeft.palette[groundIdx];
        // console.warn("ground");
        // console.warn(groundIdx);
        // console.warn(ground);
        // console.warn(this.colorWeft.palette);
        // console.warn("solid");
        // console.warn(solidIdx);
        // console.warn(solid);
        // console.warn(this.colorWarp.palette);
        displayColors.backgroundName = M.var.colorWarpNames[solidIdx];
        displayColors.solidName = M.var.colorWarpNames[solidIdx];
        displayColors.groundName= M.var.colorWeftNames[groundIdx];
        // console.warn(displayColors.backgroundName);
      } else {
        solidIdx = randChoice(
          Array.from(
            { length: this.colorWeft.palette.length },
            (_, index) => index
          )
        );
        groundIdx = randChoice(
          Array.from(
            { length: this.colorWarp.palette.length },
            (_, index) => index
          )
        );
        solid = this.colorWeft.palette[solidIdx];
        ground = this.colorWarp.palette[groundIdx];
        // console.warn("ground");
        // console.warn(groundIdx);
        // console.warn(ground);
        // console.warn(this.colorWeft.palette);
        // console.warn("solid");
        // console.warn(solidIdx);
        // console.warn(solid);
        // console.warn(this.colorWarp.palette);
        displayColors.backgroundName = M.var.colorWeftNames[solidIdx];
        displayColors.solidName = M.var.colorWeftNames[solidIdx];
        displayColors.groundName= M.var.colorWarpNames[groundIdx];
        // console.warn(displayColors.backgroundName);
      }

      let warp = this.colorWarp.palette;
      let weft = this.colorWeft.palette;

      displayColors.treadling.active.cell = weft;
      displayColors.treadling.active.edge = false;
      displayColors.treadling.inactive.cell = solid;
      displayColors.treadling.inactive.edge = false;

      displayColors.tieUp.active.cell = solid; //solid
      displayColors.tieUp.active.edge = false;
      displayColors.tieUp.inactive.cell = ground; //ground
      displayColors.tieUp.inactive.edge = false;

      displayColors.threading.active.cell = warp;
      displayColors.threading.active.edge = false;
      displayColors.threading.inactive.cell = solid;
      displayColors.threading.inactive.edge = false;
      displayColors.background = solid;
      displayColors.solid = solid;
      displayColors.ground = ground;
    }
    renderer.setClearColor(displayColors.background);
  }
  visualizeColorGrids() {
    let geometry = new THREE.PlaneGeometry(M.var.cellSize, M.var.cellSize);

    //visualize warp colors
    for (let i = 0; i < this.colorWarp.length; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: this.colorWarp.pattern[i],
      });
      let cell = new THREE.Mesh(geometry, material);
      cell.position.fromArray(this.colorWarp.posOffset[0][i]);
      cell.userData.myInfo = { type: "cell", deleteFlag: this.colorWarp.name };
      this.colorWarp.mesh[i] = cell;
      cell.visible = M.var.colorWarpVisible;
      scene.add(cell);
    }

    //visualize weft colors
    for (let i = 0; i < this.colorWeft.length; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: this.colorWeft.pattern[i],
      });
      let cell = new THREE.Mesh(geometry, material);
      cell.position.fromArray(this.colorWeft.posOffset[i][0]);
      cell.userData.myInfo = { type: "cell", deleteFlag: this.colorWeft.name };
      this.colorWeft.mesh[i] = cell;
      cell.visible = M.var.colorWeftVisible;
      scene.add(cell);
      if (i > this.colorWeft.length / this.colorWeft.offSet.y) {
        cell.visible = false;
      }
    }
  }
  pickSelectedColors(lib, len) {
    let idxs = [];
    let probs = [];
    // console.log(len)
    // console.log(palettes[len])

    for (let i = 0; i < palettes[len].length; i++) {
      if (M.var.colorSelectName == palettes[len][i].name) {
        idxs.push(i);
        probs.push(palettes[len][i].p);
      }
    }

    let idx = rWeightedItems(idxs, probs);
    let colorName = palettes[len][idx].name;
    let colors = palettes[len][idx].arr;
    let col = [];
    for (let i = 0; i < len; i++) {
      col.push({ color: new THREE.Color(lib[colors[i]]), name: colors[i] });
    }
    shuffleArray(col);

    // console.log("colorName",colorName)
    // console.log("colorCount",len)
    M.var.colorGroupName = colorName;
    return col;
  }
  twillPattern(
    update = this.threading,
    gridSlope = M.var.twillSlope,
    gridOffset = M.var.twillOff,
    gridTranslate
  ) {
    let threadingGrid = this.threading.pattern;
    let treadlingGrid = this.treadling.pattern;

    if (update == this.threading) {
      // console.log(this.threading)
      let slope = M.var.threadingSlope;
      let offset = M.var.threadingOffset;
      let translate = M.var.threadingTranslate;
      let height = this.threading.size.x;
      let width = this.threading.size.y + 1;
      let grid = this.threading.pattern;
      for (let i = 0; i < width - 1; i++) {
        let x = Math.floor((slope * i + translate) % height);
        // console.log(x,i)
        // console.log(grid[x])
        grid[x][i] = 1;
        // console.log(grid)
      }

      /*
      let slope = Math.floor(M.var.threadingSlope) || 1;    //  twillSlope
      let offset = M.var.threadingOffset || 1;              //  twillOff
      let shaftCnt = 0;

      for (let j = 0; j < M.var.NUM_THREADS; j++) {
        // Set the current cell to 1
        threadingGrid[shaftCnt][j] = 1;

        // Move vertically down the slope
        shaftCnt += slope;

        // If we've gone past the bottom, wrap to the top and move right by the offset
        if (shaftCnt >= M.var.NUM_SHAFTS) {
          shaftCnt -= M.var.NUM_SHAFTS;
          j += offset - 1; // -1 because the for loop will increment j as well
        }
      }*/
    } else if (update == this.treadling) {
      let slope = M.var.treadlingSlope;
      let offset = M.var.treadlingOffset;
      let translate = M.var.treadlingTranslate;
      let height = this.treadling.size.y;
      let width = this.treadling.size.x + 1;
      let grid = this.treadling.pattern;
      for (let i = 0; i < width - 1; i++) {
        let y = Math.floor((slope * i + translate) % height);
        // console.log(i,y)
        // console.log(grid[x])
        grid[i][y] = 1;
        // console.log(grid)
      }
      /*
      let slope = Math.floor(M.var.treadlingSlope) || 1; // twillSlopeTr
      let offset = M.var.treadlingOffset || 1;              // twillOffTr
      let shaftCnt = 0; // Current position on the vertical axis

      for (let j = 0; j < M.var.NUM_PICKS; j++) {
        // Set the current cell to 1
        treadlingGrid[j][shaftCnt] = 1;

        // Move vertically down the slope
        shaftCnt += slope;

        // If we've gone past the bottom, wrap to the top and move right by the offset
        if (shaftCnt >= M.var.NUM_TREADLES) {
          shaftCnt -= M.var.NUM_TREADLES;
          j += offset - 1; // -1 because the for loop will increment j as well
        }
      }*/
    }
  }
  vPattern(update = this.threading) {
    let threadingGrid = this.threading.pattern;
    let treadlingGrid = this.treadling.pattern;

    if (update == this.threading) {
      let slope = 1; // Math.floor(M.var.threadingSlope) || 1; // twillSlope
      let offset = M.var.threadingOffset || 1; // twillOff
      let shaftCnt = 0; // Current position on the vertical axis

      for (let j = 0; j < M.var.NUM_THREADS; j++) {
        // Set the current cell to 1
        //console.log("shaftCnt = " + shaftCnt);
        threadingGrid[shaftCnt][j] = 1;

        // Move vertically down the slope
        shaftCnt += slope;

        //if we've gone past the bottom, reverse to plot the other leg of the V
        if (shaftCnt == M.var.NUM_SHAFTS - 1) {
          slope *= -1;
        }

        //if we've gone past the top, reverse to plot the other leg of the V
        if (shaftCnt == 0 && j > 0) {
          slope *= -1;
        }
      }
    } else if (update == this.treadling) {
      // Handle treadlingGrid updates similarly
      // console.log("twillPatternTr!!");
      //use the same pattern as above on the treadling grid
      let slope = 1; //Math.floor(M.var.treadlingSlope) || 1; // twillSlopeTr
      let offset = M.var.treadlingOffset || 1; // twillOffTr
      let shaftCnt = 0; // Current position on the vertical axis
      for (let j = 0; j < M.var.NUM_PICKS; j++) {
        // Set the current cell to 1
        treadlingGrid[j][shaftCnt] = 1;

        // Move vertically down the slope
        shaftCnt += slope;

        //if we've gone past the bottom, reverse to plot the other leg of the V
        if (shaftCnt == M.var.NUM_TREADLES - 1) {
          slope *= -1;
        }

        //if we've gone past the top, reverse to plot the other leg of the V
        if (shaftCnt == 0 && j > 0) {
          slope *= -1;
        }
      }
    }
  }
  triWavePattern(update = this.threading) {
    //ThreadinGrid
    let threadingGrid = this.threading.pattern;
    let treadlingGrid = this.treadling.pattern;

    if (update == this.threading) {
      let slope = M.var.threadingSlope;
      let offset = M.var.threadingOffset;
      let translate = M.var.threadingTranslate;
      let height = this.threading.size.x;
      let width = this.threading.size.y + 1;
      let grid = this.threading.pattern;
      let prev = 0;
      for (let i = 0; i < width - 1; i++) {
        // let n = (slope*i+translate) % (height) ;
        // let o = (slope*i+translate) % (height*2) - height;
        // let p = Math.sign(o);
        // let q = n*p - height*Math.min(0,p);
        // let x = Math.floor(q)
        // let f1 = Math.floor( ( slope*i +translate) % (2*height-1))
        // let f2 = Math.floor( (-slope*i +translate) % (2*height-1))
        // let x = Math.min(f1,f2)

        let x = Math.abs(Math.floor(triangleWave(i, slope, height, translate)));
        // console.log(x,i)
        // console.log(grid[x])
        grid[x][i] = 1;
        // console.log(grid)
      }
      // debugger

      /*
      console.log(this.threading) // Math ERROR
      let slope = M.var.threadingSlope
      let offset = M.var.threadingOffset
      let translate = M.var.threadingTranslate
      let height = this.threading.size.x
      let width =  this.threading.size.y + 1
      let grid = this.threading.pattern
      for (let i = 0; i <width-1; i++) {
        let n = (slope*i+translate) % (height) ;
        let o = (slope*i+translate) % (height*2) - height;
        let p = Math.sign(o);
        let q = n*p - height*Math.min(0,p);
        let x = Math.floor(q)
        // console.log(x,i)
        // console.log(grid[x])
        grid[x][i] = 1
        console.log(grid)
      }
      */
      /*
      let period = 2*(M.var.NUM_SHAFTS/M.var.threadingSlope)//M.var.NUM_THREADS / M.var.triFreq;
      let amp = M.var.NUM_SHAFTS;

      for (let x = 0; x < M.var.NUM_THREADS; x++) {
        // Calculate the wrapped index
        let wrappedIndex = (x + M.var.threadingOffset) % M.var.NUM_THREADS; // triOff
        // Calculate the normalized phase
        let phase = (wrappedIndex % period) / period;

        let y;
        if (phase <= 0.5) {
          // Rising part of the triangle wave
          y = phase * 2 * amp;
        } else {
          // Falling part of the triangle wave
          y = (1 - phase) * 2 * amp;
        }

        // Round the resulting y-value
        y = Math.floor(y);

        // Ensure y is within bounds
        if (y >= 0 && y < M.var.NUM_TREADLES) {
          threadingGrid[y][x] = 1;
        } else {
          let e
          // console.log("y out of bounds");
        }
      }
      */
    } else if (update == this.treadling) {
      let slope = M.var.treadlingSlope; // Math ERROR
      let offset = M.var.treadlingOffset;
      let translate = M.var.treadlingTranslate;
      let height = this.treadling.size.y;
      let width = this.treadling.size.x + 1;
      let grid = this.treadling.pattern;
      for (let i = 0; i < width - 1; i++) {
        let y = Math.abs(Math.floor(triangleWave(i, slope, height, translate)));
        // console.log(i,y)
        grid[i][y] = 1;
        // console.log(grid[i])
        // console.log(grid)
        // console.log("")
      }
      /*
      let slope = M.var.treadlingSlope // Math ERROR
      let offset = M.var.treadlingOffset
      let translate = M.var.treadlingTranslate
      let height = this.treadling.size.y
      let width =  this.treadling.size.x + 1
      let grid = this.treadling.pattern
      for (let i = 0; i <width-1; i++) {
        let n = (slope*i+translate) % (height) ;
        let o = (slope*i+translate) % (height*2) - height;
        let p = Math.sign(o);
        let q = n*p - height*Math.min(0,p);
        let y =   Math.floor(q)
        console.log(i,y)
        grid[i][y] = 1
        console.log(grid[i])
        console.log(grid)
        console.log("")
      }
      debugger
      */
      /*
      //treadlingGrid
      //repeat code from above for the treadling grid
      let period = 2*(M.var.NUM_TREADLES/M.var.treadlingSlope);// M.var.NUM_PICKS / M.var.triFreqTr;
      let amp = M.var.NUM_TREADLES;
      for (let x = 0; x < M.var.NUM_PICKS; x++) {
        // Calculate the wrapped index
        let wrappedIndex = (x + M.var.treadlingOffset) % M.var.NUM_PICKS; //triOffTr
        // Calculate the normalized phase
        let phase = (wrappedIndex % period) / period;

        let y;
        if (phase <= 0.5) {
          // Rising part of the triangle wave
          y = phase * 2 * amp;
        } else {
          // Falling part of the triangle wave
          y = (1 - phase) * 2 * amp;
        }

        // Round the resulting y-value
        y = Math.floor(y);

        // Ensure y is within bounds
        if (y >= 0 && y < M.var.NUM_TREADLES) {
          treadlingGrid[x][y] = 1;
        } else {
          let e
          // console.log("y out of bounds");
        }
      }
      */
    }
  }
  randPattern(update = this.threading) {
    let threadingGrid = this.threading.pattern;
    let treadlingGrid = this.treadling.pattern;
    // console.log("randPattern!!");

    if (update == this.threading) {
      //patternParams
      //starte the shaft at a random position between 1 and NUM_SHAFTS-1
      let stShaft = Math.floor(rand() * M.var.NUM_SHAFTS);
      //determin a run length between 1 and NUM_SHAFTS-1
      //let runLength = Math.floor(rand() * M.var.NUM_SHAFTS-1)+1;
      //determine whether the pattern is ascending or decending
      let slope = randChoice([-1, 1]);
      let shaftCnt = 0; //current position on the vertical axis
      shaftCnt = stShaft;
      // console.log("first stShaft = " + stShaft);
      for (let j = 0; j < Math.floor(M.var.NUM_THREADS / 2); j++) {
        //set the current cell to 1
        // console.log("shaftCnt = " + shaftCnt + " j = " + j);
        threadingGrid[shaftCnt][j] = 1;
        //move according to the slope
        shaftCnt += slope;
        //if we've gone past the bottom, reverse to plot the other leg of the V
        if (shaftCnt > M.var.NUM_SHAFTS - 1) {
          //reset params and start another run
          let flag = 0;
          while (flag == 0) {
            stShaft = Math.floor(rand() * M.var.NUM_SHAFTS);
            if (stShaft != M.var.NUM_SHAFTS - 1) {
              flag = 1;
            }
          }
          slope = randChoice([-1, 1]);
          shaftCnt = stShaft;
        }
        //if we've gone past the top, reverse to plot the other leg of the V
        if (shaftCnt < 0) {
          //reset params and start another run
          //restrict it from repeating the same shaftCnt
          let flag = 0;
          while (flag == 0) {
            stShaft = Math.floor(rand() * M.var.NUM_SHAFTS);
            if (stShaft != 0) {
              flag = 1;
            }
          }
          slope = randChoice([-1, 1]);
          shaftCnt = stShaft;
        }
        // console.log("currJ = " + j);
      }
      //copy the first half of the pattern to the second half

      //console.log("stJ = " + Math.floor(M.var.NUM_THREADS / 2));
      for (
        let j = Math.floor(M.var.NUM_THREADS / 2);
        j < M.var.NUM_THREADS;
        j++
      ) {
        for (let i = 0; i < M.var.NUM_SHAFTS; i++) {
          //to mirror = threadingGrid[i][Math.floor(M.var.NUM_THREADS / 2) -j - 1];
          threadingGrid[i][j] =
            threadingGrid[i][j - Math.floor(M.var.NUM_THREADS / 2)];
        }
      }
    } else if (update == this.treadling) {
      // copy the threading pattern to the treadling pattern
      for (let i = 0; i < M.var.NUM_PICKS; i++) {
        for (let j = 0; j < M.var.NUM_TREADLES; j++) {
          treadlingGrid[i][j] = threadingGrid[j][i];
        }
      }
    }
  }
  offsetPattern(grid) {
    // console.log("")
    // console.log(grid)
    const rows = grid.size.x;
    const cols = grid.size.y;

    let offsetFix;
    if (
      grid.name == "treadling" ||
      grid.name == "colorWeft" ||
      grid.name == "drawdownWarp" ||
      grid.name == "drawdownWeft"
    ) {
      offsetFix = (M.var.verticalSpacing - 1) / 2;
    } else {
      offsetFix = 0;
    }

    let pos = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        let pt = [
          j * M.var.cellSize * grid.offSet.x +
            grid.position.x +
            (1 - grid.offSet.y) / 2 +
            offsetFix,
          -i * M.var.cellSize * grid.offSet.y +
            grid.position.y +
            (1 - grid.offSet.y) / 2,
          0,
        ];
        row.push(pt);
      }
      pos.push(row);
    }
    grid.posOffset = pos;
    // console.log("")
    // console.log(grid)
  }
  caTieUpGrid() {
    let cnt = 0;
    let passed = false;
    while (!passed || cnt < 1000) {
      this.makeCA(this);
      passed = this.checkSequentialRuns(8 - 3, this.tieUp.pattern, false);
      if (passed) {
        break;
      } else {
        cnt++;
      }
    }
    if (cnt >= 1000) {
      // failed inside while loop // what are odds and time implications
      renderer.setClearColor(0xff0000);
      console.error("CA tie up count", cnt);
    } else {
      // console.log("count",cnt)
    }
  }
  makeCA() {
    //CA Tie Up Grid
    const setRandomRules = () =>
      Array.from({ length: 14 }, () => Math.round(rand())); // MAJOR FAILURE:  Maximum call stack size exceeded
    //keep looping until we get a big enough pattern
    let flag = true;
    while (flag) {
      let loopCnt = 0;
      this.theRules = setRandomRules();
      //console.log(this.theRules);
      myCa = new CA(this.theRules, M.var.NUM_SHAFTS, M.var.NUM_TREADLES, scene);
      //number of site
      //let randSites = Math.floor(rand() * 5) + 1;
      /*
      for (let i = 0; i < 1; i++) {
        let randSpread = 2; //Math.floor(rand() * 10) + 3;
        myCa.randomSeed(randSpread);
      }
      */
      myCa.randomSeed(1);
      myCa.restart();
      for (let i = 0; i < 12; i++) {
        //number of generations
        myCa.generate();
      }
      this.tieUp.pattern = myCa.oldBoard;
      let cnt = 0;
      for (let i = 0; i < this.tieUp.pattern.length; i++) {
        for (let j = 0; j < this.tieUp.pattern[i].length; j++) {
          if (this.tieUp.pattern[i][j] == 1) {
            cnt++; //count the number of 1's
          }
        }
      }
      loopCnt++;
      //Make sure the pattern is not too sparse or too dense
      if (
        cnt > M.var.NUM_SHAFTS * M.var.NUM_SHAFTS * 0.2 &&
        cnt < M.var.NUM_SHAFTS * M.var.NUM_SHAFTS * 0.8
      ) {
        flag = false;
      } else if (loopCnt > 100) {
        flag = false;
      }
    }
  }
  visualizeGrid(grid) {
    let pattern = grid.pattern;
    let name = grid.name;

    let geometry = new THREE.PlaneGeometry(M.var.cellSize, M.var.cellSize);
    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        let cellCol = fetchColors(name, pattern, i, j);
        const material = new THREE.MeshBasicMaterial({
          // color: pattern[i][j] === 1 ? M.var.activeColor : M.var.inactiveColor,
          color: cellCol.cell,
        });

        /* testing direction of grid
        if (i == 0 && (j == 0 || j == 1)) {
          material.color = new THREE.Color("red");
        }
        */

        let cell = new THREE.Mesh(geometry, material);
        // console.log(this) // TRIWAVE DEBUG
        // console.log(M)
        cell.position.fromArray(grid.posOffset[i][j]);
        cell.userData.myInfo = {
          myGrid: pattern,
          myCol: j,
          myRow: i,
          type: "cell",
          deleteFlag: name,
        };
        scene.add(cell);

        //use mesh edgees to draw grid lines
        if (cellCol.edge != false) {
          // flag to not draw edges
          const edges = new THREE.EdgesGeometry(cell.geometry);
          const line = new THREE.LineSegments(
            edges,
            // new THREE.LineBasicMaterial({ color: M.var.activeColor })
            new THREE.LineBasicMaterial({ color: cellCol.edge })
          );
          line.position.fromArray(grid.posOffset[i][j]);
          line.position.z = 10;
          line.userData.myInfo = {
            myGrid: pattern,
            myCol: j,
            myRow: i,
            type: "gridline",
            deleteFlag: name,
          };
          scene.add(line);
          // console.log(grid.mesh )
          // grid.mesh[i][j] = {cell:cell, edge:line} // BROKEN? JB
          // console.log(grid.offSet.y )
          // console.log(i > pattern.length / grid.offSet.y )

          if (i > pattern.length / grid.offSet.y) {
            line.visible = false;
          }
        }
        if (i > pattern.length / grid.offSet.y) {
          cell.visible = false;
        }
      }
    }
  }
  computeDrawdown(
    threading = this.threading.pattern,
    tieUp = this.tieUp.pattern,
    treadling = this.treadling.pattern
  ) {
    let drawdown = [];
    let pickCnt = 0;

    for (let pick of treadling) {
      let row = new Array(M.var.NUM_THREADS).fill(0); // Initialize the row with zeros
      let raisedShafts = []; // Array to keep track of which shafts are raised for this pick
      // Determine which shafts are raised for this pick
      for (let i = 0; i < pick.length; i++) {
        if (pick[i] === 1) {
          for (let j = 0; j < tieUp[i].length; j++) {
            if (tieUp[i][j] === 1) {
              raisedShafts.push(j);
            }
          }
        }
      }
      // Determine which threads are raised for each of the raised shafts
      for (let j = 0; j < M.var.NUM_THREADS; j++) {
        for (let shaft of raisedShafts) {
          if (threading[shaft][j] === 1) {
            row[j] = 1;
            break;
          }
        }
      }
      drawdown.push(row);

      //weaving instructions
      let cnt = 0;
      let curr;

      if (pickCnt <= M.var.NUM_TREADLES) {
        if (row[0] == 1) {
          wPat = wPat + " U ";
          wPat_print = wPat_print + " U ";
          curr = 1;
        } else {
          wPat = wPat + " O ";
          wPat_print = wPat_print + " O ";
          curr = 0;
        }
        // THIS ASSUMES WARP + WEFT PATTERNS NOT ALWAYS TRUE
        // DO THEY WANT THIS INFO?
        //console.log("repeat length = " + row.length / M.var.NUM_SHAFTS);
        for (let i = 0; i < M.var.NUM_SHAFTS; i++) {
          if (curr == 1 && row[i] == 1) {
            //do nothing
          } else if (curr == 0 && row[i] == 0) {
            //do nothing
          } else if (curr == 1 && row[i] == 0) {
            wPat = wPat + cnt + " O ";
            wPat_print = wPat_print + cnt + " O ";
            curr = 0;
            cnt = 0;
          } else if (curr == 0 && row[i] == 1) {
            wPat = wPat + cnt + " U ";
            wPat_print = wPat_print + cnt + " U ";
            curr = 1;
            cnt = 0;
          }
          //console.log("wPat_print = " + wPat_print);
          cnt++;
        }
        wPat = wPat + cnt + " REPEAT";
        wPat = "<div>" + wPat + "</div>\n";
        wPat_print = wPat_print + cnt + " REPEAT\n";
      }
      pickCnt++;
    }
    wPat = wPat + "REPEAT";
    wPat_print = wPat_print + "REPEAT";
    this.drawdownWarp.pattern = drawdown;
    this.drawdownWeft.pattern = drawdown;

    let passedDrawdown = this.checkSequentialRuns(9 + 1);
    let checkLimit = 100;
    // console.log(`PASSED LENGTH CHECK: ${passedDrawdown}`); // should be 5?
    // console.log(``);

    if (!passedDrawdown) {
      if (this.drawdownCheckCount < checkLimit) {
        this.resetPattern(this.tieUp);
        this.caTieUpGrid();
        this.computeDrawdown();
        this.drawdownCheckCount++;
      } else {
        console.warn(`reached Maximum drawdown check of ${checkLimit}`);
      }
    } else {
      this.drawdownCheckCount = 0;
    }
    // console.warn(`drawdownCheckCount: ${this.drawdownCheckCount}`);
    // return drawdown;
  }
  visualizeDrawdown(grid = this.drawdownWarp) {
    let drawdown = grid.pattern;
    let offsetX = grid.position.x;
    let offsetY = grid.position.y;
    let Z = 0;
    let geometry = new THREE.PlaneBufferGeometry(
      M.var.cellSize,
      M.var.cellSize
    );

    //console.log("visualize Drawdown!!");
    //console.log("drawdownWarp ", this.drawdownWarp.pattern);
    //console.log("drawdownWeft ", this.drawdownWeft.pattern);
    let edgeScale = 0.9999;

    geometry = new THREE.PlaneBufferGeometry(
      M.var.cellSize * this.drawdownWarp.offSet.x,
      M.var.cellSize * this.drawdownWarp.offSet.y
    );
    for (let i = 0; i < drawdown.length; i++) {
      for (let j = 0; j < M.var.NUM_THREADS; j++) {
        let cellColor, edgeColor;
        ``;

        // If within the drawdown grid, determine the color based on the drawdown value
        // cellColor = drawdown[i][j] === 1 ? this.colorWarp.pattern[j] : this.colorWeft.pattern[j];
        cellColor = this.colorWarp.pattern[j];
        Z = this.drawdownWarp.pattern[i][j];
        //find the edge color
        //calculate a darker shade of cellColor
        let r = Math.round(cellColor.r * 220);
        let g = Math.round(cellColor.g * 220);
        let b = Math.round(cellColor.b * 220);
        edgeColor = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
        const material = new THREE.MeshBasicMaterial({ color: cellColor });
        const cell = new THREE.Mesh(geometry, material);

        cell.position.fromArray(this.drawdownWarp.posOffset[i][j]);
        cell.position.z = Z * 2;

        scene.add(cell);

        let A, B;

        if (M.var.drawEdges) {
          //add the edge lines
          //get the verticies of the plane object
          const positions = cell.geometry.attributes.position.array;
          // console.log (positions) //edge debug
          // let vScale = M.var.verticalSpacing//1.5//M.var.verticalSpacing
          let vScale = positions[1] + M.var.verticalSpacing;
          if (
            i == 0 ||
            i == Math.ceil((drawdown.length - 1) / M.var.verticalSpacing)
          ) {
            // console.error(drawdown.length)  //edge debug
            // console.warn(i)
            vScale = 0.5;
            // cell.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
          }

          // positions[0]*=edgeScale
          // positions[1]*=edgeScale*
          // positions[2]*=edgeScale
          // positions[3]*=edgeScale
          // positions[4]*=edgeScale
          // positions[5]*=edgeScale
          // positions[6]*=edgeScale
          // positions[7]*=edgeScale
          // positions[8]*=edgeScale
          // positions[9]*=edgeScale
          // positions[10]*=edgeScale
          // positions[11]*=edgeScale
          // Define the start and end points for the left and right edges
          const leftStart = new THREE.Vector3(
            positions[0] * edgeScale,
            +vScale,
            positions[2] // 0
          ).add(cell.position);
          const leftEnd = new THREE.Vector3(
            positions[3] * edgeScale,
            +vScale,
            positions[5] // 0
          ).add(cell.position);
          const rightStart = new THREE.Vector3(
            positions[6] * edgeScale,
            -vScale,
            positions[8] // 0
          ).add(cell.position);
          const rightEnd = new THREE.Vector3(
            positions[9] * edgeScale,
            -vScale,
            positions[11] // 0
          ).add(cell.position);

          if (drawdown[i][j] === 1) {
            // Create and add the vertical lines
            A = new THREE.Line( //left
              new THREE.BufferGeometry().setFromPoints([leftStart, rightStart]),
              new THREE.LineBasicMaterial({ color: edgeColor })
            );
            B = new THREE.Line( //right
              new THREE.BufferGeometry().setFromPoints([rightEnd, leftEnd]),
              new THREE.LineBasicMaterial({ color: edgeColor })
            );
            scene.add(A); //left
            scene.add(B); //right
          }
        }

        // hide if scalled out of square
        if (i > drawdown.length / this.drawdownWeft.offSet.y) {
          cell.visible = false;
          if (M.var.drawEdges) {
            if (A) {
              A.visible = false;
            }
            if (B) {
              B.visible = false;
            }
          }
        }
      }
    }

    // multiplying here is werid... gonna require an aditional boolean for offset properties if we want horizontal spacing
    geometry = new THREE.PlaneBufferGeometry(M.var.cellSize, M.var.cellSize);
    for (let i = 0; i < drawdown.length; i++) {
      for (let j = 0; j < M.var.NUM_THREADS; j++) {
        let cellColor, edgeColor;
        // If within the drawdown grid, determine the color based on the drawdown value
        cellColor = this.colorWeft.pattern[j];
        //console.log(cellColor);
        Z = this.drawdownWeft.pattern[i][j];
        //find the edge color
        //calculate a darker shade of cellColor
        let r = Math.round(cellColor.r * 220);
        let g = Math.round(cellColor.g * 220);
        let b = Math.round(cellColor.b * 220);
        edgeColor = new THREE.Color(`rgb(${r}, ${g}, ${b})`);

        const material = new THREE.MeshBasicMaterial({ color: cellColor });
        const cell = new THREE.Mesh(geometry, material);

        cell.position.fromArray(this.drawdownWeft.posOffset[j][i]);
        cell.position.z = Z;
        scene.add(cell);

        let A, B;
        if (M.var.drawEdges) {
          //get the verticies of the plane object
          const positions = cell.geometry.attributes.position.array;
          // console.log (positions)
          // debugger

          // Define the start and end points for the left and right edges
          const leftStart = new THREE.Vector3(
            positions[0],
            positions[1],
            positions[2]
          ).add(cell.position);
          const leftEnd = new THREE.Vector3(
            positions[3],
            positions[4],
            positions[5]
          ).add(cell.position);
          const rightStart = new THREE.Vector3(
            positions[6],
            positions[7],
            positions[8]
          ).add(cell.position);
          const rightEnd = new THREE.Vector3(
            positions[9],
            positions[10],
            positions[11]
          ).add(cell.position);

          if (drawdown[i][j] === 10) {
            let temp;
          } else {
            // Create and add the horiz lines
            A = new THREE.Line( //top
              new THREE.BufferGeometry().setFromPoints([leftStart, leftEnd]),
              new THREE.LineBasicMaterial({ color: edgeColor })
            );
            B = new THREE.Line( //bottom
              new THREE.BufferGeometry().setFromPoints([rightStart, rightEnd]),
              new THREE.LineBasicMaterial({ color: edgeColor })
            );
            scene.add(A); //left
            scene.add(B); //right
          }
        }
        // hide if scalled out of square
        // if (i > drawdown.length / this.drawdownWeft.offSet.x) {// no
        // if (i > drawdown.length / this.drawdownWeft.offSet.y) {// no
        // if (i > drawdown.length / this.drawdownWarp.offSet.x) {// no
        // if (i > drawdown.length / this.drawdownWarp.offSet.y) {// no

        if (j > drawdown.length / this.drawdownWeft.offSet.y) {
          cell.visible = false;
          if (M.var.drawEdges) {
            if (A) {
              A.visible = false;
            }
            if (B) {
              B.visible = false;
            }
          }
        }
      }
    }
  }
  removeDrawdown() {
    // this is really slow. Def a better way to do this
    let arr = [...scene.children];
    for (let i = 0; i < arr.length; i++) {
      let child = arr[i];
      if (child.userData.myInfo === undefined) {
        // drawdown doesnt have any userdata
        scene.remove(child);
      }
    }
    //console.log("removed drawdown");
  }
  removeGrid(flags = ["none"]) {
    if (!Array.isArray(flags)) {
      flags = [flags]; // Ensure flags is always an array
    }

    let arr = [...scene.children];
    for (let i = 0; i < arr.length; i++) {
      let child = arr[i];
      // console.log(child.userData.myInfo.deleteFlag);
      try {
        if (flags.includes(child.userData.myInfo.deleteFlag)) {
          scene.remove(child);
        }
      } catch {}
    }
    console.log("removed grid");
  }
  addDrawdownText() {
    const textContainer = document.createElement("div");
    textContainer.id = "drawdownText";
    textContainer.innerHTML = wPat;

    const rendererCanvas = document.querySelector("canvas");
    if (rendererCanvas) {
      rendererCanvas.insertAdjacentElement("afterend", textContainer);
    } else {
      console.error(
        "Canvas not found. Make sure this function is called after the canvas has been added to the DOM."
      );
    }
  }
  checkSequentialRuns(
    maxLength = M.var.maxRun,
    arr = this.drawdownWarp.pattern,
    throwE = true
  ) {
    const rowCount = arr.length;
    const colCount = arr[0].length;

    // Check rows
    for (let row = 0; row < rowCount; row++) {
      let count = 1;
      for (let col = 1; col < colCount; col++) {
        if (arr[row][col] === arr[row][col - 1]) {
          count++;
          if (count >= maxLength) {
            if (throwE) {
              // console.error(`row error`);
              // console.error(`sequence test failed at ${row},${col}`);
              // console.error(`sequence length:${count} out of ${maxLength}`);
              this.sequenceRepair(false);
            }
            return false;
          }
        } else {
          count = 1;
        }
      }
    }

    // Check columns
    for (let col = 0; col < colCount; col++) {
      let count = 1;
      for (let row = 1; row < rowCount; row++) {
        if (arr[row][col] === arr[row - 1][col]) {
          count++;
          if (count >= maxLength) {
            if (throwE) {
              // console.error(`column error`);
              // console.error(`sequence test failed at ${row},${col}`);
              // console.error(`sequence length:${count} out of ${maxLength}`);
              this.sequenceRepair(false);
            }
            return false;
          }
        } else {
          count = 1;
        }
      }
    }
    if (throwE) {
      this.sequenceRepair(true);
    }
    return true;
  }
  sequenceRepair(result) {
    if (result) {
      renderer.setClearColor(displayColors.background);
      M.var.passedLengthTest = true;
    } else {
      renderer.setClearColor(0xed5151);
      M.var.passedLengthTest = false;
    }
  }
}
class CA {
  constructor(rule, _rows, _cols, scene) {
    this.oldBoard = [];
    this.newBoard = [];
    this.on = [];
    this.genCount = 0;
    this.gens = M.var.maxGen + 1;
    this.seeds = [];
    this.COLS = _cols;
    this.ROWS = _rows;
    this.rule = rule;
    this.scene = scene;

    //initialize the boards
    this.oldBoard = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(0)
    );
    this.newBoard = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(0)
    );
    this.seeds = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(0)
    );
  }
  reset() {
    this.oldBoard = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(0)
    );
    this.genCount = 0;
  }
  // zeros out the CA and reseeds it
  restart() {
    this.genCount = 0;
    // clear the archive and molecule array
    // initialize matrix
    this.oldBoard = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(0)
    );
    this.newBoard = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(0)
    );

    //console.log("oldBoard before =" + this.oldBoard);

    for (let j = 0; j < this.ROWS; j++) {
      for (let k = 0; k < this.COLS; k++) {
        if (this.seeds[j][k] == 1) {
          this.oldBoard[j][k] = 1;
        }
      }
    }
    //console.log("oldBoard after =" + this.oldBoard);

    // clear seeds
    this.seeds = Array(this.ROWS).fill(Array(this.COLS).fill(0));

    this.genCount++;
  }
  randomSeed(num) {
    //pick a random seed
    //SEEDS are gen 0 in the visualization
    this.on[this.genCount] = [];
    //get a random number between 0 and the number of this.Rows
    //let randRow = Math.floor(rand() * (this.ROWS - 1)) + 1;
    //let randCol = Math.floor(rand() * (this.COLS - 1)) + 1;

    //get a random number between 0 and the number of this.Rows
    let randRow = Math.floor(this.ROWS / 2);
    let randCol = Math.floor(this.COLS / 2);

    this.seeds[randRow][randCol] = 1;
    this.seeds[randRow + 2][randCol + 2] = 1;
    this.seeds[randRow - 2][randCol - 2] = 1;

    let coinFlip = rand();
    //console.log("coinFlip = " + coinFlip);
    if (coinFlip <= 0.33) {
      // console.log("ASSYM");
      //num = 2; //num - 1;
      // Pick some others around the first
      for (let j = 0; j < num; j++) {
        let env = Math.round(this.ROWS * 0.33); //envelope
        // console.log("env = " + env);
        let randRow2 = Math.floor(rand() * (env * 2 + 1)) - env + randRow;
        let randCol2 = Math.floor(rand() * (env * 2 + 1)) - env + randCol;
        //console.log("wild card seed at " + randRow2 + ", " + randCol2);
        //if for some reason randRow randCol is out of bounds just bail out
        if (
          randRow2 < 0 ||
          randCol2 < 0 ||
          randRow2 > this.ROWS - 1 ||
          randCol2 > this.COLS - 1
        ) {
          //do nothing
          // console.log("out of bounds");
        } else {
          this.seeds[randRow2][randCol2] = 1;
        }
      }
    } else {
      // console.log("SYMM"); 
    }
    this.genCount++;
  } //end of random seed
  // The process of calculating the new pattern
  generate() {
    //add a new gen to on
    this.on[this.genCount] = [];
    // loop through every cell in our array and check neighbors
    for (let y = 0; y < this.ROWS; y++) {
      for (let z = 0; z < this.COLS; z++) {
        // neighbor counter
        let nb = 0;
        const neighbors = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ];

        for (let i = 0; i < neighbors.length; i++) {
          const [dx, dy] = neighbors[i];
          const neighborRow = y + dx;
          const neighborCol = z + dy;

          if (
            neighborRow >= 0 &&
            neighborRow < this.ROWS &&
            neighborCol >= 0 &&
            neighborCol < this.COLS &&
            this.oldBoard[neighborRow][neighborCol] === 1
          ) {
            nb++;
          }
        }

        if (this.oldBoard[y][z] == 1) {
          if (nb == 0) {
            this.newBoard[y][z] = this.rule[0];
          }
          if (nb == 1) {
            this.newBoard[y][z] = this.rule[1];
          }
          if (nb == 2) {
            this.newBoard[y][z] = this.rule[2];
          }
          if (nb == 3) {
            this.newBoard[y][z] = this.rule[3];
          }
          if (nb == 4) {
            this.newBoard[y][z] = this.rule[4];
          }
          if (nb == 5) {
            this.newBoard[y][z] = this.rule[5];
          }
          if (nb == 6) {
            this.newBoard[y][z] = this.rule[6];
          }
        }
        if (this.oldBoard[y][z] == 0) {
          if (nb == 0) {
            this.newBoard[y][z] = this.rule[7];
          }
          if (nb == 1) {
            this.newBoard[y][z] = this.rule[8];
          }
          if (nb == 2) {
            this.newBoard[y][z] = this.rule[9];
          }
          if (nb == 3) {
            this.newBoard[y][z] = this.rule[10];
          }
          if (nb == 4) {
            this.newBoard[y][z] = this.rule[11];
          }
          if (nb == 5) {
            this.newBoard[y][z] = this.rule[12];
          }
          if (nb == 6) {
            this.newBoard[y][z] = this.rule[13];
          }
        }
      }
    }

    /*
    for (let j = 0; j < this.ROWS; j++) {
      for (let k = 0; k < this.COLS; k++) {
        if (this.newBoard[j][k] === 1) {
          this.lattice.points[j][k].state = 1;
          this.on[this.genCount].push(this.lattice.points[j][k]);
        } else {
          //this.lattice.points[j][k].state = 0;
        }
      }
    }
    */

    // swap old and new boards
    let tmp = this.oldBoard;
    this.oldBoard = this.newBoard;
    this.newBoard = tmp;

    //update lattice state
    this.genCount++;

    //println("done");
  }
}

////////////////////////////////////////////////////////
//  START RENDER
////////////////////////////////////////////////////////
init();
// animate();
render();
function init() {
  scene = new THREE.Scene();

  // console.log("devicePixelRatio",window.devicePixelRatio)
  // renderer = new THREE.WebGLRenderer({antialias: true,});
  // renderer = new THREE.WebGLRenderer({});
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(devicePixelRatio);
  let container = document.getElementById("container");
  // renderer.setSize(viewportWidth, viewportHeight);
  renderer.setClearColor(displayColors.background);
  // renderer.domElement.addEventListener("click", onDocumentMouseClick, false);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.zIndex = "-1";

  camera = new THREE.OrthographicCamera(
    -M.var.zoom,
    M.var.zoom,
    M.var.zoom,
    -M.var.zoom,
    1,
    1000
  );
  camera.position.set(0, 0, 35); // Adjust the '50' value as needed to fit everything in view
  camera.lookAt(0, 0, 0); // Focus on the origin of the scene

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  weave = new weavedraft();
  updateCamera();

  createTableSnippet(formatTextforTable(), displayColors.ground);
  addGUI();
  console.log(weave);
  // console.log(scene);

  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);
}

function animate() {
  // let t = performance.now() / 1000;
  // server.timedExport(t);
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
  // server.timedExport(1, 0);
  // server.triggerExport();
}

////////////////////////////////////////////////////////
//  Functions
////////////////////////////////////////////////////////
function onWindowResize() {
  updateCamera();
  styleSquareDiv();
  styleTextUpdate();
  render();
}

function updateCamera() {
  // console.log("updating Camera")
  // console.log(scene)
  // let bbox = new THREE.Box3().setFromObject(scene);
  // let visableArray = []
  // let invisableArray = []
  let bbox = new THREE.Box3();
  /*
  scene.traverse(function (object) {
    // console.log(object)
    if (object.visible && object != scene) {
        // console.log("visible")
        let objectBoundingBox = new THREE.Box3().setFromObject(object);
        bbox.union(objectBoundingBox);
        // visableArray.push(object)
    }else{
      // console.warn("object invisible")
      // invisableArray.push(object)
    }
  });
  // console.log("visableArray",visableArray)
  // console.log("invisableArray",invisableArray)
  // console.log("bboxSize",bboxSize)
  // console.log("bboxCenter",bboxCenter)
  // debugger
  */

  let bboxSize = bbox.getSize(new THREE.Vector3());
  let bboxCenter = bbox.getCenter(new THREE.Vector3());
  //OVERWRITE visible filtering not working.
  // bboxSize = new THREE.Vector3(63,62,2)
  // bboxCenter = new THREE.Vector3(4,-6.5,1)
  bboxSize = new THREE.Vector3(58, 59, 10);
  bboxCenter = new THREE.Vector3(1.5, -9, 5);
  DIM.x = DIM.y = Math.min(window.innerWidth, window.innerHeight);
  renderer.setSize(DIM.x, DIM.y);
  let viewportAspect = DIM.x / DIM.y;
  let contentAspect = bboxSize.x / bboxSize.y;
  let zm = 1.4; //1.5 //1.7;
  let scale;
  if (contentAspect > viewportAspect) {
    // Content is wider than the viewport, fit to width
    scale = bboxSize.x / zm;
    camera.right = scale;
    camera.top = scale / viewportAspect;
    camera.bottom = -scale / viewportAspect;
  } else {
    // Content is taller than the viewport, fit to height
    scale = bboxSize.y / zm;
    camera.top = scale;
    camera.bottom = -scale;
    camera.left = -scale * viewportAspect;
    camera.right = scale * viewportAspect;
  }
  camera.position.set(bboxCenter.x, bboxCenter.y, 35);
  camera.lookAt(bboxCenter);
  camera.updateProjectionMatrix();
}

function saveCanvas(filename = M.seed) {
  let file = filename + ".png";
  let dataURL = renderer.domElement.toDataURL();
  let link = document.createElement("a");
  link.href = dataURL;
  link.download = file;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("saved Canvas");
}
function saveLargeCanvas(filename, size = 2400) {
  // Create an offscreen canvas
  let offScreenCanvas = document.createElement("canvas");
  offScreenCanvas.width = size;
  offScreenCanvas.height = size;
  let offscreenRenderer = new THREE.WebGLRenderer({
    canvas: offScreenCanvas,
    antialias: false,
  });
  offscreenRenderer.setPixelRatio(devicePixelRatio);
  offscreenRenderer.setPixelRatio(2);
  offscreenRenderer.setSize(size, size);
  offscreenRenderer.setClearColor(displayColors.background);
  // offScreenCanvas.appendChild(offscreenRenderer.domElement);
  // Optionally, if your scene or camera is affected by size, adjust them
  // let originalAspect = camera.aspect;
  // camera.aspect = size.width / size.height;
  // camera.updateProjectionMatrix();

  // Render the scene with the offscreen renderer
  offscreenRenderer.render(scene, camera);

  // Save the image from the offscreen canvas
  let dataURL = offScreenCanvas.toDataURL("image/png");
  let link = document.createElement("a");
  link.href = dataURL;
  link.download = filename + ".png";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  offscreenRenderer.dispose();

  // Optionally, reset aspect ratio and projection matrix of the original camera
  // camera.aspect = originalAspect;
  // camera.updateProjectionMatrix();

  console.log("Saved large canvas");
}

// Usage: saveLargeCanvas("highresimage", { width: 1920, height: 1080 });

function saveText(filename = M.seed) {
  // Save wPat to text file
  var textData = wPat_print;
  var textBlob = new Blob([textData], { type: "text/plain" });
  var textURL = URL.createObjectURL(textBlob);
  var a = document.createElement("a");
  a.href = textURL;
  a.download = filename + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  console.log("Saved Image ");
}

function createText() {
  // Find the canvas element and its container
  const canvas = document.querySelector("canvas");
  const container = canvas.parentElement;

  // Check if the overlay already exists
  let overlay = document.getElementById("overlay");
  if (!overlay) {
    // Create a new div element for the overlay
    overlay = document.createElement("div");
    overlay.id = "overlay";

    // Set styles to match the canvas size and position
    overlay.style.position = "absolute";
    overlay.style.top = canvas.offsetTop + "px";
    overlay.style.left = canvas.offsetLeft + "px";
    overlay.style.width = canvas.offsetWidth + "px";
    overlay.style.height = canvas.offsetHeight + "px";

    // Add the overlay to the container
    container.appendChild(overlay);
  }

  // Create a wrapper div for the table
  const tableWrapper = document.createElement("div");
  tableWrapper.id = "table-wrapper"; // You can add styling to this ID later

  let headers = [
    "Pattern:",
    "Colors:",
    "Palette:",
    "Bindings:",
    "Spacing:",
    "Instructions:",
  ];
  let idx = 0;
  // Create the table with 2 rows and 4 columns
  const table = document.createElement("table");
  for (let i = 0; i < 3; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 2; j++) {
      const td = document.createElement("td");
      // td.textContent = `Row ${i + 1}, Col ${j + 1}`;
      td.textContent = `${headers[idx]} ${idx}`;
      tr.appendChild(td);
      idx++;
    }
    table.appendChild(tr);
  }

  // Add styles to the table (optional)
  table.style.width = "100%";
  table.style.height = "100%";
  table.style.borderCollapse = "collapse";

  // Add the table to the wrapper and the wrapper to the overlay
  tableWrapper.appendChild(table);
  overlay.appendChild(tableWrapper);
}

function formatJson() {
  delete M.var.warpColors;
  delete M.var.weftColors;
  delete M.var.theRules;
  /*
  //color Checks
  try{
  console.log( [...M.var.colorWarp ])
  for (let i = 0; i < M.var.colorWarp.length; i++) {
    M.var.colorWarp[i] = "0x" + M.var.colorWarp[i].getHexString();
  }
  console.log( [...M.var.colorWeft ])
  for (let i = 0; i < M.var.colorWeft.length; i++) {
    M.var.colorWeft[i] = "0x" + M.var.colorWeft[i].getHexString();
  }
  
  M.var.activeColor = M.var.activeColor.getHexString();
  M.var.inactiveColor = M.var.inactiveColor.getHexString();
  M.var.backgroundColor = M.var.backgroundColor.getHexString();
  */
  delete M.var.activeColor;
  delete M.var.inactiveColor;
}

function saveJson(name = M.seed) {
  let filename = name + ".json";
  // let myjson = JSON.stringify(M , null , 2);
  let myjson = M;
  downloadFile(myjson, filename);
  console.log("saved Json!");
}

function downloadFile(data, filename) {
  var filenameParts = filename.split(".");
  var filetype = filenameParts[filenameParts.length - 1]; // 'csv' || 'json'
  var blob =
    filetype == "json"
      ? // ? new Blob([JSON.stringify(data)], { type: 'octet/stream' })
        // : new Blob([Papa.unparse(data)], { type: 'text/plain' });
        new Blob(
          [
            JSON.stringify(data, null, 2)
              .replace(/\\n/g, "\n")
              .replace(/\\"/g, '"'),
          ],
          { type: "application/json" }
        ) // Replace \\n with \n and \" with "
      : new Blob([Papa.unparse(data)], { type: "text/plain" });
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.click();
  a.parentNode.removeChild(a);
}
////////////////////////////////////////////////////////
//  Event Listeners
////////////////////////////////////////////////////////
document.addEventListener("keypress", function (e) {
  // console.log("")
  // console.log(e.key)
  if (e.key === "s" || e.key == "S") {
    // renderer.render(scene, camera);
    saveLargeCanvas("Enlace", 2400);
  } else if (e.key === "t" || e.key == "T") {
    // createText()
    M.var.textVisible = !M.var.textVisible;
    toggleText();
  } /*if (e.key === "d" || e.key == "D") {
    // Save image
    // Render the scene and trigger a download of the image
    renderer.render(scene, camera);
    saveCanvas()
    // formatJson()
    // saveJson()
    // saveText()
  }*/

  /*
  // key press  keypress
  if (e.key == "r" || e.key == "R") {
    weave.removeDrawdown();
    weave.resetPattern(weave.tieUp);
    weave.caTieUpGrid();
    // console.log(weave.tieUp);
    weave.visualizeGrid(weave.tieUp);
    weave.getColorGridS();
    weave.visualizeColorGrids();
    weave.computeDrawdown();
    weave.visualizeDrawdown();
  }else if (e.key == "t" || e.key == "T") {
    //pick a random pattern for threading or treadling grid
    let randGrid = Math.floor(rand() * 2);
    let grid;
    if (randGrid == 0) {
      grid = weave.threading;
      console.log("threading");
    } else {
      grid = weave.treadling;
      console.log("treadling");
    }
    weave.resetPattern(grid);

    let randPattern = Math.floor(rand() * 4);
    console.log("randNum = " + randPattern);
    if (randPattern == 0) {
      weave.triWavePattern(grid);
      console.log("triWavePattern");
    } else if (randPattern == 1) {
      weave.twillPattern(grid);
      console.log("twillPattern");
    } else if (randPattern == 2) k{
      weave.vPattern(grid);
      console.log("vPattern");
    } else if (randPattern == 3) {
      weave.randPattern(grid);
      console.log("randPattern");
    }

    weave.visualizeGrid(grid);
    weave.removeDrawdown();
    weave.computeDrawdown();
    weave.visualizeDrawdown();
  }else if (e.key === "s" || e.key == "S") {
    // Save image
    // Render the scene and trigger a download of the image
    renderer.render(scene, camera);
    saveCanvas()
    formatJson()
    saveJson()
    // saveText()
  }
  else if (e.key === "v" || e.key == "V"){
    weave.removeGrid(["tieUp"]);
    render();
  }*/
});

/*
function onDocumentMouseClick(event) {// need async to ensure not switching when clicked
  event.preventDefault();

  mouse.x = (event.clientX / DIM.x) * 2 - 1;
  mouse.y = -(event.clientY / DIM.y) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    let intersected;
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.userData.myInfo.type == "cell") {
        intersected = intersects[i].object;
      }
    }

    // Identify which grid was clicked based on position and offsets
    let clickedGrid, gridOffsetX, gridOffsetY;
    console.log(intersected.userData);
    clickedGrid = intersected.userData.myInfo.myGrid;
    // console.log( structuredClone(clickedGrid) )

    if (clickedGrid) {
      const clickedCol = intersected.userData.myInfo.myCol;
      const clickedRow = intersected.userData.myInfo.myRow;

      clickedGrid[clickedRow][clickedCol] =
        1 - clickedGrid[clickedRow][clickedCol];
      if (intersected.material.color.equals(M.var.activeColor)) {
        intersected.material.color = M.var.inactiveColor;
      } else {
        intersected.material.color = M.var.activeColor;
      }
      // console.log( structuredClone(clickedGrid) )

      //console.log(structuredClone(weave.drawdownWarp.pattern));
      //console.log(structuredClone(weave.drawdownWeft.pattern));

      // Recompute and redraw the drawdown
      weave.computeDrawdown();
      //console.log(structuredClone(weave.drawdownWarp.pattern));
      //console.log(structuredClone(weave.drawdownWeft.pattern));

      weave.visualizeDrawdown();
    }
  }
}
*/

////////////////////////////////////////////////////////
//  GUI
////////////////////////////////////////////////////////
function addGUI() {
  gui = new GUI({ width: 350 });
  gui.add(M.var, "preset", presetTypes).name("Preset");
  const threading = gui.addFolder("Threading");
  const treadling = gui.addFolder("Treadling");
  const tieUp = gui.addFolder("tieUp");
  const drawDown = gui.addFolder("drawDown");
  const colorControl = gui.addFolder("Colors");

  const fn = {
    randomizeTieUp: function () {
      updateTieUpPattern();
      render();
    },
  };

  ///////////////////////////
  //  threading
  ///////////////////////////
  threading
    .add(M.var, "threadingPattern", threadingPatternTypes)
    .name("Pattern")
    .onChange(function () {
      updateThreadingPattern();
      render();
    });
  threading
    .add(M.var, "threadingSlope", 0, 4, 0.0001)
    .name("Slope")
    .onChange(function () {
      updateThreadingPattern();
      render();
    });
  threading
    .add(M.var, "threadingOffset", -5, 5, 1)
    .name("Offset")
    .onChange(function () {
      updateThreadingPattern();
      render();
    });
  threading
    .add(M.var, "threadingTranslate", -10, 10, 1)
    .name("Translate")
    .onChange(function () {
      updateThreadingPattern();
      render();
    });
  threading
    .add(M.var, "treadlingMirrorPattern")
    .name("Not Added- Mirror Pattern")
    .onChange(function () {});
  threading
    .add(M.var, "treadlingMirrorColor")
    .name("Not Added- Mirror Color")
    .onChange(function () {});

  ///////////////////////////
  //  treadling
  ///////////////////////////
  treadling
    .add(M.var, "treadlingPattern", treadlingPatternTypes)
    .name("Pattern")
    .onChange(function () {
      updateTreadlingPattern();
      render();
    });
  treadling
    .add(M.var, "treadlingSlope", 0, 4, 0.0001)
    .name("Slope")
    .onChange(function () {
      updateTreadlingPattern();
      render();
    });
  treadling
    .add(M.var, "treadlingOffset", -5, 5, 1)
    .name("Offset")
    .onChange(function () {
      updateTreadlingPattern();
      render();
    });
  treadling
    .add(M.var, "treadlingTranslate", -10, 10, 1)
    .name("Translate")
    .onChange(function () {
      updateTreadlingPattern();
      render();
    });
  treadling
    .add(M.var, "treadlingMirrorPattern")
    .name("Not Added- Mirror Pattern")
    .onChange(function () {});
  treadling
    .add(M.var, "treadlingMirrorColor")
    .name("Not Added- Mirror Color")
    .onChange(function () {});

  ///////////////////////////
  //  tieUp
  ///////////////////////////
  tieUp.add(fn, "randomizeTieUp").name("randomize Tie Up");
  let temp = { temp: false };
  tieUp
    .add(temp, "temp")
    .name("Not Added- Mirror Tie Up")
    .onChange(function () {});

  ///////////////////////////
  //  drawDown
  ///////////////////////////
  /*
  drawDown.add(M.var, "verticalSpacing", 1, 2, 0.05).name("vertical Spacing").onChange(function () {
    weave.removeDrawdown();
    weave.removeGrid(["treadling", , "colorWarp", "colorWeft"]);
    weave.treadling.offSet.y = M.var.verticalSpacing;
    weave.colorWeft.offSet.y = M.var.verticalSpacing;
    weave.drawdownWeft.offSet.y = M.var.verticalSpacing;
    weave.drawdownWarp.offSet.y = M.var.verticalSpacing;
    weave.offsetPattern(weave.treadling);
    weave.offsetPattern(weave.colorWeft);
    weave.offsetPattern(weave.drawdownWarp);
    weave.offsetPattern(weave.drawdownWeft);
    weave.visualizeGrid(weave.treadling);
    weave.visualizeColorGrids();
    weave.computeDrawdown();
    weave.visualizeDrawdown();
    render()
  }).listen();*/
  drawDown
    .add(M.var, "verticalSpacingType", spacingTypes)
    .name("Spacing")
    .onChange(function () {
      if (M.var.verticalSpacingType == "Standard") {
        M.var.verticalSpacing = 1.5;
      } else if (M.var.verticalSpacingType == "Tight") {
        M.var.verticalSpacing = 1.25;
      } else if (M.var.verticalSpacingType == "Close") {
        M.var.verticalSpacing = 1.0;
      }

      weave.removeDrawdown();
      weave.removeGrid(["treadling", , "colorWarp", "colorWeft"]);
      weave.treadling.offSet.y = M.var.verticalSpacing;
      weave.colorWeft.offSet.y = M.var.verticalSpacing;
      weave.drawdownWeft.offSet.y = M.var.verticalSpacing;
      weave.drawdownWarp.offSet.y = M.var.verticalSpacing;
      weave.offsetPattern(weave.treadling);
      weave.offsetPattern(weave.colorWeft);
      weave.offsetPattern(weave.drawdownWarp);
      weave.offsetPattern(weave.drawdownWeft);
      weave.visualizeGrid(weave.treadling);
      weave.visualizeColorGrids();
      weave.computeDrawdown();
      weave.visualizeDrawdown();
      render();
    })
    .listen();
  drawDown
    .add(M.var, "drawEdges")
    .name("Draw Edges")
    .onChange(function () {
      weave.removeDrawdown();
      weave.visualizeDrawdown();
      render();
    });

  ///////////////////////////
  //  Colors
  ///////////////////////////
  colorControl
    .add(M.var, "colorPalette", colorPalettes)
    .name("Color Generation")
    .onChange(function () {
      console.log("colorpal");
      weave.removeGrid(["colorWarp", "colorWeft"]);
      weave.getColorGridS();
      weave.visualizeColorGrids();
      weave.removeDrawdown();
      weave.visualizeDrawdown();
      render();
    });
  colorControl
    .add(M.var, "colorArrayName", colorSelectNames)
    .name("REMOVED Color Palette")
    .onChange(function () {});
  /*
  colorControl.add(M.var, "colorArrayName", colorArrayNames).name("Color Palette").onChange(function () {
    console.log("colorpal")
    weave.removeGrid(["colorWarp", "colorWeft"]);
    weave.getColorGridS()
    weave.visualizeColorGrids();
    weave.removeDrawdown();
    weave.visualizeDrawdown();
    render();
  })*/
  colorControl
    .add(M.var, "colorWeftCount", 1, 3, 1)
    .name("Not Added- Color Palettes")
    .onChange(function () {});
  colorControl
    .add(M.var, "colorWarpCount", 1, 3, 1)
    .name("Not Added- Color Palettes")
    .onChange(function () {});

  colorControl.add(M.var, "layout", layouts).name("layout");
  ///////////////////////////
  //  update functions
  ///////////////////////////

  function updateThreadingPattern() {
    weave.resetPattern(weave.threading);
    weave.managePattern();
    weave.removeGrid(["threading"]);
    weave.visualizeGrid(weave.threading);
    weave.removeDrawdown();
    weave.computeDrawdown();
    weave.visualizeDrawdown();
  }

  function updateTreadlingPattern() {
    weave.resetPattern(weave.treadling);
    weave.managePattern();
    weave.removeGrid(["treadling"]);
    weave.visualizeGrid(weave.treadling);
    weave.removeDrawdown();
    weave.computeDrawdown();
    weave.visualizeDrawdown();
  }

  function updateTieUpPattern() {
    weave.resetPattern(weave.tieUp);
    weave.caTieUpGrid();
    weave.removeGrid(["tieUp"]);
    weave.visualizeGrid(weave.tieUp);
    weave.removeDrawdown();
    weave.computeDrawdown();
    weave.visualizeDrawdown();
  }

  tieUp.open();
  treadling.open();
  drawDown.open();
  threading.open();
  treadling.open();
  colorControl.open();
  gui.open();
}

////////////////////////////////////////////////////////
//  Random Functions
////////////////////////////////////////////////////////
function rand(min = 0, max = 1) {
  // return Math.random() * (max - min) + min;
  // return R.rand(min, max);
  return min + (max - min) * R.random_dec();
}
function rInt(a, b) {
  // random integer between a (inclusive) and b (inclusive)
  if (a < b) {
    return Math.floor(rand(a, b + 1));
  } else {
    return Math.floor(rand(b, a + 1));
  }
}
function randChoice(list) {
  // random value in an array of items
  return list[rInt(0, list.length - 1)];
}
function rWeightedItems(items, weights) {
  let options = {
    select: rand(),
    index: null,
    sum: 0,
    mode: null,
    tempMin: 0,
    tempMax: 0,
  };
  for (let i = 0; i < weights.length; i++) {
    options.sum += weights[i];
  }

  for (let i = 0; i < items.length; i++) {
    options.tempMax = weights[i] / options.sum + options.tempMin;
    if (options.tempMin <= options.select && options.select < options.tempMax) {
      if (weights[i] != 0) {
        options.index = i;
      }
    }
    options.tempMin += weights[i] / options.sum;
  }
  return items[options.index];
}
function genTokenData(projectNum = 0) {
  let data = {};
  let hash = "0x";
  for (var i = 0; i < 64; i++) {
    // hash += Math.floor(Math.random() * 16).toString(16);
    hash += Math.floor(seedRand() * 16).toString(16);
  }
  data.hash = hash;

  // data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
  data.tokenId = (
    projectNum * 1000000 +
    Math.floor(seedRand() * 1000)
  ).toString();
  return data;
}
function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}
function cyrb128(str) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
}

function triangleWave(x, slope, height, translation) {
  if (height <= 0) {
    throw new Error("Height must be positive");
  }

  const normalizedX = (x + translation) * slope;
  const period = 2 * height - 2;
  const modX = normalizedX % period;

  if (height % 2 === 0) {
    // Special handling for even heights
    if (modX < height) {
      return modX;
    } else if (modX < period - height) {
      return height - 1;
    } else {
      return modX - period;
    }
  } else {
    // General case
    if (modX < height) {
      return modX;
    } else {
      return period - modX;
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rand(0, i));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function shuffleArrayRandom(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random()*i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function fetchColors(gridName, pattern, i, j) {
  let cellColor;
  let edgeColor;
  let mode = M.var.displayMode; // "Tight"
  // console.log(mode)
  if (mode == "Original") {
    (cellColor = pattern[i][j] === 1 ? M.var.activeColor : M.var.inactiveColor),
      (edgeColor = M.var.activeColor);
  } else if (mode == "Inverse" || mode == "Grid") {
    if (pattern[i][j] === 1) {
      cellColor = displayColors[gridName].active.cell; // M.var.activeColor
      edgeColor = displayColors[gridName].active.edge; // M.var.activeColor
    } else {
      cellColor = displayColors[gridName].inactive.cell; // M.var.inactiveColor
      edgeColor = displayColors[gridName].inactive.edge; // M.var.inactiveColor
    }
  } else if (mode == "Weave Colors") {
    if (gridName == "tieUp") {
      if (pattern[i][j] === 1) {
        cellColor = displayColors[gridName].active.cell; // M.var.activeColor
        edgeColor = displayColors[gridName].active.edge; // M.var.activeColor
      } else {
        cellColor = displayColors[gridName].inactive.cell; // M.var.inactiveColor
        edgeColor = displayColors[gridName].inactive.edge; // M.var.inactiveColor
      }
    } else {
      let indx;
      if (gridName == "threading") {
        indx = j % displayColors[gridName].active.cell.length;
      } else if (gridName == "treadling") {
        indx = i % displayColors[gridName].active.cell.length;
      }

      let active = displayColors[gridName].active.cell[indx];
      if (pattern[i][j] === 1) {
        cellColor = active; // M.var.activeColor
        if (active == displayColors.background) {
          edgeColor = displayColors.tieUp.inactive.cell;
        } else {
          edgeColor = false;
        }
      } else {
        cellColor = displayColors[gridName].inactive.cell; // M.var.inactiveColor
        edgeColor = displayColors[gridName].inactive.edge; // M.var.inactiveColor
      }
    }
  }
  return { cell: cellColor, edge: edgeColor };
}

function toggleText() {
  if (squareDiv.style.display == "block") {
    squareDiv.style.display = "none";
  } else {
    squareDiv.style.display = "block";
  }
}

function styleSquareDiv() {
  let viewportHeight = DIM.x;

  // let parentElement = squareDiv.parentElement
  // viewportHeight = Math.min(parentElement.clientWidth,parentElement.clientHeight)
  if (M.var.textVisible) {
    squareDiv.style.display = "block"; // "block" "none"
  } else {
    squareDiv.style.display = "none"; // "block" "none"
  }

  squareDiv.style.position = "absolute";
  squareDiv.style.height = viewportHeight + "px";
  squareDiv.style.width = viewportHeight + "px";
  squareDiv.style.left = "50%";
  squareDiv.style.top = "50%";
  squareDiv.style.transform = "translate(-50%, -50%)";

  // squareDiv.style.background = 'red'; // Just for visibility

  styleInnerDiv();
}

function styleInnerDiv() {
  innerDiv.style.position = "absolute";
  innerDiv.style.bottom = "0";
  innerDiv.style.width = "68.5%";
  innerDiv.style.height = "14.8%";
  innerDiv.style.left = "50%";
  innerDiv.style.transform = "translateX(-50%)";
  innerDiv.style.zIndex = "5";
  // innerDiv.style.background = 'red';
}

function createTableSnippet(
  contentValues = ["", "", "", "", ""],
  textColor = "black",
  parentElement = innerDiv
) {
  // let contentArray = ["Pattern:   ","Colors:   ","Palette:   ","Bindings:   ","Spacing:   ","Instructions:   "]
  let contentArray = [
    "Pattern:   ",
    "Warp Colors:   ",
    "Palette:   ",
    "Weft Colors:   ",
    "Spacing:   ",
    "Bindings:   ",
  ];

  for (let i = 0; i < contentValues.length; i++) {
    contentArray[i] += contentValues[i];
  }

  // console.log(textColor instanceof THREE.Color  )
  // debugger
  if (textColor instanceof THREE.Color) {
    textColor = textColor.getHexString();
  }

  // Create table and its body
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  table.appendChild(tbody);
  table.style.width = "100%"; // Table takes up 100% of the parent's width
  table.style.tableLayout = "fixed"; // Ensures columns are evenly spread out
  table.style.zIndex = "5";

  // Array of rows, each row is an array of cell contents for that row
  var rows = [
    [contentArray[0], contentArray[1]], // First row
    [contentArray[2], contentArray[3]], // Second row
    [contentArray[4], contentArray[5]], // Third row
  ];

  // Iterate through each row to create and append its cells
  rows.forEach(function (rowContent, rowIndex) {
    let tr = document.createElement("tr");
    rowContent.forEach(function (cellContent) {
      let cell = document.createElement("td");
      cell.innerText = cellContent;
      cell.style.color = "#" + textColor;
      cell.style.whiteSpace = "nowrap";

      tr.appendChild(cell);
      tabelCells.push(cell);
    });
    tbody.appendChild(tr);
  });

  // Append the table to the specified parent element
  if (parentElement) {
    parentElement.appendChild(table);
  } else {
    console.error("Parent element not found.");
  }
}
function styleTextUpdate() {
  let fontSize;
  if (DIM.x > 1000) {
    // For larger screens
    fontSize = "18px"; // Larger font size
  } else if (DIM.x > 600) {
    // For medium screens
    fontSize = "16px"; // Medium font size
  } else if (DIM.x > 450) {
    // For medium screens
    fontSize = "14px"; // Medium font size
  } else {
    // For smaller screens
    fontSize = "12px"; // Smaller font size
  }

  // console.log(fontSize);
  tabelCells.forEach(function (cell) {
    cell.style.fontSize = fontSize;
    if (DIM.x < 300) {
      cell.style.display = "none";
    } else {
      cell.style.display = "table-cell";
    }
  });
  // console.log(fontSize);
}

function formatTextforTable() {
  let colArr = [...M.var.colorWarpNames, ...M.var.colorWeftNames];
  let st1 = "";
  let st2 = "";
  let arr = [];
  for (let color of M.var.colorWarpNames) {
    st1 += `${color}, `;
  }
  st1 = st1.slice(0, -1);
  st1 = st1.slice(0, -1);
  for (let color of M.var.colorWeftNames) {
    st2 += `${color}, `;
  }
  st2 = st2.slice(0, -1);
  st2 = st2.slice(0, -1);
  arr[0] = M.var.preset;
  arr[1] = st1;
  arr[2] = M.var.colorSelectName;
  arr[3] = st2;
  arr[4] = M.var.verticalSpacingType;
  arr[5] = displayColors.backgroundName; // background.getHexString();
  return arr;
}
