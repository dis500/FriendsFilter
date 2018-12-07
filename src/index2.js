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