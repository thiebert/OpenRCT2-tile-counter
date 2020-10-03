// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="C:/Users/hello/Documents/OpenRCT2/bin/openrct2.d.ts" />

// Import a module from another file.
import Oui from "./OliUI";

function main() {
  ui.registerMenuItem("Count Tiles", CreateCountWindow);
}

function CreateCountWindow() {
  const window = new Oui.Window("Count Window");
  window.setWidth(300);

  const raisedBox = new Oui.GroupBox("Raised Tiles");
  window.addChild(raisedBox);
  const raisedDisclaimer = new Oui.Widgets.Label("Total count of all tiles with the Surface object above 0");
  raisedBox.addChild(raisedDisclaimer);

  const raisedLabel = new Oui.Widgets.Label(GetRaisedTileCount().toString());
  raisedBox.addChild(raisedLabel);

  const blackedBox = new Oui.GroupBox("Non-Blacked Tiles");
  window.addChild(blackedBox);

  const blackedDisclaimer = new Oui.Widgets.Label("Total count of all tiles that are not blacktiled");
  blackedBox.addChild(blackedDisclaimer);

  const blackedLabel = new Oui.Widgets.Label(GetBlackedTileCount().toString());
  blackedBox.addChild(blackedLabel);

  const unbuiltBox = new Oui.GroupBox("Built Tiles");
  window.addChild(unbuiltBox);

  const unbuiltDisclaimer = new Oui.Widgets.Label("Total count of all tiles where Surface > 0 OR objects built above blacktiles");
  unbuiltBox.addChild(unbuiltDisclaimer);

  const unbuiltLabel = new Oui.Widgets.Label(GetUnbuiltTileCount().toString());
  unbuiltBox.addChild(unbuiltLabel);

  // And then all that's left is the grand opening.
  window.open();
}

function GetRaisedTileCount() {
  var count = 0;
  for (var x = 0; x < map.size.x; x++) {
    for (var y = 0; y < map.size.y; y++) {
      console.log(x + ', ' + y);
      var tile = map.getTile(x, y);
      if (getSurface(tile).baseHeight > 2) {
        count++;
      }
    }
  }
  console.log("raised complete");
  return count;
}

function GetBlackedTileCount() {
  var count = 0;
  for (var x = 0; x < map.size.x; x++) {
    for (var y = 0; y < map.size.y; y++) {
      var tile = map.getTile(x, y);
      var firstElement = getFirstElement(tile)
      if (getSurface(tile).baseHeight <= 2 && (
          tile.numElements == 1 || (
            firstElement.baseHeight <= 2 &&
            firstElement.type === "large_scenery"))) {
        count++;
      }
    }
  }

  console.log("blacked complete");
  return (x * x) - count;
}

function GetUnbuiltTileCount() {
  var count = 0;
  for (var x = 0; x < map.size.x; x++) {
    for (var y = 0; y < map.size.y; y++) {
      var tile = map.getTile(x, y);
      var firstElement = getFirstElement(tile)
      if (getSurface(tile).baseHeight <= 2 && (
          tile.numElements == 1 || (
            firstElement.baseHeight <= 2 &&
            firstElement.type === "large_scenery" &&
            tile.numElements == 2))) {
        count++;
      }
    }
  }

  console.log("unbuilt complete");
  return (x * x) - count;
}

function getSurface(tile) {
  for (var index = 0; index < tile.numElements; index++)
    if (tile.elements[index].type === "surface")
      return tile.elements[index];
  return tile.elements[0];
}

function getFirstElement(tile) {
  if (tile.numElements > 1) {
    for (var index = 0; index < tile.numElements; index++)
      if (tile.elements[index].type !== "surface")
        return tile.elements[index];
  }
  return tile.elements[0];
}

registerPlugin({
  name: "tile-counter",
  version: "0.1",
  licence: "MIT", // Make sure to set the license prior to release
  authors: ["thiebert (inthemanual)"],
  type: "local",
  main: main
});