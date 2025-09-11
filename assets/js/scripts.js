(function greeting() {
  var greetings = [
    'Hi!', 'Привіт!', 'こんにちは！', 'Salut!', '¡Hola!', 'Hallo!', 'Hej!', 'Moi!', 'Hei!', 'Tere!', 'Sveiki!', 'Olá!', 'Ciao!', 'Labas!', 'Cześć!'
  ];

  var rndGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  var container = document.getElementById('greeting');

  var tempSpan = document.createElement('span');
  tempSpan.style.visibility = 'hidden';
  tempSpan.style.whiteSpace = 'pre';
  tempSpan.style.font = window.getComputedStyle(container).font;
  tempSpan.textContent = rndGreeting;
  document.body.appendChild(tempSpan);

  container.style.display = 'inline-block';
  container.style.width = tempSpan.offsetWidth + 'px';
  container.style.textAlign = 'left';
  document.body.removeChild(tempSpan);

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