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

let filterInput = document.querySelector('.search__input-left');
let firstZone = document.querySelector('.container__wrapper-left');
let secondZone = document.querySelector('.container__wrapper-right');


VK.init({
  apiId: 6765635
});

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
            let info = friends.items;
            let leftListArray = info;
            let rightListArray = [];
            let currentDrag;

            for (let i = 0; i < leftListArray.length; i++) {
                 renderLeftFriends(leftListArray[i]);
            }

            filterInput.addEventListener('keyup', function () {
                let value = filterInput.value;
            /!*    let filteredFriends = info.filter(friend => isMatching(friend.first_name, value));*!/
                let filteredFriends = info.filter(function (friend) {
                   return isMatching(`${friend.first_name} ${friend.last_name}`, value);
                });

                firstZone.innerHTML = '';

                for (let i = 0; i < filteredFriends.length; i++) {
                   renderLeftFriends(filteredFriends[i]);
                }
            });

        firstZone.addEventListener('click', function (e) {
            let target = e.target;
            if (target.classList.contains('container__item-btn--add')) {
                let id = Number(target.getAttribute('data-id'));
                let index = leftListArray.findIndex(friend => friend.id === id);
                rightListArray.push(leftListArray[index]);
                leftListArray.splice(index, 1);

                firstZone.innerHTML = '';

                for (let i = 0; i < leftListArray.length; i++) {
                    renderLeftFriends(leftListArray[i]);
                }

                secondZone.innerHTML = '';

                for (let i = 0; i < rightListArray.length; i++) {
                    renderRightFriends(rightListArray[i]);
                }
            }
        });

        secondZone.addEventListener('click', function (e) {
            let target = e.target;
            if (target.classList.contains('container__item-btn--delete')) {
                let id = Number(target.getAttribute('data-id'));
                let index = rightListArray.findIndex(friend => friend.id === id);
                leftListArray.push(rightListArray[index]);
                rightListArray.splice(index, 1);
                console.log(rightListArray);

                secondZone.innerHTML = '';

                for (let i = 0; i < rightListArray.length; i++) {
                    renderRightFriends(rightListArray[i]);
                }

                firstZone.innerHTML = '';

                for (let i = 0; i < leftListArray.length; i++) {
                    renderLeftFriends(leftListArray[i]);
                }
            }
        });

        function makeDnD(zone1, zone2) {
            zone1.addEventListener('dragstart', function (e) {
             /*   e.target.style.backgroundColor = '#f0f0f0';*/
                currentDrag = {node: e.target};
                console.log('начал тащить');
            });

            zone1.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            zone2.addEventListener('drop', function (e) {
                zone2.appendChild(currentDrag.node);
                console.log('sdfsdf');
            });
        }

        makeDnD(firstZone, secondZone);

        /*function makeDnD(zones) {
            let currentDrag;

            zones.forEach(zone => {
                zone.addEventListener('dragstart', (e) => {
                    currentDrag = {source: zone, node: e.target};
                    currentDrag.node.style.backgroundColor = '#f0f0f0';
                });

                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                zone.addEventListener('drop', (e) => {
                    if (currentDrag) {
                        e.preventDefault();

                        if (currentDrag.source !== secondZone) {
                            if (currentDrag.node.classList.contains('container__item')) {
                                zone.appendChild(currentDrag.node);
                            }
                        }
                        currentDrag.node.style.backgroundColor = '#ffffff';
                        currentDrag = null;
                    }
                });
            });
        }*/

       /* makeDnD([firstZone, secondZone]);*/

    });

function renderLeftFriends(friends) {
    let friendBlock = document.createElement('div');
    let friendName = document.createElement('p');
    let friendImage = document.createElement('img');
    let friendBtn = document.createElement('div');

    friendBlock.classList.add('container__item');
    friendName.classList.add('container__item-text');
    friendImage.classList.add('container__item-img');
    friendBtn.classList.add('container__item-btn--add');
    friendBtn.setAttribute('data-id', friends.id);

    friendBlock.draggable = true;
    friendName.textContent = `${friends.first_name} ${friends.last_name}`;
    friendImage.src = friends.photo_100;

    firstZone.appendChild(friendBlock);
    friendBlock.appendChild(friendName);
    friendBlock.appendChild(friendImage);
    friendBlock.appendChild(friendBtn);

    return friendBlock;
}

function renderRightFriends(friends) {
    let friendBlock = document.createElement('div');
    let friendName = document.createElement('p');
    let friendImage = document.createElement('img');
    let friendBtn = document.createElement('div');

    friendBlock.classList.add('container__item');
    friendName.classList.add('container__item-text');
    friendImage.classList.add('container__item-img');
    friendBtn.classList.add('container__item-btn--delete');
    friendBtn.setAttribute('data-id', friends.id);

    friendBlock.draggable = true;
    friendName.textContent = `${friends.first_name} ${friends.last_name}`;
    friendImage.src = friends.photo_100;

    secondZone.appendChild(friendBlock);
    friendBlock.appendChild(friendName);
    friendBlock.appendChild(friendImage);
    friendBlock.appendChild(friendBtn);

    return friendBlock;
}

function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1;
}

/*function makeDnD(zones) {
    let currentDrag;

    zones.forEach(zone => {
       zone.addEventListener('dragstart', (e) => {
           currentDrag = {source: zone, node: e.target};
           currentDrag.node.style.backgroundColor = '#f0f0f0';
       });

       zone.addEventListener('dragover', (e) => {
            e.preventDefault();
       });

       zone.addEventListener('drop', (e) => {
            if (currentDrag) {
                e.preventDefault();

                let target = e.target;
                let id = Number(target.getAttribute('data-id'));
                let index = rightListArray.findIndex(friend => friend.id === id);
                leftListArray.push(rightListArray[index]);
                rightListArray.splice(index, 1);
                console.log(rightListArray);

                if (currentDrag.source !== zone) {
                    zone.appendChild(currentDrag.node);
                }
                currentDrag.node.style.backgroundColor = '#ffffff';
                currentDrag = null;
            }
       });
    });
}*/

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


