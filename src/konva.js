import React, { useState, useRef } from "react";
import {
  Stage,
  Layer,
  Image,
  Rect,
  Circle,
  Line,
  Text,
  Arrow,
  Transformer,
} from "react-konva";
import ContentEditable from "react-contenteditable";
import "./App.css";

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [texts, setTexts] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [drawingArrow, setDrawingArrow] = useState(false);
  const inputRef = useRef(null);
  const trRef = useRef(null);
  const stageRef = useRef(null);

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => setUploadedImage(img);
    };
    reader.readAsDataURL(file);
  };

  // Add Shapes
  const addShape = (type) => {
    setShapes([
      ...shapes,
      {
        id: shapes.length + 1,
        type,
        x: 150,
        y: 150,
        width: 120,
        height: 80,
        radius: type === "circle" ? 40 : 0,
        fill: "lightblue",
        stroke: "black",
        strokeWidth: 2,
        draggable: true,
      },
    ]);
  };

  // Add Text
  const addText = () => {
    setTexts([
      ...texts,
      {
        id: texts.length + 1,
        x: 200,
        y: 200,
        text: "Edit me!",
        fontSize: 18,
        fontFamily: "Arial",
        fontWeight: "normal",
        fill: "black",
        draggable: true,
      },
    ]);
  };

  // Start Arrow Drawing
  const startArrow = () => {
    setDrawingArrow(true);
  };

  // Handle Mouse Click to Draw Arrow
  const handleStageMouseDown = (e) => {
    if (!drawingArrow) return;

    const pos = e.target.getStage().getPointerPosition();
    setArrows([
      ...arrows,
      {
        id: arrows.length + 1,
        points: [pos.x, pos.y, pos.x + 50, pos.y + 50],
        stroke: "black",
        strokeWidth: 2,
      },
    ]);
    setDrawingArrow(false);
  };

  // Update Text Properties
  const updateTextProperty = (key, value) => {
    if (!selectedElement || selectedElement.type !== "text") return;
    setTexts(
      texts.map((t) =>
        t.id === selectedElement.id ? { ...t, [key]: value } : t
      )
    );
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Interactive Image Editor</h1>

      <div className="controls">
        <label className="file-upload-label">
          📂 Choose File
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="file-input-hidden"
          />
        </label>
        <button onClick={() => addShape("rect")} className="button">
          Add Rectangle
        </button>
        <button onClick={() => addShape("circle")} className="button">
          Add Circle
        </button>
        <button onClick={addText} className="button">
          Add Text
        </button>
        <button onClick={startArrow} className="button">
          Draw Arrow
        </button>
      </div>

      <div className="editor-container">
        {selectedElement && selectedElement.type === "text" && (
          <div className="sidebar">
            <h3>Edit Text</h3>
            <ContentEditable
              innerRef={inputRef}
              html={selectedElement.text}
              disabled={false}
              onChange={(e) => updateTextProperty("text", e.target.value)}
              className="editable-text"
            />
            <label>Font Size:</label>
            <input
              type="number"
              value={selectedElement.fontSize}
              onChange={(e) => updateTextProperty("fontSize", e.target.value)}
            />
            <label>Font Color:</label>
            <input
              type="color"
              value={selectedElement.fill}
              onChange={(e) => updateTextProperty("fill", e.target.value)}
            />
          </div>
        )}

        <div className="canvas-container">
          <Stage
            width={1100}
            height={600}
            onMouseDown={handleStageMouseDown}
            ref={stageRef}
          >
            <Layer>
              {uploadedImage && (
                <Image image={uploadedImage} x={50} y={50} draggable />
              )}

              {shapes.map((shape) =>
                shape.type === "rect" ? (
                  <Rect
                    key={shape.id}
                    {...shape}
                    onClick={() => setSelectedElement(shape)}
                    draggable
                  />
                ) : (
                  <Circle
                    key={shape.id}
                    {...shape}
                    onClick={() => setSelectedElement(shape)}
                    draggable
                  />
                )
              )}

              {texts.map((text) => (
                <Text
                  key={text.id}
                  {...text}
                  onClick={() => setSelectedElement(text)}
                  draggable
                />
              ))}

              {arrows.map((arrow) => (
                <Arrow key={arrow.id} {...arrow} />
              ))}

              {selectedElement && (
                <Transformer
                  ref={trRef}
                  boundBoxFunc={(oldBox, newBox) => newBox}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default App;
