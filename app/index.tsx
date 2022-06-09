import React from '@libs/react'
import App from './App'
import { createComponents } from './core/utils/create-components'
import './index.css'

export default function Bootstrap({ Components, ...props }: EntryProps) {
  return (
    <App Components={createComponents(Components)} {...props} />
  )
}
