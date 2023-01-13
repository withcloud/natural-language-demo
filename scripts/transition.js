let final_transcript = ""; //頁面內容
let turn_state = false; //開啟
let speech_pause = false; //暫停
let speech_start_status = false; //狀態

let diff_lang_number = 0;
let diff_lang_prompt = {
  buttonNextPage: ["下一頁", "Next Page", "Próxima Página"],
  toastTitle: ["成功", "Success", "Sucesso"],
  positiveEmotions: ["積極", "Positive", "Positivo"],
  naturalEmotions: ["自然", "Natural", "Natureza"],
  negativeEmotions: ["消極", "Negative", "Negativo"],

  recognitionPageButtonStart: [
    "開始錄音",
    "Start Recording",
    "Comece a gravar",
  ],
  recognitionPageButtonStartSuccess: ["已開始", "Started", "Começado"],
  recognitionPageButtonStop: ["停止錄音", "Stop Recording", "Pare de gravar"],
  recognitionPageTitle: [
    "情緒識別",
    "Emotion Recognition",
    "Reconhecimento De Emoção",
  ],
  recognitionPageSpeakLangTips: [
    "請講廣東話",
    "Please speak Cantonese",
    "Por favor, fale cantonês",
  ],
  recognitionError: [
    "獲取不到收音設備，請檢查",
    "The radio device cannot be obtained, please check",
    "O dispositivo de rádio não pode ser obtido, verifique",
  ],
  recognitionSuccess: [
    "成功開啟，請對著收音設備講話。",
    "Successfully turned on, please speak into the radio.",
    "Ligado com sucesso, fale no rádio.",
  ],
  resultPageTitle: ["紀錄結果", "Recorded Results", "Resultados Registrados"],
};

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
      diff_lang_number = 0;
      break;
    case 2:
      chinese.style.display = "none";
      english.style.display = "block";
      portuguese.style.display = "none";
      main.style.display = "none";
      diff_lang_number = 1;
      break;
    case 3:
      chinese.style.display = "none";
      english.style.display = "none";
      portuguese.style.display = "block";
      main.style.display = "none";
      diff_lang_number = 2;
      break;
  }

  change_language_display(diff_lang_number);

  // 語言頁面倒計時
  window.languageCarNum = 60;
  $(".introduction_start").text(
    diff_lang_prompt.buttonNextPage[diff_lang_number] +
      `（${window.languageCarNum}）`
  );
  window.languageCarTimer = setInterval(() => {
    window.languageCarNum -= 1;
    $(".introduction_start").text(
      diff_lang_prompt.buttonNextPage[diff_lang_number] +
        `（${window.languageCarNum}）`
    );
    if (window.languageCarNum <= 0) {
      again();
    }
  }, 1000);
}

// 修改顯示語言文字
function change_language_display(number = 0) {
  if (typeof number !== "number") {
    return;
  }

  // recognition page
  $("#emotion_recognition_title").text(
    diff_lang_prompt.recognitionPageTitle[number]
  );
  // $("#emotion_recognition_speak_lang_tips").text(
  //   diff_lang_prompt.recognitionPageSpeakLangTips[number]
  // );
  $("#emotion_recognition_button_start").text(
    diff_lang_prompt.recognitionPageButtonStart[number]
  );
  $("#emotion_recognition_button_stop").text(
    diff_lang_prompt.recognitionPageButtonStop[number]
  );
  $("#positive_str").text(diff_lang_prompt.positiveEmotions[number]);
  $("#natural_str").text(diff_lang_prompt.naturalEmotions[number]);
  $("#negetive_str").text(diff_lang_prompt.negativeEmotions[number]);
  $("#emotion_recognition_button_nextPage").text(
    diff_lang_prompt.buttonNextPage[number]
  );

  // recognition result page
  $("#emotion_recognition_result_title").text(
    diff_lang_prompt.resultPageTitle[number]
  );
  $("#emotion_recognition_result_positive_str").text(
    diff_lang_prompt.positiveEmotions[number]
  );
  $("#emotion_recognition_result_natural_str").text(
    diff_lang_prompt.naturalEmotions[number]
  );
  $("#emotion_recognition_result_negative_str").text(
    diff_lang_prompt.negativeEmotions[number]
  );
}

function language_start(language) {
  $("#pinInputPage").css("display", "block");
  // $(`#emotion_recognition`).css("display", "block");
  $(`#introduction_${language}`).css("display", "none");
  clearInterval(window.languageCarTimer); //清除語言頁面倒計時
}

function pin_code_start() {
  $("#emotion_recognition").css("display", "block");
  $("#pinInputPage").addClass("hidden");
}

async function emotion_recognition_next() {
  if (window?.recognition) {
    window?.recognition?.stop();
  }
  // 上傳分數
  try {
    const body = {
      score: 100,
      pin: pinInput,
      itemName: GAME_NAME,
    };

    const result = await fetch(`${HOST}/api/score/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());
  } catch (error) {
    console.error("發生錯誤:", error);
  }

  $("#emotion_recognition").css("display", "none");
  $("#pinInputPage").css("display", "none");
  $("#emotion_recognition_result").css("display", "block");
  $("#Happy_num").text(Happy_num);
  $("#Emotion_num").text(Emotion_num);
  $("#Angry_num").text(Angry_num);

  // 倒計時
  window.emotionRecognitionResultnNum = 10;
  $("#emotion_recognition_result_title").text(
    diff_lang_prompt.resultPageTitle[diff_lang_number] +
      `（${window.emotionRecognitionResultnNum}）`
  );
  window.emotionRecognitionResultnNumTimer = setInterval(() => {
    window.emotionRecognitionResultnNum -= 1;
    $("#emotion_recognition_result_title").text(
      diff_lang_prompt.resultPageTitle[diff_lang_number] +
        `（${String(window.emotionRecognitionResultnNum).padStart(2, "0")}）`
    );
    if (window.emotionRecognitionResultnNum <= 0) {
      clearInterval(window.emotionRecognitionResultnNumTimer); // 清除倒計時
      emotion_recognition_result_next();
      $("#emotion_recognition_result").css("display", "none");
      $("#main").css("display", "none");
    }
  }, 1000);
}

const getAllScores = async () => {
  try {
    const data = await fetch(`${HOST}/api/user/all_scores?pin=${pinInput}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (data.error) {
      throw new Error(data.error);
    } else {
      data.forEach((item) => {
        scoresData.push({
          id: item.id,
          itemName: item.itemName,
          score: item.score,
        });
      });

      // 基于准备好的dom，初始化echarts实例
      $("#eChartsMain").ready(() => {
        const myChart = echarts.init(document.getElementById("eChartsMain"));

        // 指定图表的配置项和数据
        const option = {
          title: {
            text: "遊戲得分圖",
          },
          radar: {
            indicator: items.map((item) => {
              return {
                name: item,
                max: 100,
              };
            }),
          },
          series: [
            {
              // name: "得分",
              type: "radar",
              data: [
                {
                  value: items.map((item) => {
                    const scores = scoresData.filter((s) => {
                      return s.itemName === item;
                    });
                    const score = _.maxBy(scores, "score");

                    return score?.score || 0;
                  }),
                  name: "各項遊戲得分得分",
                },
              ],
            },
          ],
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      });
    }
  } catch (error) {
    console.error("發生錯誤:", error);
  }
};

// 進入到結束頁面
function emotion_recognition_result_next() {
  getAllScores();
  $("#pinShowPage").css("display", "block");
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
  try {
    if (window.recognition) speech_pause = false;
    // 需要vpn和chrome的，目前只支持chrome
    window.recognition = recognition = new webkitSpeechRecognition();

    if (!recognition || !window.recognition) {
      $.toast({
        heading: "Error",
        text: diff_lang_prompt.recognitionError[diff_lang_number],
        icon: "error",
        position: "bottom-left",
      });
      return;
    }

    recognition.lang = "yue-Hant-HK";
    recognition.continuous = true; // 配置设置以使每次识别都返回连续结果
    recognition.interimResults = true; // 配置应返回临时结果的设置
    recognition.start();

    recognition.onstart = function () {
      turn_state = true;
      $("#emotion_recognition_button_start").prop("disabled", true);
      $("#emotion_recognition_button_start").text(
        diff_lang_prompt.recognitionPageButtonStartSuccess[diff_lang_number]
      );

      if (!speech_start_status) {
        speech_start_status = true;
        $("#emotion_recognition_button_stop").show();
        $.toast({
          heading: "Success",
          text: diff_lang_prompt.recognitionSuccess[diff_lang_number],
          icon: "success",
          position: "bottom-left",
        });
      }
    };

    recognition.onresult = async function (event) {
      //每次說話，把準確率最高的那個顯示在頁面上
      // 第幾次說話便從第幾次追加內容
      var interim_transcript = "";
      let data = "";

      if (!speech_pause) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            $("#emotion_recognition_negetive_true").css("display", "none");
            $("#emotion_recognition_natural_true").css("display", "none");
            $("#emotion_recognition_positive_true").css("display", "none");
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
              sentiments =
                result.response.result2.sentiments || result.result2.sentiments;
              $("#sentiments").text(`sentiments: ${sentiments}`);
              if (sentiments && sentiments < 0.4 && sentiments > 0) {
                $("#emotion_recognition_negetive_true").css("display", "block");
                ++Angry_num;
              }
              if (sentiments && sentiments > 0.66667) {
                $("#emotion_recognition_positive_true").css("display", "block");
                ++Happy_num;
              }
              if (sentiments && sentiments > 0.4 && sentiments < 0.66667) {
                $("#emotion_recognition_natural_true").css("display", "block");
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
      // 語音結束時觸發;
      if (turn_state) {
        recognition.start();
      } else {
        recognition.stop();
      }
    };

    recognition.onerror = function (event) {
      console.log("onerror", event.message);
    };
  } catch (error) {}
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}

//停止
function speechStop() {
  // 內容清空
  final_transcript = "";
  speech_start_status = false;
  turn_state = false;
  $("#emotion_recognition_p").text("");
  $("#emotion_recognition_button_start").prop("disabled", false);
  $("#emotion_recognition_button_start").text(
    diff_lang_prompt.recognitionPageButtonStart[diff_lang_number]
  );
  $("#emotion_recognition_button_stop").hide();

  // 暫停設置及內容
  if (window.recognition) {
    window.recognition?.stop();
    window.recognition = null;
  }
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
