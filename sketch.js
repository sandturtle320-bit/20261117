let walkSpriteSheet; 
let standSpriteSheet; 
let jumpSpriteSheet; 
let jumpMoveSpriteSheet; 
let fallingSpriteSheet; 
let attackSpriteSheet;  
let squatSpriteSheet;      
let squatMoveSpriteSheet;  
let muzzleFlashImg;     
let hitEffectImg;       

let characterX = 100;  
let characterY = 100;  
let velocityY = 0; 
let gravity = 0.8; 
let jumpStrength = -20; 

let facingDirection = 1; 
let currentFrame = 0; 
let lastFrameTime = 0; 
let previousAnimation = "stand"; 
let animationState = "stand"; 

// 遊戲畫面與關卡狀態
let gameState = "MENU"; 
let currentLevel = 1;   
let is1_2Intro = false; 
let stateTimer = 0;     
let castleTargetX = 0;  
let hideCharacter = false; 

// 狀態系統變數
let isActionLocked = false; 
let isGliding = false; 
let isOnGround = false; 
let isShortJump = false; 
let isAttacking = false;         
let hasFiredThisAttack = false;  
let isCrouching = false;         
let prevHitboxH = 50;            
let activeEffects = [];          

// 道具與變大系統變數
let isBig = false;               
let mushrooms = [];              
let brickParticles = [];         

// 得分與浮動文字系統
let score = 0;
let coins = []; 
let floatingTexts = []; 

// 動畫影格設定
const WALK_FRAME_COUNT = 8; 
const STAND_FRAME_COUNT = 7; 
const JUMP_FRAME_COUNT = 10; 
const JUMP_MOVE_FRAME_COUNT = 23; 
const FALLING_FRAME_COUNT = 3;    
const ATTACK_FRAME_COUNT = 12;   
const SQUAT_FRAME_COUNT = 5;        
const SQUAT_MOVE_FRAME_COUNT = 12;  

// 儲存每張精靈圖的整體高度與「每個影格各自的腳底留白 (frameBottomPaddings)」
let spriteMetrics = {};

const BASE_FRAME_INTERVAL = 100;  
const MOVE_SPEED = 4; 

// 地圖系統設定
// 圖例新增：I = 隱藏方塊 (平時隱形無碰撞，僅跳躍從下方頂出後變為已敲過的金幣空磚 E)
const TILE_SIZE = 40; 
let cameraX = 0;      

const MAP_1_1 = [
  "                                                                                                                                                                                                                    ",
  "                                                                                                                                                                                                                    ",
  "                                                                                                                                                                                                                    ",
  "                                                                                                                                                                                                 |                  ",
  "                                                                                BBBBBBBB   BBB?                                                                                                  F                  ",
  "                      ?                                                                                                                                    BB?B                                  F                  ",
  "                                                                                                                                                                                                 F                  ",
  "            B?BMB                                                                                                     B?B                                                                        F                  ",
  "                                                                                                                                                       S  SS      BB      I                      F        CCC       ",
  "                                    PP                                                                                                                SS  SSS                                    F       CCCCC      ",
  "                            PP      PP      PP                      ?               ?  ?  ?     B         BB         B   B              P            SSS  SSSS             P                     F       CCCCC      ",
  "                    PP      PP      PP      PP                                                                                         PP           SSSS  SSSSS           PP         BB?B        F       CCCCC      ",
  "                    PP      PP      PP      PP                                                                                        PPP          SSSSS  SSSSSS         PPP                     S       CCCCC      ",
  "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
  "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG  GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
];

const MAP_1_2_INTRO = [
  "                              ",
  "                              ",
  "                              ",
  "                              ",
  "                              ",
  "                              ",
  "                              ",
  "                              ",
  "                    PP        ",
  "                    PP        ",
  "                    PP        ",
  "                  HHPP        ",
  "                  HHPP        ",
  "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
  "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
];

const MAP_1_2 = [
  "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB                                    ",
  "                                                                                                                                                                                                                    ",
  "                                                                                                                                                                                                                    ",
  "                                                                                                                                                                                                 |                  ",
  "                                                                    BBBBBB           BBBBBB                                        BBBBBBBBBBBB                                                  F                  ",
  "                                                                    B    B           B    B                                                                                                      F                  ",
  "                                                                    B ?M B           B ?? B               BBBB      BBBB                                                                         F                  ",
  "            ?????                                                   B    B           B    B                                                                       SS                             F                  ",
  "                                                                    BBBBBB           BBBBBB                                                                      SSS         I                   F        CCC       ",
  "                                           PP                                                                       PP                    PP                    SSSS                             F       CCCCC      ",
  "                                 PP        PP                                                       BB?B            PP                    PP                   SSSSS         P                   F       CCCCC      ",
  "                       PP        PP        PP                                                                       PP                    PP                  SSSSSS        PP                   F       CCCCC      ",
  "             S         PP        PP        PP                                                                       PP                    PP                 SSSSSSS       PPP                   S       CCCCC      ",
  "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
  "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGG   GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
];

let levelMap = [];
let flagCol = -1; 

function loadLevelMap(sourceMap) {
  levelMap = [];
  flagCol = -1;
  for (let r = 0; r < sourceMap.length; r++) {
    let rowArr = sourceMap[r].split('');
    for (let c = 0; c < rowArr.length; c++) {
      if (rowArr[c] === '|' || rowArr[c] === 'F') {
        flagCol = c;
      }
    }
    levelMap.push(rowArr);
  }
}

const BASE_HITBOX_W = 24;
const BASE_HITBOX_H = 50;
const BIG_HITBOX_W = 30;
const BIG_HITBOX_H = 80; // 2格磚塊高 (80px)

function preload() { 
  walkSpriteSheet = loadImage("action/walk/ALL3.png"); 
  standSpriteSheet = loadImage("action/stand/ALL1.png"); 
  jumpSpriteSheet = loadImage("action/jump/ALL2.png"); 
  jumpMoveSpriteSheet = loadImage("action/jumpforward/ALL4.png"); 
  fallingSpriteSheet = loadImage("action/falling/ALL5.png"); 
  
  squatSpriteSheet = loadImage("action/squat_down/squat_down.png", () => {}, () => console.error("找不到蹲下圖片")); 
  squatMoveSpriteSheet = loadImage("action/squat_down_move/squat_down_move.png", () => {}, () => console.error("找不到蹲下走路圖片")); 

  attackSpriteSheet = loadImage("action/attackA/ALL5.png", () => {}, () => console.error("找不到攻擊圖片")); 
  muzzleFlashImg = loadImage("action/special_effects/hit-removebg-preview.png", () => {}, () => console.error("找不到槍口特效")); 
  hitEffectImg = loadImage("action/special_effects/hited-removebg-preview.png", () => {}, () => console.error("找不到擊中特效")); 
} 

// 逐格掃描精靈圖的真實人物高度與每一格各自的腳底留白，確保任何姿勢與影格都能 100% 切齊地面
function measureSpriteMetrics(img, frameCount) {
  if (!img || img.width === 0) {
    return { contentHeight: 100, frameBottomPaddings: new Array(frameCount).fill(0), frameHeight: 100 };
  }
  img.loadPixels();
  let fw = floor(img.width / frameCount);
  let fh = img.height;
  let frameBottomPaddings = [];
  let maxContentHeight = 0;

  for (let f = 0; f < frameCount; f++) {
    let minY = fh;
    let maxY = 0;
    let startX = f * fw;
    let endX = startX + fw;

    for (let y = 0; y < fh; y++) {
      for (let x = startX; x < endX; x++) {
        let idx = (y * img.width + x) * 4;
        let alpha = img.pixels[idx + 3];
        if (alpha > 20) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (minY > maxY) {
      minY = 0;
      maxY = fh - 1;
    }
    let ch = maxY - minY + 1;
    if (ch > maxContentHeight) maxContentHeight = ch;
    frameBottomPaddings.push((fh - 1) - maxY);
  }

  return {
    contentHeight: maxContentHeight,
    frameBottomPaddings: frameBottomPaddings,
    frameHeight: fh
  };
}

function setup() { 
  createCanvas(windowWidth, windowHeight); 
  imageMode(CENTER); 
  frameRate(60); 

  spriteMetrics["walk"]      = measureSpriteMetrics(walkSpriteSheet, WALK_FRAME_COUNT);
  spriteMetrics["stand"]     = measureSpriteMetrics(standSpriteSheet, STAND_FRAME_COUNT);
  spriteMetrics["jump"]      = measureSpriteMetrics(jumpSpriteSheet, JUMP_FRAME_COUNT);
  spriteMetrics["jumpMove"]  = measureSpriteMetrics(jumpMoveSpriteSheet, JUMP_MOVE_FRAME_COUNT);
  spriteMetrics["falling"]   = measureSpriteMetrics(fallingSpriteSheet, FALLING_FRAME_COUNT);
  spriteMetrics["attack"]    = measureSpriteMetrics(attackSpriteSheet, ATTACK_FRAME_COUNT);
  spriteMetrics["squat"]     = measureSpriteMetrics(squatSpriteSheet, SQUAT_FRAME_COUNT);
  spriteMetrics["squatMove"] = measureSpriteMetrics(squatMoveSpriteSheet, SQUAT_MOVE_FRAME_COUNT);
} 

function draw() { 
  if (gameState === "MENU") {
    drawMenu();
    return;
  }

  if (currentLevel === 1 || is1_2Intro) {
    background("#6b8cff"); 
  } else {
    background("#0a0a12");
  }

  // --- 蹲下狀態判斷 ---
  let standHitboxW = isBig ? BIG_HITBOX_W : BASE_HITBOX_W;
  let standHitboxH = isBig ? BIG_HITBOX_H : BASE_HITBOX_H;

  if (gameState === "PLAYING" && isOnGround && !isAttacking) {
    if (keyIsDown(DOWN_ARROW)) {
      isCrouching = true;
    } else if (isCrouching) {
      let standCenterY = characterY + (prevHitboxH - standHitboxH) / 2;
      if (!checkCollision(characterX, standCenterY, standHitboxW, standHitboxH)) {
        isCrouching = false;
      }
    }
  } else if (!isOnGround) {
    isCrouching = false;
  }

  // 碰撞箱高度：長大蹲下 0.5 倍、縮小蹲下 0.75 倍
  let crouchHitboxFactor = isCrouching ? (isBig ? 0.5 : 0.75) : 1.0;
  let currentHitboxW = standHitboxW;
  let currentHitboxH = standHitboxH * crouchHitboxFactor;

  if (currentHitboxH !== prevHitboxH) {
    characterY += (prevHitboxH - currentHitboxH) / 2;
    prevHitboxH = currentHitboxH;
  }

  // --- 1. 處理移動與過場 ---
  let moveX = 0; 
  let currentMoveSpeed = isCrouching ? (MOVE_SPEED / 3) : MOVE_SPEED;

  if (gameState === "PLAYING") {
    if (!isAttacking) {
      if (keyIsDown(RIGHT_ARROW)) { moveX = currentMoveSpeed; facingDirection = 1; } 
      if (keyIsDown(LEFT_ARROW))  { moveX = -currentMoveSpeed; facingDirection = -1; } 
    }
    
    characterX += moveX; 
    characterX = constrain(characterX, currentHitboxW / 2, levelMap[0].length * TILE_SIZE - currentHitboxW / 2);

    if (flagCol !== -1) {
      let flagWallX = flagCol * TILE_SIZE + TILE_SIZE / 2;
      if (characterX + currentHitboxW / 2 > flagWallX) {
        characterX = flagWallX - currentHitboxW / 2;
      }
    }

    if (checkCollision(characterX, characterY, currentHitboxW, currentHitboxH)) {
      characterX -= moveX; 
    }

    if (is1_2Intro && keyIsDown(RIGHT_ARROW)) {
      checkEnterPipe(characterX, characterY, currentHitboxW, currentHitboxH);
    }

  } else if (gameState === "FLAG_SLIDE") {
    velocityY = 5;
    characterY += velocityY;
    let groundTopY = 13 * TILE_SIZE - currentHitboxH / 2 - 0.1; 
    if (characterY >= groundTopY) {
      characterY = groundTopY;
      velocityY = 0;
      isOnGround = true;
      gameState = "WALK_TO_CASTLE";
    }

  } else if (gameState === "WALK_TO_CASTLE") {
    if (!hideCharacter) {
      moveX = 3;
      facingDirection = 1;
      characterX += moveX;
      if (characterX >= castleTargetX) {
        characterX = castleTargetX;
        hideCharacter = true; 
        stateTimer = millis();
      }
    } else {
      if (millis() - stateTimer > 1500) {
        if (currentLevel === 1) {
          startLevel(2, false); 
        } else {
          gameState = "ALL_CLEAR";
        }
      }
    }

  } else if (gameState === "ENTERING_PIPE") {
    moveX = 2;
    facingDirection = 1;
    characterX += moveX;
    if (millis() - stateTimer > 900) {
      is1_2Intro = false;
      loadLevelMap(MAP_1_2);
      characterX = 100;
      characterY = 100;
      velocityY = 0;
      hideCharacter = false;
      gameState = "PLAYING";
    }
  }

  // --- 2. 物理系統與碰撞偵測 ---
  if (gameState === "PLAYING" || gameState === "WALK_TO_CASTLE") {
    if (isGliding && velocityY > 0) {
      velocityY += gravity * 0.2; 
      if (velocityY > 2) velocityY = 2; 
    } else {
      velocityY += gravity;    
    }
    
    characterY += velocityY; 
    isOnGround = false; 
    
    // 向上跳躍時額外檢測頭頂是否頂到隱藏方塊 ('I')
    if (velocityY < 0) {
      let headY = characterY - currentHitboxH / 2;
      let hitHiddenLeft  = checkHiddenBlockHit(characterX - currentHitboxW * 0.25, headY);
      let hitHiddenRight = checkHiddenBlockHit(characterX + currentHitboxW * 0.25, headY);
      if (hitHiddenLeft || hitHiddenRight) {
        let topTileRow = floor(headY / TILE_SIZE);
        characterY = (topTileRow + 1) * TILE_SIZE + currentHitboxH / 2 + 0.1;
        velocityY = 0;
      }
    }

    if (checkCollision(characterX, characterY, currentHitboxW, currentHitboxH)) {
      if (velocityY > 0) { 
        let bottomTileRow = floor((characterY + currentHitboxH / 2) / TILE_SIZE);
        characterY = bottomTileRow * TILE_SIZE - currentHitboxH / 2 - 0.1; 
        velocityY = 0; 
        isOnGround = true; 
        isGliding = false; 
        isActionLocked = false; 
        isShortJump = false; 
      } else if (velocityY < 0) { 
        let topTileRow = floor((characterY - currentHitboxH / 2) / TILE_SIZE);
        characterY = (topTileRow + 1) * TILE_SIZE + currentHitboxH / 2 + 0.1; 
        velocityY = 0; 
        
        checkHitTile(characterX - currentHitboxW * 0.25, characterY - currentHitboxH / 2 - 4);
        checkHitTile(characterX + currentHitboxW * 0.25, characterY - currentHitboxH / 2 - 4);
      }
    }
  }

  if (gameState === "PLAYING") {
    checkFlagpole(characterX, characterY, currentHitboxW, currentHitboxH);
  }

  if (characterY > levelMap.length * TILE_SIZE + 200) {
    startLevel(currentLevel, false);
  }

  // --- 3. 判斷動畫狀態 ---
  const isJumping = !isOnGround; 
  
  if (gameState === "FLAG_SLIDE") {
    animationState = "falling";
  } else if (gameState === "WALK_TO_CASTLE" || gameState === "ENTERING_PIPE") {
    animationState = "walk";
  } else if (isAttacking) {
    animationState = "attack"; 
  } else if (isActionLocked) {
    animationState = "jump";
  } else {
    if (isGliding) {
      animationState = "falling";
    } else if (isJumping) {
      if (previousAnimation === "jump") {
        animationState = "falling";
      } else if (moveX !== 0) {
        animationState = "jumpMove"; 
      } else {
        if (velocityY > 0) {
          animationState = "falling";
        } else {
          animationState = "jump";
          isActionLocked = true; 
        }
      }
    } else if (isCrouching) {
      if (moveX !== 0) {
        animationState = "squatMove";
      } else {
        animationState = "squat";
      }
    } else {
      if (moveX !== 0) {
        animationState = "walk";
      } else {
        animationState = "stand";
      }
    }
  }

  let activeSpriteSheet;
  let activeFrameCount;

  if (animationState === "attack") { activeSpriteSheet = attackSpriteSheet; activeFrameCount = ATTACK_FRAME_COUNT; }
  else if (animationState === "squatMove") { activeSpriteSheet = squatMoveSpriteSheet; activeFrameCount = SQUAT_MOVE_FRAME_COUNT; }
  else if (animationState === "squat") { activeSpriteSheet = squatSpriteSheet; activeFrameCount = SQUAT_FRAME_COUNT; }
  else if (animationState === "falling") { activeSpriteSheet = fallingSpriteSheet; activeFrameCount = FALLING_FRAME_COUNT; } 
  else if (animationState === "jumpMove") { activeSpriteSheet = jumpMoveSpriteSheet; activeFrameCount = JUMP_MOVE_FRAME_COUNT; } 
  else if (animationState === "jump") { activeSpriteSheet = jumpSpriteSheet; activeFrameCount = JUMP_FRAME_COUNT; } 
  else if (animationState === "walk") { activeSpriteSheet = walkSpriteSheet; activeFrameCount = WALK_FRAME_COUNT; } 
  else { activeSpriteSheet = standSpriteSheet; activeFrameCount = STAND_FRAME_COUNT; }
  
  const frameWidth = activeSpriteSheet.width / activeFrameCount; 
  const frameHeight = activeSpriteSheet.height; 

  // --- 精準比例鎖定：以 walk 的「真實人物高度」為 100% 基準 ---
  const WALK_REAL_HEIGHT = isBig ? 84 : 56;
  let metric = spriteMetrics[animationState] || spriteMetrics["walk"];

  let targetContentHeight = WALK_REAL_HEIGHT;
  if (animationState === "squat" || animationState === "squatMove") {
    targetContentHeight = WALK_REAL_HEIGHT * 0.78;
  }

  let displayScale = targetContentHeight / metric.contentHeight;

  // --- 4. 動態播放速率控制與射擊擊破方塊邏輯 ---
  if (animationState !== previousAnimation) { 
    currentFrame = 0; 
    lastFrameTime = millis(); 
    previousAnimation = animationState; 
  } 

  let currentFrameInterval = BASE_FRAME_INTERVAL;
  if (animationState === "jumpMove") {
    currentFrameInterval = isShortJump ? 25 : 60; 
  } else if (animationState === "squat") {
    currentFrameInterval = 60; 
  }

  if (millis() - lastFrameTime >= currentFrameInterval) { 
    currentFrame++;
    lastFrameTime = millis(); 
    
    if (animationState === "attack") {
      if (currentFrame >= activeFrameCount) {
        isAttacking = false; 
        currentFrame = activeFrameCount - 1; 
      }
    } else if (animationState === "squat") {
      currentFrame = min(currentFrame, activeFrameCount - 1);
    } else if (animationState === "jump" && currentFrame >= JUMP_FRAME_COUNT) {
      isActionLocked = false;
      animationState = "falling";
      previousAnimation = "jump"; 
      currentFrame = 0;
    } else {
      currentFrame = currentFrame % activeFrameCount;
    }
  }
  currentFrame = min(currentFrame, activeFrameCount - 1);

  if (isAttacking && (currentFrame === 6 || currentFrame === 7) && !hasFiredThisAttack) {
    let muzzleOffsetX = (WALK_REAL_HEIGHT * 0.75) * facingDirection; 
    let muzzleOffsetY = isBig ? -15 : -10; 
    
    let startX = characterX + muzzleOffsetX;
    let startY = characterY + muzzleOffsetY;

    let hitX = startX;
    let hitY = startY;
    let maxDistance = width; 
    let step = 10;           
    let currentDistance = 0;

    while (currentDistance < maxDistance) {
      hitX += step * facingDirection;
      currentDistance += step;
      
      let c = floor(hitX / TILE_SIZE);
      let r = floor(hitY / TILE_SIZE);
      
      if (r >= 0 && r < levelMap.length && c >= 0 && c < levelMap[0].length) {
        let tile = levelMap[r][c];
        // 子彈穿透空氣與未打出的隱藏方塊 ('I')
        if (tile !== ' ' && tile !== 'I' && tile !== '|' && tile !== 'F' && tile !== 'C') { 
          if (tile === 'B') {
            levelMap[r][c] = ' ';
            score += 50;
            spawnBrickParticles(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2);
          } else if (tile === '?') {
            levelMap[r][c] = 'E';
            score += 100;
            coins.push({
              x: c * TILE_SIZE + TILE_SIZE / 2,
              y: r * TILE_SIZE,
              vy: -8,
              life: 20
            });
          } else if (tile === 'M') {
            levelMap[r][c] = 'E';
            mushrooms.push({
              x: c * TILE_SIZE + TILE_SIZE / 2,
              y: r * TILE_SIZE - TILE_SIZE / 2,
              vx: 2,
              vy: -2,
              size: 32
            });
          }
          break; 
        }
      }
    }

    let effectScale = isBig ? 0.24 : 0.166;

    activeEffects.push({
      img: muzzleFlashImg,
      x: startX,
      y: startY,
      spawnTime: millis(),
      duration: 50,      
      scale: effectScale,      
      direction: facingDirection
    });

    activeEffects.push({
      img: hitEffectImg,
      x: hitX,
      y: hitY,
      spawnTime: millis(),
      duration: 50,      
      scale: effectScale,      
      direction: facingDirection
    });

    hasFiredThisAttack = true; 
  }

  // --- 5. 攝影機跟隨 ---
  let maxCameraX = max(0, levelMap[0].length * TILE_SIZE - width);
  cameraX = constrain(characterX - width / 3, 0, maxCameraX);

  // --- 6. 繪製世界 ---
  push(); 
  let mapOffsetY = height - (levelMap.length * TILE_SIZE);
  translate(-cameraX, mapOffsetY); 

  drawMap();
  updateAndDrawMushrooms(currentHitboxW, currentHitboxH);
  updateAndDrawCoins(); 
  updateAndDrawBrickParticles();

  // 繪製角色：依據「當前影格」的真實腳底留白動態對齊碰撞箱底部，確保蹲下與任何動作完全切齊地面
  if (!hideCharacter) {
    let hitboxBottomY = characterY + currentHitboxH / 2;
    let frameBottomPad = metric.frameBottomPaddings[currentFrame] || 0;
    let realFeetOffsetFromCanvasBottom = frameBottomPad * displayScale;
    let drawCenterY = hitboxBottomY - (frameHeight * displayScale) / 2 + realFeetOffsetFromCanvasBottom;

    push(); 
    translate(characterX, drawCenterY); 
    scale(facingDirection * displayScale, displayScale); 
    image(activeSpriteSheet, 0, 0, frameWidth, frameHeight, currentFrame * frameWidth, 0, frameWidth, frameHeight); 
    pop(); 
  }

  if (gameState === "ENTERING_PIPE") {
    drawPipesOnly();
  }

  for (let i = activeEffects.length - 1; i >= 0; i--) {
    let ef = activeEffects[i];
    if (millis() - ef.spawnTime > ef.duration) {
      activeEffects.splice(i, 1); 
    } else {
      push();
      translate(ef.x, ef.y);
      scale(ef.direction * ef.scale, ef.scale); 
      image(ef.img, 0, 0); 
      pop();
    }
  }

  updateAndDrawFloatingTexts();

  pop(); 

  // --- 7. 繪製 UI 介面 ---
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  let stageLabel = is1_2Intro ? "1-2 (ENTRANCE)" : `1-${currentLevel}`;
  text(`WORLD ${stageLabel}   |   SCORE: ${score}`, 20, 20);
  text(`STATUS: ${isBig ? "SUPER (2格高)" : "NORMAL"}${isCrouching ? " (蹲下中)" : ""}   |   [↓] 蹲下潛行  [M] 選關  [R] 重置`, 20, 48);

  if (gameState === "ALL_CLEAR") {
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    fill("#FFD700");
    textSize(52);
    textAlign(CENTER, CENTER);
    text("ALL COURSES CLEAR!", width / 2, height / 2 - 40);
    fill(255);
    textSize(26);
    text(`FINAL SCORE: ${score}`, width / 2, height / 2 + 20);
    textSize(20);
    text("按 [M] 返回關卡選擇畫面", width / 2, height / 2 + 65);
  }
} 

function drawMenu() {
  background("#1e2749");
  fill("#D95D39");
  rect(0, height - 80, width, 80);

  textAlign(CENTER, CENTER);
  fill("#FFD700");
  textSize(52);
  text("SUPER PLATFORMER", width / 2, height / 2 - 140);
  
  fill(255);
  textSize(22);
  text("請選擇要遊玩的關卡（可點擊按鈕或按鍵盤 1 / 2）", width / 2, height / 2 - 75);

  let btn1X = width / 2 - 160;
  let btnY = height / 2 + 20;
  let btnW = 260;
  let btnH = 110;
  let hover1 = (mouseX > btn1X - btnW/2 && mouseX < btn1X + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2);
  
  fill(hover1 ? "#4ea8de" : "#6b8cff");
  stroke(255);
  strokeWeight(3);
  rect(btn1X - btnW/2, btnY - btnH/2, btnW, btnH, 16);
  noStroke();
  fill(255);
  textSize(28);
  text("WORLD 1-1", btn1X, btnY - 15);
  textSize(16);
  text("地上草原關卡 [按 1]", btn1X, btnY + 22);

  let btn2X = width / 2 + 160;
  let hover2 = (mouseX > btn2X - btnW/2 && mouseX < btn2X + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2);

  fill(hover2 ? "#3a3a52" : "#1a1a2e");
  stroke(255);
  strokeWeight(3);
  rect(btn2X - btnW/2, btnY - btnH/2, btnW, btnH, 16);
  noStroke();
  fill(255);
  textSize(28);
  text("WORLD 1-2", btn2X, btnY - 15);
  textSize(16);
  text("地下洞穴關卡 [按 2]", btn2X, btnY + 22);

  fill(200);
  textSize(16);
  text("操作說明：方向鍵移動 ｜ ↓ 鍵蹲下走路 ｜ 空白鍵跳躍 / 滑翔 ｜ F 鍵射擊", width / 2, height - 115);
}

function mousePressed() {
  if (gameState === "MENU") {
    let btn1X = width / 2 - 160;
    let btn2X = width / 2 + 160;
    let btnY = height / 2 + 20;
    let btnW = 260;
    let btnH = 110;

    if (mouseX > btn1X - btnW/2 && mouseX < btn1X + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
      startLevel(1, true);
    } else if (mouseX > btn2X - btnW/2 && mouseX < btn2X + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
      startLevel(2, true);
    }
  }
}

function startLevel(levelNum, resetScore) {
  currentLevel = levelNum;
  if (levelNum === 1) {
    is1_2Intro = false;
    loadLevelMap(MAP_1_1);
  } else {
    is1_2Intro = true;
    loadLevelMap(MAP_1_2_INTRO);
  }

  gameState = "PLAYING";
  characterX = 100;
  characterY = 100;
  velocityY = 0;
  if (resetScore) {
    score = 0;
    isBig = false;
  }
  isCrouching = false;
  prevHitboxH = isBig ? BIG_HITBOX_H : BASE_HITBOX_H;
  hideCharacter = false;
  isGliding = false;
  isActionLocked = false;
  isShortJump = false;
  isAttacking = false;
  mushrooms = [];
  coins = [];
  brickParticles = [];
  activeEffects = [];
  floatingTexts = [];
}

function checkEnterPipe(cx, cy, cw, ch) {
  let rightEdge = cx + cw / 2 + 4;
  let col = floor(rightEdge / TILE_SIZE);
  let row = floor(cy / TILE_SIZE);

  if (row >= 0 && row < levelMap.length && col >= 0 && col < levelMap[0].length) {
    if (levelMap[row][col] === 'H') {
      gameState = "ENTERING_PIPE";
      stateTimer = millis();
      isAttacking = false;
      isCrouching = false;
    }
  }
}

// 跳躍向上頂擊隱藏方塊 ('I')：打出後變為已敲過的金幣空磚 ('E') 並彈出金幣
function checkHiddenBlockHit(hitX, hitY) {
  let col = floor(hitX / TILE_SIZE);
  let row = floor(hitY / TILE_SIZE);

  if (row >= 0 && row < levelMap.length && col >= 0 && col < levelMap[0].length) {
    if (levelMap[row][col] === 'I') {
      levelMap[row][col] = 'E';
      score += 100;
      coins.push({
        x: col * TILE_SIZE + TILE_SIZE / 2,
        y: row * TILE_SIZE,
        vy: -8,
        life: 20
      });
      return true;
    }
  }
  return false;
}

function checkHitTile(hitX, hitY) {
  let col = floor(hitX / TILE_SIZE);
  let row = floor(hitY / TILE_SIZE);

  if (row >= 0 && row < levelMap.length && col >= 0 && col < levelMap[0].length) {
    let tile = levelMap[row][col];
    
    if (tile === '?') {
      levelMap[row][col] = 'E'; 
      score += 100;             
      coins.push({
        x: col * TILE_SIZE + TILE_SIZE / 2,
        y: row * TILE_SIZE,
        vy: -8,       
        life: 20      
      });
    } else if (tile === 'M') {
      levelMap[row][col] = 'E';
      mushrooms.push({
        x: col * TILE_SIZE + TILE_SIZE / 2,
        y: row * TILE_SIZE - TILE_SIZE / 2,
        vx: 2,
        vy: -2,
        size: 32
      });
    } else if (tile === 'B' && isBig) {
      levelMap[row][col] = ' ';
      score += 50;
      spawnBrickParticles(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2);
    }
  }
}

function spawnBrickParticles(bx, by) {
  let dirs = [[-3, -8], [3, -8], [-2, -5], [2, -5]];
  for (let d of dirs) {
    brickParticles.push({
      x: bx,
      y: by,
      vx: d[0],
      vy: d[1],
      life: 40
    });
  }
}

function updateAndDrawBrickParticles() {
  for (let i = brickParticles.length - 1; i >= 0; i--) {
    let p = brickParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.5;
    p.life--;

    fill((currentLevel === 1 || is1_2Intro) ? "#A33B20" : "#3b6e8c");
    rect(p.x - 6, p.y - 6, 12, 12);

    if (p.life <= 0) {
      brickParticles.splice(i, 1);
    }
  }
}

function updateAndDrawMushrooms(playerW, playerH) {
  for (let i = mushrooms.length - 1; i >= 0; i--) {
    let m = mushrooms[i];
    
    m.x += m.vx;
    if (checkCollision(m.x, m.y, m.size, m.size)) {
      m.x -= m.vx;
      m.vx *= -1;
    }

    m.vy += gravity * 0.6;
    m.y += m.vy;
    if (checkCollision(m.x, m.y, m.size, m.size)) {
      if (m.vy > 0) {
        let bottomRow = floor((m.y + m.size / 2) / TILE_SIZE);
        m.y = bottomRow * TILE_SIZE - m.size / 2 - 0.1;
        m.vy = 0;
      }
    }

    push();
    translate(m.x, m.y);
    fill("#FFE4B5");
    rect(-8, 0, 16, 14, 3);
    fill("#E63946");
    arc(0, 2, 32, 28, PI, TWO_PI);
    fill(255);
    ellipse(-7, -5, 6, 6);
    ellipse(7, -5, 6, 6);
    ellipse(0, -9, 7, 7);
    pop();

    if (abs(characterX - m.x) < (playerW + m.size) / 2 &&
        abs(characterY - m.y) < (playerH + m.size) / 2) {
      if (!isBig) {
        isBig = true;
      }
      score += 1000;
      mushrooms.splice(i, 1);
      continue;
    }

    if (m.y > levelMap.length * TILE_SIZE + 100) {
      mushrooms.splice(i, 1);
    }
  }
}

function checkFlagpole(cx, cy, cw, ch) {
  if (flagCol === -1 || gameState !== "PLAYING") return;

  let flagX = flagCol * TILE_SIZE + TILE_SIZE / 2;
  if (cx + cw / 2 >= flagX - 6) {
    characterX = flagX;
    velocityY = 0;
    isGliding = false;
    isAttacking = false;
    isCrouching = false;
    gameState = "FLAG_SLIDE";

    let grabRow = floor(cy / TILE_SIZE);
    let earnedPoints = 200;
    if (grabRow <= 3) {
      earnedPoints = 10000; 
    } else if (grabRow === 4) {
      earnedPoints = 8000;
    } else if (grabRow === 5) {
      earnedPoints = 4000;
    } else if (grabRow === 6) {
      earnedPoints = 2000;
    } else if (grabRow === 7) {
      earnedPoints = 1000;
    } else if (grabRow === 8) {
      earnedPoints = 800;
    } else if (grabRow === 9 || grabRow === 10) {
      earnedPoints = 400;
    } else {
      earnedPoints = 200;
    }

    score += earnedPoints;

    floatingTexts.push({
      text: "+" + earnedPoints,
      x: flagX + 25,
      y: cy,
      vy: -1.5,
      life: 120 
    });

    let minCastleCol = 9999;
    let maxCastleCol = -1;
    for (let r = 0; r < levelMap.length; r++) {
      for (let c = flagCol + 1; c < levelMap[r].length; c++) {
        if (levelMap[r][c] === 'C') {
          minCastleCol = min(minCastleCol, c);
          maxCastleCol = max(maxCastleCol, c);
        }
      }
    }
    if (maxCastleCol !== -1) {
      castleTargetX = ((minCastleCol + maxCastleCol + 1) / 2) * TILE_SIZE;
    } else {
      castleTargetX = flagX + 8 * TILE_SIZE;
    }
  }
}

function updateAndDrawFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    let ft = floatingTexts[i];
    ft.y += ft.vy;
    ft.life--;

    fill("#FFD700");
    stroke(0);
    strokeWeight(4);
    textSize(28);
    textAlign(LEFT, CENTER);
    text(ft.text, ft.x, ft.y);
    noStroke();

    if (ft.life <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}

function updateAndDrawCoins() {
  for (let i = coins.length - 1; i >= 0; i--) {
    let c = coins[i];
    c.y += c.vy; 
    c.vy += 0.6; 
    c.life--;

    fill("#FFD700");
    stroke("#B8860B");
    strokeWeight(2);
    ellipse(c.x, c.y, 16, 22);
    noStroke();

    if (c.life <= 0) {
      coins.splice(i, 1);
    }
  }
}

function drawPipesOnly() {
  for (let row = 0; row < levelMap.length; row++) {
    for (let col = 0; col < levelMap[row].length; col++) {
      let tile = levelMap[row][col];
      if (tile === 'P' || tile === 'H') {
        let tileX = col * TILE_SIZE;
        let tileY = row * TILE_SIZE;
        stroke(0, 60);
        strokeWeight(1);
        fill(tile === 'H' ? "#2ecc71" : "#27AE60");
        rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        noStroke();
      }
    }
  }
}

function drawMap() {
  let isDayTheme = (currentLevel === 1 || is1_2Intro);
  for (let row = 0; row < levelMap.length; row++) {
    for (let col = 0; col < levelMap[row].length; col++) {
      let tile = levelMap[row][col];
      let tileX = col * TILE_SIZE;
      let tileY = row * TILE_SIZE;

      if (tileX + TILE_SIZE > cameraX && tileX < cameraX + width) {
        stroke(0, 60);
        strokeWeight(1);
        if (tile === 'G') {
          fill(isDayTheme ? "#D95D39" : "#2b5876"); 
          rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        } else if (tile === 'B') {
          fill(isDayTheme ? "#A33B20" : "#3b6e8c"); 
          rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        } else if (tile === '?' || tile === 'M') {
          fill("#F2C94C"); 
          rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
          fill("#B8860B");
          noStroke();
          textSize(22);
          textAlign(CENTER, CENTER);
          text("?", tileX + TILE_SIZE / 2, tileY + TILE_SIZE / 2);
        } else if (tile === 'E') {
          fill("#8B5A2B"); 
          rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        } else if (tile === 'P') {
          fill("#27AE60"); 
          rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        } else if (tile === 'H') {
          fill("#2ecc71"); 
          rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        } else if (tile === 'S') {
          fill(isDayTheme ? "#B07D4F" : "#4a7c9b"); 
          rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        } else if (tile === 'F') {
          noStroke();
          fill("#FFFFFF");
          rect(tileX + TILE_SIZE / 2 - 4, tileY, 8, TILE_SIZE);
        } else if (tile === '|') {
          noStroke();
          fill("#FFFFFF");
          rect(tileX + TILE_SIZE / 2 - 4, tileY, 8, TILE_SIZE);
          fill("#2ECC71");
          triangle(tileX + TILE_SIZE / 2 - 4, tileY, tileX + TILE_SIZE / 2 - 36, tileY + 15, tileX + TILE_SIZE / 2 - 4, tileY + 30);
        } else if (tile === 'C') {
          fill("#8D4925");
          rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
        }
        // 注意：tile === 'I' (隱藏方塊) 不繪製任何外觀，保持完全隱形直到被頂出變成 'E'
        noStroke();
      }
    }
  }
}

function checkCollision(cx, cy, cw, ch) {
  let left = cx - cw / 2;
  let right = cx + cw / 2;
  let top = cy - ch / 2;
  let bottom = cy + ch / 2; 

  let startCol = floor(left / TILE_SIZE);
  let endCol = floor(right / TILE_SIZE);
  let startRow = floor(top / TILE_SIZE);
  let endRow = floor(bottom / TILE_SIZE);

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      if (r >= 0 && r < levelMap.length && c >= 0 && c < levelMap[0].length) {
        let tile = levelMap[r][c];
        // 未被打出的隱藏方塊 ('I') 不具備一般碰撞，只有從下方往上頂時才會觸發
        if (tile !== ' ' && tile !== 'I' && tile !== 'F' && tile !== '|' && tile !== 'C') { 
          return true; 
        }
      }
    }
  }
  return false;
}

function keyPressed() { 
  if (gameState === "MENU") {
    if (key === '1') startLevel(1, true);
    if (key === '2') startLevel(2, true);
    return;
  }

  if (key === 'm' || key === 'M') {
    gameState = "MENU";
    return;
  }

  if (key === 'r' || key === 'R') {
    startLevel(currentLevel, false);
    return;
  }

  if (gameState !== "PLAYING") return;

  if (keyCode === 32) { 
    if (isOnGround && !isActionLocked) {
      velocityY = jumpStrength; 
      isShortJump = false; 
    } else if (!isOnGround) {
      isGliding = !isGliding;  
      isActionLocked = false; 
      
      if (isGliding) {
        if (velocityY > 0) {
          velocityY = 0; 
        } else {
          velocityY *= 0.5; 
        }
      }
    }
    return false; 
  } 

  if (key === 'f' || key === 'F') { 
    if (!isAttacking && !isCrouching) {
      isAttacking = true;
      hasFiredThisAttack = false; 
      currentFrame = 0; 
      lastFrameTime = millis();
    }
  }
} 

function keyReleased() {
  if (keyCode === 32 && gameState === "PLAYING") {
    if (velocityY < 0) {
      velocityY = 0;      
      isShortJump = true; 
    }
  }
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}