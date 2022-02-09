import {UI} from './view.js';


let table;
let player;
gameNew();
UI.INPUTS.forEach(item => item.addEventListener('click', gameNew));
UI.RESTART.addEventListener('click', gameNew);

function gameNew() {
  UI.LIST.innerHTML = '';
  table = [ ['', '', ''],
            ['', '', ''],
            ['', '', '']];
  player = document.querySelector('.input:checked').id.slice(-1);
  UI.RESTART.classList.remove('visible')
  UI.STATUS.textContent =  "Сейчас ходит " + player.toUpperCase()
  
  new Promise(function(resolve, reject) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const item = document.createElement('button');
        item.className = 'item';
        item.setAttribute('id', `${i}-${j}`);
        UI.LIST.append(item);
      };
    };
    resolve();
  })
  .then(() => {
    document.querySelectorAll('.item').forEach(item => {
      item.addEventListener('click', handler)});
  });
}


function handler() {
  const[row, col] = this.id.split('-')
  if (table[row][col] == '') {
    table[row][col] = player
    this.classList.add('item_' + player);

    const status = gameStatus()
    if (status) {
      gameOver(status)
      return
    }

    player = ['x', 'o'].filter(item => item != player)[0]
    UI.STATUS.textContent =  "Сейчас ходит " + player.toUpperCase()
  }
}

function gameStatus() {
  let flag = false

  table.forEach((rows, index) => {
    const row = rows.reduce((a, b) => a + b, '')
    const col = table.reduce((a, b) => a + b[index], '')
    const diagonallr = table.reduce((a, b, i) => a + b[i], '')
    const diagonalrl = table.reduce((a, b, i) => a + b[2 - i], '') 
    setTimeout([row, col, diagonallr, diagonalrl].forEach((item, i) => {
      if (['xxx', 'ooo'].includes(item)) {
        winLine(i, index)
        flag = "Победил " + player.toUpperCase()}
    }))
  })
  const isdraw = table.map(item => item.reduce((a, b) => a + b, '').length).reduce((a, b) => a + b, 0) == 9 && !flag;
  if (isdraw) flag = 'Ничья'
  return flag;
}

function winLine(line, rowcol) {
  switch(line) {
    case 0:
      for (let i = 0; i < 3; i++) {
        const item = document.getElementById(`${rowcol}-${i}`)
        item.classList.add('item_win')
      }
    break;
    case 1:
      for (let i = 0; i < 3; i++) {
        const item = document.getElementById(`${i}-${rowcol}`)
        item.classList.add('item_win')
      }
      break;
    case 2:
      for (let i = 0; i < 3; i++) {
        const item = document.getElementById(`${i}-${i}`)
        item.classList.add('item_win')
      }
      break;
    case 3:
      for (let i = 0; i < 3; i++) {
        const item = document.getElementById(`${2 - i}-${i}`)
        item.classList.add('item_win')
      }
      break;
  }
}

function gameOver(status) {
  document.querySelectorAll('.item').forEach(item => {
    item.setAttribute('disabled', true)
    item.classList.add('item_desabled')
  })
  UI.STATUS.textContent = status;
  UI.RESTART.classList.add('visible');
}