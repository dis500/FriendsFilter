import './../sass/styles.scss';

let leftFilterInput = document.querySelector('.search__input-left');
let rightFilterInput = document.querySelector('.search__input-right');
let firstZone = document.querySelector('.container__wrapper-left');
let secondZone = document.querySelector('.container__wrapper-right');
let saveBtn = document.querySelector('.footer__btn');
let storage = localStorage;


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

            if (storage.data === '' && storage.data2 === '') {
                for (let i = 0; i < leftListArray.length; i++) {
                    renderLeftFriends(leftListArray[i]);
                }
            } else {
                let arr = JSON.parse(storage.data);
                let arr2 = JSON.parse(storage.data2);

                firstZone.innerHTML = '';

                for (let i = 0; i < arr.length; i++) {
                    renderLeftFriends(arr[i]);
                }

                for (let i = 0; i < arr2.length; i++) {
                    renderRightFriends(arr2[i]);
                }
            }

            saveBtn.addEventListener('click', function () {
                storage.data = JSON.stringify(leftListArray);
                storage.data2 = JSON.stringify(rightListArray);
                console.log(storage.data);
            });

            leftFilterInput.addEventListener('keyup', function () {
                let value = leftFilterInput.value;
            /!*    let filteredFriends = info.filter(friend => isMatching(friend.first_name, value));*!/

                let filteredFriends = leftListArray.filter(function (friend) {
                   return isMatching(`${friend.first_name} ${friend.last_name}`, value);
                });

                firstZone.innerHTML = '';

                for (let i = 0; i < filteredFriends.length; i++) {
                   renderLeftFriends(filteredFriends[i]);
                }
            });

            rightFilterInput.addEventListener('keyup', function () {
               let value = rightFilterInput.value;

                let filteredFriends = rightListArray.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, value);
                });

                secondZone.innerHTML = '';

                for (let i = 0; i < filteredFriends.length; i++) {
                    renderRightFriends(filteredFriends[i]);
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

        function makeDnDRight(zone1, zone2) {
            zone1.addEventListener('dragstart', function (e) {
             /*   e.target.style.backgroundColor = '#f0f0f0';*/
                currentDrag = {node: e.target};
                console.log('начал тащить');
            });

            zone1.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            zone2.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            zone2.addEventListener('drop', function (e) {
                /*zone2.appendChild(currentDrag.node);*/
                let id = Number(currentDrag.node.getAttribute('data-id'));
                let index = leftListArray.findIndex(friend => friend.id === id);
                rightListArray.push(leftListArray[index]);
                leftListArray.splice(index, 1);
                console.log(rightListArray);

                firstZone.innerHTML = '';

                for (let i = 0; i < leftListArray.length; i++) {
                    renderLeftFriends(leftListArray[i]);
                }

                secondZone.innerHTML = '';

                for (let i = 0; i < rightListArray.length; i++) {
                    renderRightFriends(rightListArray[i]);
                }
            });
        }

        makeDnDRight(firstZone, secondZone);

        function makeDnDLeft(zone1, zone2) {
            zone2.addEventListener('dragstart', function (e) {
                /!*   e.target.style.backgroundColor = '#f0f0f0';*!/
                currentDrag = {node: e.target};
                console.log('начал тащить');
            });

            zone2.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            zone1.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            zone1.addEventListener('drop', function (e) {
                /!*zone2.appendChild(currentDrag.node);*!/
                let id = Number(currentDrag.node.getAttribute('data-id'));
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
            });
        }

        makeDnDLeft(firstZone, secondZone);

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
                                let id = Number(target.getAttribute('data-id'));
                                let index = leftListArray.findIndex(friend => friend.id === id);
                                rightListArray.push(leftListArray[index]);
                                leftListArray.splice(index, 1);
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
    friendBlock.setAttribute('data-id', friends.id);
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
    friendBlock.setAttribute('data-id', friends.id);
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






