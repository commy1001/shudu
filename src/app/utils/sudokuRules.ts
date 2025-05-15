// utils/sudokuRules.ts

// 验证数独是否合法（返回错误位置或 null）
export const validateSudoku = (squares: (string | null)[]) => {
  const errors = new Set<number>();// 用于存储错误位置的索引

  // 将一维数组转换为二维 9x9 网格
  const grid: (string | null)[][] = [];
  for (let i = 0; i < 9; i++) {
    grid.push(squares.slice(i * 9, (i + 1) * 9));
  }

  // 检查行、列、子网格
  const checkUnique = (cells: (string | null)[], indexes: number[]) => {
    const seen = new Set<string>();// 记录已经出现过的数字
    for (let i = 0; i < cells.length; i++) {
      const value = cells[i];
      if (!value) continue;
      if (seen.has(value)) {
        indexes.forEach(index => errors.add(index));
      }
      seen.add(value);
    }
  };

  // 检查行
  for (let row = 0; row < 9; row++) {
    const rowCells = grid[row];
    checkUnique(rowCells, rowCells.map((_, col) => row * 9 + col));
  }

  // 检查列
  for (let col = 0; col < 9; col++) {
    const colCells = grid.map(row => row[col]);
    checkUnique(colCells, colCells.map((_, row) => row * 9 + col));
  }

  // 检查 3x3 子网格,四层循环
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const subgridIndexes: number[] = [];
      const subgridCells: (string | null)[] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const row = boxRow * 3 + i;
          const col = boxCol * 3 + j;
          const index = row * 9 + col;
          subgridCells.push(squares[index]);
          subgridIndexes.push(index);
        }
      }
      checkUnique(subgridCells, subgridIndexes);
    }
  }

  return errors.size > 0 ? Array.from(errors) : null;
};