function addListener(type, options, divId) {
  window.addEventListener(
    "scroll",
    (divId = function() {
      if (pageYOffset >= 1) {
        let finished = adsMaking(type, options, divId);
        if (finished) {
          window.removeEventListener("scroll", divId);
        }
      }
    })
  );
}

function addNoScroll(type, options, divId) {
  let finished = adsMaking(type, options, divId);
  if (finished === false) {
    setTimeout(addNoScroll, 100, type, options, divId);
  }
}

function adsMaking(type, options, divId) {
  let finished = false;
  if (options.createElems) {
    options.createElems.map(createElem);
  }
  if (options.makeAds) {
    options.makeAds();
    finished = true;
  }
  if (options.googleAdsTag) {
    finished = googleAdsTagConstruct(options.googleAdsTag);
  }
  if (type === "googleAdsIns") {
    finished = googleAdsInsConstruct(options);
  }
  let tElem = document.getElementById(options.createElems[0].into);
  if (tElem) {
    tElem.id = str_rand(10);
  }
  return finished;
}

function googleAdsTagConstruct(options) {
  if (window.googletag == undefined) {
    if (!document.getElementById("adsTagOptim")) {
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;
      script.src = "https://www.googletagservices.com/tag/js/gpt.js";
      script.id = "adsTagOptim";
      head.appendChild(script);
    }
  } else if (window.googletag.defineSlot !== undefined) {
    let slot = googletag
      .defineSlot(options.adUnitPath, options.size, options.opt_div)
      .addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.pubads().disableInitialLoad();
    googletag.pubads().collapseEmptyDivs();
    googletag.enableServices();
    googletag.cmd.push(function() {
      googletag.display(options.opt_div);
      googletag.pubads().refresh([slot]);
    });
    return true;
  }
  return false;
}

function googleAdsInsConstruct(options) {
  if (
    window.adsbygoogle == undefined &&
    !document.getElementById("adsbygoogleOptim")
  ) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.defer = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    // script.setAttribute(
    //   "data-ad-client",
    //   options.createElems[0].parametres["data-ad-client"]
    // );
    script.id = "adsbygoogleOptim";
    head.appendChild(script);
    return false;
  } else {
    (adsbygoogle = window.adsbygoogle || []).push({});
    return true;
  }
}

function consoleLog(type, problem) {
  console.log(
    "AdsOptimizer : Problem with type " + type + ". " + problem + " is wrong."
  );
}

function createElem(elem) {
  let into = document.getElementById(elem.into);
  if (into) {
    let checkID = document.getElementById(elem.parametres.id);
    if (!checkID) {
      let element = document.createElement(elem.type);
      if (elem.parametres) {
        for (let [key, value] of Object.entries(elem.parametres)) {
          element.setAttribute(key, value);
        }
      }
      into.append(element);
    }
  }
}

function createAds(type, divId, options) {
  switch (type) {
    case "mgid":
    case "mixadv":
    case "adpartner":
    case "googleAdsIns":
    case "googleAdsTag":
    case "onlyScriptAds":
      if (
        !options.screenSizes ||
        (document.documentElement.clientWidth >= options.screenSizes.min &&
          document.documentElement.clientWidth <= options.screenSizes.max)
      ) {
        if (
          options.makeAds ||
          type === "googleAdsTag" ||
          type === "googleAdsIns"
        ) {
          if (divId) {
            if (options.loadOnScroll === false) {
              addNoScroll(type, options, divId);
            } else {
              addListener(type, options, divId);
            }
          } else {
            consoleLog(type, "divId");
          }
        } else {
          consoleLog(type, "makeAds");
        }
      }
      break;
    default:
      console.log("type is empty or wrong");
  }
}

function str_rand(strCount) {
  var result = "";
  var words = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  var max_position = words.length - 1;
  for (i = 0; i < strCount; ++i) {
    position = Math.floor(Math.random() * max_position);
    result = result + words.substring(position, position + 1);
  }
  return result;
}
