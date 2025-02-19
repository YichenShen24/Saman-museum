// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import WordCloud from "../components/WordCloud";

// const socket = io(`${import.meta.env.VITE_API_BASE_URL}`);

// const Survey = () => {
//   const [feedback, setFeedback] = useState("");
//   const [keywords, setKeywords] = useState({});

//   useEffect(() => {
//     console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

//     // Listen for updates from the server
//     socket.on("updateWordCloud", (data) => {
//       setKeywords(data);
//     });

//     return () => {
//       socket.off("updateWordCloud");
//     };
//   }, []);

//   const handleSubmit = async () => {
//     try {
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/survey`, {
//         feedback,
//       });
//       setFeedback(""); // Clear input after submission
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
//       <h1 className="text-4xl font-bold text-blue-900 mb-8">Live Word Cloud</h1>
//       <div className="w-4/5 lg:w-2/3 p-6 bg-white shadow-lg rounded-lg">
//         <textarea
//           className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Share your thoughts on sex education..."
//           value={feedback}
//           onChange={(e) => setFeedback(e.target.value)}
//         />
//         <button
//           onClick={handleSubmit}
//           className={`mt-4 px-6 py-2 rounded-lg font-bold ${
//             feedback.trim()
//               ? "bg-blue-600 text-white hover:bg-blue-700"
//               : "bg-gray-400 text-gray-700 cursor-not-allowed"
//           }`}
//           disabled={!feedback.trim()}
//         >
//           Submit
//         </button>
//       </div>
//       <div className="mt-8">{<WordCloud data={keywords} />}</div>
//     </div>
//   );
// };

// export default Survey;

import React from "react";
import WordCloud from "../components/WordCloud"; // 引入词云组件

const Survey = () => {
  // ✅ 直接定义静态数据
  const keywords = {
    交流: 1,
    侵略: 1,
    权力: 1,
    冲动: 1,
    幻想: 1,
    满足: 1,
    液体: 1,
    繁衍: 1,
    累: 1,
    平等: 1,
    自由: 1,
    压抑: 1,
    爱: 1,
    舒服: 1,
    害羞: 1,
    Desire: 1,
    Love: 1,
    Danger: 1,
    Inexperience: 1,
    Curious: 1,
    Wary: 1,
    爱情: 1,
    男女: 1,
    繁育: 1,
    兴奋: 1,
    运动: 1,
    高潮: 1,
    激情: 1,
    理智: 1,
    love: 1,
    Family: 1,
    Happy: 1,
    Intimacy: 1,
    Caring: 1,
    connection: 1,
    "爽！！！": 1,
    避孕: 1,
    前戏: 1,
    "after care": 1,
    passion: 1,
    excitement: 1,
    empty: 1,
    身体: 1,
    目的性: 1,
    education: 1,
    flying: 1,
    human: 1,
    探索: 1,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">
        Current Word Cloud
      </h1>
      <div className="mt-8">
        {/* ✅ 直接传递静态数据 */}
        <WordCloud data={keywords} />
      </div>
    </div>
  );
};

export default Survey;
