import React, { useState, useRef } from 'react';
import { FaDownload, FaUndo, FaPlus, FaTrash } from 'react-icons/fa';
import * as htmlToImage from 'html-to-image';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Draggable from 'react-draggable';

const ThiepEditor = ({ card, onBack }) => {
  const fonts = [
    { 
      id: 'font-dancing', 
      name: 'Dancing Script',
      family: "'Dancing Script', cursive",
      sample: 'Chúc mừng năm mới!' 
    },
    { 
      id: 'font-great-vibes', 
      name: 'Great Vibes',
      family: "'Great Vibes', cursive",
      sample: 'Happy New Year!' 
    },
    { 
      id: 'font-pacifico', 
      name: 'Pacifico',
      family: "'Pacifico', cursive",
      sample: 'Xuân 2024' 
    },
    { 
      id: 'font-lobster', 
      name: 'Lobster',
      family: "'Lobster', cursive",
      sample: 'Tết 2024' 
    }
  ];

  const [textBoxes, setTextBoxes] = useState([
    {
      id: 1,
      text: '<p>Chúc mừng năm mới!</p>',
      font: fonts[0].id,
      color: '#D42F2F',
      size: '40',
      width: 200,
      position: { x: 0, y: 0 }
    }
  ]);
  const [selectedBoxId, setSelectedBoxId] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef(null);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'align': ['', 'center', 'right'] }],
      [{ 'size': ['small', 'large', 'huge'] }],
      ['clean']
    ]
  };

  const formats = [
    'bold', 'italic', 'underline',
    'align', 'size'
  ];

  const handleDownload = async () => {
    if (cardRef.current) {
      setIsCapturing(true);
      try {
        const dataUrl = await htmlToImage.toPng(cardRef.current);
        const link = document.createElement('a');
        link.download = 'thiep-tet.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const addNewTextBox = () => {
    const newId = Math.max(0, ...textBoxes.map(box => box.id)) + 1;
    const newBox = {
      id: newId,
      text: '<p>Nhấp để chỉnh sửa</p>',
      font: fonts[0].id,
      color: '#D42F2F',
      size: '40',
      width: 200,
      position: { x: 20, y: 20 }
    };
    setTextBoxes([...textBoxes, newBox]);
    setSelectedBoxId(newId);
  };

  const deleteTextBox = (id) => {
    if (textBoxes.length > 1) {
      setTextBoxes(textBoxes.filter(box => box.id !== id));
      setSelectedBoxId(textBoxes[0].id);
    }
  };

  const updateSelectedBox = (updates) => {
    setTextBoxes(textBoxes.map(box => 
      box.id === selectedBoxId ? { ...box, ...updates } : box
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Preview Panel */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-8">
        <div ref={cardRef} className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
          <img src={card.thumbnail} alt="Card Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0">
            {textBoxes.map((box) => (
              <Draggable
                key={box.id}
                position={box.position}
                onDrag={(e, data) => {
                  updateSelectedBox({ position: { x: data.x, y: data.y } });
                }}
                bounds="parent"
                disabled={isCapturing}
              >
                <div 
                  className={`absolute p-4 cursor-move ${
                    selectedBoxId === box.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedBoxId(box.id)}
                  style={{
                    fontFamily: fonts.find(f => f.id === box.font)?.family,
                    color: box.color,
                    fontSize: `${box.size}px`,
                    width: `${box.width}px`,
                    textAlign: 'center',
                    zIndex: selectedBoxId === box.id ? 51 : 50,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    userSelect: 'none'
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: box.text }} />
                  {selectedBoxId === box.id && textBoxes.length > 1 && (
                    <button
                      onClick={() => deleteTextBox(box.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-xl shadow-xl p-6 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={addNewTextBox}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FaPlus /> Thêm khung chữ
          </button>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">Nội dung</h3>
          <div className="bg-white rounded border">
            <ReactQuill
              value={textBoxes.find(box => box.id === selectedBoxId)?.text}
              onChange={(value) => updateSelectedBox({ text: value })}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">Phông chữ</h3>
          <div className="space-y-2">
            {fonts.map((font) => (
              <button
                key={font.id}
                onClick={() => updateSelectedBox({ font: font.id })}
                className={`w-full p-3 rounded-lg border-2 transition-all bg-white ${
                  textBoxes.find(box => box.id === selectedBoxId)?.font === font.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-200'
                }`}
                style={{ fontFamily: font.family }}
              >
                <span className="text-xl text-black">{font.sample}</span>
                <span className="block text-sm text-gray-500 mt-1">{font.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">Màu chữ</h3>
          <input
            type="color"
            value={textBoxes.find(box => box.id === selectedBoxId)?.color}
            onChange={(e) => updateSelectedBox({ color: e.target.value })}
            className="w-full h-12 cursor-pointer rounded-lg"
          />
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">Cỡ chữ</h3>
          <input
            type="range"
            min="20"
            max="80"
            value={textBoxes.find(box => box.id === selectedBoxId)?.size}
            onChange={(e) => updateSelectedBox({ size: e.target.value })}
            className="w-full"
          />
          <div className="text-center mt-2">{textBoxes.find(box => box.id === selectedBoxId)?.size}px</div>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">Độ rộng khung</h3>
          <div className="space-y-2">
            <input
              type="range"
              min="100"
              max="500"
              value={textBoxes.find(box => box.id === selectedBoxId)?.width}
              onChange={(e) => updateSelectedBox({ width: e.target.value })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Hẹp</span>
              <span>{textBoxes.find(box => box.id === selectedBoxId)?.width}px</span>
              <span>Rộng</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <FaDownload /> Tải về
          </button>
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <FaUndo /> Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThiepEditor; 