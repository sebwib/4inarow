import { use, useCallback, useEffect, useState } from "react";

type GameState = ("black" | "red" | "none")[][];

export const Game = () => {
  const [locked, setLocked] = useState(false);
  const [turn, setTurn] = useState<"black" | "red">("black");
  const [game, setGame] = useState<GameState>([
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
  ]);

  const [wins, setWins] = useState<"red" | "black" | "none">("none");

  const resetGame = () => {
    setLocked(false);
    setWins("none");
    setGame([
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
    ]);
    setTurn("black");
  };

  const checkWin = (game: GameState) => {
    // Check rows
    for (let row = 0; row < game.length; row++) {
      for (let col = 0; col < game[row].length - 3; col++) {
        if (
          game[row][col] === turn &&
          game[row][col + 1] === turn &&
          game[row][col + 2] === turn &&
          game[row][col + 3] === turn
        ) {
          setTimeout(() => {
            setWins(turn);
          }, 700);
          return;
        }
      }
    }
    // Check columns
    for (let col = 0; col < game[0].length; col++) {
      for (let row = 0; row < game.length - 3; row++) {
        if (
          game[row][col] === turn &&
          game[row + 1][col] === turn &&
          game[row + 2][col] === turn &&
          game[row + 3][col] === turn
        ) {
          setLocked(true);

          setTimeout(() => {
            setWins(turn);
          }, 700);
          return;
        }
      }
    }
    // Check diagonals
    for (let row = 0; row < game.length - 3; row++) {
      for (let col = 0; col < game[row].length - 3; col++) {
        if (
          game[row][col] === turn &&
          game[row + 1][col + 1] === turn &&
          game[row + 2][col + 2] === turn &&
          game[row + 3][col + 3] === turn
        ) {
          setLocked(true);
          setTimeout(() => {
            setWins(turn);
          }, 700);
          return;
        }
        if (
          game[row][col + 3] === turn &&
          game[row + 1][col + 2] === turn &&
          game[row + 2][col + 1] === turn &&
          game[row + 3][col] === turn
        ) {
          setLocked(true);
          setTimeout(() => {
            setWins(turn);
          }, 700);
          return;
        }
      }
    }
  };

  const click = useCallback(
    (turn: "black" | "red", rowIndex: number, cellIndex: number) => {
      if (locked) {
        return;
      }

      const newGame = [...game];

      let didPlace = false;

      // fall through rows until free cell
      for (let i = game.length - 1; i >= 0; i--) {
        if (newGame[i][cellIndex] === "none") {
          newGame[i][cellIndex] = turn;
          didPlace = true;
          break;
        }
      }

      if (!didPlace) {
        // no more free cells in this column
        return;
      }

      setGame(newGame);

      checkWin(newGame);
      setTurn(turn === "black" ? "red" : "black");
    },
    [game, locked]
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(95vh, 95vw)",
          height: "min(95vh, 95vw)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {game.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{ display: "flex", width: "100%", height: "100%" }}
          >
            {row.map((cell, cellIndex) => (
              <div
                onClick={() => {
                  if (cell === "none") {
                    click(turn, rowIndex, cellIndex);
                  }
                }}
                key={cellIndex}
                style={{
                  position: "relative",
                  width: 100 / row.length + "%",
                  height: "100%",
                  backgroundColor: "white",
                  border: "1px solid black",
                }}
              >
                {cell !== "none" && (
                  <div
                    style={{
                      animation: `fall ${rowIndex * 0.1}s`,
                      left: "5%",
                      top: "5%",
                      position: "absolute",
                      width: "90%",
                      height: "90%",
                      backgroundColor: cell,
                      borderRadius: "50%",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        ))}
        {wins !== "none" && (
          <div
            style={{
              animation: `fadeIn 0.8s`,
              position: "absolute",
              top: "0%",
              left: "0%",
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              padding: 20,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: 40,
                textAlign: "center",
                marginBottom: 20,
                textTransform: "uppercase",
                fontWeight: "bold",
                color: wins,
                textShadow:
                  "-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF",
              }}
            >
              {wins} wins!
            </h1>
            <button
              onClick={resetGame}
              style={{
                padding: 10,
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: 5,
                fontSize: 20,
              }}
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
