/* eslint-disable consistent-return */
/* eslint-disable quote-props */
/* eslint-disable prefer-template */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
// <div class="stream-empty"></div>
const API_URL = 'https://api.twitch.tv/kraken';
const CLIENT_ID = 's44s145uexjgeu9mqqa1s93oc1bnli';
const STREAM_TEMPLATE = `<div class="stream">
       <img src="$preview" />
       <div class="stream__data">
           <div class="stream__avatar">
               <img src="$logo">
           </div>
           <div class="stream__intro">
               <a herf=$url target="_blank">
                <div class="stream__title">$title</div>
                <div class="stream__channel">
                    $name
                </div>
               </a>
           </div>
       </div>
     </div>`;

getGamesFetch().then((data) => {
  const gameTop = data.top;
  for (let game of gameTop) {
    let element = document.createElement('li');
    element.innerText = game.game.name;
    document.querySelector('.navbar__nav').appendChild(element);
  }

  // 顯示第一個遊戲的實況名稱
  changeGame(gameTop[0].game.name);
});

document.querySelector('.navbar__nav').addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    const gameName = e.target.innerText;
    changeGame(gameName);
  }
});
function getStreamsFetch(gameName) {
  return fetch(API_URL + '/streams?game=' + encodeURIComponent(gameName), {
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': CLIENT_ID,
    },
  })
    .then(response => response.json());
}
function appendStream(stream) {
  let element = document.createElement('div');
  document.querySelector('.streams').appendChild(element);
  element.outerHTML = STREAM_TEMPLATE
    .replace('$preview', stream.preview.large)
    .replace('$logo', stream.channel.logo)
    .replace('$title', stream.channel.status)
    .replace('$name', stream.channel.name)
    .replace('$url', stream.channel.url);
}
function changeGame(gameName) {
  document.querySelector('h1').innerText = gameName;
  document.querySelector('.streams').innerHTML = '';
  getStreamsFetch(gameName).then((data) => {
    for (data.stream of data.streams) {
      appendStream(data.stream);
    }
  });
}
function getGamesFetch() {
  return fetch(API_URL + '/games/top?limit=5', {
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': CLIENT_ID,
    },
  })
    .then(response => response.json());
}
