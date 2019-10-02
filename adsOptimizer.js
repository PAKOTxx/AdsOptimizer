function addListener(options, divId) {
    window.addEventListener('scroll', divId = function() {
        if (pageYOffset >= 1) {
            if(options.createElems) {
                options.createElems.map(createElem);
            }
            if(options.makeAds){
                options.makeAds();
            }
            if(options.googleAdsTag) {
                googleAdsTagConstruct(options.googleAdsTag);
            }
            window.removeEventListener('scroll', divId);
        }
    });
}

function googleAdsTagConstruct(options) {
    if(window.googletag !== undefined) {
        let slot = googletag.defineSlot(options.adUnitPath, options.size, options.opt_div).addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
        googletag.pubads().collapseEmptyDivs();
        googletag.enableServices();
        googletag.cmd.push(function () {
            googletag.display(options.opt_div);
            googletag.pubads().refresh([slot]);
        });
    }
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
        case 'mixadv':
        case 'adpartner':
        case 'googleAdsIns':
        case 'googleAdsTag':
        case 'onlyScriptAds':
            if(!options.screenSizes || (document.documentElement.clientWidth >= options.screenSizes.min && document.documentElement.clientWidth <= options.screenSizes.max)) {
                if (options.makeAds || (type='googleAdsTag')) {
                    if (divId) {
                        addListener(options, divId);
                    }
                    else {
                        consoleLog(type, 'divId');
                    }
                }
                else {
                    consoleLog(type, 'makeAds');
                }
            }
            break;
        default:
            console.log('type is empty or wrong');
    }
}