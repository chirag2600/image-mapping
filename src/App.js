import React, { useState } from "react";
import { Arrow, Image, Layer, Rect, Stage, Text } from "react-konva";
import "./App.css"; // Import the CSS file

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageDetails, setImageDetails] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState(null);
  const [texts, setTexts] = useState([]); // State for text widgets
  const [isAddingText, setIsAddingText] = useState(false); // State to toggle text adding mode
  const [textStart, setTextStart] = useState(null); // Start point for the text

  // Function to handle image upload
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

  // Add new part to the image
  const handleAddPart = () => {
    const newPart = {
      id: imageDetails.length + 1,
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      name: `Part ${imageDetails.length + 1}`,
      details: `Details for part ${imageDetails.length + 1}`,
      textX: 160, // Position of text (relative to part)
      textY: 50,
    };
    setImageDetails([...imageDetails, newPart]);
  };

  // Start drawing an arrow
  const startDrawingArrow = () => {
    setIsDrawingArrow(true);
  };

  // Handle arrow drawing on click
  const handleArrowClick = (e) => {
    if (isDrawingArrow) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();

      if (!arrowStart) {
        setArrowStart(pointerPosition);
      } else {
        setArrows([
          ...arrows,
          {
            start: arrowStart,
            end: pointerPosition,
          },
        ]);
        setArrowStart(null);
        setIsDrawingArrow(false);
      }
    }
  };

  // Handle arrow drag move
  const handleArrowDragMove = (index, e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const updatedArrows = arrows.map((arrow, i) => {
      if (i === index) {
        const dx = pointerPosition.x - arrow.start.x;
        const dy = pointerPosition.y - arrow.start.y;

        return {
          ...arrow,
          start: { x: arrow.start.x + dx, y: arrow.start.y + dy },
          end: { x: arrow.end.x + dx, y: arrow.end.y + dy },
        };
      }
      return arrow;
    });

    setArrows(updatedArrows);
  };

  // Start adding text
  const startAddingText = () => {
    setIsAddingText(true);
  };

  // Handle text click to add new text widget
  const handleTextClick = (e) => {
    if (isAddingText) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();

      setTexts([
        ...texts,
        {
          id: texts.length + 1,
          x: pointerPosition.x,
          y: pointerPosition.y,
          text: "New Text",
          fontSize: 14,
        },
      ]);
      setIsAddingText(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Interactive Image Editor</h1>
      <div className="controls">
      <label htmlFor="file-upload" className="file-upload-label">
        📂 Choose File
        <input
          type="file"
          id="file-upload"
          onChange={handleImageUpload}
          accept="image/*"
          className="file-input-hidden"
        />
      </label>

        <button onClick={handleAddPart} disabled={!uploadedImage} className="button">
          Add Part
        </button>
        <button onClick={startDrawingArrow} disabled={!uploadedImage} className="button">
          Draw Arrow
        </button>
        <button onClick={startAddingText} disabled={!uploadedImage} className="button">
          Add Text
        </button>
      </div>
      <div className="canvas-container">
        {uploadedImage && (
          <Stage
            width={1100}
            height={600}
            onClick={(e) => {
              handleArrowClick(e);
              handleTextClick(e); // Handle text click
            }}
          >
            <Layer>
              <Image image={uploadedImage} width={1000} height={600} />
              {imageDetails.map((part) => (
                <React.Fragment key={part.id}>
                  <Rect
                    x={part.x}
                    y={part.y}
                    width={part.width}
                    height={part.height}
                    fill={
                      hoveredPart === part.id
                        ? "rgba(0, 0, 255, 0.3)"
                        : "transparent"
                    }
                    stroke="blue"
                    strokeWidth={2}
                    draggable
                    onDragEnd={(e) => {
                      const updatedParts = imageDetails.map((p) =>
                        p.id === part.id
                          ? { ...p, x: e.target.x(), y: e.target.y() }
                          : p
                      );
                      setImageDetails(updatedParts);
                    }}
                    onMouseEnter={() => setHoveredPart(part.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                  <Text
                    x={part.x + part.textX}
                    y={part.y + part.textY}
                    text={part.details}
                    fill="black"
                    fontSize={14}
                    width={200}
                    wrap="word"
                  />
                </React.Fragment>
              ))}
              {arrows.map((arrow, index) => (
                <Arrow
                  key={index}
                  points={[
                    arrow.start.x,
                    arrow.start.y,
                    arrow.end.x,
                    arrow.end.y,
                  ]}
                  stroke="red"
                  strokeWidth={2}
                  pointerLength={10}
                  pointerWidth={10}
                  lineCap="round"
                  lineJoin="round"
                  draggable
                  onDragMove={(e) => handleArrowDragMove(index, e)}
                />
              ))}
              {texts.map((text) => (
                <Text
                  key={text.id}
                  x={text.x}
                  y={text.y}
                  text={text.text}
                  fontSize={text.fontSize}
                  fill="black"
                  draggable
                  onDragEnd={(e) => {
                    const updatedTexts = texts.map((t) =>
                      t.id === text.id
                        ? { ...t, x: e.target.x(), y: e.target.y() }
                        : t
                    );
                    setTexts(updatedTexts);
                  }}
                />
              ))}
              {hoveredPart && (
                <>
                  <Arrow
                    points={[
                      imageDetails.find((p) => p.id === hoveredPart).x + 50,
                      imageDetails.find((p) => p.id === hoveredPart).y + 25,
                      imageDetails.find((p) => p.id === hoveredPart).x + 150,
                      imageDetails.find((p) => p.id === hoveredPart).y - 50,
                    ]}
                    stroke="black"
                    strokeWidth={2}
                    pointerLength={10}
                    pointerWidth={10}
                    lineCap="round"
                    lineJoin="round"
                  />
                  <Text
                    x={imageDetails.find((p) => p.id === hoveredPart).x + 160}
                    y={imageDetails.find((p) => p.id === hoveredPart).y - 50}
                    text={
                      imageDetails.find((p) => p.id === hoveredPart).details
                    }
                    fill="black"
                    fontSize={14}
                    width={200}
                    wrap="word"
                  />
                </>
              )}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
};

export default App;
