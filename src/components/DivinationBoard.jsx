import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Button, Radio, Modal, message, Space } from 'antd'
import { motion } from 'framer-motion'
import axios from 'axios'
import { API_CONFIG, YAO_NAMES } from '../config'

async function queryDivination(hexagrams, question) {
  try {
    const hexagramsText = hexagrams
      .map((h, i) => `${YAO_NAMES[i + 1]}：${h.symbol}`)
      .join('，')

    const response = await axios.post(API_CONFIG.DIVINATION_API_URL, {
      inputs: {},
      query: `我的六次排卦分别是${hexagramsText}，我要求挂的内容为${question}，请根据我的要求给出解答。`,
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
      return response.data.answer
    }
    throw new Error('未获取到有效响应')

  } catch (error) {
    console.error('API调用错误:', error)
    throw new Error('解卦过程出现问题，请稍后重试')
  }
}

const PageContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  min-height: 100vh;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
  }
`

const LeftSection = styled.div`
  flex: 1;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const RightSection = styled(motion.div)`
  flex: 1;
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const BoardContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const CoinsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  gap: 2rem;
  perspective: 1000px;
`

const CoinWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
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
  font-size: 1.8rem;
  font-weight: bold;
  color: #8B4513;
  background: radial-gradient(circle at 30% 30%, #ffd700, #daa520);
  border: 4px solid #daa520;
  transform: ${props => props.side === 'back' ? 'rotateY(180deg)' : 'none'};

  &::after {
    content: '${props => props.side === 'front' ? '字' : '花'}';
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

const DivineButton = styled(Button)`
  background: #8b4513;
  border-color: #8b4513;
  width: 200px;
  height: 60px !important;
  font-size: 1.5rem !important;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);

  &:hover {
    background: #a0522d !important;
    border-color: #a0522d !important;
  }

  &:active {
    transform: translateY(2px);
  }
`

const ResultContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  min-height: 400px;
  max-height: 400px;
  overflow-y: auto;
  text-align: left;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    min-height: 300px;
    max-height: 300px;
    font-size: 1rem;
  }
`

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem;
`

const ResultItem = styled(motion.div)`
  padding: 1rem;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 1.3rem;

  &:last-child {
    color: #ffd700;
    font-weight: bold;
  }
`

const DivinationResult = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  overflow-y: auto;
  min-height: 500px;
  max-height: 500px;
  font-size: 1.2rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;

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

  @media (max-width: 768px) {
    min-height: 400px;
    max-height: 400px;
    padding: 1rem;
    font-size: 1rem;
  }
`

const QuestionSection = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const QuestionTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  .ant-radio-button-wrapper {
    background: rgba(255, 255, 255, 0.1);
    border-color: #8b4513;
    color: #fff;
    min-width: 100px;
    text-align: center;
    height: 40px;
    line-height: 38px;
    font-size: 1.1rem;
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

    &:not(:first-child)::before {
      background-color: #8b4513;
    }
  }

  @media (max-width: 768px) {
    gap: 0.5rem;

    .ant-radio-button-wrapper {
      min-width: 80px;
      font-size: 0.9rem;
      padding: 0 0.5rem;
      height: 36px;
      line-height: 34px;
    }
  }
`

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

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

const BaguaSymbol = styled.div`
  font-family: monospace;
  white-space: pre;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  margin-bottom: 1rem;
  font-size: 1.2rem;
  line-height: 1.2;
  align-self: center;
  justify-self: center;
  width: 100%;
  text-align: center;
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

function getHexagramSymbol(frontCount) {
  switch(frontCount) {
    case 3: // 三正
      return '老阴 (×)'
    case 2: // 两正一反
      return '少阳 (—)'
    case 1: // 一正两反
      return '少阴 (--)'
    case 0: // 三反
      return '老阳 (o)'
    default:
      return ''
  }
}

function DivinationBoard() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [coinSides, setCoinSides] = useState(['front', 'front', 'front'])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [divinationResult, setDivinationResult] = useState('')
  const [showBuddha, setShowBuddha] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const resetDivination = () => {
    setResults([])
    setDivinationResult('')
    setShowBuddha(true)
    setSelectedQuestion(null)
    setCoinSides(['front', 'front', 'front'])
    setIsModalVisible(false)
  }

  const flipCoins = () => {
    return Array(3).fill(null).map(() => 
      Math.random() > 0.5 ? 'front' : 'back'
    )
  }

  const handleDivination = async () => {
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
      const newResult = {
        count: results.length + 1,
        frontCount,
        symbol: hexagramSymbol
      }
      
      setResults(prevResults => [...prevResults, newResult])
      setIsLoading(false)
    }, 2000)
  }

  const handleQuestionSelect = async (e) => {
    const value = e.target.value
    if (!value) return

    if (results.length < 6) {
      message.warning({
        content: '请施主先完成6次排盘，老衲再来演算天机。',
        style: {
          fontSize: '1.1rem',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '10px',
          border: '1px solid #ffd700',
          padding: '1rem'
        }
      })
      return
    }

    setSelectedQuestion(value)
    setIsModalVisible(true)
    
    try {
      const answer = await queryDivination(results, value)
      setIsModalVisible(false)
      setShowBuddha(false)
      setDivinationResult(`
尊敬的施主：

观您所求"${value}"一事，六爻已定，卦象已明。

${answer}
      `)
    } catch (error) {
      message.error(error.message)
      setIsModalVisible(false)
    }
  }

  return (
    <PageContainer>
      <LeftSection>
        <BoardContainer>
          <CoinsContainer>
            {coinSides.map((side, i) => (
              <CoinWrapper
                key={i}
                animate={{
                  rotateY: isLoading 
                    ? [0, 360, 720, 1080] 
                    : side === 'front' ? 0 : 180,
                  rotateX: isLoading ? [0, 15, -15, 0] : 0,
                }}
                transition={{
                  duration: isLoading ? 1 : 0.3,
                  repeat: isLoading ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <CoinFace side="front" />
                <CoinFace side="back" />
              </CoinWrapper>
            ))}
          </CoinsContainer>
          
          <ButtonContainer>
            <DivineButton
              type="primary" 
              onClick={handleDivination}
              disabled={isLoading}
            >
              {results.length >= 6 ? '重新开始' : '开始排盘'}
            </DivineButton>
          </ButtonContainer>

          <ResultContainer>
            <ResultList>
              {results.map((result, index) => (
                <ResultItem
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  {YAO_NAMES[result.count]}：{result.symbol}
                </ResultItem>
              ))}
            </ResultList>
          </ResultContainer>
        </BoardContainer>
      </LeftSection>

      <RightSection>
        <DivinationResult>
          {showBuddha ? (
            <BaguaSymbol>{buddhaArt}</BaguaSymbol>
          ) : (
            <div style={{ width: '100%', padding: '0.5rem' }}>{divinationResult}</div>
          )}
        </DivinationResult>

        <QuestionSection>
          <QuestionTitle>请选择您想问卜的方面：</QuestionTitle>
          <StyledRadioGroup
            optionType="button"
            buttonStyle="solid"
            value={selectedQuestion}
            onChange={handleQuestionSelect}
            disabled={results.length < 6}
          >
            {['感情', '事业', '财富', '升学', '吉凶'].map(question => (
              <Radio.Button key={question} value={question}>
                {question}
              </Radio.Button>
            ))}
          </StyledRadioGroup>
        </QuestionSection>
      </RightSection>

      <Modal
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
      </Modal>
    </PageContainer>
  )
}

export default DivinationBoard