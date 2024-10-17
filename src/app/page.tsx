import type { Metadata } from 'next'
import type { FunctionComponent } from 'react'

import { Game } from '../components/Game/Game'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'App Yobta',
}

const HomePage: FunctionComponent = () => {
  return (
    <>
      <main className="container max-w-lg mx-auto px-4">
        <h1 className="text-2xl my-4 text-center">Tic-Tac-Toe</h1>
        <Game />
      </main>
    </>
  )
}

export default HomePage
