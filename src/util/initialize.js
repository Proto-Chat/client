import { ws } from "../utils/socket";
import { createGifPopup } from "./gifs";
import { logout } from "./login";
import { createDMTopBar, createDmLink, createNewMessage, handlePastedImage } from "./messages";
import { loadingAnimInterval, requestDM } from "./misc";
import { initialShow } from "./profile";
import { send } from "./send";

var loc = window.location.href+'';

if (loc.indexOf('http://') == 0 && loc.indexOf('localhost') == -1){
    window.location.href = loc.replace('http://','https://');
}

export function createWSPath() {
    const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    var echoSocketUrl = socketProtocol + `//${window.location.hostname}`;
    if (window.location.port) echoSocketUrl += `:${window.location.port}`;
    echoSocketUrl += '/websocket';
    return echoSocketUrl;
}


export function createPageMenu() {
    const e = document.createElement('div');

    const toHome = document.createElement('a');
    toHome.href = '/';
    toHome.classList.add('pageSwitchLink');
    toHome.classList.add('unselectable');
    toHome.innerText = 'HOME';
    e.appendChild(toHome);

    const toSocials = document.createElement('a');
    toSocials.href = '/social';
    toSocials.classList.add('pageSwitchLink');
    toSocials.classList.add('unselectable');
    toSocials.innerText = 'SOCIALS';
    e.appendChild(toSocials);

    const createDm = document.createElement('a');
    createDm.onclick = (e) => {
        if (document.getElementsByClassName('profileoutlinediv').length > 0) return console.log("div already open");

        ws.send(JSON.stringify({
            code: 4,
            op: 7,
            sid: localStorage.getItem('sessionid')
        }));
    }
    createDm.classList.add('pageSwitchLink');
    createDm.classList.add('unselectable');
    createDm.classList.add('addGroupDmBtn');
    createDm.innerText = '+';
    e.appendChild(createDm);

    e.className = 'pageSwitchContainer';
    return e;
}


export function initializeLayout(response, dmid) {
    const data = response.data;
    const element = document.getElementById('dms');
    for (const k of element.childNodes) { k.remove(); }

    localStorage.setItem("user", JSON.stringify(data.user));

    element.appendChild(createPageMenu());

    const dmSYS = data.dms.find((dm) => dm.uid == '0');
    element.appendChild(createDmLink(dmSYS));

    for (const dmRaw of data.dms) {
        const a = createDmLink(dmRaw);

        if (dmRaw.uid != "0") element.appendChild(a);
    }

    // localStorage.setItem('desc', data.configs.desc)
    const profileConfigs = data.configs.find((c) => c._id == 'myprofile');

    if (profileConfigs) {
        delete profileConfigs._id;
        localStorage.setItem('profileConfigs', JSON.stringify(profileConfigs));
    }
    
    setUpUser(response.data.user);

    //URL Params
    const params = new URLSearchParams(document.location.search);
    if (params.has('dmid')) {
        const dmid = params.get('dmid');
        sessionStorage.setItem('waitforDM', dmid);
        window.location.href = '/';
    } else {
        if (dmid) {
            const waitloop = setInterval(() => {
                if (document.getElementById(`dmpfp-${dmid}`)) {
                    clearInterval(waitloop);
                    if (dmid) requestDM(dmid);
                    
                    sessionStorage.removeItem('waitforDM');
                    clearInterval(loadingAnimInterval);
                    document.getElementById('loadingdiv').style.display = 'none';
                    document.getElementById('maincontent').style.display = 'block';
                }
            }, 1000);
        } else {
            clearInterval(loadingAnimInterval);
            document.getElementById('loadingdiv').style.display = 'none';
            document.getElementById('maincontent').style.display = 'block';
        }
    }
}


export const createPFPDivIcon = (url) => {
    const icon = document.createElement('img');
    icon.style.position = 'absolute';
    icon.style.width = '25px';
    icon.style.height = '25px';
    icon.style.marginTop = '5px';
    // icon.style.marginLeft = '10px';
    icon.src = url;

    return icon;
}


export function setUpUser(user) {
    const element = document.getElementsByClassName('userprofile')[0];
    const uname = document.createElement('h1');
    uname.innerText = user.username;
    element.appendChild(uname);

    const settingsTrigger = document.createElement('p');
    // settingsTrigger.innerText = '⚙';
    settingsTrigger.appendChild(createPFPDivIcon('https://clipground.com/images/settings-icon-png-white-3.png'));
    settingsTrigger.className = 'settingsTrigger';
    
    const logoutTrigger = document.createElement('p');
    // logoutTrigger.innerText = '🛑';
    const lico = createPFPDivIcon('https://github.com/ION606/chatJS/blob/main/client/assets/exit.png?raw=true');
    lico.style.marginLeft = '20px';
    logoutTrigger.appendChild(lico);
    logoutTrigger.className = 'settingsTrigger';

    const profileConfigs = {
        username: "",
        status: "",
        desc: "",
        icon: "",
        editing: false
    }

    profileConfigs.username = JSON.parse(localStorage.getItem('user')).username;
    const localConfigs = JSON.parse(localStorage.getItem('profileConfigs'));
    
    profileConfigs.description = localConfigs?.description || "";
    profileConfigs.status = localConfigs?.status || "";
    profileConfigs.icon = localConfigs?.icon || "";

    element.onclick = () => {
        if (settingsTrigger.matches(":hover")) {
            profileConfigs.editing = true;
            initialShow(profileConfigs);
        }
        else if (logoutTrigger.matches(':hover')) {
            logout();
        } else {
            // initialShow(user);
            initialShow(profileConfigs);
        }
    }

    const optbar = document.createElement('div');
    optbar.style.paddingLeft = '10px';
    optbar.className = 'nopointer';
    optbar.appendChild(settingsTrigger);
    optbar.appendChild(logoutTrigger);

    element.appendChild(optbar);
}


export function setupDM(response) {
    const data = response.data;

    // highlight the current one and make all others not active
    var currentlyActive = document.getElementsByClassName('activechat')[0];
    if (currentlyActive) currentlyActive.classList.remove('activechat');
    
    currentlyActive = document.getElementById(data.other.uid);
    currentlyActive.classList.add('activechat');
    
    localStorage.setItem('currentChatID', data.chatID);

    if (currentlyActive.classList.contains('unread')) {
        ws.send(JSON.stringify({
            code: 3,
            op: 3,
            data: {
                dmid: data.chatID,
                sid: localStorage.getItem('sessionid')
            }
        }));

        currentlyActive.classList.remove('unread')
    }

    const element = document.getElementById('chatMain');
    element.innerHTML = "";

    element.appendChild(createDMTopBar(data));

    const messages = document.createElement('div');
    messages.id = 'messages';

    let lastVideo;
    var counter = 0;
    for (const msg of data.messages) {
        const msgElement = createNewMessage(msg);
        messages.appendChild(msgElement);
        
        if (msgElement.lastChild.lastChild && msgElement.lastChild.lastChild.tagName == 'VIDEO') {
            lastVideo = msgElement.lastChild.lastChild;

            counter++;
            if (msgElement.children.length > counter) { lastVideo = undefined; }
        }
    }

    const inpwrapper = document.createElement('div');

    if (data.other.uid != '0') {
        const inpelement = document.createElement('textarea');
        inpelement.id = 'textinp';

        var keys = {};
        function handleEnter(e) {
            let { which, type } = e || Event; // to deal with IE
            let isKeyDown = (type == 'keydown');
            keys[which] = isKeyDown;

            if(isKeyDown && keys[13]) {
                if (!keys[16]) {
                    send();
                }
            }
            else if (isKeyDown) {
                e.target.parentElement.style.borderColor = 'black';
            }
            else {
                e.target.style.height = "1px";
                e.target.style.height = (e.target.scrollHeight)+"px";
                messages.scrollTop = messages.scrollHeight - messages.clientHeight;
            }
        }
        inpelement.onkeydown = handleEnter;
        inpelement.onkeyup = handleEnter;

        inpelement.addEventListener('paste', async (e) => {
            const cData = e.clipboardData;
            if (cData.getData('Text')) return;
            if (cData.files.length == 0) return;
            for (const file of cData.files) {
                handlePastedImage(file);
            }
        });
        
        inpelement.onfocus = () => {
            inpelement.style.border = "none";
        }

        const gifBtn = document.createElement('button');
        gifBtn.innerText = "GIF";
        gifBtn.onclick = (e) => {
            e.preventDefault();
            if (document.getElementsByClassName('gifpopup').length > 0) return;
            const gifpopup = createGifPopup();
            gifpopup.style.right = e.target.style.right;
            e.target.parentElement.appendChild(gifpopup);
        }
        gifBtn.className = 'msgbtnsend';
        gifBtn.style.marginRight = '5px';

        const inpbtn = document.createElement('button');
        inpbtn.onclick = (e) => {
            e.preventDefault();
            send();
        };
        inpbtn.className = 'msgbtnsend';
        inpbtn.innerText = "SEND";
        inpbtn.style.minWidth = '60px';
        inpbtn.style.marginRight = '1px';
        // const i = document.createElement('i');
        // i.className = 'fa-duotone fa-paper-plane-top';
        // inpbtn.appendChild(i);

        const upload = document.createElement('input');
        upload.style.display = 'none';
        upload.type = 'file';
        upload.id = 'fileuploadinp';
        upload.accept = 'image/*';
        upload.addEventListener('change',  (e) => {
            if (e.target.files.length == 0) return;
            for (const file of e.target.files) {
                handlePastedImage(file);
            }
        });

        const uploadbtn = document.createElement('button');
        uploadbtn.className = 'fileUploadBtn';
        uploadbtn.innerText = "+";

        uploadbtn.onclick = (e) => {
            e.preventDefault();
            document.getElementById('fileuploadinp').click();
        }
        
        const inpdiv = document.createElement('form');
        inpdiv.className = 'msginp';
        inpdiv.appendChild(upload);
        inpdiv.appendChild(uploadbtn);
        inpdiv.appendChild(inpelement);
        inpdiv.appendChild(gifBtn);
        inpdiv.appendChild(inpbtn);
        inpwrapper.appendChild(inpdiv);
    } else {
        const inpdiv = document.createElement('form');
        inpdiv.className = 'msginp';
        inpdiv.style = 'align-content: center;justify-content: center;';

        const h1 = document.createElement('h4');
        h1.style = 'align-content: center; margin: 20px;';
        h1.innerText = 'THIS IS A SYSTEM DM, YOU CAN\'T SEND MESSAGES HERE!';
        inpdiv.appendChild(h1);

        inpwrapper.appendChild(inpdiv);
    }

    // messages.onchange = () => {messages.lastChild.lastChild.scrollIntoView();}

    if (messages && messages.lastChild) {
        if (lastVideo) {
            lastVideo.addEventListener('playing', () => {
                lastVideo.scrollIntoView();
                const lastChild = messages.lastChild.lastChild.lastChild;
                if (lastChild != lastVideo) messages.lastChild.scrollIntoView();
            });
        }
        else if (messages.lastChild.lastChild.firstChild && messages.lastChild.lastChild.firstChild.tagName == 'IMG') {
            //#FIXME DOES NOT TRIGGER
            const lastChild = messages.lastChild.lastChild.firstChild.tagName;
            lastChild.scrollIntoView();
            messages.scrollTop += lastChild.height + 1000;
        } else {
            if (messages.lastChild) messages.lastChild.lastChild.scrollIntoView();
            messages.scrollTop += 1000;
        }
    }


    element.appendChild(messages);
    element.appendChild(inpwrapper);
    element.style = 'display: block;';
}