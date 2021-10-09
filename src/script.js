// Set initial canvas settings...

let dimensions = {
  x: 0,
  y: 0,
  width: 500,
  height: 500
};
let gap = dimensions.width + dimensions.height;
let fixedDimensions = { x: 0, y: 0 };
let prevDimensions = { x: 0, y: 0, scale: 1 };
let frame = undefined;
let offset = { x: 0, y: 0 };
let prevMode = undefined;
let mode = "draw";
let palette = [
  "#E74C3C",
  "#E67E22",
  "#F1C40F",
  "#2ECC71",
  "#1ABC9C",
  "#3498DB",
  "#9B59B6"
];
let searching = false;
let colorPicked = undefined;
let distance = 0;
let scale = 1;
let erase = false;
let drawn = false;
let rotation = 0,
  prevRotation = undefined;
let difference = 0;
let middleCoord;
let lineWidth = 3;
let path = "";
let scaled = false;
let strokeColor = "#000000";
let start = true;

const actions = [];
const colorCode = document.querySelector(".color__code");
colorCode.innerText = strokeColor;
const canvas = document.getElementById("area"),
  ctx = canvas.getContext("2d");
const stateCanvas = new OffscreenCanvas(dimensions.width, dimensions.height),
  sctx = stateCanvas.getContext("2d");
const copyCanvas = new OffscreenCanvas(
    (window.innerWidth || 1) + gap * 5,
    (window.innerHeight || 1) + gap * 5
  ),
  cctx = copyCanvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const info = document.querySelector(".info__p");
const tempCanvas = document.querySelector("#temp");
const tctx = tempCanvas.getContext("2d");

// Resize canvas on screen adjust...

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  tempCanvas.width = window.innerWidth;
  tempCanvas.height = window.innerHeight;
  copyCanvas.width = (window.innerWidth || 1) + gap * 5;
  copyCanvas.height = (window.innerHeight || 1) + gap * 5;
  ctx.fillStyle = "white";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;
  cctx.lineCap = "round";
  cctx.lineJoin = "round";
  cctx.lineWidth = lineWidth;
  cctx.strokeStyle = strokeColor;
  scale = 1;
  rotation = 0;
  dimensions.x = window.innerWidth / 2;
  dimensions.y = window.innerHeight / 2;
  prevDimensions.x = dimensions.x;
  prevDimensions.y = dimensions.y;
  dimensions.x -= dimensions.width / 2;
  dimensions.y -= dimensions.height / 2;
  path = "";
  path = path + `ctx.strokeStyle = "${strokeColor}";`;
  info.innerText = "scale: 1, rotation: 0\u00B0";
  drawCanvas();
}

function RGBtoHEX(r, g, b) {
  r = r.toString(16).length > 1 ? r.toString(16) : "0" + r.toString(16);
  g = g.toString(16).length > 1 ? g.toString(16) : "0" + g.toString(16);
  b = b.toString(16).length > 1 ? b.toString(16) : "0" + b.toString(16);
  return "#" + r + g + b;
}

function drawCanvas() {
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  ctx.translate(
    dimensions.x + dimensions.width / 2,
    dimensions.y + dimensions.height / 2
  );
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(
    -(dimensions.x + dimensions.width / 2),
    -(dimensions.y + dimensions.height / 2)
  );
  ctx.fillStyle = "white";
  ctx.fillRect(dimensions.x, dimensions.y, dimensions.width, dimensions.height);
  ctx.drawImage(
    stateCanvas,
    0,
    0,
    dimensions.width,
    dimensions.height,
    dimensions.x,
    dimensions.y,
    dimensions.width,
    dimensions.height
  );
  ctx.translate(
    dimensions.x + dimensions.width / 2,
    dimensions.y + dimensions.height / 2
  );
  ctx.rotate(-((rotation * Math.PI) / 180));
  ctx.translate(
    -(dimensions.x + dimensions.width / 2),
    -(dimensions.y + dimensions.height / 2)
  );
}

function recalc() {
  //sctx.clearRect(0,0,dimensions.width,dimensions.height);
  for (let i of actions) {
    sctx.drawImage(i, 0, 0);
  }
}

window.addEventListener("resize", () => {
  cctx.resetTransform();
  cctx.beginPath();
  cctx.clearRect(
    0,
    0,
    window.innerWidth + gap * 5,
    window.innerHeight + gap * 5
  );
  let x = dimensions.x + gap; //prevDimensions.x + gap - dimensions.width / 2,
  y = dimensions.y + gap; //prevDimensions.y + gap - dimensions.height / 2;

  cctx.translate(x + dimensions.width / 2, y + dimensions.height / 2);
  cctx.rotate(-((rotation * Math.PI) / 180));
  cctx.translate(-(x + dimensions.width / 2), -(y + dimensions.height / 2));
  eval(path.replaceAll("ctx", "cctx"));
  createImageBitmap(
    cctx.getImageData(x, y, dimensions.width, dimensions.height)
  ).then((bm) => {
    actions.push(bm);
    recalc();
    drawn = false;
    resize();
  });
});

window.addEventListener("dblclick", () => document.body.requestFullscreen());
canvas.addEventListener("click", (e) => {
  if (mode === "draw") {
    let swidth = lineWidth / 2 < 1 ? 1 : lineWidth / 2;
    let cmd = `ctx.beginPath();ctx.fillStyle="${strokeColor}";ctx.arc(${
      e.pageX / scale
    },${e.pageY / scale},${swidth},0,2*Math.PI);ctx.fill();`;
    eval(cmd);

    cmd = `ctx.beginPath();ctx.fillStyle="${strokeColor}";ctx.arc(${
      e.pageX / scale + gap
    },${e.pageY / scale + gap},${swidth},0,2*Math.PI);ctx.fill();`;
    path = path + cmd;
    drawn = true;
  }
});

function applyFrame(r) {
  cctx.resetTransform();
  cctx.beginPath();
  cctx.clearRect(
    0,
    0,
    window.innerWidth + gap * 5,
    window.innerHeight + gap * 5
  );
  let x = dimensions.x + gap; //prevDimensions.x + gap - dimensions.width / 2,
  y = dimensions.y + gap; //prevDimensions.y + gap - dimensions.height / 2;

  cctx.translate(x + dimensions.width / 2, y + dimensions.height / 2);
  cctx.rotate(-((rotation * Math.PI) / 180));
  cctx.translate(-(x + dimensions.width / 2), -(y + dimensions.height / 2));
  eval(path.replaceAll("ctx", "cctx"));
  createImageBitmap(
    cctx.getImageData(x, y, dimensions.width, dimensions.height)
  ).then((bm) => {
    actions.push(bm);
    recalc();
    path = "";
    drawn = false;
    if (r) {
      scale = 1;
      rotation = 0;
      dimensions.x = window.innerWidth / 2;
      dimensions.y = window.innerHeight / 2;
      prevDimensions.x = dimensions.x;
      prevDimensions.y = dimensions.y;
      dimensions.x -= dimensions.width / 2;
      dimensions.y -= dimensions.height / 2;
      drawCanvas();
    }
  });
}

canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    if (drawn) {
      applyFrame();
    }

    middleCoord = {
      x: Math.round((e.touches[0].pageX + e.touches[1].pageX) / 2),
      y: Math.round((e.touches[0].pageY + e.touches[1].pageY) / 2)
    };

    prevRotation =
      Math.atan2(
        e.touches[1].pageY - e.touches[0].pageY,
        e.touches[1].pageX - e.touches[0].pageX
      ) *
      (180 / Math.PI);

    offset.x = Math.round(middleCoord.x - prevDimensions.x);
    offset.y = Math.round(middleCoord.y - prevDimensions.y);

    distance = Math.round(
      Math.sqrt(
        Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2) +
          Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2)
      )
    );
  } else {
    if (mode === "draw") {
      let cmd = `ctx.beginPath();ctx.moveTo(${e.touches[0].pageX / scale}, ${
        e.touches[0].pageY / scale
      });`;
      eval(cmd);

      cmd = `ctx.beginPath();ctx.moveTo(${e.touches[0].pageX / scale + gap}, ${
        e.touches[0].pageY / scale + gap
      });`;
      path = path + cmd;
    } else if (mode === "picker") {
      searching = true;
    } else if (mode === "line" || mode === "circle" || mode === "square") {
      startCoord.x = e.touches[0].pageX;
      startCoord.y = e.touches[0].pageY;
    }
  }
});

canvas.addEventListener("touchend", (e) => {
  if (mode === "draw") {
    ctx.beginPath();
    path = path + "ctx.beginPath();";
  } else if (mode === "picker") {
    searching = false;
    mode = prevMode;
    dropper.style.backgroundColor = "rgba(0,0,0,0.6)";
    tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    if (colorPicked) {
      let color = RGBtoHEX(...colorPicked);
      colorCode.innerText = color;
      ctx.strokeStyle = color;
      cctx.strokeStyle = color;
      strokeColor = color;
      pickr.setColor(color);
    }
  } else if (
    mode === "line" &&
    startCoord.x !== null &&
    endCoord.x !== null &&
    e.touches.length === 0
  ) {
    tctx.beginPath();
    tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    let cmd = `ctx.beginPath();ctx.lineWidth="${lineWidth}";ctx.strokeStyle="${strokeColor}";ctx.moveTo(${
      startCoord.x / scale
    },${startCoord.y / scale});ctx.lineTo(${endCoord.x / scale},${
      endCoord.y / scale
    });ctx.stroke();`;
    eval(cmd);

    cmd = `ctx.beginPath();ctx.lineWidth="${lineWidth}";ctx.strokeStyle="${strokeColor}";ctx.moveTo(${
      startCoord.x / scale + gap
    },${startCoord.y / scale + gap});ctx.lineTo(${endCoord.x / scale + gap},${
      endCoord.y / scale + gap
    });ctx.stroke();`;
    path = path + cmd;
    drawn = true;

    startCoord.x = null;
    startCoord.y = null;
    endCoord.x = null;
    endCoord.y = null;
  } else if (
    mode === "circle" &&
    startCoord.x !== null &&
    endCoord.x !== null &&
    radius !== null &&
    e.touches.length === 0
  ) {
    tctx.beginPath();
    tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    let cmd = `ctx.beginPath();ctx.lineWidth="${lineWidth}";ctx.strokeStyle="${strokeColor}";ctx.arc(${
      startCoord.x / scale
    },${startCoord.y / scale},${radius / 2},0,2*Math.PI);ctx.stroke();`;
    eval(cmd);

    cmd = `ctx.beginPath();ctx.lineWidth="${lineWidth}";ctx.strokeStyle="${strokeColor}";ctx.arc(${
      startCoord.x / scale + gap
    },${startCoord.y / scale + gap},${radius / 2},0,2*Math.PI);ctx.stroke();`;
    path = path + cmd;
    drawn = true;

    startCoord.x = null;
    startCoord.y = null;
    endCoord.x = null;
    endCoord.y = null;
  } else if (
    mode === "square" &&
    startCoord.x !== null &&
    endCoord.x !== null &&
    e.touches.length === 0
  ) {
    tctx.beginPath();
    tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    let cmd = `ctx.beginPath();ctx.lineWidth="${lineWidth}";ctx.strokeStyle="${strokeColor}";ctx.moveTo(${
      startCoord.x / scale
    }, ${startCoord.y / scale});
      ctx.lineTo(${endCoord.x / scale}, ${startCoord.y / scale});
      ctx.lineTo(${endCoord.x / scale}, ${endCoord.y / scale});
      ctx.lineTo(${startCoord.x / scale}, ${endCoord.y / scale});
      ctx.lineTo(${startCoord.x / scale}, ${
      startCoord.y / scale
    });ctx.stroke();`;
    eval(cmd);

    cmd = `ctx.beginPath();ctx.lineWidth="${lineWidth}";ctx.strokeStyle="${strokeColor}";ctx.moveTo(${
      startCoord.x / scale + gap
    }, ${startCoord.y / scale + gap});
      ctx.lineTo(${endCoord.x / scale + gap}, ${startCoord.y / scale + gap});
      ctx.lineTo(${endCoord.x / scale + gap}, ${endCoord.y / scale + gap});
      ctx.lineTo(${startCoord.x / scale + gap}, ${endCoord.y / scale + gap});
      ctx.lineTo(${startCoord.x / scale + gap}, ${
      startCoord.y / scale + gap
    });ctx.stroke();`;

    path = path + cmd;
    drawn = true;

    startCoord.x = null;
    startCoord.y = null;
    endCoord.x = null;
    endCoord.y = null;
  }
});

canvas.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    let currentDistance = Math.round(
      Math.sqrt(
        Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2) +
          Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2)
      )
    );
    difference = Math.round(Math.abs(currentDistance - distance));
    let currentScale;
    scaled = false;
    prevDimensions.scale = scale;
    if (currentDistance > distance) {
      currentScale = difference / 150;
      if (scale + currentScale <= 10) scale += currentScale;
      distance = currentDistance;
      scaled = true;
    } else {
      currentScale = difference / 150;
      if (scale - currentScale >= 0.2) scale -= currentScale;
      distance = currentDistance;
      scaled = true;
    }

    middleCoord = {
      x: Math.round((e.touches[0].pageX + e.touches[1].pageX) / 2),
      y: Math.round((e.touches[0].pageY + e.touches[1].pageY) / 2)
    };

    let currentRotation =
      Math.atan2(
        e.touches[1].pageY - e.touches[0].pageY,
        e.touches[1].pageX - e.touches[0].pageX
      ) *
      (180 / Math.PI);
    rotation += currentRotation - prevRotation;
    prevRotation = currentRotation;
    rotation = rotation <= 360 ? rotation : rotation - 360;
    rotation = rotation >= -360 ? rotation : 0;

    info.innerText = `scale: ${String(scale).slice(
      0,
      3
    )}, rotation: ${Math.round(rotation)}\u00B0`;

    dimensions.x = middleCoord.x - offset.x;
    dimensions.y = middleCoord.y - offset.y;
    prevDimensions.x = dimensions.x;
    prevDimensions.y = dimensions.y;
    dimensions.x /= scale;
    dimensions.y /= scale;
    dimensions.x -= dimensions.width / 2;
    dimensions.y -= dimensions.height / 2;
    drawCanvas();
  } else {
    // Image color data for color picker mode...
    if (mode === "picker") {
      tctx.beginPath();
      tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      let imgData = ctx.getImageData(
        e.touches[0].pageX,
        e.touches[0].pageY,
        1,
        1
      );
      colorPicked = Object.values(imgData.data);
      tctx.arc(e.touches[0].pageX, e.touches[0].pageY - 50, 20, 0, 2 * Math.PI);
      tctx.fillStyle = `rgba(${colorPicked[0]},${colorPicked[1]},${colorPicked[2]},${colorPicked[3]})`;
      tctx.strokeStyle = "black";
      tctx.lineWidth = "1";
      tctx.fill();
      tctx.stroke();
    } else if (mode === "draw") {
      let cmd = `ctx.strokeStyle="${strokeColor}";ctx.lineWidth="${lineWidth}";ctx.lineTo(${
        e.touches[0].pageX / scale
      },${e.touches[0].pageY / scale});ctx.stroke();`;
      eval(cmd);

      cmd = `ctx.strokeStyle="${strokeColor}";ctx.lineWidth="${lineWidth}";ctx.lineTo(${
        e.touches[0].pageX / scale + gap
      },${e.touches[0].pageY / scale + gap});ctx.stroke();`;
      path = path + cmd;
      drawn = true;
    } else if (mode === "line") {
      endCoord.x = e.touches[0].pageX;
      endCoord.y = e.touches[0].pageY;
      tctx.save();
      tctx.beginPath();
      tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tctx.scale(scale, scale);
      tctx.lineWidth = lineWidth;
      tctx.strokeStyle = strokeColor;
      tctx.lineCap = "round";
      tctx.moveTo(startCoord.x / scale, startCoord.y / scale);
      tctx.lineTo(endCoord.x / scale, endCoord.y / scale);
      tctx.stroke();
      tctx.restore();
      tctx.scale(1, 1);
    } else if (mode === "circle") {
      endCoord.x = e.touches[0].pageX;
      endCoord.y = e.touches[0].pageY;
      radius = Math.round(
        Math.sqrt(
          Math.pow(startCoord.x - endCoord.x, 2) +
            Math.pow(startCoord.y - endCoord.y, 2)
        )
      );
      tctx.save();
      tctx.beginPath();
      tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tctx.scale(scale, scale);
      tctx.lineWidth = lineWidth;
      tctx.strokeStyle = strokeColor;
      tctx.lineCap = "round";
      tctx.arc(
        startCoord.x / scale,
        startCoord.y / scale,
        radius / 2,
        0,
        2 * Math.PI
      );
      tctx.stroke();
      tctx.restore();
      tctx.scale(1, 1);
    } else if (mode === "square") {
      endCoord.x = e.touches[0].pageX;
      endCoord.y = e.touches[0].pageY;
      tctx.save();
      tctx.beginPath();
      tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tctx.scale(scale, scale);
      tctx.lineWidth = lineWidth;
      tctx.strokeStyle = strokeColor;
      tctx.lineCap = "round";
      tctx.lineJoin = "round";
      tctx.moveTo(startCoord.x / scale, startCoord.y / scale);
      tctx.lineTo(endCoord.x / scale, startCoord.y / scale);
      tctx.lineTo(endCoord.x / scale, endCoord.y / scale);
      tctx.lineTo(startCoord.x / scale, endCoord.y / scale);
      tctx.lineTo(startCoord.x / scale, startCoord.y / scale);
      tctx.stroke();
      tctx.restore();
      tctx.scale(1, 1);
    }
  }
});

resize();

/* USER SETTINGS...*/

const pickr = Pickr.create({
  el: ".pickr",
  theme: "monolith", // or 'monolith', or 'nano'
  alwaysShow: true,
  autoReposition: true,
  defaultRepresentation: "HEX",
  appClass: ".color-picker",
  default: strokeColor,
  swatches: [
    "rgba(244, 67, 54, 1)",
    "rgba(233, 30, 99, 1)",
    "rgba(156, 39, 176, 1)",
    "rgba(103, 58, 183, 1)",
    "rgba(63, 81, 181, 1)",
    "rgba(33, 150, 243, 1)",
    "rgba(3, 169, 244, 1)",
    "rgba(0, 188, 212, 1)",
    "rgba(0, 150, 136, 1)",
    "rgba(76, 175, 80, 1)",
    "rgba(139, 195, 74, 1)",
    "rgba(205, 220, 57, 1)",
    "rgba(255, 235, 59, 1)",
    "rgba(255, 193, 7, 1)"
  ],
  components: {
    // Main components
    preview: true,
    hue: true,
    // Input / output Options
    interaction: {
      hex: true,
      rgba: true,
      hsla: true,
      hsva: true,
      cmyk: true,
      input: true,
      clear: true,
      save: true
    }
  }
});

pickr.on("change", (color) => {
  color = `#${color.toHEXA().join("").toUpperCase()}`;
  colorCode.innerText = color;
  ctx.strokeStyle = color;
  cctx.strokeStyle = color;
  strokeColor = color;
});

// Enable color selection from canvas...

const dropper = document.querySelector(".dropper");
dropper.addEventListener("click", () => {
  dropper.style.backgroundColor = "dodgerblue";
  prevMode = mode;
  mode = "picker";
  recalc();
});

const swatchesAdd = document.querySelector(".swatches__add");
const swatchesColors = document.querySelector(".swatches__colors");

// set default swatches...

palette.forEach((s) => {
  let color = s;
  let swatch = document.createElement("div");
  swatch.setAttribute("class", "swatches__colors__swatch");
  swatch.style.backgroundColor = color;
  swatch.setAttribute("data-color", color);
  swatch.addEventListener("click", (e) => {
    let c = swatch.getAttribute("data-color");
    colorCode.innerText = c;
    ctx.strokeStyle = c;
    cctx.strokeStyle = c;
    strokeColor = c;
    pickr.setColor(c);
  });
  swatchesColors.appendChild(swatch);
});

swatchesAdd.addEventListener("click", () => {
  if (swatchesColors.childNodes.length < 100) {
    if (!palette.includes(strokeColor)) {
      palette.push(strokeColor);
      let swatch = document.createElement("div");
      swatch.setAttribute("class", "swatches__colors__swatch");
      swatch.style.backgroundColor = strokeColor;
      swatch.setAttribute("data-color", strokeColor);
      swatch.addEventListener("click", (e) => {
        let color = swatch.getAttribute("data-color");
        colorCode.innerText = color;
        ctx.strokeStyle = color;
        cctx.strokeStyle = color;
        strokeColor = color;
        pickr.setColor(color);
      });
      if (swatchesColors.hasChildNodes()) {
        swatchesColors.insertBefore(swatch, swatchesColors.childNodes[0]);
      } else {
        swatchesColors.appendChild(swatch);
      }
    } else {
      /* alert(
        "That color already exists! Please select another to add to your palette."
      ); */
    }
  } else {
    alert("Sorry, You have a limit of 100 custom colors!");
  }
});

// enable pen size changing...

const penSize = document.querySelector(".pen__size");
const penData = document.querySelector(".pen__data");

function changeSize() {
  penData.value = penSize.value;
  lineWidth = penSize.value;
  ctx.lineWidth = penSize.value;
  cctx.lineWidth = penSize.value;
}

penSize.addEventListener("touchmove", changeSize);
penSize.addEventListener("change", changeSize);

penData.addEventListener("change", () => {
  if (penData.value > 200) penData.value = "200";
  if (penData.value < 0.1) penData.value = "0.1";
  penSize.value = penData.value;
  lineWidth = penData.value;
  ctx.lineWidth = penData.value;
  cctx.lineWidth = penData.value;
});

// Enable eraser mode...

const eraser = document.querySelector(".eraser");
let prevColor;
eraser.addEventListener("click", () => {
  if (!erase) {
    prevColor = strokeColor;
    strokeColor = "white";
    path = path + "ctx.strokeColor='white';";
    erase = true;
    eraser.style.backgroundColor = "dodgerblue";
    /* erase = true;
    path = path + "ctx.globalCompositeOperation='destination-out';"; */
  } else {
    strokeColor = prevColor;
    path = path + `ctx.strokeColor='${strokeColor}';`;
    erase = false;
    eraser.style.backgroundColor = "rgba(0,0,0,0.6)";
    /*  erase = false;
    path = path + "ctx.globalCompositeOperation='source-over';"; */
  }
});

// Reset rotation and scale...

let reset = document.querySelector(".info__reset");

reset.addEventListener("click", () => {
  applyFrame(true);
  info.innerText = "scale: 1, rotation: 0\u00B0";
});

// download image...
let saveModal = document.querySelector(".download");
let saveButton = document.querySelector("#save-button");
let url,
  Mtype = document.querySelector("#type");

Mtype.addEventListener("change", () => {
  if (Mtype.selectedIndex) {
    sctx.clearRect(0, 0, dimensions.width, dimensions.height);
  } else {
    sctx.fillRect(0, 0, dimensions.width, dimensions.height);
  }
  recalc();
  stateCanvas
    .convertToBlob({
      type: Mtype.selectedIndex ? "image/png" : "image/jpeg"
    })
    .then((blob) => {
      url = URL.createObjectURL(blob);
      saveButton.setAttribute("href", url);
    })
    .catch((err) => {
      alert(err);
    });
});

function save() {
  sctx.fillStyle = "white";
  sctx.fillRect(0, 0, dimensions.width, dimensions.height);
  cctx.resetTransform();
  cctx.beginPath();
  cctx.clearRect(
    0,
    0,
    window.innerWidth + gap * 5,
    window.innerHeight + gap * 5
  );
  let x = dimensions.x + gap; //prevDimensions.x + gap - dimensions.width / 2,
  y = dimensions.y + gap; //prevDimensions.y + gap - dimensions.height / 2;

  cctx.translate(x + dimensions.width / 2, y + dimensions.height / 2);
  cctx.rotate(-((rotation * Math.PI) / 180));
  cctx.translate(-(x + dimensions.width / 2), -(y + dimensions.height / 2));
  eval(path.replaceAll("ctx", "cctx"));
  createImageBitmap(
    cctx.getImageData(x, y, dimensions.width, dimensions.height)
  ).then((bm) => {
    actions.push(bm);
    recalc();
    drawn = false;
    resize();
    stateCanvas
      .convertToBlob({
        type: "image/jpeg"
      })
      .then((blob) => {
        url = URL.createObjectURL(blob);
        saveButton.setAttribute("href", url);
        saveModal.style.display = "block";
      })
      .catch((err) => {
        alert(err);
      });
  });
}

function exitSave() {
  saveModal.style.display = "none";
  url = undefined;
}

// Shape functions...

let shapes = document.querySelector(".shapes");
let sOptions = document.querySelector(".shapes__options");
let shapesOpen = false;
let Line = document.querySelector(".line");
let Circle = document.querySelector(".circle");
let Square = document.querySelector(".square");

function disableShapes() {
  document.querySelectorAll(".shape").forEach((s) => {
    s.style.backgroundColor = "rgba(0,0,0,0)";
  });
}

shapes.addEventListener("click", () => {
  if (!shapesOpen) {
    shapes.style.backgroundColor = "dodgerblue";
    sOptions.style.display = "grid";
    shapesOpen = true;
  } else {
    sOptions.style.display = "none";
    shapes.style.backgroundColor = "rgba(0,0,0,0.6)";
    shapesOpen = false;
    mode = "draw";
    disableShapes();
  }
});

// line function ...

let startCoord = { x: null, y: null },
  endCoord = { x: null, y: null };

function line() {
  mode = "line";
  disableShapes();
  Line.style.backgroundColor = "dodgerblue";
}

// circle function ...

let radius = null;

function circle() {
  mode = "circle";
  disableShapes();
  Circle.style.backgroundColor = "dodgerblue";
}

// square function ...

function square() {
  mode = "square";
  disableShapes();
  Square.style.backgroundColor = "dodgerblue";
}
