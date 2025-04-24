// 查找导航的contact us按钮，并添加指定的class
const contactBtn = document.querySelector('a[href="https://i.secai.ai/contact_us"]');

contactBtn.classList.add('hs-cta-trigger-button', 'hs-cta-trigger-button-189188848506');

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

fetch('https://js.hs-scripts.com/48609194.js')
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

window.addEventListener('load', () => {
  document.addEventListener('click', e => {
    let div = e.target.closest('div');
    if (e.target.id === 'download_ioc' || e.target.id === 'download_ip' || div.id === 'download_ioc' || div.id === 'download_ip') {
      const id = e.target.id || div.id;
      downloadFile(id);
    }
  })
})