function preventSelection(element){
  var preventSelection = false;

  function addHandler(element, event, handler){
    if (element.attachEvent) 
      element.attachEvent('on' + event, handler);
    else 
      if (element.addEventListener) 
        element.addEventListener(event, handler, false);
  }
  function removeSelection(){
    if (window.getSelection) { window.getSelection().removeAllRanges(); }
    else if (document.selection && document.selection.clear)
      document.selection.clear();
  }
  function killCtrlA(event){
    var event = event || window.event;
    var sender = event.target || event.srcElement;

    if (sender.tagName.match(/INPUT|TEXTAREA/i))
      return;

    var key = event.keyCode || event.which;
    if (event.ctrlKey && key == 'A'.charCodeAt(0))  // 'A'.charCodeAt(0) можно заменить на 65
    {
      removeSelection();

      if (event.preventDefault) 
        event.preventDefault();
      else
        event.returnValue = false;
    }
  }

  // не даем выделять текст мышкой
  addHandler(element, 'mousemove', function(){
    if(preventSelection)
      removeSelection();
  });
  addHandler(element, 'mousedown', function(event){
    var event = event || window.event;
    var sender = event.target || event.srcElement;
    preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
  });

  // борем dblclick
  // если вешать функцию не на событие dblclick, можно избежать
  // временное выделение текста в некоторых браузерах
  addHandler(element, 'mouseup', function(){
    if (preventSelection)
      removeSelection();
    preventSelection = false;
  });

  // борем ctrl+A
  // скорей всего это и не надо, к тому же есть подозрение
  // что в случае все же такой необходимости функцию нужно 
  // вешать один раз и на document, а не на элемент
  addHandler(element, 'keydown', killCtrlA);
  addHandler(element, 'keyup', killCtrlA);
}
preventSelection(document.getElementsByClassName('answer')[0]);

var hints = ['Все отлично!', 'Все очень хорошо!', 'Хорошая на улице погода, не так ли?', 'Умей радоваться тому, что у тебя есть!', 'Будь внимателен к окружающим!', 'Не злоупотребляй чужой добротой', 'Помогай людям']; 
document.getElementsByClassName('hint')[0].innerHTML = hints[Math.floor(Math.random() * ((hints.length-1) - 0 + 1)) + 0];
var points = 0;
var questions = [
    'Если представится случай, люблю играть первую скрипку в обществе',
    'В трудном или спорном положении жду поддержки у самого близкого человека.',
    'В любом деле умею с легкостью принимать решения.',
    'Отличаюсь впечатлительностью, во мне легко вызвать сострадание.',
    'Умею постоять за свой авторитет.',
    'Забочусь о своей внешности, и это доставляет мне удовольствие.',
    'Обычно стараюсь приспособиться к обстоятельствам, а не действовать по первому побуждению.',
    'Иногда кокетничаю с представителями противоположного пола.',
    'Обладаю большой психической силой и независимостью в действиях.',
    'Всегда ношу с собой зеркальце.',
    'Умею не только долго помнить обиду, но и отплатить той же монетой.',
    'Не отличаюсь выдержкой и не умею оставаться хладнокровным в любом положении.',
    'Считаю, что любовь — это сокровенное переживание, не нуждающееся в непременном внешнем проявлении.',
    'Я романтичен.',
    'Мой характер схож с характером моего отца.'
];
var variants = [
    'Психически — вы мужчина на все 100 процентов. Решительность, самостоятельность, независимость — вот ваши сильные стороны. Умеете быть опорой для другого человека и знаете, зачем живете на этом свете. Ваши жизненные принципы могут вызывать уважение многих людей. Если вы мужчина, ваши ответы наводят на мысль о некоторой схематичности и стереотипности понимания вопросов пола и собственной мужественности. Но если вы женщина — довольны ли вы собою?',
    'В зависимости от необходимости вы обнаруживаете как типично мужские, так и классически женские черты, умея сочетать мягкость с решительностью и впечатлительность с благоразумием. Может быть, иногда жизненные обстоятельства потребуют от вас поступков, которые вы считаете более свойственными противоположному полу, тем не менее умение приспосабливаться и большая психическая гибкость будут вашими союзниками в любых обстоятельствах.',
    'Психически — вы стопроцентная женщина. Сегодня это редко встречаемый тип человека. Если вы любите готовить, заниматься домашним хозяйством и воспитывать детей, если вы мягки и покорны — вы имеете все задатки, чтобы стать воплощением мужского идеала. Настоящий мужчина примет вас такой, какая вы есть, достаточно, что он вас полюбит. Если же вы мужчина — ваше положение незавидно...'
];

function removeClass(obj, cls) {
  var classes = obj.className.split(' ');
  for(i=0; i<classes.length; i++) {
    if (classes[i] == cls) {
      classes.splice(i, 1);
      i--;
    }
  }
  obj.className = classes.join(' ');
}


var curBox = document.getElementsByClassName('box');
var pointer = 0;
var questionText = document.getElementById('quest-text');
questionText.innerHTML = questions[pointer];
var finResult = 0;
var yes = document.getElementById('a1');
var no = document.getElementById('a2');
var dont = document.getElementById('a3');
function finish() {
    if (points >= 100) finResult = 0;
    else if (points >= 50) finResult = 1;
    else finResult = 2;
    var cont = document.getElementsByClassName('content');
    cont[0].innerHTML = variants[finResult];
    cont[0].className += ' padtop';
};
function updateQuestion() {
    questionText.innerHTML = questions[pointer];
}

yes.onclick = function () {
    if ((pointer+1)%2 != 0) points+=10;
    if (pointer == questions.length - 1) {finish(); return;}
    console.log(pointer);
    removeClass(curBox[pointer], 'active');
    curBox[pointer].className += ' passed';
    curBox[pointer+1].className += ' active';
    pointer++;
    updateQuestion();
};
no.onclick = function () {
    if ((pointer+1)%2 == 0) points+=10;
    if (pointer == questions.length - 1) {finish(); return;}
    removeClass(curBox[pointer], 'active');
    curBox[pointer].className += ' passed';
    curBox[pointer+1].className += ' active';
    pointer++;
    updateQuestion();
};
dont.onclick = function () {
    points+=5;
    if (pointer == questions.length - 1) {finish(); return;}
    removeClass(curBox[pointer], 'active');
    curBox[pointer].className += ' passed';
    curBox[pointer+1].className += ' active';
    pointer++;
    updateQuestion();
};
