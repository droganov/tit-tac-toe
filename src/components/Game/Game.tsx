'use client'
import { createStore, sessionStoragePlugin } from '@yobta/stores'
import { useStore } from '@yobta/stores/react'
import { Button } from '@yobta/ui'
import clsx from 'clsx'
import type { FunctionComponent } from 'react'

type Results = (boolean | null)[]

type Size = 3 | 4 | 5

type State = {
  isDraw: boolean
  isOver: boolean
  results: Results
  selectedColNumber: number
  selectedDiagonalNumber: number
  selectedRowNumber: number
  size: Size
  turn: boolean
}

const initialState: State = {
  isDraw: false,
  isOver: false,
  results: Array(9).fill(null),
  selectedColNumber: -1,
  selectedDiagonalNumber: -1,
  selectedRowNumber: -1,
  size: 3,
  turn: true,
}

const movesStore = createStore<State>(
  initialState,
  // prevents state loss when refreshing the page
  sessionStoragePlugin({ channel: 'tic-tac-toe' })
)

const makeTurn = (index: number, turn: boolean): void => {
  const last = movesStore.last()
  const results = [...last.results]
  results[index] = turn
  const { selectedColNumber, selectedDiagonalNumber, selectedRowNumber } =
    getWinner(last.size, results)

  movesStore.next({
    isDraw: !results.includes(null),
    isOver:
      Math.max(selectedRowNumber, selectedColNumber, selectedDiagonalNumber) !==
      -1,
    results,
    selectedColNumber,
    selectedDiagonalNumber,
    selectedRowNumber,
    size: last.size,
    turn: !turn,
  })
}

const reset = (size: Size): void => {
  movesStore.next({
    ...initialState,
    results: Array(size * size).fill(null),
    size,
  })
}

const isFilled = (results: Results): boolean => {
  const items = new Set(results)
  return items.size === 1 && !items.has(null)
}

const getWinner = (
  size: number,
  results: Results
): Pick<
  State,
  'selectedColNumber' | 'selectedDiagonalNumber' | 'selectedRowNumber'
> => {
  let selectedColNumber = -1
  let selectedDiagonalNumber = -1
  let selectedRowNumber = -1

  const diagonal1 = Array(size).fill(null)
  const diagonal2 = [...diagonal1]

  for (let i = 0; i < size; i++) {
    diagonal1[i] = results[i * size + i]
    diagonal2[i] = results[i * size + size - i - 1]

    const row = results.slice(i * size, i * size + size)
    if (isFilled(row)) {
      selectedRowNumber = i
    }

    const col = results.filter((_, j) => j % size === i)
    if (isFilled(col)) {
      selectedColNumber = i
    }
  }

  if (isFilled(diagonal1)) {
    selectedDiagonalNumber = 0
  }

  if (isFilled(diagonal2)) {
    selectedDiagonalNumber = 1
  }

  return {
    selectedColNumber,
    selectedDiagonalNumber,
    selectedRowNumber,
  }
}

export const Game: FunctionComponent = () => {
  const {
    isDraw,
    isOver,
    results,
    selectedColNumber,
    selectedDiagonalNumber,
    selectedRowNumber,
    size,
    turn,
  } = useStore(movesStore)

  return (
    <>
      <select
        className="px-2 mb-2 rounded"
        onChange={(event) => {
          const nextSize = parseInt(event.target.value, 10) as Size
          reset(nextSize)
        }}
        value={size}
      >
        <option value="3">3x3</option>
        <option value="4">4x4</option>
        <option value="5">5x5</option>
      </select>
      <div
        className={clsx(
          'grid gap-1',
          size === 3 && 'grid-cols-3',
          size === 4 && 'grid-cols-4',
          size === 5 && 'grid-cols-5'
        )}
      >
        {results.map((value, i) => {
          const rowNumber = Math.floor(i / size)
          const colNumber = i % size
          const isDiagonal1 = colNumber === rowNumber
          const isDiagonal2 = colNumber === size - rowNumber - 1

          const isSelected =
            selectedRowNumber === rowNumber ||
            selectedColNumber === colNumber ||
            (isDiagonal1 && selectedDiagonalNumber === 0) ||
            (isDiagonal2 && selectedDiagonalNumber === 1)

          return (
            <div
              className={clsx(
                'p-2 aspect-square yobta-button h-auto border yobta-border-ink-border',
                'flex justify-center items-center',
                (isOver || value !== null) && 'pointer-events-none',
                isSelected && 'yobta-success'
              )}
              key={i}
              onClick={() => {
                makeTurn(i, turn)
              }}
            >
              {value === true && 'X'}
              {value === false && 'O'}
            </div>
          )
        })}
      </div>
      {isDraw && (
        <div className="text-center text-lg my-4">
          It&apos;s a tie! Both X and O get participation trophies... and a
          nagging feeling that they&apos;ve wasted their lives on a futile
          struggle for dominance.
        </div>
      )}
      {isOver && (
        <div className="text-center text-lg my-4">
          {turn ? 'O' : 'X'} wins!{' '}
          <span>
            {!turn ? 'O' : 'X'} gets a participation trophy... and a strong urge
            to reconsider life choices.
          </span>
        </div>
      )}
      <Button
        className="yobta-primary rounded-full mx-auto mt-4"
        onClick={() => {
          reset(size)
        }}
      >
        Rematch?
      </Button>
    </>
  )
}
