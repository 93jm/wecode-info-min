//시간 난이도 조절을 위해 기본값 설정
const GAME_TIME = 5;

let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];
// --------
const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.word-button');


init();
function init(){
    buttonChange('게임 로딩중...');
    getWords()
    wordInput.addEventListener('input', checkMatch);
}

//게임 실행

function run(){
    //게임중일때는 return을 줘버려 버튼을 재 눌러도 시간에 영향을 안줌
    if(isPlaying){
        return;
    }
    isPlaying = true;
    time = GAME_TIME;
    wordInput.focus();
    scoreDisplay.innerText= 0;
    timeInterval = setInterval(countDown,1000);
    checkInterval = setInterval(checkStauts, 50);
    buttonChange('게 임 중');
}

function checkStauts(){
    if(!isPlaying && time === 0){
        buttonChange('게 임 시 작')
        clearInterval(checkInterval)
    }
}


//단어 불러오기
function getWords(){
    axios.get('https://random-word-api.herokuapp.com/word?number=100')
        .then(function (response) {
            response.data.forEach((word) => {
                
                if(word.length < 10 ){
                    words.push(word);
                }
            })
            console.log(words);
            buttonChange('게 임 시 작');
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    
}


//단어 일치 체크하기
function checkMatch(){
    if(wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()){
        wordInput.value = "";
        if(!isPlaying){
            return;
        }
        //위에 if문이 실행되어 return이 일어나면 score가 +가 되지 않는다.
        score++;
        scoreDisplay.innerText = score;
        //아래 문구가 없을 시 정답을 맞추어도 시간은 초기화가 되지않고 계속 흐름
        time = GAME_TIME;
        //단어 일치 시 words 배열에 있는 새로운 단어 랜덤으로 입력
        const randomIndex = Math.floor(Math.random()*words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}


//시간이 조건에 따라 흐르고 게임중이 아닐때에는 시간 흐르는걸 초기화

function countDown(){
    time > 0 ? time -- : isPlaying = false;
    if(!isPlaying){
        clearInterval(timeInterval)
    }
    //이부분에서 지속적으로 조건에 따라 시간값이 들어감
    timeDisplay.innerText = time;
}

//button의 클래스를 조건에 맞게 삭제or추가 하여 css 스타일 변화

function buttonChange(text){
    button.innerText = text;
    text === '게 임 시 작' ? button.classList.remove('word-loading') : button.classList.add('word-loading');
}