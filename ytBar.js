const settings = {
  gradientColor1: "#ff0033",
  gradientColor2: "#ff2791",
  logoBgColor: "#ff0033",
  logoTriangleColor: "#ffffff",
  gradientPercent: 80,
  gradientStep: 10,
};

getSettings().then(() => {
  styleThumbnailBars();
  styleHomepageHoverThumbnailBar();
  stylePlayerBar();
  styleProgressBar();
  checkForLogo();
});

listenForColorChanges();

function listenForColorChanges() {
  browser.storage.onChanged.addListener((changes) => {
    const names = Object.keys(changes);
    for (const name of names) {
      settings[name] = changes[name].newValue;
    }
    styleThumbnailBars();
    styleHomepageHoverThumbnailBar();
    stylePlayerBar();
    styleProgressBar();
    checkForLogo();
  });
}

async function getSettings() {
  const names = Object.keys(settings);
  for (const name of names) {
    await setSetting(name);
  }
}

async function setSetting(name) {
  const result = await browser.storage.local.get(name);
  if (result[name]) {
    settings[name] = result[name];
  }
}

function getGradient(gradientColor1, gradientColor2, gradientPercent) {
  const step = parseInt(settings.gradientStep);
  const gradientPercentNumber = parseInt(gradientPercent);

  let percent1 = gradientPercentNumber - step;
  if (percent1 < 0) percent1 = 0;
  let percent2 = gradientPercentNumber + step;
  if (percent2 > 100) percent2 = 100;
  const gradientCSS = `linear-gradient(
  to right, 
  ${gradientColor1} 0%, 
  ${gradientColor1} ${percent1}%, 
  ${gradientColor2} ${percent2}%, 
  ${gradientColor2} 100%) 
  !important;`;
  return gradientCSS;
}

function stylePlayerBar() {
  const style = document.createElement("style");
  style.innerHTML = `
    .ytp-scrubber-button {
      background: ${settings.gradientColor2} !important;
      }
      .ytp-play-progress {
        background: ${getGradient(
          settings.gradientColor1,
          settings.gradientColor2,
          settings.gradientPercent
        )}
      }
    `;
  document.head.append(style);
}
function styleThumbnailBars() {
  const style = document.createElement("style");
  style.innerHTML = `
    .ytd-thumbnail-overlay-resume-playback-renderer {
      background: ${getGradient(
        settings.gradientColor1,
        settings.gradientColor2,
        settings.gradientPercent
      )}
    }
  `;
  document.head.append(style);
}

function styleHomepageHoverThumbnailBar() {
  const style = document.createElement("style");
  style.innerHTML = `
    .YtProgressBarLineProgressBarPlayed {
      background: ${getGradient(
        settings.gradientColor1,
        settings.gradientColor2,
        settings.gradientPercent
      )}
    }
    .YtProgressBarPlayheadProgressBarPlayheadDot {
      background: ${settings.gradientColor2} !important;
    }
  `;
  document.head.append(style);
}

function styleProgressBar() {
  const style = document.createElement("style");
  style.innerHTML = `
    .yt-page-navigation-progress {
      background: ${getGradient(
        settings.gradientColor1,
        settings.gradientColor2,
        settings.gradientPercent
      )}
    }
  `;
  document.head.append(style);
}

function styleLogo() {
  const elem = document.querySelector("#logo-icon");
  const elem2 = elem.querySelector("g");
  elem2.children[0].setAttribute("fill", settings.logoBgColor);
  elem2.children[1].setAttribute("fill", settings.logoTriangleColor);
}

function checkForLogo() {
  const timer = setInterval(() => {
    const elem = document.querySelector("#logo-icon");
    const contains = document.body.contains(elem);
    if (contains) {
      styleLogo();
      clearInterval(timer);
    }
  }, 200);
}
