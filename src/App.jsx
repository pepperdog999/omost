import React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import DivinationBoard from './components/DivinationBoard'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #fff;
`

const TitleContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
`

const BaguaSymbol = styled.div`
  font-family: monospace;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  font-size: 2rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  margin: 0;
`

const baguaArt = `☰ ☱ ☲ ☳ ☷ ☴ ☵ ☶`

function App() {
  return (
    <AppContainer>
      <TitleContainer
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <BaguaSymbol>{baguaArt}</BaguaSymbol>
        <Title>六爻神算</Title>
      </TitleContainer>
      <DivinationBoard />
    </AppContainer>
  )
}

export default App 