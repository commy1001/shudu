'use client';

import { useState, useEffect } from 'react';
import Square from './components/square';
import { validateSudoku } from './utils/sudokuRules';
import { initialSudokuPuzzle } from './utils/sudokuPuzzles';

const App = () => {
  const [squares, setSquares] = useState<(string | null)[]>(Array(81).fill(null));// 存储当前所有格子的值
  const [prefilled, setPrefilled] = useState<boolean[]>(Array(81).fill(false));// 标记哪些格子是预设的
  const [errors, setErrors] = useState<number[]>([]);// 存储错误格子的索引
  const [isCompleted, setIsCompleted] = useState(false);// 是否完成游戏
  const [showErrors, setShowErrors] = useState(false); 
  const [message, setMessage] = useState(''); // 状态提示消息

  useEffect(() => {
    initializePuzzle();
  }, []);

  //初始数独谜题
  const initializePuzzle = () => {
    const newPrefilled = initialSudokuPuzzle.map(cell => cell !== null);// 初始化已填充的格子
    setSquares(initialSudokuPuzzle);// 设置初始数独谜题 
    setPrefilled(newPrefilled);// 设置已填充的格子
    setErrors([]);
    setIsCompleted(false);
    setShowErrors(false);
    setMessage('');
  };

  // 处理输入
  const handleChange = (index: number, value: string) => {
    if (prefilled[index]) return;

    const sanitizedValue = value.replace(/[^1-9]/g, '').slice(0, 1);// 确保输入是1-9之间的数字
    const nextSquares = [...squares];// 创建下一个状态
    nextSquares[index] = sanitizedValue || null;// 更新当前格子的值
    setSquares(nextSquares);

    // 实时验证
    const newErrors = validateSudoku(nextSquares);
    setErrors(newErrors || []);
    checkCompletion(nextSquares, newErrors || []);
  };

  // 检查是否完成
  const checkCompletion = (grid: (string | null)[], errors: number[]) => {
    const filled = grid.every(cell => cell !== null);
    const valid = errors.length === 0;
    setIsCompleted(filled && valid);
    if (filled && valid) {
      setMessage('🎉 恭喜！数独完成！');
    }
  };

  // 手动检查答案
  const checkAnswer = () => {
    const newErrors = validateSudoku(squares);
    setErrors(newErrors || []);
    setShowErrors(true);

    if (newErrors?.length) {
      setMessage('❌ 存在错误，请检查高亮格子！');
    } else if (squares.some(cell => cell === null)) {
      setMessage('⚠️ 未完成，请继续填写！');
    } else {
      setMessage('🎉 全部正确！');
    }
  };

  return (
    <div className="sudoku-container">
      <div className="controls">
        <button onClick={checkAnswer} className="button">
          检查答案
        </button>
        <button onClick={initializePuzzle} className="button">
          重新开始
        </button>
      </div>

      {message && (
        <div className={`message ${isCompleted ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="board">
        {Array.from({ length: 9 }, (_, row) => (
          <div className="board-row" key={row}>
            {Array.from({ length: 9 }, (_, col) => {
              const index = row * 9 + col;
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  isPrefilled={prefilled[index]}
                  isError={showErrors && errors.includes(index)}
                  onSquareChange={(value) => handleChange(index, value)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;