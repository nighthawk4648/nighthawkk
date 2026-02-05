'use client';
import { useState, useRef, useEffect } from 'react';
import { IoChatbubbleEllipses, IoClose, IoSend } from 'react-icons/io5';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm SketchShaper Assistant. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // More sophisticated response logic with context awareness
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello there! 👋 I'm your SketchShaper Assistant. I'm here to help you make the most of your 3D modeling experience. Whether you're looking to enhance your SketchUp workflow with our Pro features, need help with the extension, or want to explore our extensive model library - I've got you covered! What brings you here today?";
    } else if (lowerMessage.includes('pro')) {
      if (lowerMessage.includes('worth') || lowerMessage.includes('good') || lowerMessage.includes('benefit')) {
        return "SketchShaper Pro is absolutely worth it for serious designers! 🎨 For just $10/month, you get unlimited access to 1500+ premium models from top brands like IKEA, Wayfair, and Crate & Barrel. Think about it: no more endless searching for quality models, no more manual imports, and you even get custom model requests. The time savings alone make it a no-brainer for professionals. Would you like me to highlight specific features that would benefit your workflow?";
      } else {
        return "SketchShaper Pro transforms your SketchUp experience! 🚀 Imagine having instant access to 1500+ premium 3D models, one-click imports right into your projects, and even custom model requests when you need something specific. It's perfect for architects, interior designers, and 3D artists who value their time. At just $10/month, it's less than your coffee budget but saves you hours of work. What aspect of Pro interests you most - the model library, the convenience, or something else?";
      }
    } else if (lowerMessage.includes('extension')) {
      if (lowerMessage.includes('how') || lowerMessage.includes('install')) {
        return "Getting our SketchUp extension is super easy! 📦 Simply head over to the Extension page where you'll find the download button. The installation process takes just a few minutes - it's like installing any other SketchUp extension. Once installed, you'll have a magical panel right inside SketchUp where you can browse, search, and import models with a single click. We also offer a free version if you want to test the waters first. Ready to give it a try?";
      } else {
        return "Our SketchUp extension is a game-changer! ✨ Instead of constantly switching between your browser and SketchUp, you get a fully integrated experience. The extension adds a panel directly in your SketchUp workspace where you can browse our entire model library, search by category or keyword, and import models instantly. No more downloading files, no more importing manually - just seamless workflow. It works with SketchUp 2020-2025 and is super lightweight. Want to know more about specific features?";
      }
    } else if (lowerMessage.includes('download')) {
      return "Downloading SketchShaper is quick and secure! 🔒 You have two options: our free version to test the waters, or the full Pro experience for $10/month. Just visit the Pro page and click the download button. The file is a standard .rbz extension file that SketchUp recognizes immediately. Installation takes under 5 minutes, and you'll be up and running. Plus, we track downloads to ensure you always get the latest version. Ready to enhance your SketchUp workflow?";
    } else if (lowerMessage.includes('model') || lowerMessage.includes('models')) {
      if (lowerMessage.includes('what') || lowerMessage.includes('kind')) {
        return "Our model library is incredible! 🏠 We've got everything from furniture and lighting to architectural elements and decor. Think IKEA, Wayfair, Crate & Barrel - all the brands designers love. Categories include living room, bedroom, kitchen, office, outdoor, and so much more. Each model is optimized for SketchUp with proper materials and components. Pro users get access to the entire premium library, and we add 100+ new models monthly. What type of models are you most interested in?";
      } else {
        return "With over 1500+ models and growing, you'll never run out of options! 🎯 Our library covers 15+ categories: furniture, lighting, decor, architectural elements, appliances, and more. All models are SketchUp-ready with proper materials, components, and layer organization. Pro users unlock premium brands like IKEA and Wayfair, plus get custom model requests. We're constantly adding new content too - about 100+ models monthly. What specific category are you working with right now?";
      }
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return "Our pricing is designed to be accessible for everyone! 💰 SketchShaper Pro is just $10/month - that's it. No hidden fees, no tiered pricing, no complications. For less than the cost of a single premium model elsewhere, you get unlimited access to our entire library. We also offer a free version so you can test the functionality before committing. Think about it: $10 saves you hours of searching and modeling time each month. That's a fantastic ROI for any designer. Would you like to compare features between free and Pro?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help you succeed with SketchShaper! 🤝 I can assist you with:\n\n🎯 **Getting Started**: Extension installation, account setup, basic navigation\n🚀 **Features**: Pro benefits, model browsing, importing techniques\n💡 **Best Practices**: Workflow optimization, model organization, tips & tricks\n🔧 **Technical**: Compatibility issues, troubleshooting, performance\n💰 **Billing**: Subscriptions, payments, account management\n\nWhat specific challenge are you facing, or what would you like to accomplish today? The more details you give me, the better I can help!";
    } else if (lowerMessage.includes('free') || lowerMessage.includes('trial')) {
      return "Yes, we offer a free version! 🎉 It's perfect for testing the waters and understanding how SketchShaper works. The free version includes basic functionality so you can experience the seamless integration with SketchUp. While it has limited models compared to Pro, you'll still get the core experience of importing models directly into your projects. Many users start with free to get comfortable, then upgrade to Pro for the full premium library. No credit card required for the free version - just download and start creating!";
    } else if (lowerMessage.includes('compatib') || lowerMessage.includes('version') || lowerMessage.includes('sketchup')) {
      return "Great question about compatibility! 🔄 SketchShaper works seamlessly with SketchUp versions 2020 through 2025, including both Pro and Make editions. Our extension is built to be lightweight and won't slow down your SketchUp performance. We regularly update to ensure compatibility with the latest SketchUp releases. Whether you're on Windows or Mac, you're all set. The extension uses standard SketchUp API, so it integrates perfectly without conflicts. What SketchUp version are you currently using?";
    } else {
      return "That's an interesting question! 🤔 While I'm specifically designed to help with SketchShaper, I want to make sure I give you the most helpful response possible. Could you tell me a bit more about what you're trying to accomplish? Are you looking to:\n\n• Get started with SketchShaper?\n• Solve a specific modeling challenge?\n• Understand our features better?\n• Compare with other tools?\n\nThe more context you share, the better I can assist you. I'm here to make your 3D modeling journey smoother!";
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateBotResponse(inputMessage),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <IoChatbubbleEllipses className="text-2xl" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <IoChatbubbleEllipses className="text-white text-xl mr-2" />
              <h3 className="text-white font-semibold">SketchShaper Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 border border-gray-700 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ''}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
              >
                <IoSend className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
