// 查找导航的contact us按钮，并添加指定的class
const contactBtn = document.querySelector('a[href="https://i.secai.ai/contact_us"]');

contactBtn.classList.add('hs-cta-trigger-button', 'hs-cta-trigger-button-189188848506');

// 检查用户是否在当天已提交过表单
function checkFormSubmission() {
  const submissionData = localStorage.getItem('hubspotFormSubmitted');
  if (!submissionData) return false;
  
  const { timestamp } = JSON.parse(submissionData);
  const now = new Date();
  const submissionDate = new Date(timestamp);
  
  // 检查是否是同一天（UTC）
  return now.getUTCFullYear() === submissionDate.getUTCFullYear() &&
          now.getUTCMonth() === submissionDate.getUTCMonth() &&
          now.getUTCDate() === submissionDate.getUTCDate();
}

// 记录表单提交
function recordFormSubmission() {
  const submissionData = {
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('hubspotFormSubmitted', JSON.stringify(submissionData));
}

const downloadUrl = {
  download_ioc: '/images/SECAI_IOC_Sample.json',
  download_ip: '/images/SECAI_IP_Reputation_Sample.json'
}

function downloadFile(id) {
  const url = downloadUrl[id];
  const a = document.createElement('a');
  a.href = url;
  a.download = url.split('/').pop();
  a.click();
}

// 清空下载按钮样式的函数
function clearDownloadButtonsStyle() {
  const hasSubmitted = checkFormSubmission();
  if (hasSubmitted) {
    // 清空download_ioc、download_ip元素的class
    const downloadIoc = document.getElementById('download_ioc');
    const downloadIp = document.getElementById('download_ip');
    if (downloadIoc) {
      downloadIoc.classList.remove('hs-cta-trigger-button');
      downloadIoc.classList.remove('hs-cta-trigger-button-189188848506');
    }
    if (downloadIp) {
      downloadIp.classList.remove('hs-cta-trigger-button');
      downloadIp.classList.remove('hs-cta-trigger-button-189188848506');
    }
  }
}

function bindDownloadEvent() {
  // 这次打开页面前已提交过，绑定下载事件
  const hasSubmitted = checkFormSubmission();
  if (hasSubmitted) {
    document.querySelectorAll('.secai-download-btn').forEach(button => {
      button.addEventListener('click', (e) => {
          //获取id
          const id = button.id;
          downloadFile(id)
      });
    });
  }
}

// 页面加载完成后
window.addEventListener('load', () => {
  // 初始检查并清空下载按钮样式
  clearDownloadButtonsStyle();

  // 监听路径变化
  let lastPathname = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname;
      clearDownloadButtonsStyle();
      bindDownloadEvent()
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  // 在调整下载按钮class之后加载,否则会给下载按钮绑定事件
  fetch('//js.hs-scripts.com/48609194.js')
    .then(response => response.text())
    .then(scriptContent => {
      const script = document.createElement('script');
      script.textContent = scriptContent;
      script.id = 'hs-script-loader';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch(error => console.error('加载HubSpot脚本失败:', error));

  bindDownloadEvent();

  // 为所有HubSpot触发器按钮添加点击事件
  document.querySelectorAll('.hs-cta-trigger-button-189188848506').forEach(button => {
    button.addEventListener('click', (e) => {
      if (button.id === 'download_ioc' || button.id === 'download_ip') {
        localStorage.setItem('downloadType', button.id);
        // 这次打开页面在其他位置提交过
        const hasSubmitted = checkFormSubmission();
        if (hasSubmitted) {
          //获取id
          const id = button.id;
          downloadFile(id)
        }
      } else {
        localStorage.removeItem('downloadType');
      }
    });
  });
});

// 监听表单提交事件
window.addEventListener('message', (event) => {
  // 表单ready后显示按钮（不过现在看js加载后会把href属性删除导致按钮显示
  if (event.data.type === "hsCallsToActionCallback" &&
    event.data.eventName === "onCallToActionReady") {
    contactBtn.style.display = 'inline';
  }
  if (
    event.data.type === "hsCallsToActionCallback" &&
    event.data.eventName === "onCallToActionFormSubmitted"
  ) {
    // 记录用户已提交表单
    recordFormSubmission();
    // 下载文件
    const downloadType = localStorage.getItem('downloadType');

    if(downloadType === 'download_ioc' || downloadType === 'download_ip') {
      // 下载文件，去除downloadType
      downloadFile(downloadType);
    }
  }
});