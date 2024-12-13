import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Radio, message, Modal, Input } from 'antd'
import { motion } from 'framer-motion'
import axios from 'axios'
import { 
  API_CONFIG, 
  DIVINATION_TOPICS, 
  YAO_SYMBOLS,
  BUDDHA_ART,
  UI_MESSAGES 
} from '../config'

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
  margin-right: 1rem;
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
  color: #ffd700;
  font-size: 1rem;
  min-width: 60px;
  text-align: center;
  padding: 0.5rem;
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #8b4513;
  
  ${props => props.active && `
    border-color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.1);
  `}
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

const BuddhaArt = styled.pre`
  font-family: monospace;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  font-size: 1rem;
  line-height: 1.2;
  margin: 0;
  white-space: pre;
  text-align: left;
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

const CustomInput = styled(Input)`
  width: 200px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #8b4513;
  border-radius: 6px;
  color: #000;
  font-size: 1rem;
  
  &:hover, &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.45);
  }
`

const TopicContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
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
  const [customTopic, setCustomTopic] = useState('')
  const [divinationResult, setDivinationResult] = useState('')
  const [showBuddha, setShowBuddha] = useState(true)
  const [coinSides, setCoinSides] = useState(['front', 'front', 'front'])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const resetDivination = () => {
    setResults([])
    setDivinationResult('')
    setShowBuddha(true)
    setSelectedTopic(null)
    setCustomTopic('')
    setCoinSides(['front', 'front', 'front'])
    setIsModalVisible(false)
  }

  const flipCoins = () => {
    return Array(3).fill(null).map(() => 
      Math.random() > 0.5 ? 'front' : 'back'
    )
  }

  const handleCastDivination = async () => {
    if (results.length >= 6) {
      resetDivination()
      return
    }

    if (!selectedTopic) {
      message.warning(UI_MESSAGES.ERROR_NO_TOPIC)
      return
    }

    if (selectedTopic === 'custom' && !customTopic.trim()) {
      message.warning(UI_MESSAGES.ERROR_NO_CUSTOM)
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

  const handleCustomTopicChange = (e) => {
    const value = e.target.value
    const chineseChars = value.match(/[\u4e00-\u9fa5]/g) || []
    
    if (chineseChars.length === 5) {
      if (value.length < customTopic.length) {
        setCustomTopic(value)
      }
      return
    }
    
    if (chineseChars.length < 5) {
      setCustomTopic(value)
    }
  }

  const handleTopicSelect = (e) => {
    const value = e.target.value
    setSelectedTopic(value)
    if (value !== 'custom') {
      setCustomTopic('')
    }
  }

  const handleAnalyze = async () => {
    if (results.length < 6) return

    let topic
    if (selectedTopic === 'custom') {
      if (!customTopic.trim()) {
        message.warning(UI_MESSAGES.ERROR_NO_CUSTOM)
        return
      }
      topic = customTopic.trim()
    } else {
      topic = DIVINATION_TOPICS.find(t => t.value === selectedTopic)?.label
    }

    if (!topic) {
      message.warning(UI_MESSAGES.ERROR_NO_TOPIC)
      return
    }

    setIsModalVisible(true)
    try {
      const response = await axios.post(API_CONFIG.DIVINATION_API_URL, {
        inputs: {},
        query: `我的六次排卦分别是${results.join('，')}，我要求挂的内容为${topic}，请根据我的要求给出解答。`,
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
      message.error(UI_MESSAGES.ERROR_API)
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
          <BuddhaArt>{BUDDHA_ART}</BuddhaArt>
        ) : (
          <div style={{ width: '100%' }}>{divinationResult}</div>
        )}
      </DivinationResult>

      <SectionContainer>
        <SectionLeft>
          <TopicTitle>透露的天机</TopicTitle>
        </SectionLeft>
        <SectionRight>
          {selectedTopic === 'custom' ? (
            <CustomInput
              placeholder={UI_MESSAGES.PLACEHOLDER_CUSTOM}
              value={customTopic}
              onChange={handleCustomTopicChange}
              autoFocus
            />
          ) : (
            <StyledRadioGroup
              optionType="button"
              buttonStyle="solid"
              value={selectedTopic}
              onChange={handleTopicSelect}
            >
              {DIVINATION_TOPICS.map(topic => (
                <Radio.Button key={topic.value} value={topic.value}>
                  {topic.label}
                </Radio.Button>
              ))}
            </StyledRadioGroup>
          )}
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
        title={UI_MESSAGES.LOADING_TITLE}
        open={isModalVisible}
        footer={null}
        closable={false}
        centered
        width={400}
      >
        <LoadingContent>
          <div className="loading-icon">☸</div>
          <div>{UI_MESSAGES.LOADING_MESSAGE}</div>
        </LoadingContent>
      </LoadingModal>
    </Container>
  )
}

export default DivinationBoard