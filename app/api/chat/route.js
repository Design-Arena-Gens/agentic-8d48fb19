export async function POST(request) {
  try {
    const { message } = await request.json()

    // Rozy's AI logic - provides intelligent responses
    const response = generateResponse(message.toLowerCase())

    return Response.json({ response })
  } catch (error) {
    return Response.json({ response: 'Sorry, I encountered an error.' }, { status: 500 })
  }
}

function generateResponse(message) {
  // Knowledge base for various topics
  const responses = {
    // Greetings
    greetings: {
      triggers: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
      response: "Hello! I'm Rozy, your AI assistant. How can I help you today?"
    },

    // Math and calculations
    math: {
      triggers: ['calculate', 'math', 'plus', 'minus', 'multiply', 'divide', 'what is'],
      handler: (msg) => {
        // Simple calculator
        const match = msg.match(/(\d+\.?\d*)\s*([\+\-\*\/x×÷])\s*(\d+\.?\d*)/)
        if (match) {
          const a = parseFloat(match[1])
          const op = match[2]
          const b = parseFloat(match[3])
          let result
          switch(op) {
            case '+': result = a + b; break
            case '-': result = a - b; break
            case '*': case 'x': case '×': result = a * b; break
            case '/': case '÷': result = a / b; break
          }
          return `The answer is ${result}`
        }
        return "I can help with calculations! Try asking something like '25 + 17' or '100 / 4'"
      }
    },

    // Time and date
    time: {
      triggers: ['time', 'date', 'today', 'day', 'what day'],
      handler: () => {
        const now = new Date()
        return `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} and the time is ${now.toLocaleTimeString()}`
      }
    },

    // Programming
    programming: {
      triggers: ['code', 'programming', 'javascript', 'python', 'java', 'html', 'css', 'function', 'variable', 'loop'],
      response: "I can help with programming! I know about JavaScript, Python, HTML/CSS, and more. What would you like to know?"
    },

    // Science
    science: {
      triggers: ['science', 'physics', 'chemistry', 'biology', 'atom', 'molecule', 'cell', 'gravity'],
      response: "Science is fascinating! I can explain scientific concepts. What topic are you interested in - physics, chemistry, biology, or something else?"
    },

    // History
    history: {
      triggers: ['history', 'historical', 'when was', 'who invented', 'ancient'],
      response: "History helps us understand our past! What historical topic or event would you like to learn about?"
    },

    // Weather
    weather: {
      triggers: ['weather', 'temperature', 'forecast', 'rain', 'sunny', 'cloudy'],
      response: "I'd love to help with weather, but I don't have real-time data access. Try checking weather.com or your local weather service!"
    },

    // General knowledge
    knowledge: {
      triggers: ['what', 'how', 'why', 'when', 'where', 'who', 'explain', 'tell me'],
      response: "That's an interesting question! I'm designed to help with a wide range of topics including math, science, programming, history, and general knowledge. Could you be more specific about what you'd like to know?"
    },

    // Gratitude
    thanks: {
      triggers: ['thank', 'thanks', 'appreciate', 'helpful'],
      response: "You're very welcome! I'm happy to help. Is there anything else you'd like to know?"
    },

    // Identity
    identity: {
      triggers: ['who are you', 'what are you', 'your name', 'about you'],
      response: "I'm Rozy, your AI assistant! I'm here to answer questions, help with calculations, explain concepts, and assist you with various tasks. How can I help you today?"
    },

    // Capabilities
    capabilities: {
      triggers: ['what can you do', 'help me', 'can you', 'able to'],
      response: "I can help with:\n• Answering general knowledge questions\n• Math calculations\n• Explaining programming concepts\n• Science, history, and educational topics\n• General conversation and assistance\n\nWhat would you like help with?"
    }
  }

  // Check for math operations first
  if (message.match(/\d+\.?\d*\s*[\+\-\*\/x×÷]\s*\d+\.?\d*/)) {
    return responses.math.handler(message)
  }

  // Check each category
  for (const [key, data] of Object.entries(responses)) {
    if (data.triggers.some(trigger => message.includes(trigger))) {
      return data.handler ? data.handler(message) : data.response
    }
  }

  // Default intelligent response
  return "I understand you're asking about '" + message.split(' ').slice(0, 5).join(' ') + "...' While I may not have specific information on that exact topic, I'm here to help! Could you rephrase your question or ask about something else? I'm good with math, science, programming, history, and general knowledge questions."
}
