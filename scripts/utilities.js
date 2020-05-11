// Keyboard function.
function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  }

  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  }

  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
}

// Checking for collisions.
function collisionCheck(a, b) {
  let aBounds = a.getBounds();
  let bBounds = b.getBounds();
  return aBounds.x + aBounds.width > bBounds.x && aBounds.x < bBounds.x + bBounds.width && aBounds.y + aBounds.height > bBounds.y && aBounds.y < bBounds.y + bBounds.height;
}
