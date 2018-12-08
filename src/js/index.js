import './../sass/styles.scss';

let leftFilterInput = document.querySelector('.search__input-left');
let rightFilterInput = document.querySelector('.search__input-right');
let firstZone = document.querySelector('.container__wrapper-left');
let secondZone = document.querySelector('.container__wrapper-right');
let saveBtn = document.querySelector('.footer__btn');
let renderedArray = [];
let storage = localStorage;
let currentDrag;

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
       /* let headerInfo = document.querySelector('.page-title');
        headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;*/

        return callAPI('friends.get', {fields: 'city, country, photo_100' });
    })
    .then(friends => {
        let info = friends.items;
        let leftListArray = info;
        let rightListArray = [];

        if (!storage.getItem('data') || !storage.getItem('data2')) {
            for (let i = 0; i < leftListArray.length; i++) {
                renderLeftFriends(leftListArray[i]);
            }

            leftFilter(leftListArray);
            rightFilter(rightListArray);

            addFriend(leftListArray, rightListArray);
            deleteFriend(leftListArray, rightListArray);

            makeDnDRight(firstZone, secondZone, leftListArray, rightListArray);
            makeDnDLeft(firstZone, secondZone, leftListArray, rightListArray);
        } else {
            let arr = JSON.parse(storage.getItem('data'));
            let arr2 = JSON.parse(storage.getItem('data2'));

            firstZone.innerHTML = '';

            for (let i = 0; i < arr.length; i++) {
                renderLeftFriends(arr[i]);
            }

            for (let i = 0; i < arr2.length; i++) {
                renderRightFriends(arr2[i]);
            }

            leftFilter(arr);
            rightFilter(arr2);

            addFriend(arr, arr2);
            deleteFriend(arr, arr2);

            makeDnDRight(firstZone, secondZone, arr, arr2);
            makeDnDLeft(firstZone, secondZone, arr, arr2);
        }

        saveBtn.addEventListener('click', function () {
           /* storage.data = JSON.stringify(leftListArray);
            storage.data2 = JSON.stringify(rightListArray);*/
            storage.setItem('data', JSON.stringify(leftListArray));
            storage.setItem('data2', JSON.stringify(rightListArray));
            console.log(storage.data);
        });
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

function leftFilter (array) {
    leftFilterInput.addEventListener('keyup', function () {
        let value = leftFilterInput.value;
        /!*    let filteredFriends = info.filter(friend => isMatching(friend.first_name, value));*!/

        let filteredFriends = array.filter(function (friend) {
            return isMatching(`${friend.first_name} ${friend.last_name}`, value);
        });

        firstZone.innerHTML = '';

        for (let i = 0; i < filteredFriends.length; i++) {
            renderLeftFriends(filteredFriends[i]);
        }
    });
}

function rightFilter (array) {
    rightFilterInput.addEventListener('keyup', function () {
        let value = rightFilterInput.value;

        let filteredFriends = array.filter(function (friend) {
            return isMatching(`${friend.first_name} ${friend.last_name}`, value);
        });

        secondZone.innerHTML = '';

        for (let i = 0; i < filteredFriends.length; i++) {
            renderRightFriends(filteredFriends[i]);
        }
    });
}

function addFriend (arr1, arr2) {
    firstZone.addEventListener('click', function (e) {
        let target = e.target;
        if (target.classList.contains('container__item-btn--add')) {
            let id = Number(target.getAttribute('data-id'));
            let index = arr1.findIndex(friend => friend.id === id);
            arr2.push(arr1[index]);
            arr1.splice(index, 1);

            if (leftFilterInput.value) {
                renderedArray = arr1.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, leftFilterInput.value);
                });

            } else {
                renderedArray = arr1;
            }
            
            firstZone.innerHTML = '';

            for (let i = 0; i < renderedArray.length; i++) {
                renderLeftFriends(renderedArray[i]);
            }

            if (rightFilterInput.value) {
                renderedArray = arr2.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, rightFilterInput.value);
                });

            } else {
                renderedArray = arr2;
            }

            secondZone.innerHTML = '';

            for (let i = 0; i < renderedArray.length; i++) {
                renderRightFriends(renderedArray[i]);
            }
        }
    });
}

function deleteFriend (arr1, arr2) {
    secondZone.addEventListener('click', function (e) {
        let target = e.target;
        if (target.classList.contains('container__item-btn--delete')) {
            let id = Number(target.getAttribute('data-id'));
            let index = arr2.findIndex(friend => friend.id === id);
            arr1.push(arr2[index]);
            arr2.splice(index, 1);
            console.log(arr2);

            if (rightFilterInput.value) {
                renderedArray = arr2.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, rightFilterInput.value);
                });

            } else {
                renderedArray = arr2;
            }

            secondZone.innerHTML = '';

            for (let i = 0; i < renderedArray.length; i++) {
                renderRightFriends(renderedArray[i]);
            }

            if (leftFilterInput.value) {
                renderedArray = arr1.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, leftFilterInput.value);
                });

            } else {
                renderedArray = arr1;
            }

            firstZone.innerHTML = '';

            for (let i = 0; i < renderedArray.length; i++) {
                renderLeftFriends(renderedArray[i]);
            }
        }
    });
}

function makeDnDRight(zone1, zone2, arr1, arr2) {
    zone1.addEventListener('dragstart', function (e) {
        e.target.style.backgroundColor = '#f0f0f0';
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
        if (currentDrag.node.classList.contains('container__item')) {
            let id = Number(currentDrag.node.getAttribute('data-id'));
            let index = arr1.findIndex(friend => friend.id === id);
            arr2.push(arr1[index]);
            arr1.splice(index, 1);
            console.log(arr2);

            if (leftFilterInput.value) {
                renderedArray = arr1.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, leftFilterInput.value);
                });

            } else {
                renderedArray = arr1;
            }

            firstZone.innerHTML = '';

            for (let i = 0; i < renderedArray.length; i++) {
                renderLeftFriends(renderedArray[i]);
            }

            if (rightFilterInput.value) {
                renderedArray = arr2.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, rightFilterInput.value);
                });

            } else {
                renderedArray = arr2;
            }

            secondZone.innerHTML = '';

            for (let i = 0; i < renderedArray.length; i++) {
                renderRightFriends(renderedArray[i]);
            }
        }
    });
}

function makeDnDLeft(zone1, zone2, arr1, arr2) {
    zone2.addEventListener('dragstart', function (e) {
        e.target.style.backgroundColor = '#f0f0f0';
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
        if (currentDrag.node.classList.contains('container__item')) {
            let id = Number(currentDrag.node.getAttribute('data-id'));
            let index = arr2.findIndex(friend => friend.id === id);
            arr1.push(arr2[index]);
            arr2.splice(index, 1);
            console.log(arr2);

            if (rightFilterInput.value) {
                renderedArray = arr2.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, rightFilterInput.value);
                });

            } else {
                renderedArray = arr2;
            }

            secondZone.innerHTML = '';

            for (let i = 0; i < renderedArray.length; i++) {
                renderRightFriends(renderedArray[i]);
            }

            if (leftFilterInput.value) {
                renderedArray = arr1.filter(function (friend) {
                    return isMatching(`${friend.first_name} ${friend.last_name}`, leftFilterInput.value);
                });

            } else {
                renderedArray = arr1;
            }

            firstZone.innerHTML = '';

            for (let i = 0; i < renderedArray.length; i++) {
                renderLeftFriends(renderedArray[i]);
            }
        }
    });
}







