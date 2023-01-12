let final_transcript = ""; //頁面內容
let turn_state = false; //開啟
let speech_pause = false; //暫停

let recognition;

// 請求host
// const PYTHON_HOST = "http://127.0.0.1:4320";
const PYTHON_HOST = "https://pythonscriptserver.region.mo";

// 重新開始遊戲
https: function again() {
  window.location.reload();
}

// 選擇語言
function language_game(number) {
  chinese = document.getElementById("introduction_chinese");
  english = document.getElementById("introduction_english");
  portuguese = document.getElementById("introduction_portuguese");
  main = document.getElementById("main");
  switch (parseInt(number)) {
    case 1:
      chinese.style.display = "block";
      english.style.display = "none";
      portuguese.style.display = "none";
      main.style.display = "none";
      break;
    case 2:
      chinese.style.display = "none";
      english.style.display = "block";
      portuguese.style.display = "none";
      main.style.display = "none";
      break;
    case 3:
      chinese.style.display = "none";
      english.style.display = "none";
      portuguese.style.display = "block";
      main.style.display = "none";
      break;
  }

  // 語言頁面倒計時
  window.languageCarNum = 60;
  $(".introduction_start").text(`開始（${window.languageCarNum}）`);
  window.languageCarTimer = setInterval(() => {
    window.languageCarNum -= 1;
    $(".introduction_start").text(`開始（${window.languageCarNum}）`);
    if (window.languageCarNum <= 0) {
      again();
    }
  }, 1000);
}

function language_start(language) {
  // $("#pinInputPage").removeClass("hidden");
  $(`#emotion_recognition`).css("display", "block");
  $(`#introduction_${language}`).css("display", "none");
  clearInterval(window.languageCarTimer); //清除語言頁面倒計時
}

function pin_code_start() {
  $("#emotion_recognition").css("display", "block");
  $("#pinInputPage").addClass("hidden");

  // 倒計時
  // window.emotionRecognitionNum = 10
  // $('#emotion_recognition_title').text(`情緒識別（${window.emotionRecognitionNum}）`)
  // window.emotionRecognitionTimer = setInterval(() => {
  //     window.emotionRecognitionNum -= 1
  //     $('#emotion_recognition_title').text(`情緒識別（${window.emotionRecognitionNum}）`)
  //     if (window.emotionRecognitionNum <= 0) {
  //         clearInterval(window.emotionRecognitionTimer) // 清除倒計時
  //         emotion_recognition_next()
  //     }
  // }, 1000)
}

// $("#emotion_recognition_p").change(async () => {
//   const data = $("#emotion_recognition_p").text();
//   let result = await fetch(`${HOST}/?str=${data}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((res) => res.json());

//   if (result) {
//     console.log(result);
//     $("#sentiments").text(`sentiments: ${result.result2.sentiments}`);
//     $("#emotion_recognition_p").text("");
//   } else {
//     console.log("識別不了");
//   }
// });

// async function emotion_recognition_just() {
//   const data = $("#emotion_recognition_p").text();
//   console.log(data);
//   let result = await fetch(`${HOST}/?str=${data}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((res) => res.json());

//   if (result) {
//     console.log(result);
//     $("#sentiments").text(`sentiments: ${result.result2.sentiments}`);
//     $("#emotion_recognition_p").text("");
//   } else {
//     console.log("識別不了");
//   }
// }

async function emotion_recognition_next() {
  // 上傳分數
  // try {
  //   const body = {
  //     score: 100,
  //     pin: pinInput,
  //     itemName: GAME_NAME,
  //   };

  //   const result = await fetch(`${HOST}/api/score/create`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(body),
  //   }).then((res) => res.json());
  // } catch (error) {
  //   console.error("發生錯誤:", error);
  // }

  $("#emotion_recognition").css("display", "none");
  $("#emotion_recognition_result").css("display", "block");
  $("#Happy_num").text(Happy_num);
  $("#Emotion_num").text(Emotion_num);
  $("#Angry_num").text(Angry_num);

  // 倒計時
  window.emotionRecognitionResultnNum = 10;
  $("#emotion_recognition_result_titile").text(
    `情緒結果（${window.emotionRecognitionResultnNum}）`
  );
  window.emotionRecognitionResultnNumTimer = setInterval(() => {
    window.emotionRecognitionResultnNum -= 1;
    $("#emotion_recognition_result_titile").text(
      `情緒結果（${String(window.emotionRecognitionResultnNum).padStart(
        2,
        "0"
      )}）`
    );
    if (window.emotionRecognitionResultnNum <= 0) {
      clearInterval(window.emotionRecognitionResultnNumTimer); // 清除倒計時
      // emotion_recognition_result_next();
      $("#emotion_recognition_result").css("display", "none");
      $("#main").css("display", "block");
    }
  }, 1000);
}

// const getAllScores = async () => {
//   try {
//     const data = await fetch(`${HOST}/api/user/all_scores?pin=${pinInput}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }).then((res) => res.json());

//     if (data.error) {
//       throw new Error(data.error);
//     } else {
//       data.forEach((item) => {
//         scoresData.push({
//           id: item.id,
//           itemName: item.itemName,
//           score: item.score,
//         });
//       });

//       // 基于准备好的dom，初始化echarts实例
//       $("#eChartsMain").ready(() => {
//         const myChart = echarts.init(document.getElementById("eChartsMain"));

//         // 指定图表的配置项和数据
//         const option = {
//           title: {
//             text: "遊戲得分圖",
//           },
//           radar: {
//             indicator: items.map((item) => {
//               return {
//                 name: item,
//                 max: 100,
//               };
//             }),
//           },
//           series: [
//             {
//               // name: "得分",
//               type: "radar",
//               data: [
//                 {
//                   value: items.map((item) => {
//                     const scores = scoresData.filter((s) => {
//                       return s.itemName === item;
//                     });
//                     const score = _.maxBy(scores, "score");

//                     return score?.score || 0;
//                   }),
//                   name: "各項遊戲得分得分",
//                 },
//               ],
//             },
//           ],
//         };

//         // 使用刚指定的配置项和数据显示图表。
//         myChart.setOption(option);
//       });
//     }
//   } catch (error) {
//     console.error("發生錯誤:", error);
//   }
// };

// 進入到結束頁面
function emotion_recognition_result_next() {
  getAllScores();
  $("#pinShowPage").removeClass("hidden");
  $("#showPinLabel").text(pinInput);
  $("#emotion_recognition_result").css("display", "none");
  // 結束頁面倒計時
  window.endCarNum = 10;
  $("#endButton").text(`再來！（${window.endCarNum}）`);
  window.endCarTimer = setInterval(() => {
    window.endCarNum -= 1;
    $("#endButton").text(`再來！（${window.endCarNum}）`);
    if (window.endCarNum <= 0) {
      again();
    }
  }, 1000);
}

function speechStart() {
  activeButton(1); //按鈕變色
  if (window.recognition) speech_pause = false;
  // 需要vpn和chrome的，目前只支持chrome
  window.recognition = recognition = new webkitSpeechRecognition();
  recognition.lang = "cmn-Hans-CN";
  recognition.continuous = true; // 配置设置以使每次识别都返回连续结果
  recognition.interimResults = true; // 配置应返回临时结果的设置
  recognition.start();

  recognition.onstart = function () {
    turn_state = true;
  };

  recognition.onresult = async function (event) {
    //每次說話，把準確率最高的那個顯示在頁面上
    // 第幾次說話便從第幾次追加內容
    var interim_transcript = "";
    let data = "";

    if (!speech_pause) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          $("#angry_true").css("display", "none");
          $("#no_emotion_true").css("display", "none");
          $("#happy_true").css("display", "none");
          $("#sentiments").text(`sentiments: `);
          data = event.results[i][0].transcript;
          $("#emotion_recognition_p").text(data);

          recognition.stop();

          let response = await fetch(`${PYTHON_HOST}/?str=${data}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          let result = await response.json();
          let sentiments = 0;
          if (result) {
            console.log(result);
            sentiments =
              result.response.result2.sentiments || result.result2.sentiments;
            $("#sentiments").text(`sentiments: ${sentiments}`);
            if (sentiments && sentiments < 0.45 && sentiments > 0) {
              $("#angry_true").css("display", "block");
              ++Angry_num;
            }
            if (sentiments && sentiments > 0.66667) {
              $("#happy_true").css("display", "block");
              ++Happy_num;
            }
            if (sentiments && sentiments > 0.45 && sentiments < 0.66667) {
              $("#no_emotion_true").css("display", "block");
              ++Emotion_num;
            }
          } else {
            console.log("識別不了");
          }

          final_transcript += final_transcript?.length
            ? `，${event.results[i][0].transcript}`
            : event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
    }
    final_transcript = capitalize(final_transcript);
  };

  recognition.onend = function () {
    //語音結束時觸發
    if (turn_state) {
      recognition.start();
    } else {
      recognition.stop();
    }
  };

  recognition.onerror = function (event) {
    console.log("onerror", event.message);
  };
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}

// 暫停
function speechPause() {
  activeButton(2); //按鈕變色
  // 暫停設置及內容
  if (window.recognition) speech_pause = true;
}

//重置
function speechReset() {
  activeButton(3); //按鈕變色
  // 內容清空
  final_transcript = "";
  $("#emotion_recognition_p").text("");

  // 暫停設置及內容
  if (window.recognition) speech_pause = true;
}

//結束
function speechEnd() {
  // 內容清空
  final_transcript = "";
  $("#emotion_recognition_p").text("");
  // 停止錄音 錄音有的話
  if (turn_state) {
    turn_state = false;
    window.recognition.stop();
  }
}

function activeButton(num) {
  $("#emotion_recognition_button button").css("border-color", "black");
  $(`#emotion_recognition_button button:eq(${num - 1})`).css(
    "border-color",
    "red"
  );
}
