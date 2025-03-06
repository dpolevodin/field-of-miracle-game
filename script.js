/** Текущий номер вопроса */
let CURRENT_ANSWER_NUMBER = 0
let ANSWERS_COUNT = QUESTIONS?.length

// надписи и цвета на секторах
const prizes = [
    {
      text: "650",
      color: "white",
    },
    { 
      text: "850",
      color: "black",
    },
    { 
      text: "700",
      color: "white",
    },
    {
      text: "750",
      color: "black",
    },
    {
      text: "950",
      color: "white",
    },
    {
      text: "800",
      color: "black",
    },
    {
      text: "900",
      color: "white",
    },
    {
      text: "1000",
      color: "black",
    },
    {
        text: "650",
        color: "white",
      },
      { 
        text: "850",
        color: "black",
      },
      { 
        text: "700",
        color: "white",
      },
      {
        text: "750",
        color: "black",
      },
      {
        text: "950",
        color: "white",
      },
      {
        text: "800",
        color: "black",
      },
      {
        text: "900",
        color: "white",
      },
      {
        text: "Приз",
        color: "deepPink",
      }
  ];

/** Запуск сессии игры */
function createGameSession(){
    // создаём переменные для быстрого доступа ко всем объектам на странице — блоку в целом, колесу, кнопке и язычку
    const wheel = document.querySelector(".deal-wheel");
    const spinner = wheel.querySelector(".spinner");
    const trigger = wheel.querySelector(".btn-spin");
    const ticker = wheel.querySelector(".ticker");

    // на сколько секторов нарезаем круг
    const prizeSlice = 360 / prizes.length;
    // на какое расстояние смещаем сектора друг относительно друга
    const prizeOffset = Math.floor(180 / prizes.length);
    // прописываем CSS-классы, которые будем добавлять и убирать из стилей
    const spinClass = "is-spinning";
    const selectedClass = "selected";
    // получаем все значения параметров стилей у секторов
    const spinnerStyles = window.getComputedStyle(spinner);

    // переменная для анимации
    let tickerAnim;
    // угол вращения
    let rotation = 0;
    // текущий сектор
    let currentSlice = 0;
    // переменная для текстовых подписей
    let prizeNodes;

    // расставляем текст по секторам
    const createPrizeNodes = () => {
        // обрабатываем каждую подпись
        prizes.forEach(({ text, color, reaction }, i) => {
            // каждой из них назначаем свой угол поворота
            const rotation = ((prizeSlice * i) * -1) - prizeOffset;
            // добавляем код с размещением текста на страницу в конец блока spinner
            spinner.insertAdjacentHTML(
                    "beforeend",
                    // текст при этом уже оформлен нужными стилями
                    `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
          <span class="text">${text}</span>
        </li>`
            );
        });
    };

    // рисуем разноцветные секторы
    const createConicGradient = () => {
        // устанавливаем нужное значение стиля у элемента spinner
        spinner.setAttribute(
                "style",
                `background: conic-gradient(
        from -90deg,
        ${prizes
                        // получаем цвет текущего сектора
                        .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
                        .reverse()
                }
      );`
        );
    };

    // создаём функцию, которая нарисует колесо в сборе
    const setupWheel = () => {
        // сначала секторы
        createConicGradient();
        // потом текст
        createPrizeNodes();
        // а потом мы получим список всех призов на странице, чтобы работать с ними как с объектами
        prizeNodes = wheel.querySelectorAll(".prize");
    };

    // определяем количество оборотов, которое сделает наше колесо
    const spinertia = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // функция запуска вращения с плавной остановкой
    const runTickerAnimation = () => {
        // взяли код анимации отсюда: https://css-tricks.com/get-value-of-css-rotation-through-javascript/
        const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
        const a = values[0];
        const b = values[1];
        let rad = Math.atan2(b, a);

        if (rad < 0) rad += (2 * Math.PI);

        const angle = Math.round(rad * (180 / Math.PI));
        const slice = Math.floor(angle / prizeSlice);

        // анимация язычка, когда его задевает колесо при вращении
        // если появился новый сектор
        if (currentSlice !== slice) {
            // убираем анимацию язычка
            ticker.style.animation = "none";
            // и через 10 миллисекунд отменяем это, чтобы он вернулся в первоначальное положение
            setTimeout(() => ticker.style.animation = null, 10);
            // после того, как язычок прошёл сектор - делаем его текущим
            currentSlice = slice;
        }
        // запускаем анимацию
        tickerAnim = requestAnimationFrame(runTickerAnimation);
    };

    // функция выбора призового сектора
    const selectPrize = () => {
        const selected = Math.floor(rotation / prizeSlice);
        prizeNodes[selected].classList.add(selectedClass);
    };

    // отслеживаем нажатие на кнопку
    trigger.addEventListener("click", () => {
        const runWheelVoice = document.getElementById('baraban-spin')
        runWheelVoice.play()
        // делаем её недоступной для нажатия
        trigger.disabled = true;
        // задаём начальное вращение колеса
        rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
        // убираем прошлый приз
        prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
        // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
        wheel.classList.add(spinClass);
        // через CSS говорим секторам, как им повернуться
        spinner.style.setProperty("--rotate", rotation);
        // возвращаем язычок в горизонтальную позицию
        ticker.style.animation = "none";
        // запускаем анимацию вращение
        runTickerAnimation();
    });

    // отслеживаем, когда закончилась анимация вращения колеса
    spinner.addEventListener("transitionend", () => {
        // останавливаем отрисовку вращения
        cancelAnimationFrame(tickerAnim);
        // получаем текущее значение поворота колеса
        rotation %= 360;
        // выбираем приз
        selectPrize();
        // убираем класс, который отвечает за вращение
        wheel.classList.remove(spinClass);
        // отправляем в CSS новое положение поворота колеса
        spinner.style.setProperty("--rotate", rotation);
        // делаем кнопку снова активной
        trigger.disabled = false;
    });

    // подготавливаем всё к первому запуску
    setupWheel();

    // Получаем контейнер для кнопок
    const buttonsContainer = document.getElementById("buttons-container");
    buttonsContainer.innerHTML = ''

    /** звук неправильной буквы */
    const letterWrongAudio = document.getElementById("letter-wrong")
    /** звук правильной буквы  */
    const letterCorrectAudio = document.getElementById("letter-correct")

// Массив русских букв
    const russianAlphabet = [
        "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И",
        "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т",
        "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь",
        "Э", "Ю", "Я"
    ];

// Добавление кнопок в контейнер
    russianAlphabet.forEach((letter) => {
        const button = createButton(letter);
        buttonsContainer.appendChild(button);
    });

    /** Вопрос с ответом для использования в качестве контента на основе текущего вопроса */
    const { question, answer } = QUESTIONS[CURRENT_ANSWER_NUMBER]

    /** Получаем контейнер для букв */
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = ''

    /** Записываем вопрос в контейнер */
    const questionContainer = document.getElementById("question-container");
    questionContainer.textContent = question

    /** Создаем пустые input на каждый символ ответа или заполняем по условию значением */
    function createWordsInput(letter) {
        const textarea = document.createElement("input");
        textarea.name = letter.toUpperCase();
        return textarea;
    }

    function createWordsInputWithValue(letter) {
        const textarea = document.createElement("input");
        textarea.value = letter.toUpperCase();
        return textarea;
    }

    /** Добавление input для букв в контейнер */
    function createFieldsForAnswer(answerData) {
        const questionNumberLabel = document.getElementById("question-number-label")
        questionNumberLabel.innerText = `Вопрос №${CURRENT_ANSWER_NUMBER + 1}`;
        answerData.split('').forEach((letter) => {
            const inputs = createWordsInput(letter);
            wordContainer.appendChild(inputs);
        });
    }

    /** Функция для создания кнопки */
    function createButton(letter) {
        const button = document.createElement("button");
        button.textContent = letter;
        button.addEventListener("click", () => {
            if (answer.toUpperCase().includes(letter)) {
                document.getElementsByName(letter.toUpperCase()).forEach((element) => {
                    element.value = letter;
                })
                letterCorrectAudio.play()
            } else {
                letterWrongAudio.play()
            }
            const wordContainerChildNodes = [...wordContainer.childNodes]
            if (wordContainerChildNodes.every(node => !!node.value)) {
                wordContainerChildNodes.forEach(node => node.className = 'input_glow')
            }
        });
        return button;
    }

    const showAnswerButton = document.getElementById("show-answer-button");
    showAnswerButton.addEventListener("click", () => {
        const wordContainerChildNodes = [...wordContainer.childNodes]
        wordContainerChildNodes.forEach(node => {
            const { name } = node
            node.value = name
            wordContainerChildNodes.forEach(node => node.className = 'input_glow')
        })
    })

    createFieldsForAnswer(answer)

    /** Плавающие кнопки для звкуков из игры */
    const floatButtons = document.getElementsByClassName('float-button')
    /** Элементы запуска звуков */
    const floatButtonsAudio = document.getElementsByClassName('float-audio');

    /** Автомобиль */
    floatButtons[0].addEventListener('click', () => {
        floatButtonsAudio[0].play()
    })

    /** Все ваше */
    floatButtons[1].addEventListener('click', () => {
        floatButtonsAudio[1].play()
    })

    /** Сектор приз */
    floatButtons[2].addEventListener('click', () => {
        floatButtonsAudio[2].play()
    })
}

// createGameSession()
/** Запуск игры */
const gameContainer = document.getElementById("game-container");
const startGameAudio = document.getElementById("start-game");


const startButton = document.getElementById('start-button');
startButton.addEventListener("click", () => {
    createGameSession()
    startGameAudio.play()
    startButton.style.display = "none";
    gameContainer.style.display = "flex";

    const yakubovichImage = document.getElementById('yakubovich')
    yakubovichImage.style.bottom = '-60px'
    console.log(yakubovichImage, 'yakubovichImage')
})

/** Переключение вопросов */
const nextQuestionButton = document.getElementById("next-question-button");
nextQuestionButton.addEventListener("click", () => {
    if (CURRENT_ANSWER_NUMBER < ANSWERS_COUNT - 1) {
        CURRENT_ANSWER_NUMBER = CURRENT_ANSWER_NUMBER + 1
        createGameSession()
    }
})


