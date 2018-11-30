/*import 'babel-polyfill';
import _ from 'lodash';

import './../sass/styles.scss';

const getHeader = () => {
  const helloWebpack = _.join(['Hello', 'webpack!'], ' ');
  console.log(helloWebpack);
  const element = document.createElement('h1');

  element.innerHTML = helloWebpack;

  return element;
};

document.body.appendChild(getHeader());

const o = {
  foo: {
    bar: null
  }
};

console.log(o?.foo?.bar?.baz ?? 'default');*/

import './../sass/styles.scss';

VK.init({
  apiId: 6765635
});

/*function auth() {
    VK.Auth.login();
}

auth();*/


function auth() {
    return new Promise ((resolve, reject) => {
        VK.Auth.login(data =>{
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'))
            }
        }, 2);
    });
}

function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
           if (data.error) {
               reject(data.error);
           } else {
               resolve(data.response);
           }
        });
    });
}

auth()
    .then(() => {
        return callAPI('users.get', {name_case: 'gen'});
    })
    .then(([me]) => {
        let headerInfo = document.querySelector('.page-title');
        headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;

        return callAPI('friends.get', {fields: 'city, country, photo_100' });
    })
    .then(friends => {
            console.log(friends);
            let info = friends.items;

            for (let i = 0; i < info.length; i++) {
                 renderFriends(info[i]);
            }

            filterInput.addEventListener('keyup', function () {
                let value = filterInput.value;
            /*    let filteredFriends = info.filter(friend => isMatching(friend.first_name, value));*/
                let filteredFriends = info.filter(function (friend) {
                    isMatching(`${friend.first_name} ${friend.last_name}`, value);
                });

                for (let i = 0; i < filteredFriends.length; i++) {
                  return renderFriends(filteredFriends[i]);
                }
            })
            /*for (let i = 0; i < filteredFriends.length; i++) {
                renderFriends(filteredFriends[i]);
            }*/
    });

let filterInput = document.querySelector('.search__input-left');
let wrapper = document.querySelector('.container__wrapper');

function renderFriends(friends) {
    let friendBlock = document.createElement('div');
    let friendName = document.createElement('p');
    let friendImage = document.createElement('img');
    let friendBtn = document.createElement('div');

    friendBlock.classList.add('container__item');
    friendName.classList.add('container__item-text');
    friendImage.classList.add('container__item-img');
    friendBtn.classList.add('container__item-btn');

    friendName.textContent = `${friends.first_name} ${friends.last_name}`;
    friendImage.src = friends.photo_100;

    wrapper.appendChild(friendBlock);
    friendBlock.appendChild(friendName);
    friendBlock.appendChild(friendImage);
    friendBlock.appendChild(friendBtn);

    return friendBlock;
}

function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1;
}

/*let btn = document.querySelector('.container__btn');

btn.addEventListener('click', function () {
    renderFriends();
});*/

/*let btn = document.querySelector('.filter__container-btn');
let wrapper = document.querySelector('.filter__container-wrapper');

function friendsRender() {
    let li = document.createElement('div');
    li.classList.add('filter__friend');
    wrapper.appendChild(li);
    return li;
}

btn.addEventListener('click', function () {
    friendsRender();
});*/


