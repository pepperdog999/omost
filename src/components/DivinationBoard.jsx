import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Radio, message, Modal } from 'antd'
import { motion } from 'framer-motion'
import axios from 'axios'
import { API_CONFIG, DIVINATION_TOPICS, YAO_SYMBOLS } from '../config'

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const ContentSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const DivinationResult = styled(ContentSection)`
  height: 400px;
  min-height: 400px;
  max-height: 400px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
  overflow-y: auto;
  padding: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  }
`

const SectionContainer = styled(ContentSection)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 0.5rem;
  }
`

const SectionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 2rem;
  border-right: 1px solid rgba(255, 215, 0, 0.3);
  min-width: 120px;

  @media (max-width: 768px) {
    padding-right: 0;
    padding-bottom: 0.5rem;
    border-right: none;
    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  }
`

const SectionRight = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const TopicTitle = styled.div`
  color: #ffd700;
  font-size: 1rem;
  white-space: nowrap;
`

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  .ant-radio-button-wrapper {
    background: rgba(255, 255, 255, 0.1);
    border-color: #8b4513;
    color: #fff;
    min-width: 80px;
    text-align: center;
    height: 36px;
    line-height: 34px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
      color: #ffd700;
      background: rgba(139, 69, 19, 0.5);
    }

    &.ant-radio-button-wrapper-checked {
      background: #8b4513;
      border-color: #ffd700;
      color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }
  }
`

const YaoResult = styled.div`
  flex: 1;
  min-width: 60px;
  text-align: center;
  padding: 0.5rem;
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  border-radius: 8px;
  transition: all 0.3s ease;
`

const ActionButton = styled(motion.button)`
  width: 100%;
  height: 60px;
  font-size: 1.2rem;
  background: #8b4513;
  border: none;
  border-radius: 15px;
  color: #ffd700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #a0522d;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const BuddhaArt = styled.div`
  font-family: monospace;
  white-space: pre;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  font-size: 1rem;
  line-height: 1.2;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const buddhaArt = `
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\\  =  /O
               ____/\`---'\\____
             .'  \\\\|     |//  \`.
            /  \\\\|||  :  |||//  \\
           /  _||||| -:- |||||-  \\
           |   | \\\\\\  -  /// |   |
           | \\_|  ''\\---/''  |   |
           \\  .-\\__  \`-\`  ___/-. /
         ___\`. .'  /--.--\\  \`. . __
      ."" '<  \`.___\\_<|>_/___.'  >'"".
     | | :  \`- \\\`.;\`\\ _ /\`;.\`/ - \` : | |
     \\  \\ \`-.   \\_ __\\ /__ _/   .-\` /  /
======\`-.____\`-.___\\_____/___.-\`____.-'======
                   \`=---='

佛主保佑 神机妙算
`

const CoinsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
  perspective: 1000px;
`

const CoinWrapper = styled(motion.div)`
  width: 60px;
  height: 60px;
  position: relative;
  transform-style: preserve-3d;
`

const CoinFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #8B4513;
  background: radial-gradient(circle at 30% 30%, #ffd700, #daa520);
  border: 4px solid #daa520;
  transform: ${props => props.side === 'back' ? 'rotateY(180deg)' : 'none'};

  &::after {
    content: '${props => props.side === 'front' ? '字' : '花'}';
  }
`

const LoadingModal = styled(Modal)`
  .ant-modal-content {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #ffd700;
  }
  
  .ant-modal-header {
    background: transparent;
    border-bottom: none;
    
    .ant-modal-title {
      color: #ffd700;
    }
  }
`

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;

  .loading-icon {
    font-size: 3rem;
    color: #ffd700;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }
`

function getHexagramSymbol(frontCount) {
  switch(frontCount) {
    case 3: // 三字
      return YAO_SYMBOLS.LAO_YIN
    case 2: // 两字一花
      return YAO_SYMBOLS.SHAO_YANG
    case 1: // 一字两花
      return YAO_SYMBOLS.SHAO_YIN
    case 0: // 三花
      return YAO_SYMBOLS.LAO_YANG
    default:
      return ''
  }
}

function DivinationBoard() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [divinationResult, setDivinationResult] = useState('')
  const [showBuddha, setShowBuddha] = useState(true)
  const [coinSides, setCoinSides] = useState(['front', 'front', 'front'])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const resetDivination = () => {
    setResults([])
    setDivinationResult('')
    setShowBuddha(true)
    setSelectedTopic(null)
    setCoinSides(['front', 'front', 'front'])
    setIsLoading(false)
  }

  const flipCoins = () => {
    return Array(3).fill(null).map(() => 
      Math.random() > 0.5 ? 'front' : 'back'
    )
  }

  const handleCastDivination = async () => {
    if (!selectedTopic) {
      message.warning('请先选择想要透露的天机')
      return
    }

    if (results.length >= 6) {
      resetDivination()
      return
    }

    setIsLoading(true)
    
    const flipInterval = setInterval(() => {
      setCoinSides(flipCoins())
    }, 100)

    setTimeout(() => {
      clearInterval(flipInterval)
      const finalSides = flipCoins()
      setCoinSides(finalSides)
      
      const frontCount = finalSides.filter(side => side === 'front').length
      const hexagramSymbol = getHexagramSymbol(frontCount)
      
      setResults(prevResults => [...prevResults, hexagramSymbol])
      setIsLoading(false)
    }, 1000)
  }

  const handleAnalyze = async () => {
    if (results.length < 6) return

    setIsModalVisible(true)
    try {
      const response = await axios.post(API_CONFIG.DIVINATION_API_URL, {
        inputs: {},
        query: `我的六次排卦分别是${results.join('，')}，我要求挂的内容为${selectedTopic}，请根据我的要求给出解答。`,
        response_mode: "blocking",
        conversation_id: "",
        user: "10@buddha"
      }, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.DIVINATION_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data && response.data.answer) {
        setShowBuddha(false)
        setDivinationResult(response.data.answer)
      }
    } catch (error) {
      message.error('解卦过程出现问题，请稍后重试')
    } finally {
      setIsModalVisible(false)
    }
  }

  const getButtonText = () => {
    if (isLoading) return '请稍候...'
    if (results.length === 6 && !divinationResult) return '请解析天机'
    if (divinationResult) return '再来一次'
    return '开始排盘'
  }

  const handleButtonClick = () => {
    if (results.length === 6 && !divinationResult) {
      handleAnalyze()
    } else {
      handleCastDivination()
    }
  }

  return (
    <Container>
      <DivinationResult>
        {showBuddha ? (
          <BuddhaArt>{buddhaArt}</BuddhaArt>
        ) : (
          <div style={{ width: '100%' }}>{divinationResult}</div>
        )}
      </DivinationResult>

      <SectionContainer>
        <SectionLeft>
          <TopicTitle>选择想要透露的天机</TopicTitle>
        </SectionLeft>
        <SectionRight>
          <StyledRadioGroup
            optionType="button"
            buttonStyle="solid"
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
          >
            {DIVINATION_TOPICS.map(topic => (
              <Radio.Button key={topic.value} value={topic.value}>
                {topic.label}
              </Radio.Button>
            ))}
          </StyledRadioGroup>
        </SectionRight>
      </SectionContainer>

      <SectionContainer>
        <SectionLeft>
          {coinSides.map((side, i) => (
            <CoinWrapper
              key={i}
              animate={{
                rotateY: isLoading && !isModalVisible
                  ? [0, 360, 720, 1080] 
                  : side === 'front' ? 0 : 180,
                rotateX: isLoading && !isModalVisible ? [0, 15, -15, 0] : 0,
              }}
              transition={{
                duration: isLoading ? 1 : 0.3,
                repeat: isLoading && !isModalVisible ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <CoinFace side="front" />
              <CoinFace side="back" />
            </CoinWrapper>
          ))}
        </SectionLeft>
        <SectionRight>
          {Array(6).fill(null).map((_, index) => (
            <YaoResult key={index} active={results[index]}>
              {results[index] || '待定'}
            </YaoResult>
          ))}
        </SectionRight>
      </SectionContainer>

      <ActionButton
        onClick={handleButtonClick}
        disabled={isLoading || (!selectedTopic && !divinationResult)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {getButtonText()}
      </ActionButton>

      <LoadingModal
        title="玄机演算"
        open={isModalVisible}
        footer={null}
        closable={false}
        centered
        width={400}
      >
        <LoadingContent>
          <div className="loading-icon">☸</div>
          <div>正在请示佛主，解析天机...</div>
        </LoadingContent>
      </LoadingModal>
    </Container>
  )
}

export default DivinationBoard