console.log('local script testing ... ');
addStyle();
const mpopup = addPopup();
const ucont = document.getElementById('memberUserList');
const blist = document.getElementById('browserItemList');
const cbox = document.getElementById('comment_box');
if (ucont) bindComments(mpopup, ucont.getElementsByClassName('userContainer'), self_selector);
if (blist) bindComments(mpopup, blist.getElementsByClassName('inner'), self_selector);
if (cbox) bindComments(mpopup, cbox.getElementsByClassName('item'), self_selector);

function self_selector(ele) {
    return ele;
}

function cb_selector(ele) {
    return ele.getElementsByTagName('p')[0]
}

function addStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
    .lucky_popup {
        -moz-border-radius: 8px;
        -webkit-border-radius: 8px;
        border-radius: 8px;
        -moz-box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
        -webkit-box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
        box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
        backdrop-filter: blur(20px) contrast(95%);
        -webkit-backdrop-filter: blur(20px) contrast(95%);
        z-index: 10;
        display: none;
        position: absolute;
        text-align: left;
        border: 1px solid #bebebe !important;
        background: rgba(255, 253, 253, 0.707) !important;
    }
    .lucky_popup p {
        margin: 5px 8px 5px 8px;
        font-size: 1em;
        font-weight: 500;
        color: #474747;
    }`;
    document.head.appendChild(style);
}

function addPopup() {
    const popupHtml = '<div class="lucky_popup"><p>showpopup</p></div>';
    $('.mainWrapper').append(popupHtml);
    return $('.lucky_popup');
}

function bindComments(ppup, list, selector) {
    for (let l of list) {
        let ele = selector(l)
        ele.style.cursor = 'pointer';
        let func = function (e) {
            if (ele == ppup.lucky_parent) {
                ppup.fadeOut();
                ppup.lucky_parent = null;
            } else {
                ppup.hide()
                ppup.css({left: e.pageX});
                ppup.css({top: e.pageY});
                ppup.find('p').html('showpopup');
                ppup.fadeIn();
                ppup.lucky_parent = ele;
            }
        }
        let func2 = function () {
            if (ele == ppup.lucky_parent) {
                ppup.fadeOut();
                ppup.lucky_parent = null;
            }
        }
        ele.onclick = func;
    }
}