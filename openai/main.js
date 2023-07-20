import { Configuration, OpenAIApi } from "https://cdn.skypack.dev/openai";
const $ = (el) => document.querySelector(el);
const uu = document.querySelector("#aoa")
const store = {
  texts: "",
  isRecognizing: true,
};

(() => {
  /* Speech API start */
  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!("webkitSpeechRecognition" in window)) {
    alert("지원 안되는 브라우저 입니다.");
  } else {
    const recognition = new SpeechRecognition();
    recognition.interimResults = true; // true면 음절을 연속적으로 인식하나 false면 한 음절만 기록함
    recognition.lang = "en-US"; // 값이 없으면 HTML의 <html lang="en">을 참고합니다. ko-KR, en-US
    recognition.continuous = false; //각 인식에 대해 연속 결과가 반환되는지 아니면 단일 결과만 반환되는지를 제어합니다. 기본값은 단일( false.)
    recognition.maxAlternatives = 20000; // maxAlternatives가 숫자가 작을수록 발음대로 적고, 크면 문장의 적합도에 따라 알맞은 단어로 대체합니다.

    recognition.onspeechend = function () {
      // 음성 감지가 끝날때 실행될 이벤트
      recognition.stop();
      $(".dictate").classList.remove("on");
      aa.textContent = "active";
      store.isRecognizing = true;
      uu.value = "Waiting for AI response..."
      openai();
    };

    recognition.onresult = function (e) {
      //result이벤트는 음성 인식 서비스가 결과를 반환할 때 시작됩니다.
      store.texts = Array.from(e.results)
        .map((results) => results[0].transcript)
        .join("");

      console.log(store.texts);
      $("input").value = store.texts;
    };

    /* // Speech API END */

    const aa = document.querySelector(".dictate");

    const active = () => {
      $(".dictate").classList.add("on");
      recognition.start();
      store.isRecognizing = false;
      aa.textContent = "unactive";
    };

    const unactive = () => {
      $(".dictate").classList.remove("on");
      recognition.stop();
      store.isRecognizing = true;
      aa.textContent = "active";
    };

    $(".dictate").addEventListener("click", () => {
      if (store.isRecognizing) {
        active();
      } else {
        unactive();
      }
    });
  }
})();
// openai api key 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
function openai() {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const bb = document.querySelector("#aoa");
  const response = openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: store.texts,
      temperature: 0.8,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((result) => {
      console.log(result.data.choices[0].text);
      bb.value = '';
      bb.value += result.data.choices[0].text;
      console.log(response);
      
    });
}
