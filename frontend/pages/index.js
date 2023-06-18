import { useState, useEffect } from "react";
import axios from 'axios';
import TypingAnimation from "../components/TypingAnimation"

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [...prevChatLog, { role: 'user', content: inputValue }])

    sendMessage(inputValue);

    setInputValue('');
  }
  const sendMessage = (message) => {

    var logs = [...chatLog, { role: "user", content: message }]

    // console.info(logs)
    // return




    const data = {
      model: "gpt-3.5-turbo-0301",
      messages: [{ "role": "user", "content": message }]
    };

    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST"
      },
      body: data
    };

    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Access-Control-Allow-Origin", "*");
    // myHeaders.append("Access-Control-Allow-Methods", "POST");

    var raw = {
      // "api_secret_key": "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",
      // "api_secret_key": process.env.OPENAI_API_KEY,
      "messages": logs
    };

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      // redirect: 'follow'
    };

    const url = 'https://api-operaite.onrender.com/chat';
    // const url = 'http://127.0.0.1:4242/chat';
    try {



      // fetch("https://api-operaite.onrender.com/chat", requestOptions)
      // fetch(url, requestOptions)
      //   .then(response => response.json())
      //   .then((response) => {
      //     console.log(response);
      //     setChatLog((prevChatLog) => [...prevChatLog, { role: 'assistant', content: response.choices[0].message.content }])
      //     setIsLoading(false);
      //   }).catch((error) => {
      //     setIsLoading(false);
      //     console.log(error);
      //   })

      axios.post(url, raw).then((response) => {
        console.log(response);
        // return
        // setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.choices[0].message.content }])
        setChatLog((prevChatLog) => [...prevChatLog, { role: 'assistant', content: response.data.choices[0].message.content }])

        setIsLoading(false);
      }).catch((error) => {
        setIsLoading(false);
        console.log(error);
      })
    }
    catch {
    }
  }

  return (
    <div className="container mx-auto max-w-[700px] overflow-y-auto">
      <div className="flex flex-col h-screen bg-gray-900">
        <h1 className="sticky top-0 bg-gradient-to-r from-white to-cyan-300 text-transparent bg-clip-text text-center pt-1 pb-5 font-bold text-6xl">Oper<span className="text-white">AI</span>te</h1>
        <div className="flex-grow p-6 bg-gray-900 chat-wrapper">
          {/* <h1>key {process.env.OPENAI_API_KEY}</h1> */}
          <div className="flex flex-col space-y-4 ">
            {
              chatLog.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                  <div className={`${message.role === 'user' ? 'bg-gray-200' : 'bg-gray-500'
                    } rounded-xl p-4 text-black max-w-sm`}>
                    {message.content}
                  </div>
                </div>
              ))
            }
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                  <TypingAnimation />
                </div>
              </div>
            }

          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-4">
          <div contentEditable className="flex rounded-lg items-end border border-gray-700 bg-gray-700 py-1 px-1 typing-container">
            <textarea
              name="text"
              rows="1"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="flex-grow px-4 py-3 bg-transparent text-white focus:outline-none chat-input"
              placeholder="Ask me..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            ></textarea>
            {/* <button type="submit" className="bg-gray-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-black transition-colors duration-300">send</button> */}
            <div className="">
              {
                isLoading ?

                  <div className="typing-indicator flex rounded-lg px-3 py-3 items-center justify-center">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                  :
                  <button
                  disabled={inputValue.length<3}
                    type="submit"
                    className={`flex items-center justify-center bg-gray-500 rounded-lg px-3 py-3  text-white font-semibold focus:outline-none hover:bg-black transition-colors duration-300 ${inputValue.length <3 && "hover:bg-gray-500 disabled"}`}
                  >
                    <svg class="svg-icon" viewBox="0 0 20 20" fill="white">
                      <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
                    </svg>
                  </button>
              }
            </div>


          </div>
          

        </form>
      </div>
    </div>
  )
}


