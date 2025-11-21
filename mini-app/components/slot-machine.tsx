"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    ["Apple", "Banana", "Cherry"],
    ["Lemon", "Apple", "Banana"],
    ["Cherry", "Lemon", "Apple"],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(null);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid: Fruit[][] = prev.map((row) => [...row]);
        // shift each column down
        for (let col = 0; col < 3; col++) {
          const newFruit = fruits[Math.floor(Math.random() * fruits.length)];
          newGrid[2][col] = newGrid[1][col];
          newGrid[1][col] = newGrid[0][col];
          newGrid[0][col] = newFruit;
        }
        return newGrid;
      });
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // check win condition directly in render
    }, 2000);
  };

  // win check directly in JSX
  const hasWin =
    !spinning &&
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2] ||
      grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2] ||
      grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2] ||
      grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0] ||
      grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1] ||
      grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]);

  useEffect(() => {
    if (hasWin) {
      setWin(`You won with ${grid[0][0]}!`);
    }
  }, [hasWin, grid]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit.toLowerCase()}.png`}
            alt={fruit}
            width={80}
            height={80}
            className="rounded-md"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {hasWin && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">{win}</span>
          <Share text={`${win} ${url}`} />
        </div>
      )}
    </div>
  );
}
