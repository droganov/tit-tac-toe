'use client'
import { createStore } from '@yobta/stores'
import { useStore } from '@yobta/stores/react'
import { Button } from '@yobta/ui'
import clsx from 'clsx'
import { type FunctionComponent, useEffect } from 'react'

type Results = (boolean | null)[]

type Size = 3 | 4 | 5

type State = {
  results: Results
  size: Size
  turn: boolean
}

const initialState: State = {
  results: Array(9).fill(null),
  size: 3,
  turn: true,
}

const movesStore = createStore<State>(initialState)

const makeTurn = (index: number, turn: boolean): void => {
  const last = movesStore.last()
  const results = [...last.results]
  results[index] = turn
  movesStore.next({
    results,
    size: last.size,
    turn: !turn,
  })
}

const reset = (size: Size): void => {
  movesStore.next({
    results: Array(size * size).fill(null),
    size,
    turn: true,
  })
}

const isFilled = (results: Results): boolean => {
  const items = new Set(results)
  return items.size === 1 && !items.has(null)
}

const getSelectedRowNumber = (size: number, results: Results): number => {
  for (let i = 0; i < size; i++) {
    const values = results.slice(i * size, i * size + size)
    if (isFilled(values)) {
      return i
    }
  }
  return -1
}

const getSelectedColNumber = (size: number, results: Results): number => {
  for (let i = 0; i < size; i++) {
    const values = results.filter((_, j) => j % size === i)
    if (isFilled(values)) {
      return i
    }
  }
  return -1
}

const getSelectedDiagonalNumber = (size: number, results: Results): number => {
  const diagonal1 = Array(size).fill(null)
  const diagonal2 = [...diagonal1]

  for (let i = 0; i < size; i++) {
    const v1 = results[i * size + i]
    const v2 = results[i * size + size - i - 1]

    diagonal1[i] = v1
    diagonal2[i] = v2
  }

  if (isFilled(diagonal1)) {
    return 0
  }

  if (isFilled(diagonal2)) {
    return 1
  }

  return -1
}

export const Game: FunctionComponent = () => {
  const { results, size, turn } = useStore(movesStore)

  useEffect(() => {
    if (results.length !== size * size) {
      reset(size)
    }
  }, [size, results.length])

  const selectedRowNumber = getSelectedRowNumber(size, results)
  const selectedColNumber = getSelectedColNumber(size, results)
  const selectedDiagonalNumber = getSelectedDiagonalNumber(size, results)

  const isOver =
    Math.max(selectedRowNumber, selectedColNumber, selectedDiagonalNumber) !==
    -1

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
      {isOver && (
        <div className="text-center text-2xl my-4">
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
