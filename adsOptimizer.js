function addListener(options, divId) {
    window.addEventListener('scroll', divId = function() {
        if (pageYOffset >= 1) {
            if(options.createElems) {
                options.createElems.map(createElem);
            }
            options.makeAds();
            window.removeEventListener('scroll', divId);
        }
    });
}

function consoleLog(type, problem) {
    console.log('AdsOptimizer : Problem with type ' + type + '. ' + problem + ' is wrong.')
}

function createElem(elem) {
    let into = document.getElementById(elem.into);
    if (into) {
        let element = document.createElement(elem.type);
        if (elem.parametres) {
            for (let [key, value] of Object.entries(elem.parametres)) {
                element.setAttribute(key, value);
            }
        }
        into.append(element);
    }
    else {
        consoleLog(elem.type, 'div into id');
    }
}

function createAds(type, divId, options) {
    switch (type) {
        case 'mgid':
        case 'adpartner':
            if(options.makeAds) {
                if(divId) {
                    addListener(options, divId);
                }
                else {
                    consoleLog(type, 'divId');
                }
            }
            else {
                consoleLog(type, 'makeAds');
            }
            break;
        case 'value 2':
            break;
        default:
            console.log('type is empty or wrong');
    }
}