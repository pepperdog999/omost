export const API_CONFIG = {
  DIVINATION_API_URL: 'https://dify.unissense.tech/v1/chat-messages',
  DIVINATION_API_KEY: 'app-8BLZgppP4TxJ4pYmHTmkIfkO'
}

export const YAO_NAMES = {
  1: '初爻',
  2: '二爻',
  3: '三爻',
  4: '四爻',
  5: '五爻',
  6: '上爻'
}

export const DIVINATION_TOPICS = [
  { value: 'love', label: '感情' },
  { value: 'career', label: '事业' },
  { value: 'wealth', label: '财运' },
  { value: 'health', label: '健康' },
  { value: 'study', label: '学业' },
  { value: 'custom', label: '自定义' }
]

export const YAO_SYMBOLS = {
  SHAO_YANG: '少阳',
  SHAO_YIN: '少阴',
  LAO_YANG: '老阳',
  LAO_YIN: '老阴'
}

export const BUDDHA_ART = `
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\\  =  /O
               ____/\`---'\\____
             .'  \\|     |//  \`.
            /  \\|||  :  |||//  \\
           /  _||||| -:- |||||-  \\
           |   | \\\\  -  /// |   |
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

export const UI_MESSAGES = {
  LOADING_TITLE: '玄机演算',
  LOADING_MESSAGE: '正在请示佛主，解析天机...',
  ERROR_NO_TOPIC: '请选择想要透露的天机',
  ERROR_NO_CUSTOM: '请输入想要透露的天机',
  ERROR_API: '解卦过程出现问题，请稍后重试',
  PLACEHOLDER_CUSTOM: '请输入内容(限5字)'
} 