(function() {
  const canvas = document.querySelector("#unity-canvas");
  const warningBanner = document.querySelector("#unity-warning");
  
  // Utility function to toggle visibility
  function toggleVisibility(element, show) {
    element.style.display = show ? 'block' : 'none';
  }

  // Function to display a temporary message banner for Unity WebGL loading status
  function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
      toggleVisibility(warningBanner, warningBanner.children.length);
    }

    const div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    div.style.background = type === 'error' ? 'red' : type === 'warning' ? 'yellow' : '';
    div.style.padding = '10px';
    
    if (type !== 'error') {
      setTimeout(() => {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }

    updateBannerVisibility();
  }

  // If you're changing folder names remember to change it here too
  const buildUrl = "Build";
  const loaderUrl = `${buildUrl}/Project_Magnetism_Tool_2D_Build.loader.js`;
  const config = {
    arguments: [],
    dataUrl: `${buildUrl}/Project_Magnetism_Tool_2D_Build.data`,
    frameworkUrl: `${buildUrl}/Project_Magnetism_Tool_2D_Build.framework.js`,
    codeUrl: `${buildUrl}/Project_Magnetism_Tool_2D_Build.wasm`,
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "Project_Magnetism_Tool_2D",
    productVersion: "1.0",
    showBanner: unityShowBanner,
  };


  // Mobile device styling
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
    document.querySelector("#unity-container").classList.add("unity-mobile");
    canvas.classList.add("unity-mobile");
  } else {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }

  toggleVisibility(document.querySelector("#unity-loading-bar"), true);

  window.onload = function() {
    // Hide all elements and show Placeholder 1 after page load
    toggleVisibility(canvas, false);
    document.querySelectorAll('.placeholder-text').forEach((placeholder) => {
      toggleVisibility(placeholder, false);
    });
    toggleVisibility(document.getElementById('placeholder1'), true);
  };

  const script = document.createElement("script");
  script.src = loaderUrl;
  script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
      document.querySelector("#unity-progress-bar-full").style.width = `${100 * progress}%`;
    }).then((unityInstance) => {
      toggleVisibility(document.querySelector("#unity-loading-bar"), false);

      window.loadScene = function(sceneName) {
        unityInstance.SendMessage('SceneManager', 'LoadSceneFromJS', sceneName);
        hidePlaceholder();
      };
    }).catch((message) => {
      alert(message);
    });
  };

  document.body.appendChild(script);

  window.showPlaceholder = function(placeholderId) {
    document.querySelectorAll('.placeholder-text').forEach((placeholder) => {
      toggleVisibility(placeholder, false);
    });
    toggleVisibility(canvas, false);
    toggleVisibility(document.getElementById(placeholderId), true);
  };

  window.hidePlaceholder = function() {
    toggleVisibility(canvas, true);
    document.querySelectorAll('.placeholder-text').forEach((placeholder) => {
      toggleVisibility(placeholder, false);
    });
  };

  // Placeholder buttons
  document.getElementById('placeholder1-btn').addEventListener('click', () => showPlaceholder('placeholder1'));
  document.getElementById('placeholder2-btn').addEventListener('click', () => showPlaceholder('placeholder2'));
  document.getElementById('placeholder3-btn').addEventListener('click', () => showPlaceholder('placeholder3'));
})();
