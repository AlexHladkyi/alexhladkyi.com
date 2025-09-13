(function greeting() {
  var greetings = [
    'Hi!', 'Привіт!', 'こんにちは！', 'Salut!', '¡Hola!', 'Hallo!', 'Hej!', 'Moi!', 'Hei!', 'Tere!', 'Sveiki!', 'Olá!', 'Ciao!', 'Labas!', 'Cześć!'
  ];

  var rndGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  var container = document.getElementById('greeting');

  var tmpSpan = document.createElement('span');
  tmpSpan.style.visibility = 'hidden';
  tmpSpan.style.whiteSpace = 'pre';
  tmpSpan.style.font = window.getComputedStyle(container).font;
  tmpSpan.textContent = rndGreeting;
  document.body.appendChild(tmpSpan);

  container.style.display = 'inline-block';
  container.style.width = tmpSpan.offsetWidth + 'px';
  container.style.textAlign = 'left';
  document.body.removeChild(tmpSpan);

  var index = 0;

  function typeLetter() {
    container.textContent = rndGreeting.slice(0, index + 1);
    index++;
    if (index < rndGreeting.length) {
      setTimeout(typeLetter, 100);
    }
  }

  setTimeout(typeLetter, 500);
    
})();