

let final_transcript = '' //頁面內容
let turn_state = false //開啟
let speech_pause = false //暫停

// 重新開始遊戲
function again() {
    $("#main").css('display', 'block');
    $("#introduction_chinese").css('display', 'none');
    $("#introduction_english").css('display', 'none');
    $("#introduction_portuguese").css('display', 'none');
    $("#pin_code").css('display', 'none');
    $("#emotion_recognition").css('display', 'none');
    $("#emotion_recognition_result").css('display', 'none');
    $("#end_card").css('display', 'none');

    clearInterval(window.languageCarTimer) // 清除語言頁面倒計時
    clearInterval(window.endCarTimer) // 清除結束頁面倒計時

    final_transcript = '' // 重置顯示的內容
    $("#emotion_recognition_p").text('')

    $("#emotion_recognition_button button").css('border-color', 'black')//按鈕邊框顏色初始化
}

// 選擇語言
function language_game(number) {
    chinese = document.getElementById('introduction_chinese')
    english = document.getElementById('introduction_english')
    portuguese = document.getElementById('introduction_portuguese')
    switch (parseInt(number)) {
        case 1:
            chinese.style.display = 'block'
            english.style.display = 'none'
            portuguese.style.display = 'none'
            break;
        case 2:
            chinese.style.display = 'none'
            english.style.display = 'block'
            portuguese.style.display = 'none'
            break;
        case 3:
            chinese.style.display = 'none'
            english.style.display = 'none'
            portuguese.style.display = 'block'
            break;
    }

    // 語言頁面倒計時
    window.languageCarNum = 60
    $('.introduction_start').text(`開始（${window.languageCarNum}）`)
    window.languageCarTimer = setInterval(() => {
        window.languageCarNum -= 1
        $('.introduction_start').text(`開始（${window.languageCarNum}）`)
        if (window.languageCarNum <= 0) {
            again()
        }
    }, 1000)
}

function language_start() {
    $("#pin_code").css("display", "block")
    clearInterval(window.languageCarTimer) //清除語言頁面倒計時
}

function pin_code_start() {
    $("#emotion_recognition").css("display", "block")



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

function emotion_recognition_next() {
    $("#emotion_recognition_result").css("display", "block")

    // 倒計時 
    window.emotionRecognitionResultnNum = 10
    $('#emotion_recognition_result_titile').text(`情緒結果（${window.emotionRecognitionResultnNum}）`)
    window.emotionRecognitionResultnNumTimer = setInterval(() => {
        window.emotionRecognitionResultnNum -= 1
        $('#emotion_recognition_result_titile').text(`情緒結果（${window.emotionRecognitionResultnNum}）`)
        if (window.emotionRecognitionResultnNum <= 0) {
            clearInterval(window.emotionRecognitionResultnNumTimer) // 清除倒計時
            emotion_recognition_result_next()
        }
    }, 1000)
}


// 進入到結束頁面
function emotion_recognition_result_next() {
    $("#end_card").css("display", "block")
    // 結束頁面倒計時
    window.endCarNum = 10
    $('#endButton').text(`再來！（${window.endCarNum}）`)
    window.endCarTimer = setInterval(() => {
        window.endCarNum -= 1
        $('#endButton').text(`再來！（${window.endCarNum}）`)
        if (window.endCarNum <= 0) {
            again()
        }
    }, 1000)
}

function speechStart() {
    activeButton(1)//按鈕變色
    // 需要vpn和chrome的，目前只支持chrome
    window.recognition = new webkitSpeechRecognition()
    recognition.lang = 'cmn-Hans-CN'
    recognition.continuous = true; // 配置设置以使每次识别都返回连续结果
    recognition.interimResults = true;// 配置应返回临时结果的设置
    recognition.start()

    recognition.onstart = function () {
        turn_state = true
    };

    recognition.onresult = function (event) { //每次說話，把準確率最高的那個顯示在頁面上
        // 第幾次說話便從第幾次追加內容
        if (!speech_pause) {
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += final_transcript?.length ? `，${event.results[i][0].transcript}` : event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
        }

        final_transcript = capitalize(final_transcript);
        $("#emotion_recognition_p").text(final_transcript)
    }

    recognition.onend = function () { //語音結束時觸發
        if (turn_state) {
            recognition.start();
        } else {
            recognition.stop();
        }
    };

    recognition.onerror = function (event) {
        console.log('onerror', event.message);
    }

}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function (m) { return m.toUpperCase(); });
}

// 暫停
function speechPause() {
    activeButton(2)//按鈕變色
    // 暫停設置及內容
    if (window.recognition) speech_pause = true
}

// 繼續
function speechContinue() {
    activeButton(3)//按鈕變色
    // 暫停設置及內容
    if (window.recognition) speech_pause = false
}

//重置 
function speechReset() {
    activeButton(4)//按鈕變色
    // 內容清空
    final_transcript = ''
    $("#emotion_recognition_p").text('')
}

//結束 
function speechEnd() {
    activeButton(5)//按鈕變色
    // 內容清空
    final_transcript = ''
    $("#emotion_recognition_p").text('')
    // 停止錄音 錄音有的話
    if (turn_state) {
        turn_state = false;
        window.recognition.stop();
    }

}

function activeButton(num) {
    $("#emotion_recognition_button button").css('border-color', 'black')
    $(`#emotion_recognition_button button:eq(${num - 1})`).css('border-color', 'red')
}
