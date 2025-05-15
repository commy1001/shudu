'use client';

interface SquareProps {
  value: string | null;
  isPrefilled: boolean; 
  isError: boolean;
  onSquareChange: (value: string) => void;
}
const Square = ({ value, isPrefilled, isError, onSquareChange }: SquareProps) => {
  return (
    <input
      type="text"
      className={`square ${isError ? 'error' : ''}`}
      value={value || ''}
      onChange={(e) => onSquareChange(e.target.value)}
      disabled={isPrefilled}
      style={{
        width: '30px',
        height: '30px',
        textAlign: 'center',
        border: `2px solid ${isError ? '#ff4444' : '#ccc'}`, 
        margin: '1px',
        backgroundColor: isPrefilled ? '#f0f0f0' : 'white',
        fontWeight: isPrefilled ? 'bold' : 'normal',
        cursor: isPrefilled ? 'not-allowed' : 'default',
        
      }}
    />
  );
};
export default Square;